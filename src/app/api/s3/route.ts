import { FileItem, Vendor } from "@/types/s3"
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const vendorId = searchParams.get("vendorId")
  const prefix = searchParams.get("prefix") || ""

  if (!vendorId) {
    return NextResponse.json({ error: "缺少必要的厂商ID参数" }, { status: 400 })
  }

  try {
    // 从请求头获取厂商配置
    const vendorsJson = request.headers.get('x-vendors')
    if (!vendorsJson) {
      return NextResponse.json({ error: "未找到厂商配置" }, { status: 404 })
    }

    const vendors = JSON.parse(vendorsJson)
    const vendor = vendors.find((v: Vendor) => v.id === vendorId)
    
    if (!vendor) {
      return NextResponse.json({ error: "未找到指定厂商" }, { status: 404 })
    }

    // 创建 S3 客户端
    const client = new S3Client({
      endpoint: vendor.endpoint,
      credentials: {
        accessKeyId: vendor.accessKey,
        secretAccessKey: vendor.secretKey
      },
      region: vendor.region,
      forcePathStyle: true // 使用路径样式访问
    })

    // 列出对象
    // 在创建 ListObjectsCommand 时加入 key 前缀
    const command = new ListObjectsCommand({
      Bucket: vendor.bucket,
      Prefix: vendor.key ? `${vendor.key}${prefix}` : prefix,
      Delimiter: '/'  // 使用分隔符来区分目录
    })

    const response = await client.send(command)
    
    // 转换响应数据，包括目录和文件
    const files: FileItem[] = []

    // 处理目录
    if (response.CommonPrefixes) {
      files.push(...response.CommonPrefixes.map(prefix => ({
        key: prefix.Prefix || "",
        size: 0,
        lastModified: new Date().toISOString(),
        type: "directory",
        isDirectory: true,
        name: prefix.Prefix?.split('/').slice(-2)[0] || ""
      })))
    }

    // 处理文件
    if (response.Contents) {
      files.push(...response.Contents
        .filter(item => item.Key !== prefix) // 过滤掉当前目录
        .map(item => ({
          key: item.Key || "",
          size: item.Size || 0,
          lastModified: item.LastModified?.toISOString() || new Date().toISOString(),
          type: getFileType(item.Key || ""),
          isDirectory: false,
          name: item.Key?.split('/').pop() || ""
        })))
    }

    return NextResponse.json({ 
      data: files,
      currentPath: prefix,
      message: "获取文件列表成功" 
    })
  } catch (error) {
    console.error("Error in S3 API:", error)
    return NextResponse.json(
      { error: error || "获取文件列表失败" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const vendorId = searchParams.get("vendorId")
  const key = searchParams.get("key")

  if (!vendorId || !key) {
    return NextResponse.json({ error: "缺少必要的参数" }, { status: 400 })
  }

  try {
    // 从请求头获取厂商配置
    const vendorsJson = request.headers.get('x-vendors')
    if (!vendorsJson) {
      return NextResponse.json({ error: "未找到厂商配置" }, { status: 404 })
    }

    const vendors = JSON.parse(vendorsJson)
    const vendor = vendors.find((v: Vendor) => v.id === vendorId)
    
    if (!vendor) {
      return NextResponse.json({ error: "未找到指定厂商" }, { status: 404 })
    }

    // 创建 S3 客户端
    const client = new S3Client({
      endpoint: vendor.endpoint,
      credentials: {
        accessKeyId: vendor.accessKey,
        secretAccessKey: vendor.secretKey
      },
      region: vendor.region,
      // forcePathStyle: true
    })

    // 删除对象
    // 在创建 DeleteObjectCommand 时考虑 key 前缀
    const command = new DeleteObjectCommand({
      Bucket: vendor.bucket,
      Key: key
    })

    await client.send(command)
    
    return NextResponse.json({ 
      message: "文件删除成功" 
    })
  } catch (error) {
    console.error("Error in S3 DELETE API:", error)
    return NextResponse.json(
      { error: "删除文件失败" },
      { status: 500 }
    )
  }
}

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const mimeTypes: Record<string, string> = {
    'txt': 'text/plain',
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed'
  }
  return mimeTypes[ext] || 'application/octet-stream'
}