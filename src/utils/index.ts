import { ScopeObject } from "..";

export function isServiceInScopes(scopes: Array<ScopeObject>, baseUrl: string) {
    return scopes.find(scope => {
        return scope.domain === baseUrl;
    });
}