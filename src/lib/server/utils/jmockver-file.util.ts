import { readdir } from "fs/promises";

export class JMockverFileUtils {
  async getJSONFilenames(mocksDir: string): Promise<string[]> {
    const filesOnMockFolder = await readdir(mocksDir);

    return filesOnMockFolder.reduce((prev: string[], filename: string) => {
      if (filename.endsWith('.json'))
        prev.push(filename);
      return prev;
    }, []);
  }
}