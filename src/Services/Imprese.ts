import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export interface SearchImprese {
    deniminazione?: string;
    provincia?: string;
    piva?: string;
    cf?: string;
}

export class Imprese implements Service {
    client: AxiosInstance;
    readonly service = 'imprese';
    readonly baseUrl = 'imprese.altravia.com';
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
        return res.cessata ? res.cessata : res;
    }

    async gruppoIva(partitaIva: string) {
        return await (await this.client.get(this.url + '/gruppoiva/' + partitaIva)).data.data;
    }


    async getPec(partitaIva: string) {
        const res = (await this.client.get(this.url + '/pec/' + partitaIva)).data.data
        return res.pec ? res.pec : res;
    }

    /**
     * Richiede accesso ad /advance
     */
    async search(searchQuery: SearchImprese): Promise<Array<any>> {
        return await (await this.client.get(this.url + '/advance', { params: searchQuery })).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}