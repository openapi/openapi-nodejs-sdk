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

/**
 * Service for sending and managing SMS messages
 */
export class Sms implements Service {
    client: AxiosInstance;
    readonly service = 'sms';
    readonly baseUrl = 'ws.messaggisms.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Retrieves sent SMS messages
     * @param id - Optional message ID to retrieve a specific message
     * @returns Array of messages (all messages or single message if ID provided)
     */
    async getMessages(id?: string): Promise<Array<any>> {
        // TODO: Add error handling for invalid ID or API failures
        const query = id ? \`\${id}\` : '';
        return await (await this.client.get(this.url + '/messages/' + query)).data.data;
    }

    /**
     * Sends SMS messages to one or more recipients
     * @param sender - Sender name/number (3-12 chars for string, 3-14 for number)
     * @param message - SMS text body (supports placeholders with recipient fields)
     * @param recipients - Phone number(s) with international prefix (format: '+39-number')
     * @param priority - Message priority (default: 1)
     * @param options - Additional options (flash, scheduled send, callbacks, etc.)
     * @param test - Whether this is a test message (default: false)
     * @todo Add support for transactions
     */
    async send(sender: string | number, message: string, recipients: string | Array<string | SmsRecipient>,
        priority: number = 1, options: SmsOptions, test: boolean = false,
    ): Promise<Array<any>> {
        if (typeof sender === 'string' && (sender.length > 12 || sender.length < 3)) {
            // TODO: Replace string throw with proper Error object for better error handling
            throw 'sender length must be less than 12 chars and more than 3'
        }

        if (typeof sender === 'number' && (sender.toString().length > 14 || sender.toString().length < 3)) {
            // TODO: Replace string throw with proper Error object for better error handling
            throw 'sender number length must be less than 14 chars and more than 3'
        }

        // TODO: Add validation for recipients format and provide helpful error messages
        // TODO: Handle API errors (invalid recipients, insufficient credits, etc.) with user-friendly messages
        return await (await this.client.post(this.url + '/messages/', JSON.stringify({
            test, sender, recipients, body: message, transaction: false, priority
        }))).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
