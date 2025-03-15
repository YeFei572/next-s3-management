"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Vendor } from "@/types/s3"
import { useState } from "react"

interface S3ConfigDialogProps {
  vendor: Vendor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function S3ConfigDialog({
  vendor,
  open,
  onOpenChange,
}: S3ConfigDialogProps) {
  const [config, setConfig] = useState({
    endpoint: "",
    accessKey: "",
    secretKey: "",
    region: "",
    bucket: "",
  })

  const handleSubmit = async () => {
    // TODO: 实现保存S3配置的API调用
    onOpenChange(false)
  }

  if (!vendor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vendor.name} - S3配置</DialogTitle>
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