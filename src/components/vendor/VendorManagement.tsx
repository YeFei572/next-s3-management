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
import { useState } from "react"
import AddVendorDialog from "./AddVendorDialog"

export default function VendorManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false)

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
        <VendorList />
      </CardContent>
      
      <AddVendorDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </Card>
  )
}