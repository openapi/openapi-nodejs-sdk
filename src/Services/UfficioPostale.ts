import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

interface SigleRaccomandata {
  mittente: Mittente;
  creation_timestamp: number;
  update_timestamp: number;
  confirmed: boolean;
  state: string;
  id: string;
}

interface SingleTelegramma {
  mittente: TelegrammaMittente;
  creation_timestamp: number;
  update_timestamp: number;
  confirmed: boolean;
  state: string;
  error?: any;
  id: string;
}

interface TelegrammaMittente {
  nome: string;
  cognome: string;
  email: string;
}

interface Mittente {
  nome: string;
  cognome: string;
  email?: string;
  dug: string;
  indirizzo?: string;
  civico?: string;
  comune?: string;
  cap?: string;
  provincia?: string;
  nazione?: string;
}

interface OpzioniRaccomandata {
  fronteretro?: boolean;
  colori?: boolean;
  autoconfirm?: boolean;
  ar?: boolean;
}

interface OpzioniLOL {
  fronteretro?: boolean;
  colori?: boolean;
  autoconfirm?: boolean;
}

interface OpzioniTelegramma {
  fronteretro?: boolean;
  colori?: boolean;
  autoconfirm?: boolean;
  ar?: boolean;
}

interface Destinatario {
  nome?: string;
  cognome?: string;
  comune?: string;
  cap?: string;
  provincia?: string;
  nazione?: string;
  email?: string;
  dug?: string;
  indirizzo?: string;
  civico?: string;
  co?: string;
  casella_postale?: string;
  ufficio_postale?: string;
  ragione_sociale?: string;
}

interface RaccomandataResponse {
  mittente?: Mittente;
  destinatari?: Destinatario[];
  documento?: string[];
  opzioni?: OpzioniRaccomandata;
  prodotto?: string;
  creation_timestamp?: number;
  update_timestamp?: number;
  confirmed?: boolean;
  state?: string;
  documento_validato?: Documentovalidato;
  pricing?: Pricing;
  lock?: boolean;
  confirmed_timestamp?: number;
  id: string;
}

interface Pricing {
  dettaglio: Dettaglio[];
  totale: Totale;
}

interface Totale {
  importo_totale_netto: number;
  importo_totale_iva: number;
  importo_totale: number;
}

interface Dettaglio {
  codice_servizio: string;
  descrizione_servizio: string;
  percentuale_iva: number;
  quantita: number;
  importo_unitario_totale: number;
  importo_unitario_netto: number;
  importo_unitario_iva: number;
}

interface Documentovalidato {
  pdf: string;
  jpg: string;
  pagine: number;
  size: number;
}

interface TrackingStatus {
  timestamp: number;
  descrizione: string;
  type: string;
  definitivo: boolean;
}

/**
 * Service for sending physical mail (registered letters, telegrams, ordinary mail) via Italian Post
 */
export class UfficioPostale implements Service {
    client: AxiosInstance;
    readonly service = 'ufficioPostale';
    readonly baseUrl = 'ws.ufficiopostale.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Lists available street designation types (DUG - Denominazione Urbanistica Generica)
     */
    async listDug(): Promise<{codice_dug: string; dug: string}[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/dug/')).data.data;
    }

    /**
     * Searches for validated addresses
     * @param cap - Postal code (CAP)
     * @param comune - Municipality name
     * @param dug - Street designation type
     */
    async addresses(cap: string, comune: string, dug: string) {
        // TODO: Validate parameters and add graceful error messages for invalid or not found addresses
        return await (await this.client.get(this.url + '/indirizzi', { params: {cap, comune, dug}})).data.data;
    }

