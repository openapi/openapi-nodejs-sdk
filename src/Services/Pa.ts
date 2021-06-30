import axios, { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export class Pa implements Service {
    client: AxiosInstance;
    readonly service = 'pa';
    readonly baseUrl = 'pa.openapi.it';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async findPa(partitaIva?: string) {
        return await (await this.client.get(this.url + '/' + partitaIva)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}