import { ResponseConfig } from "./response-config";

export interface MethodConfig {
  responseIdToReturn: string;
  responses: ResponseConfig[];
  sleep?: number;
}