import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image } from "lucide-react";
import { toast } from "sonner";
import pptxgen from "pptxgenjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ExportMenuProps {
  presentationTitle: string;
  slides: any[];
}

export const ExportMenu = ({ presentationTitle, slides }: ExportMenuProps) => {
  const handleExportPDF = async () => {
    toast.info("Generating PDF...");
    
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 720]
      });

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Create a temporary div to render the slide
        const slideDiv = document.createElement('div');
        slideDiv.style.width = '1280px';
        slideDiv.style.height = '720px';
        slideDiv.style.padding = '60px';
        slideDiv.style.position = 'absolute';
        slideDiv.style.left = '-9999px';
        slideDiv.style.background = slide.background_color || '#ffffff';
        
        const images = slide.content?.images || [];
        slideDiv.innerHTML = `
          <div style="display: flex; height: 100%; align-items: center;">
            <div style="flex: 1; max-width: ${images.length > 0 ? '50%' : '100%'};">
              <h1 style="font-size: 48px; margin-bottom: 30px; font-weight: bold; color: #1a1a1a;">
                ${slide.title || 'Untitled Slide'}
              </h1>
              ${slide.content?.heading ? `
                <h2 style="font-size: 32px; margin-bottom: 30px; font-weight: 600; color: #333;">
                  ${slide.content.heading}
                </h2>
              ` : ''}
              ${slide.content?.bullets && slide.content.bullets.length > 0 ? `
                <ul style="font-size: 24px; line-height: 1.8; list-style: disc; padding-left: 30px;">
                  ${slide.content.bullets.map((bullet: string) => `<li style="margin-bottom: 10px;">${bullet}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
            ${images.length > 0 ? `
              <div style="flex: 1; display: flex; flex-direction: column; gap: 10px; padding-left: 40px;">
                ${images.map((img: any) => `
                  <img src="${img.url}" alt="${img.alt || 'Slide image'}" 
                       style="width: 100%; border-radius: 8px;" />
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
        
        document.body.appendChild(slideDiv);
        
        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(slideDiv, {
          backgroundColor: slide.background_color || '#ffffff',
          scale: 2
        });
        
        document.body.removeChild(slideDiv);
        
        if (i > 0) pdf.addPage();
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 1280, 720);
      }
      
      pdf.save(`${presentationTitle.replace(/\s+/g, '-')}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF");
    }
  };

  const handleExportPPTX = async () => {
    toast.info("Generating PowerPoint...");
    
    try {
      const pptx = new pptxgen();
      pptx.layout = 'LAYOUT_16x9';
      pptx.author = 'SliderMaker AI';
      pptx.title = presentationTitle;

      for (const slide of slides) {
        const pptxSlide = pptx.addSlide();
        
        // Set background color
        if (slide.background_color) {
          pptxSlide.background = { color: slide.background_color.replace('#', '') };
        }

        const images = slide.content?.images || [];
        const hasImages = images.length > 0;

        // Add title
        if (slide.title) {
          pptxSlide.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: hasImages ? 4.5 : 9,
            h: 1,
            fontSize: 44,
            bold: true,
            color: '1a1a1a'
          });
        }

        // Add heading
        if (slide.content?.heading) {
          pptxSlide.addText(slide.content.heading, {
            x: 0.5,
            y: 1.8,
            w: hasImages ? 4.5 : 9,
            h: 0.8,
            fontSize: 28,
            bold: true,
            color: '333333'
          });
        }

        // Add bullets
        if (slide.content?.bullets && slide.content.bullets.length > 0) {
          pptxSlide.addText(
            slide.content.bullets.map((bullet: string) => ({ text: bullet, options: { bullet: true } })),
            {
              x: 0.5,
              y: slide.content?.heading ? 2.8 : 1.8,
              w: hasImages ? 4.5 : 9,
              h: 3,
              fontSize: 20,
              color: '444444',
              lineSpacing: 32
            }
          );
        }

        // Add images
        if (hasImages) {
          let yPos = 1.0;
          for (const img of images) {
            try {
              pptxSlide.addImage({
                path: img.url,
                x: 5.5,
                y: yPos,
                w: 4,
                h: 2.5
              });
              yPos += 3;
            } catch (imgError) {
              console.error('Error adding image:', imgError);
            }
          }
        }
      }

      await pptx.writeFile({ fileName: `${presentationTitle.replace(/\s+/g, '-')}.pptx` });
      toast.success("PowerPoint exported successfully!");
    } catch (error) {
      console.error('PPTX export error:', error);
      toast.error("Failed to export PowerPoint");
    }
  };

  const handleExportImages = async () => {
    toast.info("Generating images...");
    
    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        const slideDiv = document.createElement('div');
        slideDiv.style.width = '1920px';
        slideDiv.style.height = '1080px';
        slideDiv.style.padding = '80px';
        slideDiv.style.position = 'absolute';
        slideDiv.style.left = '-9999px';
        slideDiv.style.background = slide.background_color || '#ffffff';
        
        const images = slide.content?.images || [];
        slideDiv.innerHTML = `
          <div style="display: flex; height: 100%; align-items: center;">
            <div style="flex: 1; max-width: ${images.length > 0 ? '50%' : '100%'};">
              <h1 style="font-size: 72px; margin-bottom: 40px; font-weight: bold; color: #1a1a1a;">
                ${slide.title || 'Untitled Slide'}
              </h1>
              ${slide.content?.heading ? `
                <h2 style="font-size: 48px; margin-bottom: 40px; font-weight: 600; color: #333;">
                  ${slide.content.heading}
                </h2>
              ` : ''}
              ${slide.content?.bullets && slide.content.bullets.length > 0 ? `
                <ul style="font-size: 36px; line-height: 1.8; list-style: disc; padding-left: 40px;">
                  ${slide.content.bullets.map((bullet: string) => `<li style="margin-bottom: 15px;">${bullet}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
            ${images.length > 0 ? `
              <div style="flex: 1; display: flex; flex-direction: column; gap: 15px; padding-left: 60px;">
                ${images.map((img: any) => `
                  <img src="${img.url}" alt="${img.alt || 'Slide image'}" 
                       style="width: 100%; border-radius: 12px;" />
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
        
        document.body.appendChild(slideDiv);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(slideDiv, {
          backgroundColor: slide.background_color || '#ffffff',
          scale: 2
        });
        
        document.body.removeChild(slideDiv);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${presentationTitle.replace(/\s+/g, '-')}-slide-${i + 1}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast.success("Images exported successfully!");
    } catch (error) {
      console.error('Images export error:', error);
      toast.error("Export failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
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
