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

export class UfficioPostale implements Service {
    client: AxiosInstance;
    readonly service = 'ufficioPostale';
    readonly baseUrl = 'ws.ufficiopostale.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async listDug(): Promise<{codice_dug: string; dug: string}[]> {
        return await (await this.client.get(this.url + '/dug/')).data.data;
    }

    async addresses(cap: string, comune: string, dug: string) {
        return await (await this.client.get(this.url + '/indirizzi', { params: {cap, comune, dug}})).data.data;
    }

    async pricing(): Promise<Array<any>> {
        return await (await this.client.get(this.url + '/pricing/')).data.data;
    }

    async track(id: string): Promise<TrackingStatus[]> {
        return await (await this.client.get(this.url + '/tracking/' + id)).data.data;
    }

    async comuni(postalCode: string) {
        return await (await this.client.get(this.url + '/comuni/' + postalCode)).data.data;
    }

    // Raccomandate
    async listRaccomandate(): Promise<SigleRaccomandata[]> {
        return await (await this.client.get(this.url + '/raccomandate')).data.data;
    }

    async getRaccomandata(id: string) {
        return await (await this.client.get(this.url + '/raccomandate/' + id)).data.data;
    }

    async createRaccomandata(mittente: Mittente, destinatari: Destinatario[], documento: string[], autoconfirm = true, options: OpzioniRaccomandata = {}): Promise<any[]> {
        if (!Array.isArray(destinatari)) destinatari = [destinatari];
        return await (await this.client.post(this.url + '/raccomandate/', JSON.stringify({ mittente, destinatari, documento, opzioni: { autoconfirm, ...options } }))).data.data;
    }

    async confirmRaccomandata(id: string) {
        return await (await this.client.patch(this.url + '/raccomandate/' + id, JSON.stringify({ confirmed: true }))).data.data;
    }

    // Telegrammi
    async listTelegrammi(): Promise<SingleTelegramma[]> {
        return await (await this.client.get(this.url + '/telegrammi')).data.data;
    }

    async getTelegramma(id: string) {
        return await (await this.client.get(this.url + '/telegrammi/' + id)).data.data;
    }

    async createTelegramma(mittente: Mittente, destinatari: Destinatario[], documento: string, autoconfirm = true, options: OpzioniTelegramma = {}): Promise<any[]> {
        if (!Array.isArray(destinatari)) destinatari = [destinatari];
        return await (await this.client.post(this.url + '/telegrammi/', JSON.stringify({ mittente, destinatari, documento, opzioni: { autoconfirm, ...options } }))).data.data;
    }

    async confirmTelegramma(id: string) {
        return await (await this.client.patch(this.url + '/telegrammi/' + id, JSON.stringify({ confirmed: true }))).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}