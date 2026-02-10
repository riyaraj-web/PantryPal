import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Keyboard, Check, X } from "lucide-react";

interface BarcodeScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBarcodeScanned?: (barcode: string) => void;
}

export function BarcodeScannerModal({
  open,
  onOpenChange,
  onBarcodeScanned,
}: BarcodeScannerModalProps) {
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedProduct, setScannedProduct] = useState<{
    name: string;
    barcode: string;
  } | null>(null);

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      setScannedProduct({
        name: "Sample Product",
        barcode: manualBarcode,
      });
    }
  };

  const handleConfirm = () => {
    if (scannedProduct) {
      onBarcodeScanned?.(scannedProduct.barcode);
      setScannedProduct(null);
      setManualBarcode("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setScannedProduct(null);
    setManualBarcode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="barcode-scanner-modal">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!scannedProduct ? (
            <>
              <div className="flex gap-2">
                <Button
                  variant={mode === "camera" ? "default" : "outline"}
                  onClick={() => setMode("camera")}
                  className="flex-1"
                  data-testid="button-camera-mode"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
                <Button
                  variant={mode === "manual" ? "default" : "outline"}
                  onClick={() => setMode("manual")}
                  className="flex-1"
                  data-testid="button-manual-mode"
                >
                  <Keyboard className="h-4 w-4 mr-2" />
                  Manual
                </Button>
              </div>

              {mode === "camera" ? (
                <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-1/3 border-2 border-primary rounded-md relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary -translate-x-1 -translate-y-1" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary translate-x-1 -translate-y-1" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary -translate-x-1 translate-y-1" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary translate-x-1 translate-y-1" />
                    </div>
                  </div>
                  <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
                    Position barcode within the frame
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="barcode">Barcode Number</Label>
                    <Input
                      id="barcode"
                      value={manualBarcode}
                      onChange={(e) => setManualBarcode(e.target.value)}
                      placeholder="Enter barcode number"
                      data-testid="input-manual-barcode"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleManualSubmit}
                    disabled={!manualBarcode.trim()}
                    data-testid="button-lookup-barcode"
                  >
                    Look Up Product
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="font-medium text-lg">{scannedProduct.name}</p>
                <p className="text-sm text-muted-foreground">
                  Barcode: {scannedProduct.barcode}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setScannedProduct(null)}
                  data-testid="button-rescan"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rescan
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirm}
                  data-testid="button-confirm-product"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Add to Pantry
                </Button>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full"
            onClick={handleCancel}
            data-testid="button-cancel-scan"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
