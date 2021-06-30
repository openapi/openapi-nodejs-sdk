import axios, { AxiosInstance } from "axios";
import { Comuni } from "./Services/Comuni";
import { Geocoding } from "./Services/Geocoding";
import { Imprese } from "./Services/Imprese";
import { isServiceInScopes } from "./utils";
import { Pa } from './Services/Pa';

export type Environment = 'test'| 'production';

type ValidHttpMethod = 'GET' |'POST' | 'UPDATE' | 'PATCH' | 'DELETE' | '*';
export interface ScopeObject {
    domain: string;
    method: string;
    mode: ValidHttpMethod;
}

export interface Service {
    client: AxiosInstance;
    readonly service: string;
    readonly baseUrl: string;
    environment: Environment;
}

class OpenApi {
    client?: AxiosInstance;
    environment: Environment;
    token?: string;
    username: string;
    apiKey: string;
    scopes: Array<ScopeObject> = [];

    comuni?: Comuni;
    imprese?: Imprese;
    geocoding?: Geocoding;
    pa?: Pa;

    constructor(environment: Environment, username: string, apiKey: string) {
        this.username = username;
        this.apiKey = apiKey;
        this.environment = environment;
    }
    
    /**
     * Crea il client di connessione con OpenApi
     * Se l'autoRenew è attivo, controllerá lo stato del token
     * prima di istanziare il client, ed in caso lo rinnoverà
     */
    async createClient(token: string, autoRenew = true) {
        this.token = token;
        
        try {
            const tokenData = await axios.get(this.getOauthUrl() + '/token/' + token, { 
                auth: { username: this.username, password: this.apiKey }
            });

            
            if (tokenData.status === 200 ) {
                const scopes: Array<any> = tokenData.data.data[0].scopes;
                scopes.forEach(scope => {
                    const url = OpenApi.splitScope(scope);
                    this.scopes.push({ mode: scope.split(':', 1), domain: url[0], method: url[1] });
                })

                if (autoRenew && tokenData.data.data[0].expire < ((Math.floor(Date.now() / 1000) + (86400 * 15)))) {
                    await this.renewToken(this.token);
                }
            }

            else if (tokenData.status === 204) {
                throw 'The provided token does not exists or it was deleted'
            }
        } catch (err) {
            throw err;
        }

        this.client = axios.create({
            headers: { 'Authorization': 'Bearer ' + this.token }
        });

        [Comuni, Imprese, Geocoding, Pa].forEach(service => {
            //@ts-ignore
            const s = new service(this.client, this.environment);
            if (!autoRenew || isServiceInScopes(this.scopes, s.baseUrl)) {
                //@ts-ignore
                this[s.service] = s;
            }
        });
        
        return this;
    }
    
    async renewToken(token: string) {
        return await axios.patch(this.getOauthUrl() + '/token/' + token, { expire: 86400 + 365 }, {
            auth: { username: this.username, password: this.apiKey }
        });
    }

    /**
     * Genera un token 
     * @param expire valore in giorni alla di scadenza del token, default: un anno
     */
    async generateToken(scopes: Array<string>, expire: number = 365, autoRenew = true): Promise<string> {
        scopes = scopes.map(scope => {
            if (!scope.match(/:/)) {
                scope = '*:' + scope.replace('/', '') + '/*';
            }
            
            const url = OpenApi.splitScope(scope);
            return `${scope.split(':', 1)}:${this.prefix}${url[0].replace(/^test.|dev./, '')}/${url[1]}`
        });

        try {
            const body = { scopes, expire: expire * 86400 };
            const res: any = await axios.post(this.getOauthUrl() + '/token', JSON.stringify(body), {
                auth: { username: this.username, password: this.apiKey }
            });

            await this.createClient(res.data.token, autoRenew);
            return res.data.token;

        } catch(err) {
            throw err;
        }
    }

    getOauthUrl() {
        return 'https://'+ this.prefix +'oauth.altravia.com';
    }

    get prefix() {
        return this.environment === 'test' ? 'test.': '';
    }

    static splitScope(scope: string) {
        return scope.split(':', 2)[1].split('/', 2);
    }

    static async init(environment: Environment, username: string, apiKey: string, token?: string, autoRenew = true) {
        const openapi = new OpenApi('test', username, apiKey);
        
        if (token) {
            await openapi.createClient(token, autoRenew);
        }

        return openapi;
    }
}

export default OpenApi;