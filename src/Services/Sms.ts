import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export interface SmsOptions {
    flash?: boolean;
    timestamp_send?: string;
    custom?: string;
    callback_url?: string;
    callback_field?: string;
    realtime?: boolean;
    bulk?: boolean;
}

export interface SmsRecipient {
    number: string,
    fields: any;
}

export class Sms implements Service {
    client: AxiosInstance;
    readonly service = 'messages';
    readonly baseUrl = 'ws.messaggisms.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * @param id Se viene passato un id, ritorna un array contenente esclusivamente quel messaggio
     * @returns Ritorna la lista di tutti i messaggi inviati
     */
    async getMessages(id?: string): Promise<Array<any>> {
        const query = id ? `/${id}` : '';
        return await (await this.client.get(this.url + '/messages' + query)).data.data;
    }

    /**
     * 
     * @param recipients Phone number of the recipient and wanting the 'fields' object in which to insert the parameters that we want to enter in the 'body' like this: {'number':'+39-34xxxxx987', 'fields':{'name':'simone', 'surname':'rossi'}}. Mandatory is the international prefix which must be separated from the rest by '-' like this: '+39-number'. Any other format will be considered bad recipients and placed among the invalid
     * @todo Supporto per le transazioni 
     */
    async send(sender: string | number, message: string, recipients: string | Array<string | SmsRecipient>, 
        priority: number = 1, options: SmsOptions, test: boolean = false,
    ): Promise<Array<any>> {
        if (typeof sender === 'string' && (sender.length > 12 || sender.length < 3)) {
            throw 'sender length must be less than 12 chars and more than 3'
        }

        if (typeof sender === 'number' && (sender.toString().length > 14 || sender.toString().length < 3)) {
            throw 'sender number length must be less than 14 chars and more than 3'
        }

        return await (await this.client.post(this.url + '/messages', JSON.stringify({
            test, sender, recipients, body: message, transaction: false, priority 
        }))).data.data;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}