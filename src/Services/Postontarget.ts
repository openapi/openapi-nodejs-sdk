import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

interface CountryQuery {
  country_code?: string;
  country_name_EN?: string;
  country_name_IT?: string;
}

interface SearchBody {
    country_code?:	string;
    admin1_code?:	string;
    admin2_code?:	string;
    dipendenti?:	string;
    fatturato?:	string;
    forma_giuridica_id?: number;
    macro_id?: number;
    micro_id?: number;
}

export class Postontarget implements Service {
    client: AxiosInstance;
    readonly service = 'postontarget';
    readonly baseUrl = 'postontarget.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getCountriesFields(query: CountryQuery, limit = 0) {
        return await (await this.client.post(this.url + '/fields/country', JSON.stringify({ query, limit }))).data.data;
    }

    async getDipendentiFields(query: any, limit = 0) {
        return await (await this.client.post(this.url + '/fields/dipendenti', JSON.stringify({ query, limit }))).data.data;
    }

    async getFatturatoFields(query: any, limit = 0) {
        return await (await this.client.post(this.url + '/fields/fatturato', JSON.stringify({ query, limit }))).data.data;
    }

    async getFormaGiuridicaFields(query: any, limit = 0) {
        return await (await this.client.post(this.url + '/fields/forma_giuridica', JSON.stringify({ query, limit }))).data.data;
    }

    async getMacroCatFields(query: any, limit = 0) {
        return await (await this.client.post(this.url + '/fields/macrocategorie', JSON.stringify({ query, limit }))).data.data;
    }

    async getMicroCatFields(query: any, limit = 0) {
        return await (await this.client.post(this.url + '/fields/microcategorie', JSON.stringify({ query, limit }))).data.data;
    }

    //

    async findCompanyRecords(query: SearchBody) {
        return await (await this.client.post(this.url + '/search', JSON.stringify(query))).data.data;
    }

    async buyCompanyRecords(id_request: string, records: number) {
        return await (await this.client.post(this.url + '/search', JSON.stringify({ id_request, records }))).data.data;
    }

    //
    async listRequests(): Promise<any[]>{
        return await (await this.client.get(this.url + '/state')).data.data
    }

    async getRequest(id: string) {
        return await (await this.client.get(this.url + '/state/' + id)).data.data
    }
    

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}