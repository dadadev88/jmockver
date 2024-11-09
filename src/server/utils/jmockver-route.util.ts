import { readFile } from 'fs/promises';
import { type FileConfig, type HttpMethod } from '../types/jmockver.types';
import { join } from 'path';
import { type RequestHandler, type Express } from 'express';
import { LoggerUtil } from './logger.util';
import { RouteConfig } from '../types/route-config';
import { JMockverConstants } from '../contants/jmockver.constants';

export class JMockverRoutesUtils {
  constructor(private readonly app: Express) { }

  async generateRoutesFromJSONFiles(path: string, filenames: string[]): Promise<void> {
    for (const filename of filenames) {
      const fileContent = await readFile(join(path, filename), { encoding: 'utf-8' });
      try {
        const fileConfig: FileConfig = JSON.parse(fileContent);
        const routes = Object.keys(fileConfig);
        LoggerUtil.info(`🗂️  Routes in ${filename} file`);
        this.mapRoutes(routes, fileConfig);
      } catch (error) {
        LoggerUtil.info(`❌ Error parsing ${filename} file`);
      }
    }
  }

  mapRoutes(routes: string[], fileConfig: FileConfig): void {
    routes.forEach(route => {
      const routeConfig = fileConfig[route];
      const routeFullPath = `${route.startsWith('/') ? '' : '/'}${route}`;
      const methodsOnRoute = Object.keys(routeConfig) as HttpMethod[];

      this.mapMethodsOnRoutes(methodsOnRoute, routeConfig, routeFullPath);
    });
  }

  mapMethodsOnRoutes(
    methodsOnRoute: HttpMethod[],
    routeConfig: RouteConfig,
    routeFullPath: string
  ): void {
    methodsOnRoute.forEach(method => {
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

      const methodConfig = routeConfig[method];
      const responseIdToReturn = methodConfig.responseIdToReturn;

      const responseConfig = methodConfig.responses.find(response => {
        return response.id === responseIdToReturn;
      });

      if (!responseConfig || !responseIdToReturn) {
        LoggerUtil.info(`❌ Response with code ${responseIdToReturn} not found on ${method} ${routeFullPath}`);
        return;
      }

      this.createRoute(method, routeFullPath, (_, res) => {
        const sleepTime = responseConfig.sleep ?? methodConfig.sleep ?? JMockverConstants.SLEEP_TIME_DEFAULT;
        setTimeout(() => {
          for (const key in responseConfig.headers) {
            res.setHeader(key, (responseConfig.headers as any)[key]);
          }

          res.status(responseConfig.statusCode ?? JMockverConstants.RESPONSE_HTTP_DEFAULT)
            .json(responseConfig?.body ?? {});
        }, sleepTime);
      });
    });
  }

  createRoute(method: HttpMethod, path: string, requestHandler: RequestHandler): void {
    switch (method) {
      case 'GET':
        this.app.get(path, requestHandler);
        break;

      case 'POST':
        this.app.post(path, requestHandler);
        break;

      case 'PUT':
        this.app.put(path, requestHandler);
        break;

      case 'DELETE':
        this.app.delete(path, requestHandler);
        break;

      default:
        this.app.patch(path, requestHandler);
        break;
    }

    LoggerUtil.info(`  🚦 Creating mock ${path} - ${method}`);
  }
}
