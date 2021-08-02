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
}

interface Opzioni {
  fronteretro?: boolean;
  colori?: boolean;
  autoconfirm?: boolean;
  ar?: boolean;
  timestamp_invio?: any;
  callback_url?: any;
  callback_field?: any;
  custom?: any;
}

interface Destinatari {
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
  destinatari?: Destinatari[];
  documento?: string[];
  opzioni?: Opzioni;
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
        return await (await this.client.get(this.url + '/dug')).data.data;
    }

    async addresses(cap: string, comune: string, dug: string) {
        return await (await this.client.get(this.url + '/indirizzi', { params: {cap, comune, dug}})).data.data;
    }

    async pricing(cap: string, comune: string, dug: string): Promise<Array<any>> {
        return await (await this.client.get(this.url + '/pricing')).data.data;
    }

    async track(id: string): Promise<TrackingStatus[]> {
        return await (await this.client.get(this.url + '/tracking/' + id)).data.data;
    }

    async comuni(postalCode: string) {
        return await (await this.client.get(this.url + '/comuni/' + postalCode)).data.data;
    }

    // @todo Raccomandate
    async listRaccomandate(): Promise<SigleRaccomandata[]> {
        return await (await this.client.get(this.url + '/raccomandate')).data.data;
    }

    async getRaccomandata(id: string) {
        return await (await this.client.get(this.url + '/raccomandate/' + id)).data.data;
    }

    // @todo Telegrammi
    async listTelegrammi(): Promise<SingleTelegramma[]> {
        return await (await this.client.get(this.url + '/telegrammi')).data.data;
    }

    async getTelegramma(id: string) {
        return await (await this.client.get(this.url + '/telegrammi/' + id)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}