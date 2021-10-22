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
     */
    async requestProduct(codProdotto: string, data: any, assistenza?: boolean, callback?: Callback) {
        const body = { ...data };
        if (assistenza) body.assistenza = assistenza;
        if (callback) body.callback = callback;

        return await (await this.client.post(this.url + '/richiesta/' + codProdotto, JSON.stringify(body))).data.data
    }

    /**
     * Firma digitale
     */
    async getFirmaElettronica(id: string): Promise<FirmaElettronica> {
        return await (await this.client.get(this.url + '/firma_elettronica/' + id )).data.data;
    }

    async listFirmaElettronica(): Promise<FirmaElettronica[]> {
        return await (await this.client.get(this.url + '/firma_elettronica/')).data.data;
    }

    async createFirmaElettronica(filename: string, content: string, members: FesMember[], callback?: FesCallback, title?: string, description?: string): Promise<FirmaElettronica> {
        let body: any = {
            filename,
            content,
            members,
            callback
        };

        if (title) body.title = title;
        if (description) body.description = description;

        return await (await this.client.post(this.url + '/firma_elettronica/base', JSON.stringify(body))).data.data;
    }

    async downloadFirmaElettronica(id: string): Promise<string> {
        return await (await this.client.get(this.url + '/firma_elettronica/' + id + '/download')).data.content;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}