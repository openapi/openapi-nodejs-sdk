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

/**
 * Service for querying Italian business registry (companies) data
 */
export class Imprese implements Service {
    client: AxiosInstance;
    readonly service = 'imprese';
    readonly baseUrl = 'imprese.openapi.it';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Gets basic company information by VAT number (Partita IVA)
     * @param partitaIva - The Italian VAT number
     */
    async getByPartitaIva(partitaIva: string) {
        // TODO: Validate partitaIva format and provide graceful error message for invalid or not found VAT
        return await (await this.client.get(this.url + '/base/' + partitaIva)).data.data;
    }

    /**
     * Gets advanced company information by VAT number
     * @param partitaIva - The Italian VAT number
     */
    async getAdvancedByPartitaIva(partitaIva: string) {
        // TODO: Validate partitaIva and handle errors for invalid VAT or insufficient permissions
        return await (await this.client.get(this.url + '/advance/' + partitaIva)).data.data;
    }

    /**
     * Checks if a company is closed/ceased operations
     * @param partitaIva - The Italian VAT number
     * @returns Boolean indicating if closed, or full response data
     */
    async isClosed(partitaIva: string): Promise<boolean | any> {
        // TODO: Add error handling for invalid partitaIva with user-friendly message
        const res = (await this.client.get(this.url + '/closed/' + partitaIva)).data.data
        return res.cessata ? res.cessata : res;
    }

    /**
     * Gets VAT group information for a company
     * @param partitaIva - The Italian VAT number
     */
    async gruppoIva(partitaIva: string) {
        // TODO: Handle cases where company is not in a VAT group with clear message
        return await (await this.client.get(this.url + '/gruppoiva/' + partitaIva)).data.data;
    }

    /**
     * Gets the certified email (PEC) for a company
     * @param partitaIva - The Italian VAT number
     * @returns The PEC email address or full response data
     */
    async getPec(partitaIva: string) {
        // TODO: Add graceful error message when PEC is not available or partitaIva is invalid
        const res = (await this.client.get(this.url + '/pec/' + partitaIva)).data.data
        return res.pec ? res.pec : res;
    }

    /**
     * Autocomplete service for company name search
     * Wildcards (*) can be used at the beginning or end of the string
     * @param query - Search query (automatically wrapped with wildcards if not present)
     */
    async autocomplete(query: string): Promise<AutocompleteImprese[]> {
        // TODO: Validate non-empty query and provide helpful error message
        if (!query.match(/\*/)) query = `*${query}*`
        return await (await this.client.get(this.url + '/autocomplete/' + query)).data.data;
    }

    /**
     * Advanced search for companies with multiple criteria
     * Requires access to /advance endpoint
     * @param searchQuery - Search criteria (denomination, province, VAT, fiscal code)
     */
    async search(searchQuery: SearchImprese): Promise<Array<any>> {
        // TODO: Validate search parameters and handle insufficient permissions with clear message
        return await (await this.client.get(this.url + '/advance', { params: searchQuery })).data.data;
    }

    /**
     * Lists all available legal forms (natura giuridica)
     */
    async listFormeGiuridiche(): Promise<NaturaGiuridica[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/forma_giuridica')).data.data;
    }

    /**
     * Gets information about a specific legal form
     * @param legalCode - The legal form code
     */
    async getFormaGiuridica(legalCode: string): Promise<NaturaGiuridica> {
        // TODO: Validate legalCode and provide graceful error message for invalid or not found codes
        return await (await this.client.get(this.url + '/forma_giuridica/' + legalCode)).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}