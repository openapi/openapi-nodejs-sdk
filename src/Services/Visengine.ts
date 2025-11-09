import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { Callback } from "../types";
import { getBaseUrl } from "../utils";

interface SummaryVisura {
  nome_visura: string;
  nome_categoria: string;
  hash_visura: string;
}

interface Visura {
  nome_visura: string;
  nome_categoria: string;
  json_struttura: Jsonstruttura;
  ricerca: string;
  prezzo_visura: number;
  prezzo_ricerca: number;
  hash_visura: string;
  fornitori: any[];
}

interface Jsonstruttura {
  campi: any;
  validazione: string;
  istruzioni: string;
  istruzioni_ricerca: string;
}

interface Richiesta {
  _id?: string;
  state?: number;
  hash_visura?: string;
  nome?: string;
  ricerca?: boolean;
  id_ricerca?: string;
  prezzo_visura: number;
  prezzo_ricerca: number;
  indice_ricerca?: string;
  stato_richiesta: string;
  email_target?: string;
  timestamp_creation?: number;
  timestamp_last_update?: number;
  owner?: string;
  callback_data?: false | any;
  ricerche?: any;
  esito?: Esito;
}

interface Esito {
  codice: string;
  info: string;
}

interface RichiestaDocumento {
  nome: string;
  dimensione: number;
  file: string;
}

export type Transaction = 'open' | 'close';

/**
 * Service for requesting official documents and reports (visure) from Italian registries
 */
export class Visengine implements Service {
    client: AxiosInstance;
    readonly service = 'visengine';
    readonly baseUrl = 'visengine2.altravia.com';
    environment: Environment;
    lastVisura?: any;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Lists all available document types (visure)
     */
    async listServices(): Promise<SummaryVisura[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/visure')).data.data;
    }

    /**
     * Gets detailed description and requirements for a specific document type
     * @param hash - The document type identifier hash
     */
    async getServiceDescription(hash: string): Promise<Visura> {
        // TODO: Validate hash and add error handling for not found cases
        const res = await (await this.client.get(this.url + '/visure/' + hash)).data.data;
        if (res.json_struttura.istruzioni) {
            res.json_struttura.istruzioni = Buffer.from(res.json_struttura.istruzioni, 'base64').toString();
        }

        return res;
    }

    /**
     * Lists all document requests made by the user
     */
    async listRequests(): Promise<Richiesta[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/richiesta')).data.data;
    }

    /**
     * Gets details of a specific document request
     * @param id - The request ID
     */
    async getRequest(id: string) {
        // TODO: Validate ID and add error handling for not found cases
        return await (await this.client.get(this.url + '/richiesta/' + id)).data.data;
    }

    /**
     * Creates a new document request
     * @param hash - Document type hash
     * @param json_visura - Document data fields as required by the specific document type
     * @param options - Optional additional options
     * @param callback - Optional callback configuration for request completion notification
     * @param email_target - Optional email address to send the completed document
     * @param transaction - Transaction mode: 'close' to process immediately, 'open' to process later
     * @param test - Whether this is a test request (default: false)
     */
    async createRequest(hash: string, json_visura: any, options?: any, callback?: Callback, email_target?: string, transaction: Transaction = 'close', test = false) {
        // TODO: Validate required parameters and provide clear error messages
        // TODO: Handle API errors (invalid hash, missing required fields, insufficient credits, etc.)
        const state = this.getTransactionStatus(transaction);
        let body: {[key:string]: any} = { hash_visura: hash, json_visura, email_target, state, test };
        if (callback) body.callback = callback;
        if (email_target) body.email_target = email_target;
        if (options) body.opzioni = options;

        this.lastVisura = await (await this.client.post(this.url + '/richiesta', JSON.stringify(body))).data.data;
        return this.lastVisura;
    }

    /**
     * Updates an existing open document request
     * @param id - The request ID
     * @param updatedFields - Key-value object of fields to update (e.g., {'$0': ...new_values})
     * @param transaction - Transaction mode: 'close' to process, 'open' to keep open
     */
    async updateRequest(id: string, updatedFields: {[key:string]: any}, transaction: Transaction = 'close' ) {
        // TODO: Validate ID and updatedFields parameters
        // TODO: Add graceful error messages for invalid request ID or field validation errors
        let newFields: {[key:string]: any} = {};
        for (const [key, value] of Object.entries(updatedFields)) {
            newFields[`json_visura.${key}`] = value;
        }

        let body: {[key:string]: any} = { state: this.getTransactionStatus(transaction), ...newFields };
        return await (await this.client.put(this.url + '/richiesta/' + id, JSON.stringify(body))).data.data;
    }

    /**
     * Downloads the completed document
     * @param id - The request ID
     * @returns Document details including Base64 encoded file content
     */
    async getDocument(id: string): Promise<RichiestaDocumento> {
        // TODO: Validate ID and handle cases where document is not ready yet
        return await (await this.client.get(this.url + '/richiesta/' + id)).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

    /**
     * Converts transaction type to numeric state value
     * @param t - Transaction type ('close' or 'open')
     */
    getTransactionStatus(t: Transaction) {
        return t === 'close' ? 0 : 1
    }

}
