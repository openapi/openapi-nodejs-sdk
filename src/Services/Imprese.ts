import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export interface SearchImprese {
    deniminazione?: string;
    provincia?: string;
    piva?: string;
    cf?: string;
}

interface AutocompleteImprese {
  id: string;
  denominazione: string;
}

interface NaturaGiuridica {
  codice_natura_giuridica: string;
  valore: string;
}

export class Imprese implements Service {
    client: AxiosInstance;
    readonly service = 'imprese';
    readonly baseUrl = 'imprese.openapi.it';
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
     * Autocomplete service
     * Wildcards (*) can be used at the beginning or at the end of the string.
     */
    async autocomplete(query: string): Promise<AutocompleteImprese[]> {
        if (!query.match(/\*/)) query = `*${query}*`
        return await (await this.client.get(this.url + '/autocomplete/' + query)).data.data;
    }

    /**
     * Richiede accesso ad /advance
     */
    async search(searchQuery: SearchImprese): Promise<Array<any>> {
        return await (await this.client.get(this.url + '/advance', { params: searchQuery })).data.data;
    }

    async listFormeGiuridiche(): Promise<NaturaGiuridica[]> {
        return await (await this.client.get(this.url + '/forma_giuridica')).data.data;
    }

    async getFormaGiuridica(legalCode: string): Promise<NaturaGiuridica> {
        return await (await this.client.get(this.url + '/forma_giuridica/' + legalCode)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}