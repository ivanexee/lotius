import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ContactDialogProps {
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
}

export function ContactDialog({
  title = "Get in Touch",
  description = "Reach out to us at i.cxc@icloud.com",
  open: controlledOpen,
  onOpenChange,
  onConfirm,
}: ContactDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, letterSpacing: "0.05em" }}
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          {onConfirm && (
            <Button
              onClick={() => {
                onConfirm();
                handleOpenChange(false);
              }}
            >
              Confirm
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
