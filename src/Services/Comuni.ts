import { AxiosInstance } from "axios";
import { Environment, ScopeObject, Service, ServiceName } from "..";

export class Comuni implements Service {
    client: AxiosInstance;
    service: ServiceName = 'comuni';
    baseUrl = 'comuni.openapi.it';
    environment: Environment

    constructor(scopes: Array<ScopeObject>, client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getCitiesByCap(cap: string) {
        console.log(this.getBaseUrl());
        
        return await this.client.get(this.getBaseUrl() + '/cap/' + cap);
    }

    getBaseUrl() {
        return 'https://' + ((this.environment === 'test' ) ? 'test.' : '') + this.baseUrl;
    }
}
