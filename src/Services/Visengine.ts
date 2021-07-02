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

    async listServices(): Promise<SummaryVisura[]> {
        return await (await this.client.get(this.url + '/visure')).data.data;
    }

    async serviceDescription(hash: string): Promise<Visura> {
        return await (await this.client.get(this.url + '/visure/' + hash)).data.data;
    }

    async listRequests(): Promise<Richiesta[]> {
        return await (await this.client.get(this.url + '/richiesta')).data.data;
    }

    async getRequest(id: string) {
        return await (await this.client.get(this.url + '/richiesta/' + id)).data.data;
    }

    async createRequest(hash: string, json_visura: any, options?: any, callback?: Callback, email_target?: string, transaction: Transaction = 'close', test = false) {
        const state = this.getTransactionStatus(transaction);
        let body: {[key:string]: any} = { hash_visura: hash, json_visura, email_target, state, test };
        if (callback) body.callback = callback;
        if (email_target) body.email_target = email_target;
        if (options) body.opzioni = options;
        
        this.lastVisura = await (await this.client.post(this.url + '/richiesta', JSON.stringify(body))).data.data;
        return this.lastVisura;
    }

    /**
     * 
     * @param updatedFields un oggetto chiave-valore dei campi della visura che si vogliono aggiornare: 
     * `{'$0': ...nuovi_valori, '$3': ...nuovi_valori}`
     */
    async updateRequest(id: string, updatedFields: {[key:string]: any}, transaction: Transaction = 'close' ) {
        let newFields: {[key:string]: any} = {};
        for (const [key, value] of Object.entries(updatedFields)) {
            newFields[`json_visura.${key}`] = value;
        }

        let body: {[key:string]: any} = { state: this.getTransactionStatus(transaction), ...newFields };
        return await (await this.client.put(this.url + '/richiesta/' + id, JSON.stringify(body))).data.data;
    }

    async getDocument(id: string): Promise<RichiestaDocumento> {
        return await (await this.client.get(this.url + '/richiesta/' + id)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

    getTransactionStatus(t: Transaction) {
        return t === 'close' ? 0 : 1
    }

}