import {
  ListObjectsCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { S3ClientFactory } from "./s3-client-factory"
import type { S3ClientConfig } from "../types/s3-client"
import type { FileItem } from "@/types/s3"

export class S3Service {
  private config: S3ClientConfig

  constructor(config: S3ClientConfig) {
    this.config = config
  }

  async listObjects(prefix: string = ""): Promise<FileItem[]> {
    const client = S3ClientFactory.getClient(this.config)
    
    const command = new ListObjectsCommand({
      Bucket: this.config.bucket,
      Prefix: prefix,
    })

    try {
      const response = await client.send(command)
      return (response.Contents || []).map(item => ({
        key: item.Key || "",
        size: item.Size || 0,
        lastModified: (item.LastModified || new Date()).toDateString(),
        type: this.getFileType(item.Key || ""),
        // 如果item.key不含/，则表示是文件，否则是文件夹
        isDirectory: item.Key?.includes('/') || false,
        name: item.Key?.split('/').pop() || "",
      }))
    } catch (error) {
      console.error("Error listing objects:", error)
      throw error
    }
  }

  async deleteObject(key: string): Promise<void> {
    const client = S3ClientFactory.getClient(this.config)
    
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    })

    try {
      await client.send(command)
    } catch (error) {
      console.error("Error deleting object:", error)
      throw error
    }
  }

  async downloadObject(key: string): Promise<Blob> {
    const client = S3ClientFactory.getClient(this.config)
    
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    })

    try {
      const response = await client.send(command)
      if (!response.Body) {
        throw new Error("Empty response body")
      }
      return new Blob([await response.Body.transformToByteArray()])
    } catch (error) {
      console.error("Error downloading object:", error)
      throw error
    }
  }

  async uploadObject(key: string, file: File): Promise<void> {
    const client = S3ClientFactory.getClient(this.config)
    
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      Body: file,
      ContentType: file.type,
    })

    try {
      await client.send(command)
    } catch (error) {
      console.error("Error uploading object:", error)
      throw error
    }
  }

  private getFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    const mimeTypes: Record<string, string> = {
      'txt': 'text/plain',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      // 添加更多文件类型映射
    }
    return mimeTypes[ext] || 'application/octet-stream'
  }
}