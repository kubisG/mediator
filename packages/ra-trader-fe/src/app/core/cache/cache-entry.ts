import { HttpResponse } from "@angular/common/http";

export interface CacheEntry {
    url: string;
    response: HttpResponse<any>;
    entryTime: number;
}

export const MAX_CACHE_AGE = (60 * 60 * 1000); // in milliseconds 1000 * 60 * 60 = 1h

