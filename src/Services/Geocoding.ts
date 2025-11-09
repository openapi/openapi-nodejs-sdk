import { AxiosInstance } from "axios";
import { Environment, Service, } from "..";
import { getBaseUrl } from "../utils";

/**
 * Service for geocoding and reverse geocoding operations
 */
export class Geocoding implements Service {
    client: AxiosInstance;
    readonly service = 'geocoding';
    readonly baseUrl = 'geocoding.realgest.it';
    environment: Environment;

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Converts an address into geographic coordinates
     * @param address - The address to geocode
     * @returns Element with geocoding data and ID
     */
    async getGeocode(address?: string): Promise<{ element:any, id:string }> {
        // TODO: Add validation for empty address and provide graceful error message
        // TODO: Handle API errors (address not found, ambiguous results, etc.)
        return await (await this.client.post(this.url + '/geocode', JSON.stringify({ address }))).data.elements;
    }

    /**
     * Reverse geocoding: converts coordinates to address or looks up by ID
     * @param type - Type of reverse lookup ('id', 'coordinates', or 'id | coordinates')
     * @param id - Optional element ID (pass null when searching by coordinates)
     * @param lat - Latitude coordinate
     * @param long - Longitude coordinate
     */
    async reverse(type: 'id' | 'coordinates' | 'id | coordinates', id = null, lat?: string, long?: string) {
        // TODO: Validate that either id or coordinates (lat/long) are provided
        // TODO: Add graceful error messages for invalid coordinates or ID not found
        const body = id ? { id, lat, long} : { lat, long }
        return await (await this.client.post(this.url + '/geocode', JSON.stringify(body))).data.elements;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}