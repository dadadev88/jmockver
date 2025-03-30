import { HttpStatusCode } from "./jmockver.types";

export interface ResponseConfig {
  id: string;
  statusCode: HttpStatusCode;
  body: Record<string, [value: object | any[] | boolean | string]>;
  headers: Record<string, [value: boolean | string]>;
  sleep?: number;
}