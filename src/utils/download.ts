import path from 'path';
import fs from 'fs';
import axios from ':utils/axios';

const downloadDirectory = path.resolve(__dirname, '../../downloads');

export async function createDownloadDirectory() {
  const isExists = await fs.promises
    .access(downloadDirectory)
    .then(() => true)
    .catch(() => false);
  if (isExists) {
    return;
  }

  await fs.promises.mkdir(downloadDirectory, { recursive: true });
}

export async function downloadFile(url: string, fileName: string) {
  const filePath = path.join(downloadDirectory, fileName);
  const isExists = await fs.promises
    .access(filePath)
    .then(() => true)
    .catch(() => false);

  if (isExists) {
    return { downloadStatus: 'exists', filePath };
  }

  const res = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  if (res.status === 200) {
    await fs.promises.writeFile(filePath, res.data);
    return { downloadStatus: 'success', filePath };
  }

  return {
    downloadStatus: 'failed',
    filePath: null,
  };
}
