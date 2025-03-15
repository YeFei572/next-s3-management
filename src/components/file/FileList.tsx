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
import { Download, Trash2 } from "lucide-react"
import type { FileItem, Vendor } from "@/types/s3"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export function FileList() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<string>("")
  const [vendors, setVendors] = useState<Vendor[]>([])

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
      const vendorsJson = localStorage.getItem('vendors')
      
      const response = await fetch(`/api/s3?vendorId=${selectedVendor}`, {
        headers: {
          'x-vendors': vendorsJson || '[]'
        }
      })
      
      if (!response.ok) throw new Error("Failed to load files")
      const { data, message } = await response.json()
      setFiles(data)
      toast(`成功：${message}`)
    } catch (error) {
      toast(`加载文件列表失败 ${error}`)
    } finally {
      setLoading(false)
    }
  }, [selectedVendor]) // 添加 selectedVendor 作为依赖

  useEffect(() => {
    if (selectedVendor) {
      loadFiles()
    }
  }, [selectedVendor, loadFiles]) // 添加 loadFiles 作为依赖

  // const handleDelete = async (key: string) => {
  //   try {
  //     const response = await fetch(
  //       `/api/s3?vendorId=${selectedVendor}&key=${encodeURIComponent(key)}`,
  //       { method: "DELETE" }
  //     )
  //     if (!response.ok) throw new Error("Failed to delete file")
  //     const { message } = await response.json()
  //     await loadFiles()
  //     toast({
  //       title: "成功",
  //       description: message,
  //     })
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "错误",
  //       description: `删除文件失败 ${error}`,
  //     })
  //   }
  // }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async (key: string) => {
    try {
      const vendorsJson = localStorage.getItem('vendors')
      const response = await fetch(`/api/s3/download?vendorId=${selectedVendor}&key=${encodeURIComponent(key)}`, {
        headers: {
          'x-vendors': vendorsJson || '[]'
        }
      })
      
      if (!response.ok) throw new Error('下载失败')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = key.split('/').pop() || key // 使用文件名作为下载名称
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('文件下载成功')
    } catch (error) {
      console.error('Download error:', error)
      toast.error(`下载失败: ${error}`)
    }
  }

  return (
    <div className="space-y-4">
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
                <TableCell>{file.lastModified.toLocaleString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={loading}
                    onClick={() => handleDownload(file.key)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled={loading}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}