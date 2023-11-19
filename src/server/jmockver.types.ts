interface ResponseConfig {
  id: string;
  statusCode: HttpStatusCode;
  body: Record<string, [value: object | any[] | boolean | string]>;
}

export interface MethodConfig {
  responseIdToReturn: string;
  responses: ResponseConfig[];
}

export interface RouteConfig {
  GET: MethodConfig;
  POST: MethodConfig;
  PUT: MethodConfig;
  PATCH: MethodConfig;
  DELETE: MethodConfig;
}

export type FileConfig = Record<string, RouteConfig>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpStatusCode = 200 | 201 | 400 | 401 | 402 | 403 | 404 | 500;
