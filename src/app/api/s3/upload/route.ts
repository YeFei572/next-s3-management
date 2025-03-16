import { NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getVendorById } from "@/lib/vendor"

export async function POST(request: NextRequest) {
  try {
    const vendorId = request.nextUrl.searchParams.get('vendorId')
    const vendorsHeader = request.headers.get('x-vendors')

    if (!vendorId || !vendorsHeader) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    const vendor = getVendorById(JSON.parse(vendorsHeader), vendorId)
    if (!vendor) {
      return NextResponse.json({ error: '厂商不存在' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 })
    }

    const client = new S3Client({
      region: vendor.region,
      endpoint: vendor.endpoint,
      credentials: {
        accessKeyId: vendor.accessKey,
        secretAccessKey: vendor.secretKey,
      },
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    const command = new PutObjectCommand({
      Bucket: vendor.bucket,
      Key: file.name,
      Body: buffer,
      ContentType: file.type,
    })

    await client.send(command)

    return NextResponse.json({ 
      message: '上传成功',
      data: { filename: file.name }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '上传文件失败' },
      { status: 500 }
    )
  }
}