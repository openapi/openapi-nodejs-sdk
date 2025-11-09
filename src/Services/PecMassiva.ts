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

/**
 * Service for sending certified emails (PEC - Posta Elettronica Certificata) in bulk
 */
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

    /**
     * Sets PEC account credentials for sending emails
     * @param username - PEC account username
     * @param password - PEC account password
     */
    setCredentials(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    /**
     * Retrieves all PEC emails associated with a code
     * @param code - The tracking code
     * @returns Array of PEC status objects
     */
    async getAll(code: string): Promise<Array<PecStatus>> {
        if (!this.username || !this.password) {
            // TODO: Replace string throw with proper Error object
            throw 'Please set your credentials first';
        }
        // TODO: Add error handling for invalid code or API failures
        return await (await this.client.get(this.url + '/send/' + code, {
            headers: {
                'x-username': this.username,
                'x-password': this.password,
            }
        })).data.data;
    }

    /**
     * Sends a certified email (PEC)
     * @param sender - Sender PEC email address
     * @param recipient - Recipient PEC email address
     * @param body - Email body content
     * @param subject - Email subject
     * @param attachments - Optional array of attachments with name and file content
     */
    async send(sender: string, recipient: string, body: string, subject: string, attachments?: Array<{name: string, file: Buffer | any}>) {
        // TODO: Validate email addresses format
        // TODO: Add graceful error messages for invalid credentials, email format, or send failures
        const b: any = { sender, recipient, body, subject, username: this.username, password: this.password };
        if (attachments) b.attachments = attachments;
        return await (await this.client.post(this.url + '/send', JSON.stringify(b))).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }

}
