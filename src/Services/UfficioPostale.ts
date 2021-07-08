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

interface Tracking {
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

    async listRaccomandate(state?: 'NEW' | 'CONFIRMED' | 'SENDING' | 'SENT' | 'ERROR'): Promise<SigleRaccomandata[]> {
        return await (await this.client.get(this.url + '/raccomandate' + (state ? `/${state}` : ''))).data.data;
    }

    async getRaccomandata(id: string) {
        return await (await this.client.get(this.url + '/raccomandate' +  `/${id}`)).data.data;
    }

    async createRaccomandataRequest(mittente: Mittente, destinatari: Destinatari, documento: string[], opzioni: Opzioni = {}, autoconfirm = false): Promise<RaccomandataResponse[] | any[]> {
        if (!('autoconfirm' in opzioni)) opzioni = { ...opzioni, autoconfirm }
        return await (await this.client.post(this.url + '/raccomandate', JSON.stringify({mittente, destinatari, documento, opzioni}))).data.data;
    }

    async confirmRequest(request_id: string | RaccomandataResponse) {
        const id: string = (typeof request_id === 'object' && 'id' in request_id) ? request_id.id : request_id;
        return await (await this.client.patch(this.url + '/raccomandate/' + id, JSON.stringify({'confirmed': true}))).data.data;
    }

    async track(tracking_number: string): Promise<Tracking[]> {
        return await (await this.client.get(this.url + '/traking/' + tracking_number)).data.data;
    }

    async listDug(): Promise<{codice_dug: string; dug: string}[]> {
        return await (await this.client.get(this.url + '/dug')).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}