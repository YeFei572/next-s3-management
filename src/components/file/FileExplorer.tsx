import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileList } from "./FileList"

export default function FileExplorer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>文件浏览器</CardTitle>
        <CardDescription>浏览和管理S3存储中的文件</CardDescription>
      </CardHeader>
      <CardContent>
        <FileList />
      </CardContent>
    </Card>
  )
}