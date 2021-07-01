import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

interface Company {
  cf?: string;
  den?: string;
  dm?: string;
  categoria?: string;
  update_timestamp?: number;
}

export class Splitpayment implements Service {
    client: AxiosInstance;
    readonly service = 'splitpayment';
    readonly baseUrl = 'splitpayment.openapi.it';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async listCompanies(): Promise<Array<Company>> {
        return await (await this.client.get(this.url + '/')).data.data;
    }

    async company(cf?: string) {
        return await (await this.client.get(this.url + '/' + cf)).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}