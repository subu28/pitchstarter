import { mkdir, readFile, writeFile } from 'node:fs/promises';

const putJSONfile = async (id: number, content: any) => {
  await mkdir(`../tmp`, { recursive: true });
  await writeFile(`../tmp/${id}`, JSON.stringify(content, null, 2));
}

const getJSONfile = async (id: number) => {
  return JSON.parse(await readFile(`../tmp/${id}`, 'utf8'));
}

export {
  putJSONfile,
  getJSONfile
}