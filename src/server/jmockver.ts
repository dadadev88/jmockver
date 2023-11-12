import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import CLIargs from 'minimist';
import express, { type Express, RequestHandler } from 'express';
import { FileConfig, Method } from './types';
import { join } from 'node:path';

const args = CLIargs(process.argv.slice(2));
const app: Express = express();

async function getJSONFiles(mocksDir: string): Promise<string[]> {
  const filesOnMockFolder = await readdir(mocksDir);
  return filesOnMockFolder.reduce((prev: string[], filename: string) => {
    if (filename.endsWith('.json'))
      prev.push(filename);
    return prev;
  }, []);
}

function mapRoutes(routes: string[], fileConfig: FileConfig, routePrefix: string) {
  routes.forEach(route => {
    const routeConfig = fileConfig[route];
    const routeFullPath = `/${routePrefix}${route}`;
    const methodsOnRoute = Object.keys(routeConfig) as Method[];

    methodsOnRoute.forEach(method => {
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

      const methodConfig = routeConfig[method];
      const responseConfig = methodConfig.responses.find(response => {
        return response.code === methodConfig.codeToResponse;
      });

      if (!responseConfig) {
        console.log(`[JMockVer] ❌ Response with code ${methodConfig.codeToResponse} not found on ${method} ${routeFullPath}`);
        return;
      }

      createRoute(method, routeFullPath, (_, res) => {
        res.status(responseConfig.statusCode ?? 200).json(responseConfig?.body ?? {});
      });
    });
  });
}

function createRoute(method: Method, path: string, requestHandler: RequestHandler) {
  console.log(`[JMockVer] 🚦 Creating route ${method} - ${path}`);

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

async function generateRoutesFromJSONFiles(path: string, filenames: string[]) {
  for (const filename of filenames) {
    const fileContent = await readFile(join(path, filename), { encoding: 'utf-8' });
    try {
      console.log(`\n[JMockVer] 🗂️  Routes on file ${filename}`);
      const fileConfig: FileConfig = JSON.parse(fileContent);
      const routes = Object.keys(fileConfig);
      const routePrefix = filename.replace('.json', '');
      mapRoutes(routes, fileConfig, routePrefix);
    } catch (error) {
      console.log('[JMockVer] ❌ Error parsing file ' + filename);
    }
  }
}

(async () => {
  const dirArg = args.dir ?? 'mocks';
  const mocksDir = join('./', dirArg)
  if (existsSync(mocksDir)) {
    console.log(`[JMockVer] 👁️  Searching JSON mock files in "${mocksDir}" dir`);
    const files = await getJSONFiles(mocksDir);
    await generateRoutesFromJSONFiles(mocksDir, files);

    const port = args.port ?? 3000;
    app.listen(port, () => {
      console.log(`\n[JMockVer] ✅ Run on port ${port}`);
    });
  } else {
    console.log(`[JMockVer] ❌ Don't exists "${mocksDir}" dir, create it or change --dir argument`);
  }
})();

