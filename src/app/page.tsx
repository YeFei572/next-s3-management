import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VendorManagement from "@/components/vendor/VendorManagement"
import FileExplorer from "@/components/file/FileExplorer"

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">S3 管理系统</h1>
      
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files">文件管理</TabsTrigger>
          <TabsTrigger value="vendors">厂商管理</TabsTrigger>
        </TabsList>
        
        <TabsContent value="files">
          <FileExplorer />
        </TabsContent>
        
        <TabsContent value="vendors">
          <VendorManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}