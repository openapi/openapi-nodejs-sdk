import axios, { AxiosInstance } from "axios";
import { Comuni } from "./Services/Comuni";

export type Environment = 'test'| 'production';

type ValidHttpMethod = 'GET' |'POST' | 'UPDATE' | 'PATCH' | 'DELETE';
export interface ScopeObject {
    domain: string;
    method: string;
    mode: ValidHttpMethod;
}

export type ServiceName = 'comuni';
export interface Service {
    client: AxiosInstance;
    service: ServiceName;
    baseUrl: string;
    environment: Environment;
}

class OpenApi {
    client?: AxiosInstance;
    environment: Environment;
    token?: string;
    username: string;
    apiKey: string;
    autoRenew: boolean;
    scopes: Array<ScopeObject> = [];

    comuni?: Comuni;


    constructor(scopes: Array<ScopeObject | string>, environment: Environment, username: string, apiKey: string, autoRenew = true) {
        this.username = username;
        this.apiKey = apiKey;
        this.environment = environment;

        if (!scopes.length) throw new Error('missing scopes');
        scopes.forEach(scope => {
            if (typeof scope === 'object' ) {
                this.scopes.push(scope);
            }

            else if (typeof scope === 'string') {
                const url = scope.split(':', 2)[1].split('/', 2);
                //@ts-ignore
                this.scopes.push({ mode: scope.split(':', 1), domain: url[0], method: url[1] });
            }
        });

        this.autoRenew = autoRenew;
        
        return this;
    }
    
    /**
     * Crea il client di connessione con OpenApi
     * Se l'autoRenew è attivo, controllerá lo stato del token
     * prima di istanzianziare il client
     */
    async createClient(token: string) {
        this.token = token;
        
        if (this.autoRenew) {
            
            try {
                const tokenData = await axios.get(this.getOauthUrl() + '/token/' + token, { 
                    auth: { username: this.username, password: this.apiKey }
                });
                
                if (tokenData.data.data[0].expire < ((Math.floor(Date.now() / 1000) + (86400 * 15)))) {
                    await this.renewToken(this.token);
                }
            } catch (err) {
                throw err;
            }
        }
        
        this.client = axios.create({
            headers: { 'Authorization': 'Bearer ' + this.token }
        });

        [Comuni].forEach(service => {
            //@ts-ignore
            const s = new service(this.scopes, this.client, this.environment);
            this[s.service] = s;
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
     * @param expire il timestap di scadenza del token, default: un anno
     */
    async generateToken(expire: number = 86400 * 365): Promise<string> {
        if (!this.username || !this.apiKey) throw 'username and apiKey needed';

        let scopes: Array<string> = [];
        const prefix = this.environment === 'test'? 'test.' : '';

        this.scopes.forEach(scope => scopes.push(`${scope.mode}:${prefix}${scope.domain}/${scope.method}`));
        
        try {
            const res: any = await axios.post(this.getOauthUrl() + '/token', JSON.stringify({ scopes, expire }), {
                auth: { username: this.username, password: this.apiKey }
            });

            if (!res?.data?.success) throw 'Server responded with a status error';
            return res.data.token;

        } catch(err) {
            throw err;
        }
    }

    getOauthUrl() {
        return 'https://'+( this.environment === 'test' ? 'test.': '') +'oauth.altravia.com';
    }
}

export default OpenApi;