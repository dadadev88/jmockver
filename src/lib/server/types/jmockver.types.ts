import { RouteConfig } from "./route-config";

export type JMockverFile = {
  $schema: string;
  mocks: {
    url: string;
    methods: RouteConfig;
  }[];
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpStatusCode = 200 | 201 | 400 | 401 | 402 | 403 | 404 | 500;
