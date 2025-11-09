import axios, { AxiosInstance } from 'axios';
import { Environment, Service, } from '../index';
import { Callback } from '../types';
import { getBaseUrl } from "../utils";

export interface Prodotto {
    nome?: string;
    tipo?: string;
    codice_prodotto?: string;
    prezzo?: number;
}

export interface Anagrafica {
  nome?: string;
  cognome?: string;
  email?: string;
  cellulare?: string;
  codice_fiscale?: string;
  data_nascita?: string;
  sesso?: string;
  comune_nascita?: string;
  provincia_nascita?: string;
  nazione_nascita?: string;
  indirizzo_residenza?: string;
  comune_residenza?: string;
  provincia_residenza?: string;
  cap_residenza?: string;
  nazione_residenza?: string;
  destinatario?: string;
  indirizzo_spedizione?: string;
  comune_spedizione?: string;
  provincia_spedizione?: string;
  cap_spedizione?: string;
  tipo_documento?: string;
  numero_documento?: string;
  soggetto_emittente?: string;
  data_emissione?: string;
  data_scadenza?: string;
  note?: string
}

export interface FirmaElettronica {
  id: string;
  filename: string;
  title: string;
  description: string;
  members: FesMemberResponse[];
  status: string;
  download_link: string;
  callback_status: string;
  callback: FesCallback;
}

interface FesCallback {
  method: string;
  field: string;
  url: string;
}

interface FesMemberResponse {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  sign_link: string;
}

interface FesMember {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  signs: Sign[];
}

interface Sign {
  page: number;
  position: string;
}

/**
 * Service for managing digital signatures and electronic signature requests
 */
export class FirmaDigitale implements Service {
    client: AxiosInstance;
    readonly service = 'firmaDigitale';
    readonly baseUrl = 'ws.firmadigitale.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Retrieves the list of available digital signature products
     */
    async getProducts(): Promise<Array<Prodotto>> {
        // TODO: Add error handling for failed API requests with user-friendly messages
        return await (await this.client.get(this.url + '/prodotti')).data.data
    }

    /**
     * Gets details of a specific digital signature request
     * @param id - The request ID
     */
    async getRequest(id: string) {
        // TODO: Add validation for empty/invalid ID and graceful error message
        return await (await this.client.get(this.url + '/richiesta/' + id)).data.data
    }

    /**
     * Lists all digital signature requests
     */
    async listRequests(): Promise<Array<any>> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/richiesta/')).data.data
    }

    /**
     * Downloads the request module/form for a specific request
     * @param id - The request ID
     */
    async getRequestModule(id: string): Promise<Buffer> {
        // TODO: Add validation and error handling for invalid ID or missing module
        return await this.client.get(this.url + '/richiesta/' + id + '/modulo');
    }

    /**
     * Requests a digital signature product
     * @param codProdotto - Product code to request (see https://developers.openapi.it/services/firmadigitale)
     * @param data - Additional data required by the specific product
     * @param assistenza - Whether to request assistance
     * @param callback - Optional callback configuration
     */
    async requestProduct(codProdotto: string, data: any, assistenza?: boolean, callback?: Callback) {
        // TODO: Add validation for codProdotto and data parameters with clear error messages
        const body = { ...data };
        if (assistenza) body.assistenza = assistenza;
        if (callback) body.callback = callback;

        // TODO: Handle API errors with descriptive messages (invalid product code, missing required fields, etc.)
        return await (await this.client.post(this.url + '/richiesta/' + codProdotto, JSON.stringify(body))).data.data
    }

    /**
     * Gets details of a specific electronic signature request
     * @param id - The electronic signature ID
     */
    async getFirmaElettronica(id: string): Promise<FirmaElettronica> {
        // TODO: Add error handling for invalid ID or not found cases
        return await (await this.client.get(this.url + '/firma_elettronica/' + id )).data.data;
    }

    /**
     * Lists all electronic signature requests
     */
    async listFirmaElettronica(): Promise<FirmaElettronica[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/firma_elettronica/')).data.data;
    }

    /**
     * Creates a new electronic signature request
     * @param filename - Name of the file to be signed
     * @param content - Base64 encoded file content
     * @param members - Array of signers with their details and signature positions
     * @param callback - Optional callback configuration for status updates
     * @param title - Optional title for the signature request
     * @param description - Optional description
     */
    async createFirmaElettronica(filename: string, content: string, members: FesMember[], callback?: FesCallback, title?: string, description?: string): Promise<FirmaElettronica> {
        // TODO: Validate required fields (filename, content, members) and provide clear error messages
        let body: any = {
            filename,
            content,
            members,
            callback
        };

        if (title) body.title = title;
        if (description) body.description = description;

        // TODO: Handle API errors (invalid file format, missing member info, etc.) with user-friendly messages
        return await (await this.client.post(this.url + '/firma_elettronica/base', JSON.stringify(body))).data.data;
    }

    /**
     * Downloads the signed document
     * @param id - The electronic signature ID
     * @returns Base64 encoded signed document
     */
    async downloadFirmaElettronica(id: string): Promise<string> {
        // TODO: Add error handling for invalid ID or document not ready cases
        return await (await this.client.get(this.url + '/firma_elettronica/' + id + '/download')).data.content;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}