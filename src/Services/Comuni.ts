import { AxiosInstance } from "axios";
import { Environment, ScopeObject, Service, ServiceName } from "..";
import { getBaseUrl } from "../utils";

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
        return await (await this.client.get(this.url + '/cap/' + cap)).data.data;
    }

    async getComuneByCatasto(codiceCatastale: string) {
        return await (await this.client.get(this.url + '/catastale' + codiceCatastale)).data.data;
    }

    async getRegioni() {
        const regioni: Array<any> = await (await this.client.get(this.url + '/regioni')).data.data;

        return regioni.sort();
    }

    async getProvincie(regione?: string) {
        const province: Array<any> = await (await this.client.get(this.url + '/province' + (regione ? regione : '')))
            .data.data;

        return province.sort();
    }

    async getComuni(provincia?: string) {
        const comuni: Array<any> = await (await this.client.get(this.url + '/comuni' + provincia)).data.data;
        return comuni.sort();
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
