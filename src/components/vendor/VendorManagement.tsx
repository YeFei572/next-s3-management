"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus } from "lucide-react"
import VendorList from "./VendorList"
import { useState, useCallback } from "react"
import AddVendorDialog from "./AddVendorDialog"
import { toast } from "sonner"
import type { Vendor } from "@/types/s3"

export default function VendorManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])
  
  const loadVendors = useCallback(() => {
    try {
      const savedVendors = localStorage.getItem('vendors')
      if (savedVendors) {
        const parsedVendors = JSON.parse(savedVendors)
        setVendors(parsedVendors)
      }
    } catch (error) {
      console.error('Load vendors error:', error)
      toast.error('加载厂商列表失败')
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>厂商管理</CardTitle>
            <CardDescription>管理S3服务提供商</CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            添加厂商
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <VendorList vendors={vendors} loadVendors={loadVendors} />
      </CardContent>
      
      <AddVendorDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={loadVendors}
      />
    </Card>
  )
}