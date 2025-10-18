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
    
    // Create a simple HTML representation of slides
    const printContent = slides.map((slide, index) => `
      <div style="page-break-after: always; padding: 40px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="font-size: 48px; margin-bottom: 20px;">${slide.title || 'Untitled Slide'}</h1>
        ${slide.content?.heading ? `<h2 style="font-size: 32px; margin-bottom: 20px; color: #666;">${slide.content.heading}</h2>` : ''}
        ${slide.content?.bullets ? `
          <ul style="font-size: 24px; line-height: 1.8;">
            ${slide.content.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${presentationTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              @media print {
                @page { size: A4 landscape; margin: 0; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        toast.success("PDF export ready! Use your browser's print dialog to save as PDF.");
      }, 250);
    }
  };

  const handleExportPPTX = () => {
    toast.info("PPTX export requires a desktop application. Exporting as HTML instead...");
    handleExportHTML();
  };

  const handleExportHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${presentationTitle}</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; overflow: hidden; }
    .slide { display: none; padding: 60px; min-height: 100vh; box-sizing: border-box; }
    .slide.active { display: flex; flex-direction: column; justify-content: center; }
    h1 { font-size: 48px; margin-bottom: 20px; }
    h2 { font-size: 32px; margin-bottom: 20px; color: #666; }
    ul { font-size: 24px; line-height: 1.8; }
    .nav { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); }
    button { padding: 10px 20px; margin: 0 5px; font-size: 16px; cursor: pointer; }
  </style>
</head>
<body>
  ${slides.map((slide, index) => `
    <div class="slide ${index === 0 ? 'active' : ''}" id="slide-${index}">
      <h1>${slide.title || 'Untitled Slide'}</h1>
      ${slide.content?.heading ? `<h2>${slide.content.heading}</h2>` : ''}
      ${slide.content?.bullets ? `
        <ul>
          ${slide.content.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('')}
  
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