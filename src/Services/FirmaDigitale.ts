import axios, { AxiosInstance } from 'axios';
import { Environment, Service, } from '../index';
import { getBaseUrl } from "../utils";

export interface Prodotto {
    nome?: string;
    tipo?: string;
    codice_prodotto?: string;
    prezzo?: number;
}

export interface Callback {
  url?: string;
  method?: string;
  field?: string;
  data?: any
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

export class FirmaDigitale implements Service {
    client: AxiosInstance;
    readonly service = 'firmaDigitale';
    readonly baseUrl = 'ws.firmadigitale.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getProducts(): Promise<Array<Prodotto>> {
        return await (await this.client.get(this.url + '/prodotti')).data.data
    }

    async getRequest(id: string) {
        return await (await this.client.get(this.url + '/richiesta/' + id)).data.data
    }

    async listRequests(): Promise<Array<any>> {
        return await (await this.client.get(this.url + '/richiesta/')).data.data
    }

    async getRequestModule(id: string): Promise<Buffer> {
        return await this.client.get(this.url + '/richiesta/' + id + '/modulo');
    }

    /**
     * 
     * @param codProdotto il codice del prodotto da richiedere: https://developers.openapi.it/services/firmadigitale
     * @param data dati aggiuntivi richiesti dallo specifico prodotto richiesto
     * @param anagrafica se il prodotto richiede un'anagrafica, questa verrà aggita alla richiesta, Questo parametro è tipografato e fornisce un aiuto in fase di compilazione. In alternativa, è possibile passare `{ anagrafica }` direttamente in `data`, passando questo parametro nullo
     * @returns 
     */
    async requestProduct(codProdotto: string, data: any, anagrafica?: Anagrafica, assistenza?: boolean, callback?: Callback) {
        const body = { ...data };
        if (anagrafica) body.anagrafica = anagrafica;
        if (assistenza) body.assistenza = assistenza;
        if (callback) body.callback = callback;

        return await (await this.client.post(this.url + '/richiesta/' + codProdotto, JSON.stringify(body))).data.data
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}