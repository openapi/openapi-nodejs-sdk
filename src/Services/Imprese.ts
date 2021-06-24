import axios, { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export class Imprese implements Service {
    client: AxiosInstance;
    readonly service = 'imprese';
    baseUrl = 'imprese.altravia.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getByPartitaIva(partitaIva: string) {
        return await (await this.client.get(this.url + '/base/' + partitaIva)).data.data;
    }

    async getAdvancedByPartitaIva(partitaIva: string) {
        return await (await this.client.get(this.url + '/advance/' + partitaIva)).data.data;
    }

    async isClosed(partitaIva: string): Promise<boolean | any> {
        const res = (await this.client.get(this.url + '/closed/' + partitaIva)).data.data
        if (res.cessata) {
            return res.cessata;
        }

        return res;
    }

    async gruppoIva(partitaIva: string) {
        return await (await this.client.get(this.url + '/gruppoiva/' + partitaIva)).data.data;
    }


    async getPec(partitaIva: string) {
        const res = (await this.client.get(this.url + '/pec/' + partitaIva)).data.data
        if (res.pec) {
            return res.pec;
        }

        return res;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}