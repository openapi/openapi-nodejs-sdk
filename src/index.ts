import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export type Environment = 'test' | 'production';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface TokenResponse {
    token: string;
}

export interface ScopeRequest {
    scopes: string[];
    ttl?: number;
}

export class OauthClient {
    private client: AxiosInstance;
    private baseUrl: string;

    constructor(username: string, apiKey: string, isTest: boolean = false) {
        this.baseUrl = isTest ? 'https://test.oauth.altravia.com' : 'https://oauth.altravia.com';
        
        const auth = Buffer.from(`${username}:${apiKey}`).toString('base64');
        
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async createToken(scopes: string[], ttl: number = 3600): Promise<string> {
        const body = { scopes, ttl };
        const response = await this.client.post('/token', body);
        return response.data;
    }

    async getTokens(scope?: string): Promise<string> {
        const params = scope ? { scope } : {};
        const response = await this.client.get('/token', { params });
        return response.data;
    }

    async deleteToken(token: string): Promise<string> {
        const response = await this.client.delete(`/token/${token}`);
        return response.data;
    }

    async getCounters(period: string, date: string): Promise<string> {
        const response = await this.client.get(`/counters/${period}/${date}`);
        return response.data;
    }

    async getScopes(limit?: boolean): Promise<string> {
        const params = limit !== undefined ? { limit } : {};
        const response = await this.client.get('/scopes', { params });
        return response.data;
    }
}

export class Client {
    private client: AxiosInstance;

    constructor(token: string) {
        this.client = axios.create({
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async request<T = any>(
        method: HttpMethod,
        url: string,
        payload?: any,
        params?: Record<string, any>,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const requestConfig: AxiosRequestConfig = {
            method,
            url,
            ...config
        };

        if (payload) {
            requestConfig.data = payload;
        }

        if (params) {
            requestConfig.params = params;
        }

        const response = await this.client.request(requestConfig);
        return response.data;
    }

    async get<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>('GET', url, undefined, params, config);
    }

    async post<T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>('POST', url, payload, undefined, config);
    }

    async put<T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>('PUT', url, payload, undefined, config);
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>('DELETE', url, undefined, undefined, config);
    }

    async patch<T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>('PATCH', url, payload, undefined, config);
    }
}

export default { OauthClient, Client };