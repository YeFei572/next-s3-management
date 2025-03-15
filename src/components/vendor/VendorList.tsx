"use client"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { Vendor } from "@/types/s3"
import { Settings, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import S3ConfigDialog from "./S3ConfigDialog"
import AddVendorDialog from "./AddVendorDialog"
import { toast } from "sonner"

export default function VendorList() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])

  // 加载厂商列表
  const loadVendors = useCallback(() => {
    const savedVendors = localStorage.getItem('vendors')
    if (savedVendors) {
      setVendors(JSON.parse(savedVendors))
    }
  }, [])

  useEffect(() => {
    loadVendors()
  }, [loadVendors])

  const handleDelete = useCallback((vendor: Vendor) => {
    try {
      const savedVendors = localStorage.getItem('vendors')
      if (!savedVendors) return

      const vendors = JSON.parse(savedVendors)
      const updatedVendors = vendors.filter((v: Vendor) => v.id !== vendor.id)
      
      localStorage.setItem('vendors', JSON.stringify(updatedVendors))
      loadVendors() // 刷新列表
      toast.success('厂商删除成功')
    } catch (error) {
      toast.error('删除厂商失败')
      console.error('Delete vendor error:', error)
    }
  }, [loadVendors])

  return (
    <div className="space-y-4">
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

      <AddVendorDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={loadVendors}
      />
    </div>
  )
}