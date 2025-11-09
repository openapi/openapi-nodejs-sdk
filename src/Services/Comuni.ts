import { AxiosInstance } from "axios";
import { Environment, Service,} from "..";
import { getBaseUrl } from "../utils";

interface Provincia {
  nome_provincia: string;
  sigla_provincia: string;
  regione: string;
  comuni: string[];
  dettaglio_comuni: Dettagliocomuni[];
}

interface Dettagliocomuni {
  nome: string;
  popolazione: number;
  codice_catastale: string;
  codice_istat: string;
}

/**
 * Service for querying Italian municipalities, provinces, and regions data
 */
export class Comuni implements Service {
    client: AxiosInstance;
    readonly service = 'comuni';
    baseUrl = 'comuni.openapi.it';
    environment: Environment

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Retrieves cities by postal code (CAP)
     * @param cap - Italian postal code
     */
    async getCitiesByCap(cap: string): Promise<Provincia[]> {
        // TODO: Add validation for CAP format and provide graceful error message for invalid/not found CAP
        return await (await this.client.get(this.url + '/cap/' + cap)).data.data;
    }

    /**
     * Gets municipality information by cadastral code
     * @param codiceCatastale - The cadastral code
     */
    async getComuneByCatasto(codiceCatastale: string) {
        // TODO: Validate cadastral code format and handle not found cases with user-friendly messages
        return await (await this.client.get(this.url + '/catastale/' + codiceCatastale)).data.data;
    }

    // Region-related methods

    /**
     * Lists all Italian regions (sorted alphabetically)
     */
    async getRegioni() {
        // TODO: Add error handling for API failures
        const regioni: Array<string> = await (await this.client.get(this.url + '/regioni')).data.data;
        return regioni.sort();
    }

    /**
     * Gets all provinces within a specific region
     * @param regione - The region name
     */
    async getRegione(regione: string): Promise<Provincia[]> {
        // TODO: Validate region name and provide helpful error message if region not found
        return await (await this.client.get(this.url + '/regioni/' + regione)).data.data;
    }

    // Province-related methods

    /**
     * Lists all Italian provinces
     * @returns Key-value object of provinces { province_code: province_name }
     */
    async listProvince() {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/province')).data.data;
    }

    /**
     * Gets detailed information about a specific province
     * @param provincia - The province code or name
     */
    async getProvincia(provincia?: string): Promise<Provincia> {
        // TODO: Add validation for empty provincia parameter and graceful error message
        return await (await this.client.get(this.url + '/province/' + provincia)).data.data[0];
    }

    // Municipality-related methods

    /**
     * Lists all municipalities within a province
     * @param provincia - The province code or name
     */
    async listComuni(provincia: string) {
        // TODO: Add error handling if provincia is not found or API fails
       return (await this.getProvincia(provincia)).dettaglio_comuni;
    }

    /**
     * Gets municipality data by ISTAT code
     * @param code - The ISTAT statistical code
     */
    async getFromIstatCode(code: string): Promise<any[]> {
        // TODO: Validate ISTAT code format and handle not found cases with clear error messages
        return await (await this.client.get(this.url + '/istat/' + code)).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
