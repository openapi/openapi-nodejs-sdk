import { AxiosInstance } from "axios";
import { Environment, Service,} from "..";
import { getBaseUrl } from "../utils";

interface DomainRegistration {
  domain?: string;
  registrant?: string;
  admin?: string;
  tech?: string[];
  dns?: string[];
}

interface Domain {
  status: string[];
  domain: string;
  ns: string[];
  registrant: string;
  admin: string;
  tech: string;
  authinfo: string;
  crDate: string;
  exDate: string;
  dnssec: any[];
  owner: string;
  timestamp: number;
  renewal_date: string;
}

interface ContactRequest {
  name?: string;
  org?: string;
  street?: string;
  city?: string;
  province?: string;
  postalcode?: string;
  countrycode?: string;
  voice?: string;
  email?: string;
  nationalitycode?: string;
}

interface Contact {
  status: string[];
  handle: string;
  name: string;
  org: string;
  street: string;
  street2: string;
  street3: string;
  city: string;
  province: string;
  postalcode: string;
  countrycode: string;
  voice: string;
  fax: string;
  email: string;
  authinfo: string;
  consentforpublishing: number;
  nationalitycode: string;
  entitytype: number;
  regcode: string;
  schoolcode: string;
  owner: string;
  timestamp: number;
}

/**
 * Service for managing domain name registrations
 */
export class Domains implements Service {
    client: AxiosInstance;
    readonly service = 'domains';
    readonly baseUrl = 'domains.altravia.com';
    environment: Environment

    constructor(client: AxiosInstance, environment: Environment) {
        this.client = client;
        this.environment = environment;
    }

    /**
     * Checks if a domain name is available for registration
     * @param domain - The domain name to check
     */
    async checkAvailability(domain: string) {
        // TODO: Validate domain format and add graceful error messages
        return await (await this.client.get(this.url + '/check/' + domain)).data;
    }

    /**
     * Lists all registered domains
     */
    async listDomains(): Promise<string[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/domain')).data.data;
    }

    /**
     * Registers a new domain
     * @param data - Domain registration details (domain, contacts, DNS)
     */
    async registerDomain(data: DomainRegistration) {
        // TODO: Validate registration data and provide clear error messages for missing required fields
        // TODO: Handle API errors (domain already registered, invalid contacts, etc.)
        return await (await this.client.post(this.url + '/domain', JSON.stringify(data))).data;
    }

    /**
     * Gets details of a registered domain
     * @param domain - The domain name
     */
    async getDomain(domain: string): Promise<Domain> {
        // TODO: Validate domain and add error handling for not found cases
        return await (await this.client.get(this.url + '/domain/' + domain)).data.data;
    }

    /**
     * Updates domain configuration
     * @param domain - The domain name
     * @param data - Updated domain data
     */
    async updateDomain(domain: string, data: DomainRegistration): Promise<Domain> {
        // TODO: Validate parameters and handle errors for unauthorized updates or invalid data
        return await (await this.client.put(this.url + '/domain/' + domain, JSON.stringify(data))).data.data;
    }

    /**
     * Deletes/cancels a domain registration
     * @param domain - The domain name to delete
     */
    async deleteDomain(domain: string): Promise<Domain> {
        // TODO: Add confirmation validation and graceful error messages
        return await (await this.client.delete(this.url + '/domain/' + domain)).data.data;
    }

    /**
     * Removes a technical contact from a domain
     * @param domain - The domain name
     * @param techId - The technical contact ID to remove
     */
    async deleteTech(domain: string, techId: string): Promise<Domain> {
        // TODO: Validate parameters and handle errors for invalid contact ID
        return await (await this.client.delete(this.url + '/domain/' + domain + '/tech/' + techId)).data.data;
    }

    // Contact management methods

    /**
     * Lists all registered contacts
     */
    async listContacts(): Promise<string[]> {
        // TODO: Add error handling for API failures
        return await (await this.client.get(this.url + '/contact')).data.data;
    }

    /**
     * Creates a new contact for domain registration
     * @param data - Contact information
     */
    async createContact(data: ContactRequest) {
        // TODO: Validate contact data and provide clear error messages for missing required fields
        return await (await this.client.post(this.url + '/contact', JSON.stringify(data))).data;
    }

    /**
     * Gets details of a specific contact
     * @param id - The contact ID
     */
    async getContact(id: string): Promise<Contact> {
        // TODO: Validate ID and add error handling for not found cases
        return await (await this.client.get(this.url + '/contact/' + id)).data.data;
    }

    /**
     * Updates contact information
     * @param id - The contact ID
     * @param data - Updated contact data
     */
    async updateContact(id: string, data: ContactRequest) {
        // TODO: Validate parameters and handle errors for invalid data
        return await (await this.client.put(this.url + '/contact/' + id, JSON.stringify(data))).data;
    }

    /**
     * Deletes a contact
     * @param id - The contact ID to delete
     */
    async deleteContact(id: string) {
        // TODO: Add validation to prevent deleting contacts still in use by domains
        return await (await this.client.delete(this.url + '/contact/' + id)).data.data;
    }

    /**
     * Gets the full service URL based on environment
     */
    get url() {
        return getBaseUrl(this.environment, this.baseUrl)
    }
}
