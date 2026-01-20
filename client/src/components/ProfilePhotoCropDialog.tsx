import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onConfirm: (base64: string) => void;
};

export default function ProfilePhotoCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onConfirm,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [containerSize, setContainerSize] = useState(320);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [outputSize, setOutputSize] = useState(256);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number }>({
    x: 0,
    y: 0,
    ox: 0,
    oy: 0,
  });

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setOutputSize(256);
    setOffset({ x: 0, y: 0 });
  }, [open, imageSrc]);

  useEffect(() => {
    if (!open) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height));
      if (size > 0) setContainerSize(size);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  const baseScale = useMemo(() => {
    if (!natural) return 1;
    return Math.max(containerSize / natural.w, containerSize / natural.h);
  }, [containerSize, natural]);

  const effectiveScale = useMemo(() => baseScale * zoom, [baseScale, zoom]);

  const clampOffset = (x: number, y: number, scale: number) => {
    if (!natural) return { x, y };
    const scaledW = natural.w * scale;
    const scaledH = natural.h * scale;
    const maxX = Math.max(0, (scaledW - containerSize) / 2);
    const maxY = Math.max(0, (scaledH - containerSize) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  useEffect(() => {
    if (!natural) return;
    setOffset((prev) => clampOffset(prev.x, prev.y, effectiveScale));
  }, [effectiveScale, natural]);

  useEffect(() => {
    if (!open) return;
    if (!natural) return;
    const imgEl = imgRef.current;
    const canvas = previewCanvasRef.current;
    const container = containerRef.current;
    if (!imgEl || !canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, rect.height));
    if (size <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const sSize = size / effectiveScale;
    const sx = natural.w / 2 + (-size / 2 - offset.x) / effectiveScale;
    const sy = natural.h / 2 + (-size / 2 - offset.y) / effectiveScale;
    const safeSX = Math.max(0, Math.min(natural.w - sSize, sx));
    const safeSY = Math.max(0, Math.min(natural.h - sSize, sy));

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgEl, safeSX, safeSY, sSize, sSize, 0, 0, size, size);
  }, [open, natural, containerSize, effectiveScale, offset.x, offset.y]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!natural) return;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !natural) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const next = clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, effectiveScale);
    setOffset(next);
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  const handleConfirm = async () => {
    const imgEl = imgRef.current;
    if (!imgEl || !natural) return;

    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sSize = containerSize / effectiveScale;
    const sx = natural.w / 2 + (-containerSize / 2 - offset.x) / effectiveScale;
    const sy = natural.h / 2 + (-containerSize / 2 - offset.y) / effectiveScale;

    const safeSX = Math.max(0, Math.min(natural.w - sSize, sx));
    const safeSY = Math.max(0, Math.min(natural.h - sSize, sy));

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgEl, safeSX, safeSY, sSize, sSize, 0, 0, outputSize, outputSize);

    let base64 = "";
    try {
      base64 = canvas.toDataURL("image/webp", 0.9);
      if (!base64.startsWith("data:image/webp")) {
        throw new Error("webp not supported");
      }
    } catch {
      base64 = canvas.toDataURL("image/jpeg", 0.9);
    }

    onConfirm(base64);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enquadrar foto</DialogTitle>
          <DialogDescription>
            Arraste para posicionar e use o zoom para ajustar o enquadramento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden bg-muted touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <canvas ref={previewCanvasRef} className="block h-full w-full" />

            {imageSrc ? (
              <img
                ref={imgRef}
                src={imageSrc}
                alt=""
                className="hidden"
                draggable={false}
                onLoad={(e) => {
                  const el = e.currentTarget;
                  setNatural({ w: el.naturalWidth, h: el.naturalHeight });
                }}
              />
            ) : null}

            <div className="pointer-events-none absolute inset-0 ring-2 ring-primary/60 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Zoom</div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.01}
              onValueChange={(v) => setZoom(v[0] ?? 1)}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Tamanho (px)</div>
            <Slider
              value={[outputSize]}
              min={128}
              max={512}
              step={1}
              onValueChange={(v) => setOutputSize(v[0] ?? 256)}
            />
            <div className="text-sm text-muted-foreground">{outputSize}x{outputSize}</div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!natural}>
            Usar esta foto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
