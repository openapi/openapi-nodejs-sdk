import { ScopeObject } from "..";

/**
 * Checks if a service is authorized within the provided scopes
 * @param scopes - Array of scope objects to check
 * @param baseUrl - The base URL of the service to verify
 * @returns The matching scope object if found, undefined otherwise
 */
export function isServiceInScopes(scopes: Array<ScopeObject>, baseUrl: string) {
    // TODO: Add validation for empty scopes array and provide graceful error message
    return scopes.find(scope => {
        return scope.domain.match(baseUrl);
    });
}

/**
 * Constructs the full base URL for a service based on environment
 * @param env - The environment ('test' or 'production')
 * @param baseUrl - The base service URL
 * @returns The complete HTTPS URL with environment prefix if applicable
 */
export function getBaseUrl(env: string, baseUrl: string) {
    return 'https://' + ((env === 'test' ) ? 'test.' : '') + baseUrl;
}