import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

/**
 * Service for querying Italian Public Administration (PA) entities
 */
export class Pa implements Service {
    client: AxiosInstance;
    readonly service = 'pa';
    readonly baseUrl = 'pa.openapi.it';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Finds Public Administration entity by VAT number
     * @param partitaIva - The VAT number (Partita IVA) of the PA entity
     */
    async findPa(partitaIva?: string) {
        // TODO: Add validation for partitaIva and graceful error message for not found or invalid VAT
        return await (await this.client.get(this.url + '/' + partitaIva)).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
