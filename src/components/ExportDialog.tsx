import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChatMessage } from "@/lib/models";
import { FileText, FileDown } from "lucide-react";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

function generateTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "Chat Export";
  const words = first.content.split(/\s+/).slice(0, 4).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function formatChat(title: string, messages: ChatMessage[]): string {
  let text = title + "\n\n";
  for (const m of messages) {
    const label = m.role === "user" ? "User" : "DarkNeuronAI";
    text += `${label}: ${m.content}\n\n`;
  }
  return text.trim();
}

const ExportDialog = ({ isOpen, onClose, messages }: ExportDialogProps) => {
  const autoTitle = generateTitle(messages);
  const [fileName, setFileName] = useState("");

  const safeName = (fileName.trim() || autoTitle.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "chat");

  const downloadTxt = () => {
    const content = formatChat(autoTitle, messages);
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${safeName}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    onClose();
  };

  const downloadPdf = () => {
    const html = `<!DOCTYPE html><html><head><title>${safeName}</title><style>
      body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#222;line-height:1.6}
      h1{font-size:1.4em;margin-bottom:1em}
      .msg{margin-bottom:1em}
      .label{font-weight:700}
    </style></head><body>
      <h1>${autoTitle}</h1>
      ${messages.map((m) => `<div class="msg"><span class="label">${m.role === "user" ? "User" : "DarkNeuronAI"}:</span> ${m.content.replace(/</g, "&lt;")}</div>`).join("")}
    </body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 300);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Export Chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Chat Title</label>
            <p className="text-sm font-semibold text-foreground mt-1">{autoTitle}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">File Name (without extension)</label>
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={safeName}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadTxt}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            >
              <FileText className="w-4 h-4" />
              Download .txt
            </button>
            <button
              onClick={downloadPdf}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-primary-foreground text-sm font-medium"
            >
              <FileDown className="w-4 h-4" />
              Download .pdf
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
