// src/components/ai-assistant/components/artifact-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText } from "lucide-react"
import { ArtifactData } from "../types"

interface ArtifactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artifact: ArtifactData;
}

export function ArtifactDialog({ isOpen, onClose, artifact }: ArtifactDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generated Document</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <FileText className="h-8 w-8 text-violet-600" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{artifact.name}</h3>
            <p className="text-sm text-gray-500">{artifact.type}</p>
          </div>
        </div>
        <div className="flex space-x-2 justify-end">
          <Button
            variant="outline"
            onClick={() => window.open(`/api/download/${artifact.id}`, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={() => window.open(`/api/preview/${artifact.id}`, '_blank')}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}