import { ValidHttpMethod } from ".";

export interface Callback {
    url?: string;
    method?: 'JSON' | 'POST';
    field?: string;
    data?: any
}