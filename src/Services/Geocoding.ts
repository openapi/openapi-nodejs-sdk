import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

export class Geocoding implements Service {
    client: AxiosInstance;
    readonly service = 'geocoding';
    readonly baseUrl = 'geocoding.realgest.it';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    async getGeocode(address?: string): Promise<{ element:any, id:string }> {
        return await (await this.client.post(this.url + '/geocode', JSON.stringify({ address }))).data.elements;
    }

    /**
     * 
     * @param id Se si sta cercando per coordinate, passare id = null
     */
    async reverse(type: 'id' | 'coordinates' | 'id | coordinates', id = null, lat?: string, long?: string) {
        const body = id ? { id, lat, long} : { lat, long }
        return await (await this.client.post(this.url + '/geocode', JSON.stringify(body))).data.elements;
    }

    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}