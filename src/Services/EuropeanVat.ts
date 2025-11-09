import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export interface Company {
  valid?: boolean;
  format_valid?: boolean;
  country_code?: string;
  vat_number?: string;
  company_name?: string;
  company_address?: string;
}

/**
 * Service for validating European VAT numbers (VIES)
 */
export class EuropeanVat implements Service {
    client: AxiosInstance;
    readonly service = 'europeanvat';
    readonly baseUrl = 'europeanvat.altravia.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Validates and retrieves company information by European VAT number
     * @param country - Two-letter country code (e.g., 'IT', 'DE', 'FR')
     * @param vat - The VAT number to validate
     * @returns Company information including validation status
     */
    async getInformation(country: string, vat?: string): Promise<Company> {
        // TODO: Validate country code format and VAT parameter
        // TODO: Add graceful error messages for invalid VAT numbers or country codes
        return await (await this.client.get(this.url + '/companies/' + country + '/' + vat)).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}