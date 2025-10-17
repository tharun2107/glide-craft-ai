import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image } from "lucide-react";
import { toast } from "sonner";

interface ExportMenuProps {
  presentationTitle: string;
  slides: any[];
}

export const ExportMenu = ({ presentationTitle, slides }: ExportMenuProps) => {
  const handleExportPDF = () => {
    toast.info("PDF export coming soon! This feature will generate a PDF version of your presentation.");
  };

  const handleExportPPTX = () => {
    toast.info("PPTX export coming soon! This feature will create a PowerPoint file.");
  };

  const handleExportImages = () => {
    toast.info("Image export coming soon! This feature will save each slide as an image.");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPPTX}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PPTX
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportImages}>
          <Image className="w-4 h-4 mr-2" />
          Export as Images
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};