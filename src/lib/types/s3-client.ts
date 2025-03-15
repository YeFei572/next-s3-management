import { S3Config } from "@/types/s3"

export interface S3ClientConfig extends S3Config {
  vendorId: string
}

export interface CreateBucketParams {
  bucket: string
}

export interface ListObjectsParams {
  bucket: string
  prefix?: string
  maxKeys?: number
}

export interface UploadObjectParams {
  bucket: string
  key: string
  body: Buffer | Blob | ReadableStream
}

export interface DeleteObjectParams {
  bucket: string
  key: string
}