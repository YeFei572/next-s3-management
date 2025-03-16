"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,  // 添加这个导入
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Vendor } from "@/types/s3"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Cookies from 'js-cookie'

interface S3ConfigDialogProps {
  vendor: Vendor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function S3ConfigDialog({
  vendor,
  open,
  onOpenChange,
  onSuccess,
}: S3ConfigDialogProps) {
  const [config, setConfig] = useState({
    endpoint: "",
    accessKey: "",
    secretKey: "",
    region: "",
    bucket: "",
    key: "", // 添加 key 字段
  })

  // 添加 useEffect 来处理配置回显
  useEffect(() => {
    if (vendor && open) {
      setConfig({
        endpoint: vendor.endpoint || "",
        accessKey: vendor.accessKey || "",
        secretKey: vendor.secretKey || "",
        region: vendor.region || "",
        bucket: vendor.bucket || "",
        key: vendor.key || "",
      })
    }
  }, [vendor, open])

  const handleSubmit = async () => {
    try {
      const vendorsJson = localStorage.getItem('vendors')
      const vendors = vendorsJson ? JSON.parse(vendorsJson) : []
      const updatedVendor = {
        ...vendor,
        ...config,
      }
      
      let updatedVendors
      const existingVendorIndex = vendors.findIndex((v: Vendor) => v.id === vendor?.id)
      
      if (existingVendorIndex >= 0) {
        updatedVendors = vendors.map((v: Vendor) => 
          v.id === vendor?.id ? updatedVendor : v
        )
      } else {
        updatedVendors = [...vendors, updatedVendor]
      }

      localStorage.setItem('vendors', JSON.stringify(updatedVendors))
      Cookies.set('vendors', JSON.stringify(updatedVendors))

      toast.success('配置保存成功')
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error('配置保存失败')
      console.error('Save config error:', error)
    }
  }

  if (!vendor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vendor.name} - S3配置</DialogTitle>
          <DialogDescription>
            配置 S3 存储服务的连接信息
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right">
              Endpoint
            </Label>
            <Input
              id="endpoint"
              value={config.endpoint}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, endpoint: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accessKey" className="text-right">
              Access Key
            </Label>
            <Input
              id="accessKey"
              value={config.accessKey}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, accessKey: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="secretKey" className="text-right">
              Secret Key
            </Label>
            <Input
              id="secretKey"
              type="password"
              value={config.secretKey}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, secretKey: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              Region
            </Label>
            <Input
              id="region"
              value={config.region}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, region: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bucket" className="text-right">
              Bucket
            </Label>
            <Input
              id="bucket"
              value={config.bucket}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, bucket: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="key" className="text-right">
              目录前缀
            </Label>
            <Input
              id="key"
              value={config.key}
              placeholder="可选，例如：files/"
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, key: e.target.value }))
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            保存配置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}