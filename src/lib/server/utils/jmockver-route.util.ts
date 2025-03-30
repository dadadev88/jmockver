import { join } from 'path';
import { readFile } from 'fs/promises';
import { type RequestHandler, type Express } from 'express';
import { JMockverFile, type HttpMethod } from '../types/jmockver.types';
import { LoggerUtil } from '../../utils/logger.util';
import { RouteConfig } from '../types/route-config';
import { JMockverConstants } from '../symbols/jmockver.constants';
import { JMockverMethodNotAllowedError, JMockverParseError, JMockverRouteAlreadyExistsError, JMockverResponseIdNotMatchedError, JMockverStatusCodeNotValidError } from '../symbols/jmockver.errors';
import { ResponseConfig } from '../types/response-config';

export class JMockverRoutesUtils {
  private mockedRoutes: Map<string, string> = new Map();

  constructor(private readonly app: Express) { }

  async generateRoutesFromJSONFiles(mocksFolder: string, filenames: string[]): Promise<void> {
    for (const filename of filenames) {
      LoggerUtil.jumpLine();
      const fileContent = await readFile(join(mocksFolder, filename), { encoding: 'utf-8' });
      try {
        const jmockverFile: JMockverFile = JSON.parse(fileContent);

        if (!jmockverFile.mocks) {
          throw new JMockverParseError(`Mock file ${filename} is not valid`);
        }

        LoggerUtil.info(`🗂️  Routes in ${filename} file`);
        this.mapRoutesFromArrayConfig(jmockverFile, filename);
      } catch (error) {
        LoggerUtil.info(`❌ Error parsing ${filename} file`);
        if (error instanceof JMockverParseError) {
          LoggerUtil.info(`📕 Mock file ${filename} is not valid. See examples in https://github.com/dadadev88/jmockver/blob/master/examples`);
        }
      }
    }
  }

  mapRoutesFromArrayConfig(fileConfig: JMockverFile, filename: string): void {
    fileConfig.mocks.forEach(route => {
      const routeFullPath = route.url.startsWith('/') ? route.url : `/${route.url}`;
      const routeConfig = route.methods;
      const methodsOnRoute = Object.keys(routeConfig) as HttpMethod[];
      this.mapMethodsOnRoutes(methodsOnRoute, routeConfig, routeFullPath, filename);
    });
  }

  mapMethodsOnRoutes(
    methodsOnRoute: HttpMethod[],
    routeConfig: RouteConfig,
    routeFullPath: string,
    filename: string
  ): void {
    methodsOnRoute.forEach(method => {

      try {
        const routeKey = `${routeFullPath} - ${method}`;
        const methodConfig = routeConfig[method];
        const responseIdToReturn = methodConfig.responseIdToReturn;
        const responseConfig = methodConfig.responses.find(response => {
          return response.id === responseIdToReturn;
        });

        this.validateMethodConfig(method, responseConfig, responseIdToReturn, routeFullPath, routeKey);

        this.mockedRoutes.set(routeKey, filename);

        this.createRoute(method, routeFullPath, (_, res) => {
          if (responseConfig?.headers) {
            for (const [key, value] of Object.entries(responseConfig.headers)) {
              res.setHeader(key, value as any);
            }
          }

          const sleepTime = methodConfig.sleep ?? JMockverConstants.SLEEP_TIME_DEFAULT;
          setTimeout(() => {
            res.status(responseConfig?.statusCode ?? JMockverConstants.RESPONSE_HTTP_DEFAULT)
              .json(responseConfig?.body ?? {});
          }, sleepTime);
        });
      } catch (error) {
        LoggerUtil.info(`\t❌ ${error}`);
      }
    });

    this.app.get('/jmockver/routes', (_, res) => {
      const routesByFilename = new Map<string, string[]>();
      for (const [route, filename] of this.mockedRoutes.entries()) {
        routesByFilename.has(filename)
          ? routesByFilename.get(filename)?.push(route)
          : routesByFilename.set(filename, [route]);
      }

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>JMockver routes</title>
          </head>
          <style>
            body { padding: 20px; font-family: system-ui; color-scheme: light dark; background-color: #fff; color: #000; margin: 0; }
            li.route { list-style: none; padding: 4px; color: #000; border-radius: 4px; margin-bottom: 10px; background-color:rgb(209, 209, 209); }
            .filename { color:rgb(100, 144, 255); }
            .method { font-weight: bold; font-size: 12px; padding: 4px; border-radius: 4px; color: #ffffff; display: inline-block; width: 60px; text-align: center; margin-right: 10px; }
            .method-GET { background-color:rgb(0, 188, 0); } .method-POST { background-color: #0000ff; } .method-PUT, .method-PATCH { background-color: #ffa500; } .method-DELETE { background-color: #ff0000; }
            @media (prefers-color-scheme: dark) { body { background-color: #1a1a1a; color: #fff; } }
          </style>
          <body>
            <h1>JMockver</h1>
            <hr>
            ${Array.from(routesByFilename.entries()).map(([filename, routes]) => {
        return `<h4>Mock routes in <span class="filename">${filename}</span></h4>
              <ul> ${routes.map(route => {
          const routeParts = route.split(' - ');
          const routePath = routeParts[0];
          const routeMethod = routeParts[1];
          return `<li class="route"> <span class="method method-${routeMethod}">${routeMethod}</span> ${routePath} </li>`;
        }).join('')}
              </ul>`;
      }).join('')}
          </body>
        </html>
      `);
    });
  }

  private validateMethodConfig(method: string, responseConfig: ResponseConfig | undefined, responseIdToReturn: string, routeFullPath: string, routeKey: string) {
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      throw new JMockverMethodNotAllowedError(`Method ${method} is not allowed`);
    }

    if (!responseConfig || !responseIdToReturn) {
      throw new JMockverResponseIdNotMatchedError(`Response with code ${responseIdToReturn} not found on "${routeFullPath} - ${method}" route`);
    }

    if (this.mockedRoutes.has(routeKey)) {
      throw new JMockverRouteAlreadyExistsError(`Route "${routeFullPath} - ${method}" already exists on "${this.mockedRoutes.get(routeKey)}" file`);
    }

    if (responseConfig.statusCode < 200 || responseConfig.statusCode > 599) {
      throw new JMockverStatusCodeNotValidError(`Status code ${responseConfig.statusCode} is not valid, in "${routeFullPath} - ${method}" route`);
    }
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

    LoggerUtil.info(`\t🚦 Creating mock ${path} - ${method}`);
  }
}
