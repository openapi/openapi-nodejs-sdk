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

/**
 * Service for accessing targeted business mailing lists
 */
export class Postontarget implements Service {
    client: AxiosInstance;
    readonly service = 'postontarget';
    readonly baseUrl = 'postontarget.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Gets available country filter options
     * @param query - Country query filters
     * @param limit - Result limit (default: 0 for no limit)
     */
    async getCountriesFields(query: CountryQuery, limit = 0) {
        // TODO: Add validation and error handling
        return await (await this.client.post(this.url + '/fields/country', JSON.stringify({ query, limit }))).data.data;
    }

    /**
     * Gets available employee count filter options
     * @param query - Filter query
     * @param limit - Result limit (default: 0 for no limit)
     */
    async getDipendentiFields(query: any, limit = 0) {
        // TODO: Add validation and error handling
        return await (await this.client.post(this.url + '/fields/dipendenti', JSON.stringify({ query, limit }))).data.data;
    }

    /**
     * Gets available revenue filter options
     * @param query - Filter query
     * @param limit - Result limit (default: 0 for no limit)
     */
    async getFatturatoFields(query: any, limit = 0) {
        // TODO: Add validation and error handling
        return await (await this.client.post(this.url + '/fields/fatturato', JSON.stringify({ query, limit }))).data.data;
    }

    /**
     * Gets available legal form filter options
     * @param query - Filter query
     * @param limit - Result limit (default: 0 for no limit)
     */
    async getFormaGiuridicaFields(query: any, limit = 0) {
        // TODO: Add validation and error handling
        return await (await this.client.post(this.url + '/fields/forma_giuridica', JSON.stringify({ query, limit }))).data.data;
    }

    /**
     * Gets available macro-category filter options
     * @param query - Filter query
     * @param limit - Result limit (default: 0 for no limit)
     */
    async getMacroCatFields(query: any, limit = 0) {
        // TODO: Add validation and error handling
        return await (await this.client.post(this.url + '/fields/macrocategorie', JSON.stringify({ query, limit }))).data.data;
    }

    /**
     * Gets available micro-category filter options
     * @param query - Filter query
     * @param limit - Result limit (default: 0 for no limit)
     */
    async getMicroCatFields(query: any, limit = 0) {
        // TODO: Add validation and error handling
        return await (await this.client.post(this.url + '/fields/microcategorie', JSON.stringify({ query, limit }))).data.data;
    }

    /**
     * Searches for company records based on criteria
     * @param query - Search criteria (country, employees, revenue, legal form, categories)
     */
    async findCompanyRecords(query: SearchBody) {
        // TODO: Validate search parameters and provide helpful error messages
        return await (await this.client.post(this.url + '/search', JSON.stringify(query))).data.data;
    }

    /**
     * Purchases company records from a search result
     * @param id_request - The search request ID
     * @param records - Number of records to purchase
     */
    async buyCompanyRecords(id_request: string, records: number) {
        // TODO: Add validation and graceful error messages for insufficient credits or invalid request ID
        return await (await this.client.post(this.url + '/search', JSON.stringify({ id_request, records }))).data.data;
    }

    /**
     * Lists all purchase requests
     */
    async listRequests(): Promise<any[]>{
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/state')).data.data
    }

    /**
     * Gets details of a specific purchase request
     * @param id - The request ID
     */
    async getRequest(id: string) {
        // TODO: Validate ID and add error handling for not found cases
        return await (await this.client.get(this.url + '/state/' + id)).data.data
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
