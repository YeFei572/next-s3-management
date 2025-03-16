export interface Vendor {
  id: string
  name: string
  endpoint: string
  accessKey: string
  secretKey: string
  region: string
  bucket: string
  description?: string
  key?: string
  createdAt: Date
  updatedAt: Date
}

export interface S3Config {
  id: string
  vendorId: string
  endpoint: string
  accessKey: string
  secretKey: string
  region: string
  bucket: string
  isActive: boolean
}

export interface FileItem {
  key: string
  size: number
  lastModified: Date
  type: string
}