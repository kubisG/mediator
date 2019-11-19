import { Injectable, Inject, Logger } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class HttpClient {

    async get<T>(url: string): Promise<T | null> {
        return (await axios.get<T>(url)).data;
    }

    async post<T>(url: string, data: any): Promise<T> {
        return (await axios.post<T>(url, data)).data;
    }

    async put<T>(url: string, data: any): Promise<T> {
        return (await axios.post<T>(url, data)).data;
    }

    async delete(url: string): Promise<void> {
        await axios.delete(url);
    }
}
