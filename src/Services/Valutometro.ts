import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export class Valutometro implements Service {
    client: AxiosInstance;
    readonly service = 'valutometro';
    readonly baseUrl = 'valutometro.altravia.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    } 


    async getAll(code: string): Promise<Array<PecStatus>> {
        if (!this.username || !this.password) throw 'Please set your credentials first';
        return await (await this.client.get(this.url + '/send/' + code, { 
            headers: {
                'x-username': this.username,
                'x-password': this.password,
            }
        })).data.data;
    }
    
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

}