import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Copy, Check, ExternalLink } from "lucide-react";
import { labs } from "@/data/labs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const QRCodeGenerator = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Use the published URL or fallback to preview
  const baseUrl = window.location.origin;

  const getQRUrl = (labId: string) => {
    return `${baseUrl}/?lab=${labId}`;
  };

  const handleCopyLink = async (labId: string) => {
    const url = getQRUrl(labId);
    await navigator.clipboard.writeText(url);
    setCopiedId(labId);
    toast.success("Link gekopieerd naar klembord");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadQR = (labId: string, labName: string) => {
    const svg = document.getElementById(`qr-${labId}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      
      // White background
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 512, 512);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `common-ground-${labId}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success(`QR-code voor ${labName} gedownload`);
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-cyan/10">
            <QrCode className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">QR-Code Generator</h2>
            <p className="text-sm text-muted-foreground">
              Print deze codes voor fysieke locaties
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {labs.map((lab) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center p-4 rounded-xl bg-background/50 border border-border/30 hover:border-neon-cyan/30 transition-colors"
            >
              {/* Lab Info */}
              <div className="text-center mb-4">
                <span className="text-2xl mb-1 block">{lab.icon}</span>
                <h3 className="text-sm font-medium text-foreground">{lab.name}</h3>
                <p className="text-xs text-muted-foreground">{lab.tagline}</p>
              </div>

              {/* QR Code */}
              <div className="p-3 bg-white rounded-lg mb-4">
                <QRCodeSVG
                  id={`qr-${lab.id}`}
                  value={getQRUrl(lab.id)}
                  size={120}
                  level="H"
                  includeMargin={false}
                  fgColor="#0f0b09"
                  bgColor="#ffffff"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleCopyLink(lab.id)}
                >
                  {copiedId === lab.id ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleDownloadQR(lab.id, lab.name)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  PNG
                </Button>
              </div>

              {/* Preview Link */}
              <a
                href={getQRUrl(lab.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs text-muted-foreground hover:text-neon-cyan flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Test link
              </a>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20">
          <h4 className="text-sm font-medium text-foreground mb-2">📋 Instructies</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Download de QR-codes en print ze op tafelkaartjes of stickers</li>
            <li>• Wanneer bezoekers scannen, komen ze direct op de app met de locatie voorgeselecteerd</li>
            <li>• De QR-codes werken ook offline zodra de PWA is geïnstalleerd</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
