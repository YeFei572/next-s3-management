"use client"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { FileItem, Vendor } from "@/types/s3"
import { Download, Trash2, Upload } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from 'react-dropzone'
import { toast } from "sonner"
import axios from '@/lib/axios'

export function FileList() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<string>("")
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [showUploadDrawer, setShowUploadDrawer] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // 加载厂商列表
    const savedVendors = localStorage.getItem('vendors')
    if (savedVendors) {
      setVendors(JSON.parse(savedVendors))
    }
  }, [])

  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { data, message } } = await axios.get(`/s3`, {
        params: { vendorId: selectedVendor }
      })
      setFiles(data)
      toast.success(message)
    } catch {
      // 错误已经被 axios 拦截器处理
    } finally {
      setLoading(false)
    }
  }, [selectedVendor])

  useEffect(() => {
    if (selectedVendor) {
      loadFiles()
    }
  }, [selectedVendor, loadFiles])

  const handleDelete = async (key: string) => {
    try {
      const { data: { message } } = await axios.delete(`/s3`, {
        params: { vendorId: selectedVendor, key }
      })
      await loadFiles()
      toast.success(message)
    } catch {
      // 错误已经被 axios 拦截器处理
    }
  }

  const handleDownload = async (key: string) => {
    try {
      const { data } = await axios.get(`/s3/download`, {
        params: { vendorId: selectedVendor, key },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = key.split('/').pop() || key
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('文件下载成功')
    } catch {
      // 错误已经被 axios 拦截器处理
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!selectedVendor) {
      toast.error('请先选择厂商')
      return
    }

    setUploading(true)
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        
        const { data: { message } } = await axios.post(`/s3/upload`, formData, {
          params: { vendorId: selectedVendor },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        toast.success(message || `${file.name} 上传成功`)
      }
      
      await loadFiles()
      setShowUploadDrawer(false)
    } catch {
      // 错误已经被 axios 拦截器处理
    } finally {
      setUploading(false)
    }
  }, [selectedVendor, loadFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-[200px]">
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger disabled={loading}>
                <SelectValue placeholder="选择厂商" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowUploadDrawer(true)}
            disabled={!selectedVendor}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
    
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>文件名</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>修改时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              files.map((file) => (
                <TableRow key={file.key}>
                  <TableCell>{file.key}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    {file.lastModified 
                      ? new Date(file.lastModified).toLocaleString()
                      : '暂无修改时间'}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={loading}
                      onClick={() => handleDownload(file.key)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" disabled={loading}
                    onClick={() => handleDelete(file.key)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    
      <Drawer open={showUploadDrawer} onOpenChange={setShowUploadDrawer}>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>上传文件</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="outline">关闭</Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 flex-1">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors h-[400px] flex items-center justify-center
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>将文件拖放到此处...</p>
              ) : (
                <p>拖放文件到此处，或点击选择文件</p>
              )}
            </div>
          </div>
          {/* 移除原来的 DrawerFooter */}
        </DrawerContent>
      </Drawer>
    </>
  )
}