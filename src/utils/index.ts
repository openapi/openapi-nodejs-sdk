import { ScopeObject } from "..";

export function isServiceInScopes(scopes: Array<ScopeObject>, baseUrl: string) {
    return scopes.find(scope => {
        return scope.domain.match(baseUrl);
    });
}

export function getBaseUrl(env: string, baseUrl: string) {
    return 'https://' + ((env === 'test' ) ? 'test.' : '') + baseUrl;
}