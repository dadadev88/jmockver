import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import express, { type Express, type RequestHandler } from 'express';
import CLIargs from 'minimist';
import cors from 'cors';
import morgan from 'morgan';
import { type FileConfig, type HttpMethod } from './jmockver.types';
import { join } from 'node:path';

const APP_NAME: string = 'JMockver';
const args = CLIargs(process.argv.slice(2));
const app: Express = express();
app.use(cors());

const isEnableLogger = Boolean(args.logger);
isEnableLogger && enableLogger(args.loggerFormat);

function enableLogger(format: string): void {
  const hasLoggerFormat = Boolean(format);
  const loggerFormat = hasLoggerFormat ? format : 'tiny';

  console.log(`[${APP_NAME}] 👁️  Logger enable with format "${loggerFormat}"`);
  app.use(morgan(loggerFormat));
}

async function getJSONFiles(mocksDir: string): Promise<string[]> {
  const filesOnMockFolder = await readdir(mocksDir);
  return filesOnMockFolder.reduce((prev: string[], filename: string) => {
    if (filename.endsWith('.json'))
      prev.push(filename);
    return prev;
  }, []);
}

function mapRoutes(routes: string[], fileConfig: FileConfig, routePrefix: string): void {
  routes.forEach(route => {
    const routeConfig = fileConfig[route];
    const routeFullPath = `/${routePrefix}${route}`;
    const methodsOnRoute = Object.keys(routeConfig) as HttpMethod[];

    methodsOnRoute.forEach(method => {
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

      const methodConfig = routeConfig[method];
      const responseConfig = methodConfig.responses.find(response => {
        return response.id === methodConfig.idResponseToReturn;
      });

      if (responseConfig === undefined) {
        console.log(`[${APP_NAME}] ❌ Response with code ${methodConfig.idResponseToReturn} not found on ${method} ${routeFullPath}`);
        return;
      }

      createRoute(method, routeFullPath, (_, res) => {
        res.status(responseConfig.statusCode ?? 200).json(responseConfig?.body ?? {});
      });
    });
  });
}

function createRoute(method: HttpMethod, path: string, requestHandler: RequestHandler): Express {
  console.log(`[${APP_NAME}] 🚦 Creating route ${method} - ${path}`);

  if (method === 'GET')
    return app.get(path, requestHandler);

  if (method === 'POST')
    return app.post(path, requestHandler);

  if (method === 'PUT')
    return app.put(path, requestHandler);

  if (method === 'DELETE')
    return app.delete(path, requestHandler);

  return app.patch(path, requestHandler);
}

async function generateRoutesFromJSONFiles(path: string, filenames: string[]): Promise<void> {
  for (const filename of filenames) {
    const fileContent = await readFile(join(path, filename), { encoding: 'utf-8' });
    try {
      const fileConfig: FileConfig = JSON.parse(fileContent);
      const routes = Object.keys(fileConfig);
      const routePrefix = filename.replace('.json', '');
      console.log(`[${APP_NAME}] 🗂️  Routes on file ${filename} -> /${routePrefix}`);
      mapRoutes(routes, fileConfig, routePrefix);
    } catch (error) {
      console.log(`[${APP_NAME}] ❌ Error parsing file ${filename}`);
    }
  }
}

void (async function a() {
  const dirArg = args.dir ?? 'mocks';
  const mocksDir = join('./', dirArg);

  if (existsSync(mocksDir)) {
    console.log(`\n[${APP_NAME}] 🔎 Searching JSON mock files in "${mocksDir}" dir`);
    const files = await getJSONFiles(mocksDir);
    await generateRoutesFromJSONFiles(mocksDir, files);

    const port = args.port ?? 3000;
    app.listen(port, () => {
      console.log(`[${APP_NAME}] ✅ Run on port ${port}`);
    });
  } else {
    console.log(`[${APP_NAME}] ❌ Don't exists "${mocksDir}" dir, create it or change --dir argument`);
  }
})();
