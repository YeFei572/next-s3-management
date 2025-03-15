import { S3Client } from "@aws-sdk/client-s3"
import { S3ClientConfig } from "../types/s3-client"

export class S3ClientFactory {
  private static clients: Map<string, S3Client> = new Map()

  static getClient(config: S3ClientConfig): S3Client {
    const clientKey = `${config.vendorId}-${config.bucket}`
    
    if (!this.clients.has(clientKey)) {
      const client = new S3Client({
        endpoint: config.endpoint,
        region: config.region,
        credentials: {
          accessKeyId: config.accessKey,
          secretAccessKey: config.secretKey,
        },
      })
      this.clients.set(clientKey, client)
    }

    return this.clients.get(clientKey)!
  }

  static removeClient(vendorId: string, bucket: string) {
    const clientKey = `${vendorId}-${bucket}`
    this.clients.delete(clientKey)
  }
}