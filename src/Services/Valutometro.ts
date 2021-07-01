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

export class Valutometro implements Service {
    client: AxiosInstance;
    readonly service = 'valutometro';
    readonly baseUrl = 'valutometro.altravia.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    } 

    async immobili(id?: string) {
        return await (await this.client.get(this.url + '/immobili' + (id ? `/${id}` : ''))).data.data;
    }

    async listPropertyTypes(): Promise<Array<Value>> {
        return this.immobili();
    }

    async getProperty(id: string): Promise<Value> {
        return this.immobili(id);
    }

    async contratti(id?: string) {
        return await (await this.client.get(this.url + '/contratti' + (id ? `/${id}` : ''))).data.data;
    }

    async listContractTypes(): Promise<Array<Value>> {
        return this.contratti();
    }

    async getContract(id: string): Promise<Value> {
        return this.contratti(id);
    }

    async quote(indirizzo: string, tipo_immobile: string, tipo_contratto: string): Promise<ResultQuotazione> {
        return (await this.client.post(this.url + '/quotazione', JSON.stringify({ indirizzo, tipo_contratto, tipo_immobile }))).data.data;
    }

    async addressQuotation(indirizzo: string, tipo_immobile: string, tipo_contratto: string): Promise<ResultQuotazione> {
        return (await this.client.post(this.url + '/indirizzo', JSON.stringify({ indirizzo, tipo_contratto, tipo_immobile }))).data.data;
    }

    /**
     * @param searchParams i paramentri aggiuntivi che possono essere ricavati chiamando prima `addressQuotation`
     */
    async valuation(univoco: string, searchParams = {}) {
        return (await this.client.post(this.url + '/valutazione', JSON.stringify({ univoco, ...searchParams }))).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

}