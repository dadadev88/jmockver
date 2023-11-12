interface ResponseConfig {
  code: string;
  statusCode: StatusCode;
  body: { [key: string]: [value: any] }
}

export interface MethodConfig {
  codeToResponse: string;
  responses: Array<ResponseConfig>
}

export interface RouteConfig {
  GET: MethodConfig;
  POST: MethodConfig;
  PUT: MethodConfig;
  PATCH: MethodConfig;
  DELETE: MethodConfig;
}

export interface FileConfig {
  [key: string]: RouteConfig;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type StatusCode = 200 | 201 | 400 | 401 | 402 | 403 | 404 | 500;