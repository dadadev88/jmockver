import { MethodConfig } from "./method-config";

export interface RouteConfig {
  GET: MethodConfig;
  POST: MethodConfig;
  PUT: MethodConfig;
  PATCH: MethodConfig;
  DELETE: MethodConfig;
}