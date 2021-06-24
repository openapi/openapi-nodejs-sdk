import { AxiosInstance } from "axios";
import { Environment, Service,} from "..";
import { getBaseUrl } from "../utils";

export class Comuni implements Service {
    client: AxiosInstance;
    readonly service = 'comuni';
    baseUrl = 'comuni.openapi.it';
    environment: Environment

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getCitiesByCap(cap: string) {
        return await (await this.client.get(this.url + '/cap/' + cap)).data.data;
    }

    async getComuneByCatasto(codiceCatastale: string) {
        return await (await this.client.get(this.url + '/catastale/' + codiceCatastale)).data.data;
    }

    async getRegioni() {
        const regioni: Array<any> = await (await this.client.get(this.url + '/regioni')).data.data;

        return regioni.sort();
    }

    /**
     * @return Ritorna un oggetto chiave-valore delle province,
     * definito come { codice_privicia: nome_provincia }
     */
    async getProvincie(regione?: string) {
        const province: Array<any> = await (await this.client.get(this.url + '/province' + (regione ? regione : '')))
            .data.data;
        
        return province;
    }

    async getComuni(provincia?: string) {
        const comuni: Array<any> = await (await this.client.get(this.url + '/comuni' + provincia)).data.data;
        return comuni.sort();
    }

    async getFromIstatCode(code: string | number): Promise<Array<any>> {
        return await (await this.client.get(this.url + '/istat/' + code)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
