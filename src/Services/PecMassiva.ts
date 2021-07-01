import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export interface PecStatus {
  sender?: string;
  recipient?: string;
  data?: string;
  object?: string;
  message?: string;
}

export class PecMassiva implements Service {
    client: AxiosInstance;
    readonly service = 'pecMassiva';
    readonly baseUrl = 'ws.pecmassiva.com';
    environment: Environment;
    username?: string;
    password?: string;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    } 

    setCredentials(username: string, password: string) {
        this.username = username;
        this.password = password;
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

    async send(sender: string, recipient: string, body: string, subject: string, attachments?: Array<{name: string, file: Buffer | any}>) {
        const b: any = { sender, recipient, body, subject, username: this.username, password: this.password };
        if (attachments) b.attachments = attachments;
        return await (await this.client.post(this.url + '/send', JSON.stringify(b))).data.data;
    }
    
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

}