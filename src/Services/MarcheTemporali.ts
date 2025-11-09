import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export interface Marca {
  id_marca?: string;
  type?: string;
  qty_marca?: string;
  username?: string;
  password?: string;
  id_entita?: string;
  timestamp_acquisto?: string;
}

export interface newMarca {
  id_marca: string;
  username: string;
  password: string;
}

/**
 * Service for managing digital timestamps (Marche Temporali)
 */
export class MarcheTemporali implements Service {
    client: AxiosInstance;
    readonly service = 'marcheTemporali';
    readonly baseUrl = 'ws.marchetemporali.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Lists all purchased timestamp batches
     */
    async listMarche(): Promise<Array<Marca>> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/marche')).data.data;
    }

    /**
     * Purchases a new batch of timestamps
     * @param type - Provider type ('infocert' or 'aruba')
     * @param quantity - Number of timestamps to purchase
     */
    async purchase(type: 'infocert' | 'aruba', quantity: number): Promise<newMarca> {
        if (quantity < 1) {
            // TODO: Replace string throw with proper Error object
            throw 'Quantity must be positive';
        }
        // TODO: Handle API errors with user-friendly messages (insufficient funds, provider errors, etc.)
        return await (await this.client.get(this.url + '/marche/' + type + '/' + quantity)).data.data;
    }

    /**
     * Checks the availability of timestamps
     * @param type - Provider type ('infocert' or 'aruba')
     * @param amount - Minimum quantity to check
     * @returns Number of available timestamps
     */
    async checkAvailability(type: 'infocert' | 'aruba', amount: number): Promise<number> {
        if (amount < 1) {
            // TODO: Replace string throw with proper Error object
            throw 'Quantity must be positive';
        }

        // TODO: Add error handling for API failures
        let availability: string | number = await (await this.client.get(this.url + '/availability/' + type + '/' + amount)).data.data.availability;
        if (typeof availability === 'string') {
            availability = parseInt(availability);
        }

        return availability;
    }

    /**
     * Checks the status of a purchased timestamp batch
     * @param username - Batch username
     * @param password - Batch password
     * @returns Available and used timestamp counts
     */
    async checkLotto(username: string, password: string): Promise<{available: number, used: number}> {
        // TODO: Validate credentials and add graceful error messages for invalid credentials
        let res = await (await this.client.post(this.url + '/check_lotto', JSON.stringify({username, password}))).data.data;
        for (const [key, value] of Object.entries(res)) {
            if (typeof value === 'string') {
                res[key] = parseInt(value);
            }
        }

        return res;
    }

    /**
     * Checks if a minimum quantity of timestamps is available
     * @param type - Provider type ('infocert' or 'aruba')
     * @param amount - Minimum quantity required
     * @returns True if available quantity meets or exceeds requirement
     */
    async isAvailable(type: 'infocert' | 'aruba', amount: number): Promise<boolean> {
        let availability: string | number = await this.checkAvailability(type, amount);
        return (availability >= amount);
    }

    /**
     * Applies a digital timestamp to a file
     * @param username - Batch username
     * @param password - Batch password
     * @param file - Base64 encoded file content
     * @param type - Provider type ('infocert' or 'aruba')
     * @param mime - Whether to include MIME type (default: false)
     */
    async mark(username: string, password: string, file: string, type: 'infocert' | 'aruba' , mime = false) {
        // TODO: Validate file content and credentials
        // TODO: Add graceful error messages for invalid credentials or file format
        return await (await this.client.post(this.url + '/marca', JSON.stringify({username, password, file, mime, type}))).data.data;
    }

    /**
     * Analyzes an existing timestamped file
     * @param file - Base64 encoded timestamped file
     */
    async analyze(file: string) {
        // TODO: Validate file parameter and provide helpful error messages
        return await (await this.client.post(this.url + '/analisi', JSON.stringify({file}))).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
