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

interface newMarca {
  id_marca: string;
  username: string;
  password: string;
}

export class MarcheTemporali implements Service {
    client: AxiosInstance;
    readonly service = 'marcheTemporali';
    readonly baseUrl = 'ws.marchetemporali.com';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    } 

    async listMarche(): Promise<Array<Marca>> {
        return await (await this.client.get(this.url + '/marche')).data.data;
    }

    async purchase(type: 'infocert' | 'aruba', quantity: number): Promise<newMarca> {
        if (quantity < 1) throw 'Quantity must be positive';
        return await (await this.client.get(this.url + '/marche/' + type + '/' + quantity)).data.data;
    }

    /**
     * Controlla se una quantità minima di marche è diponibile
     */
    async checkAvailability(type: 'infocert' | 'aruba', amount: number): Promise<number> {
        if (amount < 1) throw 'Quantity must be positive';
        
        let availability: string | number = await (await this.client.get(this.url + '/availability/' + type + '/' + amount)).data.data.availability;
        if (typeof availability === 'string') {
            availability = parseInt(availability);
        }

        return availability;
    }

    /**
     * Controlla se una quantità minima di marche è diponibile
     */
    async checkLotto(username: string, password: string): Promise<{available: number, used: number}> {
        let res = await (await this.client.post(this.url + '/check_lotto', JSON.stringify({username, password}))).data.data;
        for (const [key, value] of Object.entries(res)) {
            if (typeof value === 'string') {
                res[key] = parseInt(value);
            }
        }

        return res;
    }

    /**
     * Controlla se una quantità minima di marche è diponibile, ritorna un booleano
     */
    async isAvailable(type: 'infocert' | 'aruba', amount: number): Promise<boolean> {
        let availability: string | number = await this.checkAvailability(type, amount);
        return (availability >= amount);
    }

    

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}