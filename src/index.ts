import axios, { AxiosInstance } from "axios";
import { Comuni } from "./Services/Comuni";
import { Geocoding } from "./Services/Geocoding";
import { Imprese } from "./Services/Imprese";
import { isServiceInScopes } from "./utils";
import { Pa } from './Services/Pa';
import { FirmaDigitale } from "./Services/FirmaDigitale";
import { MarcheTemporali } from "./Services/MarcheTemporali";
import { PecMassiva } from "./Services/PecMassiva";
import { Valutometro } from "./Services/Valutometro";
import { Splitpayment } from "./Services/SplitPayment";
import { EuropeanVat } from "./Services/EuropeanVat";
import { Visengine } from "./Services/Visengine";
import { Postontarget } from "./Services/Postontarget";
import { Domains } from "./Services/Domains";
import { Sms } from "./Services/Sms";
import { UfficioPostale } from "./Services/UfficioPostale";

export type Environment = 'test'| 'production';

export type ValidHttpMethod = 'GET' |'POST' | 'UPDATE' | 'PATCH' | 'DELETE' | '*';

// Represents a scope object for API authorization
export interface ScopeObject {
    domain: string;
    method: string;
    mode: ValidHttpMethod;
}

// Base interface for all OpenAPI services
export interface Service {
    client: AxiosInstance;
    readonly service: string;
    readonly baseUrl: string;
    environment: Environment;
}

/**
 * Main OpenAPI client class for authenticating and accessing various services
 */
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
    firmaDigitale?: FirmaDigitale;
    marcheTemporali?: MarcheTemporali;
    pecMassiva?: PecMassiva;
    valutometro?: Valutometro;
    splitpayment?: Splitpayment;
    europeanvat?: EuropeanVat;
    visengine?: Visengine;
    postontarget?: Postontarget;
    domains?: Domains;
    sms?: Sms;
    ufficioPostale?: UfficioPostale;

    constructor(environment: Environment, username: string, apiKey: string) {
        this.username = username;
        this.apiKey = apiKey;
        this.environment = environment;
    }
    
    /**
     * Creates the OpenAPI connection client
     * If autoRenew is enabled, checks token status and renews if needed
     * @param token - The authentication token
     * @param autoRenew - Whether to automatically renew expiring tokens (default: true)
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

                // Auto-renew token if it expires within 15 days
                if (autoRenew && tokenData.data.data[0].expire < ((Math.floor(Date.now() / 1000) + (86400 * 15)))) {
                    await this.renewToken(this.token);
                }
            }

            else if (tokenData.status === 204) {
                // TODO: Replace string throw with proper Error object for better error handling
                throw 'The provided token does not exists or it was deleted'
            }
        } catch (err) {
            // TODO: Add graceful error message with details about the failure (network, auth, invalid token, etc.)
            throw err;
        }

        this.client = axios.create({
            headers: { 'Authorization': 'Bearer ' + this.token }
        });

        // Initialize all available services based on token scopes
        [Comuni, Sms, Imprese, Geocoding, Pa, FirmaDigitale, MarcheTemporali, PecMassiva,
            Valutometro, Splitpayment, EuropeanVat, Visengine, Postontarget, Domains, UfficioPostale
        ].forEach(service => {
            //@ts-ignore
            const s = new service(this.client, this.environment);

            // Only add service if it's included in the token scopes
            if (isServiceInScopes(this.scopes, s.baseUrl)) {
                //@ts-ignore
                this[s.service] = s;
            }
        });
        
        return this;
    }
    
    /**
     * Renews an existing token with a new expiration time (1 year from now)
     * @param token - The token to renew
     */
    async renewToken(token: string) {
        // TODO: Add error handling for failed renewal attempts
        return await axios.patch(this.getOauthUrl() + '/token/' + token, { expire: 31536000 + Math.round(Date.now() / 1000) }, {
            auth: { username: this.username, password: this.apiKey }
        });
    }

    /**
     * Generates a new authentication token with specified scopes
     * @param scopes - Service scopes (string or array of strings)
     * @param expire - Token expiration in days (default: 365)
     * @param autoRenew - Whether to enable auto-renewal (default: true)
     * @returns The generated token string
     */
    async generateToken(scopes: string | Array<string>, expire: number = 365, autoRenew = true): Promise<string> {
        // Normalize scopes to array
        if (typeof scopes === 'string') {
            scopes = [scopes];
        }

        // Format scopes with proper prefix and wildcards
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
            // TODO: Add graceful error message indicating token generation failure with specific reason
            throw err;
        }
    }

    /**
     * Gets the OAuth service URL based on environment
     */
    getOauthUrl() {
        return 'https://'+ this.prefix +'oauth.altravia.com';
    }

    /**
     * Returns environment prefix for URLs (empty for production, 'test.' for test)
     */
    get prefix() {
        return this.environment === 'test' ? 'test.': '';
    }

    /**
     * Splits a scope string into domain and method parts
     * @param scope - The scope string to split (format: "method:domain/path")
     */
    static splitScope(scope: string) {
        return scope.split(':', 2)[1].split('/', 2);
    }

    /**
     * Factory method to initialize and create an OpenAPI client instance
     * @param environment - The environment to use ('test' or 'production')
     * @param username - The API username
     * @param apiKey - The API key
     * @param token - Optional existing token to use
     * @param autoRenew - Whether to enable auto-renewal (default: true)
     */
    static async init(environment: Environment, username: string, apiKey: string, token?: string, autoRenew = true) {
        const openapi = new OpenApi(environment, username, apiKey);

        if (token) {
            await openapi.createClient(token, autoRenew);
        }

        return openapi;
    }
}

export default OpenApi;