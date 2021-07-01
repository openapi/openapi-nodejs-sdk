import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export class EuropeanVat implements Service {
    client: AxiosInstance;
    readonly service = 'europeanvat';
    readonly baseUrl = 'europeanvat.altravia.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getInformation(country: string, vat?: string) {
        return await (await this.client.get(this.url + '/companies/' + country + '/' + vat)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}