"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Settings, Trash2 } from "lucide-react"
import type { Vendor } from "@/types/s3"
import { useState } from "react"
import S3ConfigDialog from "./S3ConfigDialog"

export default function VendorList() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)

  // 这里先用模拟数据，后续需要替换为真实的API调用
  const vendors: Vendor[] = [
    {
      id: "1",
      name: "阿里云 OSS",
      description: "阿里云对象存储服务",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>厂商名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell>{vendor.description}</TableCell>
              <TableCell>{vendor.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedVendor(vendor)
                    setShowConfigDialog(true)
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <S3ConfigDialog
        vendor={selectedVendor}
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
      />
    </div>
  )
}