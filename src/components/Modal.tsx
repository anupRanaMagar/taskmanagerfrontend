import { X } from "lucide-react";
import React, { useEffect } from "react";

interface Props {
  open: boolean;
  escFn: () => void;
  closeIcon?: string;
  content?: React.ReactNode;
  titleContent?: React.ReactNode;

  actions?: React.ReactNode;
}

export const Modal: React.FC<Props> = ({
  open,
  escFn,
  closeIcon,
  content,
  titleContent,

  actions,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        escFn();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, escFn]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full p-6 border border-border">
        {/* Header */}
        {titleContent && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {titleContent}
            </h2>
            <button
              onClick={escFn}
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              {closeIcon ?? <X className="h-5 w-5" />}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="mb-6">{content}</div>

        {/* Actions */}
        {actions && <div className="flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );
};
