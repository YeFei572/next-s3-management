import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VendorManagement from "@/components/vendor/VendorManagement"
import FileExplorer from "@/components/file/FileExplorer"

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">S3 管理系统</h1>
      
      <Tabs defaultValue="files" className="w-full">
        <div className="mb-6">
          <TabsList className="grid w-[250px] grid-cols-2 h-12">
            <TabsTrigger value="files" className="h-9">文件管理</TabsTrigger>
            <TabsTrigger value="vendors" className="h-9">厂商管理</TabsTrigger>
          </TabsList>
        </div>
        
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