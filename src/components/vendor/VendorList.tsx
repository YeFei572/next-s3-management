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
import { useState, useEffect } from "react"
import S3ConfigDialog from "./S3ConfigDialog"
import { toast } from "sonner"
import Cookies from 'js-cookie'

export default function VendorList() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])

  // 加载厂商列表
  const loadVendors = () => {
    const savedVendors = localStorage.getItem('vendors')
    if (savedVendors) {
      setVendors(JSON.parse(savedVendors))
    }
  }

  useEffect(() => {
    loadVendors()
  }, [])

  // 删除厂商
  const handleDelete = (vendor: Vendor) => {
    const updatedVendors = vendors.filter(v => v.id !== vendor.id)
    localStorage.setItem('vendors', JSON.stringify(updatedVendors))
    Cookies.set('vendors', JSON.stringify(updatedVendors))
    setVendors(updatedVendors)
    toast.success('厂商删除成功')
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>厂商名称</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Bucket</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell>{vendor.endpoint}</TableCell>
              <TableCell>{vendor.bucket}</TableCell>
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
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDelete(vendor)}
                >
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
        onSuccess={loadVendors}
      />
    </div>
  )
}