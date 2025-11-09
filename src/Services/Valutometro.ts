import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

interface Value {
  id: string;
  label: string;
}

export interface ResultQuotazione {
  id?: string;
  nome?: string;
  id_citta?: string;
  citta?: string;
  cod_cat?: string;
  provincia?: string;
  id_provincia?: string;
  id_regione?: string;
  regione?: string;
  fascia?: string;
  address?: string;
  formatted?: string;
  loc2011?: string;
  coordinate?: Coordinate;
  immobile?: Immobile;
  quotazione?: Quotazione;
  timestamp?: number;
  owner?: string;
}

interface Quotazione {
  min?: number;
  max?: number;
  med?: number;
  type?: string;
}

interface Immobile {
  type?: string;
  label?: string;
  id?: number;
}

interface Coordinate {
  lat?: number;
  lng?: number;
}

/**
 * Service for real estate property valuation in Italy
 */
export class Valutometro implements Service {
    client: AxiosInstance;
    readonly service = 'valutometro';
    readonly baseUrl = 'valutometro.altravia.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Internal method to retrieve property types
     * @param id - Optional property type ID
     */
    async immobili(id?: string) {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/immobili' + (id ? `/${id}` : ''))).data.data;
    }

    /**
     * Lists all available property types
     */
    async listPropertyTypes(): Promise<Array<Value>> {
        return this.immobili();
    }

    /**
     * Gets details of a specific property type
     * @param id - The property type ID
     */
    async getProperty(id: string): Promise<Value> {
        // TODO: Validate ID and add graceful error message for not found cases
        return this.immobili(id);
    }

    /**
     * Internal method to retrieve contract types
     * @param id - Optional contract type ID
     */
    async contratti(id?: string) {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/contratti' + (id ? `/${id}` : ''))).data.data;
    }

    /**
     * Lists all available contract types (sale, rent, etc.)
     */
    async listContractTypes(): Promise<Array<Value>> {
        return this.contratti();
    }

    /**
     * Gets details of a specific contract type
     * @param id - The contract type ID
     */
    async getContract(id: string): Promise<Value> {
        // TODO: Validate ID and add graceful error message for not found cases
        return this.contratti(id);
    }

    /**
     * Gets a property valuation quote by address
     * @param indirizzo - The property address
     * @param tipo_immobile - Property type ID
     * @param tipo_contratto - Contract type ID
     */
    async quote(indirizzo: string, tipo_immobile: string, tipo_contratto: string): Promise<ResultQuotazione> {
        // TODO: Validate parameters and provide helpful error messages for invalid address or types
        return (await this.client.post(this.url + '/quotazione', JSON.stringify({ indirizzo, tipo_contratto, tipo_immobile }))).data.data;
    }

    /**
     * Gets address validation and additional parameters for valuation
     * @param indirizzo - The property address
     * @param tipo_immobile - Property type ID
     * @param tipo_contratto - Contract type ID
     */
    async addressQuotation(indirizzo: string, tipo_immobile: string, tipo_contratto: string): Promise<ResultQuotazione> {
        // TODO: Add validation and error handling for invalid addresses
        return (await this.client.post(this.url + '/indirizzo', JSON.stringify({ indirizzo, tipo_contratto, tipo_immobile }))).data.data;
    }

    /**
     * Performs a detailed property valuation
     * @param univoco - Unique identifier from previous address quotation
     * @param searchParams - Additional parameters obtained from addressQuotation
     */
    async valuation(univoco: string, searchParams = {}) {
        // TODO: Validate univoco parameter and provide clear error messages
        return (await this.client.post(this.url + '/valutazione', JSON.stringify({ univoco, ...searchParams }))).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

}
