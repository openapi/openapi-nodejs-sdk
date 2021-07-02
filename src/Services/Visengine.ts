import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

interface Visura {
  nome_visura: string;
  nome_categoria: string;
  hash_visura: string;
}

export class Visengine implements Service {
    client: AxiosInstance;
    readonly service = 'visengine';
    readonly baseUrl = 'visengine2.altravia.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    } 

    async listServices(): Promise<Visura[]> {
        return await (await this.client.get(this.url + '/visure')).data.data;
    }

    async serviceDescription(hash: string) {
        return await (await this.client.get(this.url + '/visure/' + hash)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

}