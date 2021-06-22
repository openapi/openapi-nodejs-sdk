import axios, { AxiosInstance } from "axios";

export type Environment = 'test'| 'production';

type ValidHttpMethod = 'GET' |'POST' | 'UPDATE' | 'PATCH' | 'DELETE';
export interface ScopeObject {
    domain: string;
    method: string;
    mode: ValidHttpMethod;
}

class OpenApi {
    client: AxiosInstance;
    environment: Environment;
    scopes: Array<ScopeObject> = [];

    constructor(token: string,  environment: Environment = 'production', scopes: Array<ScopeObject | string>) {
        // this.username = username;
        this.environment = environment;

        scopes.forEach(scope => {
            if (typeof scope === 'object' ) {
                this.scopes.push(scope);
            }

            else if (typeof scope === 'string') {
                const url = scope.split(':', 2)[1].split('/', 2);
                //@ts-ignore
                this.scopes.push({ mode: scope.split(':', 1), domain: url[0], method: url[1] });
            }
        })

        this.client = axios.create({
            headers: { 'Authorization': 'Bearer ' + token }
        });
    }

    static async generateToken(username: string, apiKey: string, requestScopes: Array<ScopeObject | string>, environment: Environment, expire?: number) {
        let scopes: Array<string> = [];
        const prefix = environment === 'test'? 'test.' : '';

        requestScopes.forEach(scope => {
            if (typeof scope === 'string')  {
                const split = scope.split(':', 2)
                scopes.push(`${split[0]}:${prefix}${split[1]}`);
            } 
            
            else if (typeof scope === 'object') {
                scopes.push(`${scope.mode}:)${prefix}${scope.domain}/${scope.method}`);
            }
        });

        if (!scopes.length) throw new Error('missing scopes')
        
        try {
            const body =  expire ? { scopes, expire } : { scopes };
            const res: any = await axios.post(this.getOauthUrl(environment) + '/token', { scopes, body }, {
                auth: { username, password: apiKey }
            });

            if (!res?.data?.success) throw 'Server responded with a status error';
            return res.data;

        } catch(err) {
            throw err;
        }

    }

    static getOauthUrl(environment: Environment) {
        return 'https://'+( environment === 'test' ? 'test.': '') +'oauth.altravia.com';
    }

    static async init(token: string,  environment: Environment = 'production') {
        let tokenData;
        try {
            tokenData = await axios.get(this.getOauthUrl(environment) + '/token/' + token);
        } catch (err) {
            throw err;
        }
        
        return new OpenApi(token, environment, tokenData.data.scopes)
    }   
}

export default OpenApi;