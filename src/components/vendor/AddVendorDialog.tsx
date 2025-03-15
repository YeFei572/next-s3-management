"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

interface AddVendorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddVendorDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: AddVendorDialogProps) {
  const [name, setName] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [bucket, setBucket] = useState("")

  const handleSubmit = async () => {
    try {
      if (!name || !endpoint || !bucket) {
        toast.error('请填写完整信息')
        return
      }

      const newVendor = {
        id: Date.now().toString(),
        name,
        endpoint,
        bucket,
        accessKey: '',
        secretKey: '',
        region: '',
      }
  
      // 获取现有厂商列表
      const savedVendors = localStorage.getItem('vendors')
      const vendors = savedVendors ? JSON.parse(savedVendors) : []
      
      // 添加新厂商
      const updatedVendors = [...vendors, newVendor]
      
      // 保存到 localStorage
      localStorage.setItem('vendors', JSON.stringify(updatedVendors))
  
      toast.success('厂商添加成功')
      onSuccess?.()  // 调用成功回调以刷新列表
      onOpenChange(false)  // 关闭弹窗
      
      // 重置表单
      setName("")
      setEndpoint("")
      setBucket("")
    } catch (error) {
      toast.error('添加厂商失败')
      console.error('Add vendor error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加厂商</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名称
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right">
              Endpoint
            </Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bucket" className="text-right">
              Bucket
            </Label>
            <Input
              id="bucket"
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            确认添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}