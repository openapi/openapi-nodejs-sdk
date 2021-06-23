import axios, { AxiosInstance } from "axios";
import { Environment, ScopeObject, Service, ServiceName } from "..";
import { getBaseUrl } from "../utils";

export class Imprese implements Service {
    client: AxiosInstance;
    service: ServiceName = 'imprese';
    baseUrl = 'imprese.altravia.com';
    environment: Environment;

    constructor(scopes: Array<ScopeObject>, client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getByPartitaIva(partitaIva: string) {
        return await (await this.client.get(this.url + '/base/' + partitaIva)).data.data;
    }

    async getAdvancedByPartitaIva(partitaIva: string) {
        return await (await this.client.get(this.url + '/advance/' + partitaIva)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}