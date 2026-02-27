import { motion, AnimatePresence } from "framer-motion";
import { Settings, RotateCcw, X } from "lucide-react";
import { ChatConfig, DEFAULT_CONFIG } from "@/lib/config";
import { Slider } from "@/components/ui/slider";

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
}

const ConfigPanel = ({ isOpen, onClose, config, onConfigChange }: ConfigPanelProps) => {
  const updateConfig = (partial: Partial<ChatConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-16 left-4 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-accent" />
                <span className="text-sm font-display font-semibold text-foreground">Configuration</span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Config Body */}
            <div className="p-4 space-y-5">
              {/* System Persona */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">System Persona</label>
                <textarea
                  value={config.systemPrompt}
                  onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none font-body scrollbar-none"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Creativity (Temp)</label>
                  <span className="text-xs font-mono text-accent font-bold">{config.temperature.toFixed(1)}</span>
                </div>
                <Slider
                  value={[config.temperature]}
                  onValueChange={([v]) => updateConfig({ temperature: v })}
                  min={0}
                  max={1.5}
                  step={0.1}
                />
              </div>

              {/* Top P */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Focus (Top P)</label>
                  <span className="text-xs font-mono text-accent font-bold">{config.topP.toFixed(1)}</span>
                </div>
                <Slider
                  value={[config.topP]}
                  onValueChange={([v]) => updateConfig({ topP: v })}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Response Length</label>
                  <span className="text-xs font-mono text-accent font-bold">{config.maxTokens}</span>
                </div>
                <Slider
                  value={[config.maxTokens]}
                  onValueChange={([v]) => updateConfig({ maxTokens: v })}
                  min={16}
                  max={512}
                  step={16}
                />
              </div>

              {/* Reset */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onConfigChange(DEFAULT_CONFIG)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium text-accent"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Defaults
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfigPanel;
