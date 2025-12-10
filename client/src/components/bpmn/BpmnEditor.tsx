import { useEffect, useRef, useState } from "react";
import Modeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

const DEFAULT_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="172" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

interface BpmnEditorProps {
  diagramId: string;
  initialXml?: string | null;
}

export function BpmnEditor({ diagramId, initialXml }: BpmnEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<any | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (!containerRef.current) return;

    const modeler = new Modeler({
      container: containerRef.current,
    });

    modelerRef.current = modeler;

    const xmlToImport = initialXml && initialXml.trim().length > 0 ? initialXml : DEFAULT_BPMN_XML;

    modeler
      .importXML(xmlToImport)
      .then(() => {
        const canvas = modeler.get("canvas");
        canvas.zoom("fit-viewport");
        setIsReady(true);
      })
      .catch((error: any) => {
        console.error("Error importing BPMN XML", error);
      });

    return () => {
      modeler.destroy();
      modelerRef.current = null;
    };
  }, [diagramId, initialXml]);

  const handleSave = async () => {
    if (!modelerRef.current) return;

    try {
      setIsSaving(true);
      const { xml } = (await modelerRef.current.saveXML({ format: true })) as any;
      await apiRequest("PUT", `/api/bpmn-diagrams/${diagramId}`, {
        bpmnXml: xml,
      });
      toast({
        title: t("dd.project.bpmn.toast.save.success.title"),
        description: t("dd.project.bpmn.toast.save.success.description"),
      });
    } catch (error: any) {
      console.error("Error saving BPMN diagram", error);
      toast({
        title: t("dd.project.bpmn.toast.save.error.title"),
        description: error?.message || t("dd.project.bpmn.toast.save.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportSvg = async () => {
    if (!modelerRef.current) return;

    try {
      const { svg } = (await modelerRef.current.saveSVG()) as any;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.svg";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting SVG", error);
    }
  };

  const handleExportPng = async () => {
    if (!modelerRef.current) return;

    try {
      const { svg } = (await modelerRef.current.saveSVG()) as any;
      const image = new Image();
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (!context) {
          URL.revokeObjectURL(url);
          return;
        }
        context.drawImage(image, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = "diagram.png";
          a.click();
          URL.revokeObjectURL(pngUrl);
        }, "image/png");
      };
      image.src = url;
    } catch (error) {
      console.error("Error exporting PNG", error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportSvg}
          disabled={!isReady}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("dd.project.bpmn.editor.exportSvg")} 
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPng}
          disabled={!isReady}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("dd.project.bpmn.editor.exportPng")} 
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isReady || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("dd.project.bpmn.editor.save.loading")} 
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("dd.project.bpmn.editor.save")} 
            </>
          )}
        </Button>
      </div>
      <div className="border rounded-md h-[500px]">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
