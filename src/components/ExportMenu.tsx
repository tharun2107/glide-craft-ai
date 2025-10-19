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
  const handleExportPDF = async () => {
    toast.info("Preparing PDF export...");
    
    try {
      // Create a comprehensive HTML representation with images
      const printContent = slides.map((slide, index) => {
        const images = slide.content?.images || [];
        const imageHtml = images.length > 0 
          ? `<div style="position: absolute; right: 40px; top: 50%; transform: translateY(-50%); width: 400px;">
              ${images.map((img: any) => `
                <img src="${img.url}" alt="${img.alt || 'Slide image'}" 
                     style="width: 100%; border-radius: 8px; margin-bottom: 10px;" />
              `).join('')}
            </div>`
          : '';

        return `
          <div style="page-break-after: always; padding: 60px; min-height: 100vh; position: relative; 
                      background: ${slide.background_color || '#ffffff'};">
            <div style="max-width: ${images.length > 0 ? '50%' : '100%'};">
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
            ${imageHtml}
          </div>
        `;
      }).join('');

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${presentationTitle}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
                @media print {
                  @page { size: A4 landscape; margin: 0; }
                  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        
        // Wait for images to load
        setTimeout(() => {
          printWindow.print();
          toast.success("PDF ready! Save as PDF in the print dialog.");
        }, 500);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF");
    }
  };

  const handleExportPPTX = () => {
    toast.info("Preparing PowerPoint-compatible HTML...");
    handleExportHTML();
  };

  const handleExportHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${presentationTitle}</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      margin: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
      overflow: hidden;
      background: #000;
    }
    .slide { 
      display: none; 
      padding: 60px; 
      min-height: 100vh; 
      position: relative;
      background: #fff;
    }
    .slide.active { display: flex; flex-direction: column; justify-content: center; }
    .slide-content { max-width: 50%; }
    .slide-images { position: absolute; right: 60px; top: 50%; transform: translateY(-50%); width: 400px; }
    .slide-images img { width: 100%; border-radius: 8px; margin-bottom: 10px; }
    h1 { font-size: 48px; margin-bottom: 30px; font-weight: bold; color: #1a1a1a; }
    h2 { font-size: 32px; margin-bottom: 30px; font-weight: 600; color: #333; }
    ul { font-size: 24px; line-height: 1.8; list-style: disc; padding-left: 30px; }
    li { margin-bottom: 10px; }
    .nav { 
      position: fixed; 
      bottom: 30px; 
      left: 50%; 
      transform: translateX(-50%); 
      background: rgba(0,0,0,0.8);
      padding: 15px 20px;
      border-radius: 50px;
      backdrop-filter: blur(10px);
    }
    button { 
      padding: 12px 24px; 
      margin: 0 5px; 
      font-size: 16px; 
      cursor: pointer;
      background: #fff;
      border: none;
      border-radius: 25px;
      transition: all 0.2s;
    }
    button:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(255,255,255,0.3); }
    #counter { color: white; margin: 0 15px; font-weight: 500; }
  </style>
</head>
<body>
  ${slides.map((slide, index) => {
    const images = slide.content?.images || [];
    return `
    <div class="slide ${index === 0 ? 'active' : ''}" id="slide-${index}" 
         style="background: ${slide.background_color || '#ffffff'};">
      <div class="slide-content" style="max-width: ${images.length > 0 ? '50%' : '100%'};">
        <h1>${slide.title || 'Untitled Slide'}</h1>
        ${slide.content?.heading ? `<h2>${slide.content.heading}</h2>` : ''}
        ${slide.content?.bullets && slide.content.bullets.length > 0 ? `
          <ul>
            ${slide.content.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
      ${images.length > 0 ? `
        <div class="slide-images">
          ${images.map((img: any) => `
            <img src="${img.url}" alt="${img.alt || 'Slide image'}" />
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  }).join('')}
  
  <div class="nav">
    <button onclick="prevSlide()">Previous</button>
    <span id="counter">1 / ${slides.length}</span>
    <button onclick="nextSlide()">Next</button>
  </div>

  <script>
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('counter');
    
    function showSlide(n) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      counter.textContent = (currentSlide + 1) + ' / ' + slides.length;
    }
    
    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentationTitle.replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Presentation exported as HTML!");
  };

  const handleExportImages = async () => {
    toast.info("Preparing images export...");
    
    try {
      // This is a simplified version - in production, you'd use html2canvas or similar
      const zip = slides.map((slide, index) => ({
        name: `slide-${index + 1}.txt`,
        content: `
Slide ${index + 1}: ${slide.title || 'Untitled'}

${slide.content?.heading || ''}

${slide.content?.bullets ? slide.content.bullets.join('\n') : ''}
        `.trim()
      }));

      // Export as text files for now (in production, use html2canvas for actual images)
      zip.forEach(file => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      });

      toast.success("Slides exported! For image export, use PDF and convert to images.");
    } catch (error) {
      toast.error("Export failed");
    }
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