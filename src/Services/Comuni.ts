import { AxiosInstance } from "axios";
import { Environment, Service,} from "..";
import { getBaseUrl } from "../utils";

interface Provincia {
  nome_provincia: string;
  sigla_provincia: string;
  regione: string;
  comuni: string[];
  dettaglio_comuni: Dettagliocomuni[];
}

interface Dettagliocomuni {
  nome: string;
  popolazione: number;
  codice_catastale: string;
  codice_istat: string;
}

export class Comuni implements Service {
    client: AxiosInstance;
    readonly service = 'comuni';
    baseUrl = 'comuni.openapi.it';
    environment: Environment

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getCitiesByCap(cap: string): Promise<Provincia[]> {
        return await (await this.client.get(this.url + '/cap/' + cap)).data.data;
    }

    async getComuneByCatasto(codiceCatastale: string) {
        return await (await this.client.get(this.url + '/catastale/' + codiceCatastale)).data.data;
    }

    //Regioni

    async getRegioni() {
        const regioni: Array<string> = await (await this.client.get(this.url + '/regioni')).data.data;
        return regioni.sort();
    }

    async getRegione(regione: string): Promise<Provincia[]> {
        return await (await this.client.get(this.url + '/regioni/' + regione)).data.data;
    }

    // Provincie

    /**
     * @return Ritorna un oggetto chiave-valore delle province,
     * definito come { codice_privicia: nome_provincia }
     */
    async listProvince() {
        return await (await this.client.get(this.url + '/province')).data.data;
    }

    async getProvincia(provincia?: string): Promise<Provincia> {
        return await (await this.client.get(this.url + '/province/' + provincia)).data.data[0];
    }

    // Comuni

    async listComuni(provincia: string) {
       return (await this.getProvincia(provincia)).dettaglio_comuni;
    }

    async getFromIstatCode(code: string): Promise<any[]> {
        return await (await this.client.get(this.url + '/istat/' + code)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
