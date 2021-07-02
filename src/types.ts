import { ValidHttpMethod } from ".";

export interface Callback {
    url?: string;
    method?: ValidHttpMethod;
    field?: string;
    data?: any
}