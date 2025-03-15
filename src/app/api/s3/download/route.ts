import { NextRequest, NextResponse } from "next/server"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getVendorById } from "@/lib/vendor"
import { Readable } from "stream"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vendorId = searchParams.get('vendorId')
    const key = searchParams.get('key')
    const vendorsHeader = request.headers.get('x-vendors')

    if (!vendorId || !key || !vendorsHeader) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    const vendor = getVendorById(JSON.parse(vendorsHeader), vendorId)
    if (!vendor) {
      return NextResponse.json({ error: '厂商不存在' }, { status: 404 })
    }

    const client = new S3Client({
      region: vendor.region || 'auto',
      endpoint: vendor.endpoint,
      credentials: {
        accessKeyId: vendor.accessKey,
        secretAccessKey: vendor.secretKey,
      },
    })

    const command = new GetObjectCommand({
      Bucket: vendor.bucket,
      Key: key,
    })

    const response = await client.send(command)
    
    if (!response.Body) {
      throw new Error('文件内容为空')
    }

    const stream = response.Body as Readable
    const chunks = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${encodeURIComponent(key.split('/').pop() || key)}`,
      },
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: '下载文件失败' },
      { status: 500 }
    )
  }
}