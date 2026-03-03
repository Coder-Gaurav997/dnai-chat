import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChatMessage } from "@/lib/models";
import { FileText, FileDown, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
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
  const [autoTitle, setAutoTitle] = useState("Chat Export");
  const [titleLoading, setTitleLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!isOpen || messages.length === 0) return;
    const firstMsg = messages.find((m) => m.role === "user");
    if (!firstMsg) return;

    setTitleLoading(true);
    supabase.functions
      .invoke("generate-title", { body: { firstMessage: firstMsg.content } })
      .then(({ data }) => {
        if (data?.title) setAutoTitle(data.title);
      })
      .finally(() => setTitleLoading(false));
  }, [isOpen, messages]);

  const safeName = fileName.trim() || autoTitle.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "chat";

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
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(autoTitle, margin, y);
    y += 12;

    // Messages
    doc.setFontSize(11);
    for (const m of messages) {
      const label = m.role === "user" ? "User" : "DarkNeuronAI";
      doc.setFont("helvetica", "bold");
      const labelLines = doc.splitTextToSize(`${label}:`, maxWidth);
      if (y + 7 > doc.internal.pageSize.getHeight() - 15) {
        doc.addPage();
        y = 20;
      }
      doc.text(labelLines, margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      const contentLines = doc.splitTextToSize(m.content, maxWidth);
      for (const line of contentLines) {
        if (y > doc.internal.pageSize.getHeight() - 15) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 5.5;
      }
      y += 6;
    }

    doc.save(`${safeName}.pdf`);
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
            {titleLoading ? (
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> Generating title...
              </div>
            ) : (
              <p className="text-sm font-semibold text-foreground mt-1">{autoTitle}</p>
            )}
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
