import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

interface Company {
  cf?: string;
  den?: string;
  dm?: string;
  categoria?: string;
  update_timestamp?: number;
}

/**
 * Service for checking Italian companies subject to split payment (scissione dei pagamenti)
 */
export class Splitpayment implements Service {
    client: AxiosInstance;
    readonly service = 'splitpayment';
    readonly baseUrl = 'splitpayment.openapi.it';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Lists all companies subject to split payment
     */
    async listCompanies(): Promise<Array<Company>> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/')).data.data;
    }

    /**
     * Checks if a specific company is subject to split payment
     * @param cf - The fiscal code (Codice Fiscale) of the company
     */
    async company(cf?: string) {
        // TODO: Validate fiscal code format and provide graceful error message for not found cases
        return await (await this.client.get(this.url + '/' + cf)).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}