    /**
     * Gets pricing information for postal services
     */
    async pricing(): Promise<Array<any>> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/pricing/')).data.data;
    }

    /**
     * Tracks a postal shipment
     * @param id - The tracking ID
     * @returns Array of tracking status updates
     */
    async track(id: string): Promise<TrackingStatus[]> {
        // TODO: Validate ID and add graceful error messages for invalid or not found tracking IDs
        return await (await this.client.get(this.url + '/tracking/' + id)).data.data;
    }

    /**
     * Gets municipalities for a postal code
     * @param postalCode - The postal code (CAP)
     */
    async comuni(postalCode: string) {
        // TODO: Validate postal code format and handle not found cases
        return await (await this.client.get(this.url + '/comuni/' + postalCode)).data.data;
    }

    // Registered mail (Raccomandate) methods

    /**
     * Lists all registered mail items
     */
    async listRaccomandate(): Promise<SigleRaccomandata[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/raccomandate/')).data.data;
    }

    /**
     * Gets details of a specific registered mail item
     * @param id - The registered mail ID
     */
    async getRaccomandata(id: string) {
        // TODO: Validate ID and add error handling for not found cases
        return await (await this.client.get(this.url + '/raccomandate/' + id)).data.data;
    }

    /**
     * Creates a new registered mail item
     * @param mittente - Sender information
     * @param destinatari - Recipient(s) information
     * @param documento - Base64 encoded document(s)
     * @param autoconfirm - Auto-confirm and send immediately (default: true)
     * @param options - Additional options (double-sided, color, return receipt)
     */
    async createRaccomandata(mittente: Mittente, destinatari: Destinatario[], documento: string[], autoconfirm = true, options: OpzioniRaccomandata = {}): Promise<any[]> {
        // TODO: Validate sender and recipient data
        // TODO: Handle API errors (invalid addresses, document format errors, insufficient credits, etc.)
        if (!Array.isArray(destinatari)) destinatari = [destinatari];
        return await (await this.client.post(this.url + '/raccomandate/', JSON.stringify({ mittente, destinatari, documento, opzioni: { autoconfirm, ...options } }))).data.data;
    }

    /**
     * Confirms a registered mail item for sending
     * @param id - The registered mail ID
     */
    async confirmRaccomandata(id: string) {
        // TODO: Validate ID and handle errors for already confirmed or invalid items
        return await (await this.client.patch(this.url + '/raccomandate/' + id, JSON.stringify({ confirmed: true }))).data.data;
    }

    // Telegram methods

    /**
     * Lists all telegrams
     */
    async listTelegrammi(): Promise<SingleTelegramma[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/telegrammi/')).data.data;
    }

    /**
     * Gets details of a specific telegram
     * @param id - The telegram ID
     */
    async getTelegramma(id: string) {
        // TODO: Validate ID and add error handling for not found cases
        return await (await this.client.get(this.url + '/telegrammi/' + id)).data.data;
    }

    /**
     * Creates a new telegram
     * @param mittente - Sender information
     * @param destinatari - Recipient(s) information
     * @param documento - Base64 encoded document content
     * @param autoconfirm - Auto-confirm and send immediately (default: true)
     * @param options - Additional options
     */
    async createTelegramma(mittente: Mittente, destinatari: Destinatario[], documento: string, autoconfirm = true, options: OpzioniTelegramma = {}): Promise<any[]> {
        // TODO: Validate sender and recipient data
        // TODO: Handle API errors (invalid data, document format errors, etc.)
        if (!Array.isArray(destinatari)) destinatari = [destinatari];
        return await (await this.client.post(this.url + '/telegrammi/', JSON.stringify({ mittente, destinatari, documento, opzioni: { autoconfirm, ...options } }))).data.data;
    }

    /**
     * Confirms a telegram for sending
     * @param id - The telegram ID
     */
    async confirmTelegramma(id: string) {
        // TODO: Validate ID and handle errors for already confirmed or invalid items
        return await (await this.client.patch(this.url + '/telegrammi/' + id, JSON.stringify({ confirmed: true }))).data.data;
    }

    // Ordinary mail methods

    /**
     * Lists all ordinary mail items
     */
    async listOrdinarie() {
        // TODO: Add error handling for API failures
        return  await (await this.client.get(this.url + '/ordinarie/')).data.data;
    }

    /**
     * Gets details of a specific ordinary mail item
     * @param id - The ordinary mail ID
     */
    async getOrdinaria(id: string) {
        // TODO: Validate ID and add error handling for not found cases
        return await (await this.client.get(this.url + '/ordinarie/' + id)).data.data;
    }

    /**
     * Creates a new ordinary mail item
     * @param mittente - Sender information
     * @param destinatari - Recipient(s) information
     * @param documento - Base64 encoded document
     * @param autoconfirm - Auto-confirm and send immediately (default: true)
     * @param options - Additional options
     */
    async createOrdinaria(mittente: Mittente, destinatari: Destinatario[], documento: string, autoconfirm = true, options: OpzioniLOL = {}): Promise<any[]> {
        // TODO: Validate sender and recipient data
        // TODO: Handle API errors (invalid data, document format errors, etc.)
        if (!Array.isArray(destinatari)) destinatari = [destinatari];
        return await (await this.client.post(this.url + '/ordinarie/', JSON.stringify({ mittente, destinatari, documento, opzioni: { autoconfirm, ...options } }))).data.data;
    }

    /**
     * Confirms an ordinary mail item for sending
     * @param id - The ordinary mail ID
     */
    async confirmOrdinaria(id: string) {
        // TODO: Validate ID and handle errors for already confirmed or invalid items
        return await (await this.client.patch(this.url + '/ordinarie/' + id, JSON.stringify({ confirmed: true }))).data.data;
    }

    // Priority mail methods

    /**
     * Lists all priority mail items
     */
    async listPrioritarie() {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/prioritarie/')).data.data;
    }

    /**
     * Gets details of a specific priority mail item
     * @param id - The priority mail ID
     */
    async getPrioritaria(id: string) {
        // TODO: Validate ID and add error handling for not found cases
        return await (await this.client.get(this.url + '/prioritarie/' + id)).data.data;
    }

    /**
     * Creates a new priority mail item
     * @param mittente - Sender information
     * @param destinatari - Recipient(s) information
     * @param documento - Base64 encoded document
     * @param autoconfirm - Auto-confirm and send immediately (default: true)
     * @param options - Additional options
     */
    async createPrioritaria(mittente: Mittente, destinatari: Destinatario[], documento: string, autoconfirm = true, options: OpzioniLOL = {}): Promise<any[]> {
        // TODO: Validate sender and recipient data
        // TODO: Handle API errors (invalid data, document format errors, etc.)
        if (!Array.isArray(destinatari)) destinatari = [destinatari];
        return await (await this.client.post(this.url + '/prioritarie/', JSON.stringify({ mittente, destinatari, documento, opzioni: { autoconfirm, ...options } }))).data.data;
    }

    /**
     * Confirms a priority mail item for sending
     * @param id - The priority mail ID
     */
    async confirmPrioritaria(id: string) {
        // TODO: Validate ID and handle errors for already confirmed or invalid items
        return await (await this.client.patch(this.url + '/prioritarie/' + id, JSON.stringify({ confirmed: true }))).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
