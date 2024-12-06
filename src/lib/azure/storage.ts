import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = 'intake-documents';

if (!accountName || !accountKey) throw new Error('Azure Storage credentials not found');

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

export async function uploadFile(file: Buffer, fileName: string): Promise<string> {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
    });

    return blockBlobClient.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}