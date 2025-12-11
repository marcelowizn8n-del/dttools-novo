import { useEffect, useRef, useState } from "react";
import Modeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Save, Maximize2, Minimize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  initialAnalysis?: BpmnAnalysisResult | null;
}

export interface BpmnAnalysisResult {
  overview: string;
  bottlenecks: string[];
  unassignedTasks: string[];
  unclearEnds: string[];
  improvementIdeas: string[];
  doubleDiamondLinks: {
    discover: string[];
    define: string[];
    develop: string[];
    deliver: string[];
  };
}

export function BpmnEditor({ diagramId, initialXml, initialAnalysis }: BpmnEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<any | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BpmnAnalysisResult | null>(
    initialAnalysis ?? null,
  );
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();

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

  // When the selected diagram or its initial analysis changes, sync local state
  useEffect(() => {
    setAnalysisResult(initialAnalysis ?? null);
  }, [diagramId, initialAnalysis]);

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

  const handleZoomIn = () => {
    if (!modelerRef.current) return;
    try {
      const canvas = modelerRef.current.get("canvas");
      const currentZoom = canvas.zoom();
      const nextZoom = Math.min((typeof currentZoom === "number" ? currentZoom : 1) + 0.2, 4);
      canvas.zoom(nextZoom);
    } catch (error) {
      console.error("Error zooming in BPMN diagram", error);
    }
  };

  const handleZoomOut = () => {
    if (!modelerRef.current) return;
    try {
      const canvas = modelerRef.current.get("canvas");
      const currentZoom = canvas.zoom();
      const nextZoom = Math.max((typeof currentZoom === "number" ? currentZoom : 1) - 0.2, 0.2);
      canvas.zoom(nextZoom);
    } catch (error) {
      console.error("Error zooming out BPMN diagram", error);
    }
  };

  const handleZoomFit = () => {
    if (!modelerRef.current) return;
    try {
      const canvas = modelerRef.current.get("canvas");
      canvas.zoom("fit-viewport");
    } catch (error) {
      console.error("Error fitting BPMN diagram to viewport", error);
    }
  };

  useEffect(() => {
    if (!isPresentationMode || !isReady || !modelerRef.current) return;
    try {
      const canvas = modelerRef.current.get("canvas");
      canvas.zoom("fit-viewport");
    } catch (error) {
      console.error("Error fitting BPMN diagram when entering presentation mode", error);
    }
  }, [isPresentationMode, isReady]);

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
        // Fill with white background so exported PNG does not appear with a black/transparent background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

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
      image.onerror = (error) => {
        console.error("Error loading SVG for PNG export", error);
        URL.revokeObjectURL(url);
      };
      image.src = url;
    } catch (error) {
      console.error("Error exporting PNG", error);
    }
  };

  const handleAnalyzeWithAi = async () => {
    // If we already have an analysis (from a previous run or loaded from the server),
    // simply open the dialog instead of generating everything again.
    if (analysisResult) {
      setIsAnalysisOpen(true);
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await apiRequest(
        "POST",
        `/api/bpmn-diagrams/${diagramId}/analyze`,
        {
          language,
        },
      );
      const data = (await response.json()) as BpmnAnalysisResult;
      setAnalysisResult(data);
      setIsAnalysisOpen(true);
    } catch (error: any) {
      console.error("Error analyzing BPMN diagram with AI", error);
      toast({
        title: t("dd.project.bpmn.analyze.toast.error.title"),
        description:
          error?.message ||
          t("dd.project.bpmn.analyze.toast.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const buildAnalysisMarkdown = () => {
    if (!analysisResult) return "";

    const lines: string[] = [];

    lines.push(`# ${t("dd.project.bpmn.editor.analyzeAi.dialog.title")}`);
    lines.push(
      t("dd.project.bpmn.editor.analyzeAi.dialog.subtitle"),
    );
    lines.push("");

    lines.push(`## ${t("dd.project.bpmn.editor.analyzeAi.overview")}`);
    lines.push(analysisResult.overview || "");
    lines.push("");

    if (analysisResult.bottlenecks?.length) {
      lines.push(
        `## ${t("dd.project.bpmn.editor.analyzeAi.bottlenecks")}`,
      );
      for (const item of analysisResult.bottlenecks) {
        lines.push(`- ${item}`);
      }
      lines.push("");
    }

    if (analysisResult.unassignedTasks?.length) {
      lines.push(
        `## ${t("dd.project.bpmn.editor.analyzeAi.unassignedTasks")}`,
      );
      for (const item of analysisResult.unassignedTasks) {
        lines.push(`- ${item}`);
      }
      lines.push("");
    }

    if (analysisResult.unclearEnds?.length) {
      lines.push(
        `## ${t("dd.project.bpmn.editor.analyzeAi.unclearEnds")}`,
      );
      for (const item of analysisResult.unclearEnds) {
        lines.push(`- ${item}`);
      }
      lines.push("");
    }

    if (analysisResult.improvementIdeas?.length) {
      lines.push(
        `## ${t("dd.project.bpmn.editor.analyzeAi.improvementIdeas")}`,
      );
      for (const item of analysisResult.improvementIdeas) {
        lines.push(`- ${item}`);
      }
      lines.push("");
    }

    if (analysisResult.doubleDiamondLinks) {
      lines.push(
        `## ${t(
          "dd.project.bpmn.editor.analyzeAi.doubleDiamond.title",
        )}`,
      );

      if (analysisResult.doubleDiamondLinks.discover?.length) {
        lines.push(
          `### ${t(
            "dd.project.bpmn.editor.analyzeAi.doubleDiamond.discover",
          )}`,
        );
        for (const item of analysisResult.doubleDiamondLinks.discover) {
          lines.push(`- ${item}`);
        }
        lines.push("");
      }

      if (analysisResult.doubleDiamondLinks.define?.length) {
        lines.push(
          `### ${t(
            "dd.project.bpmn.editor.analyzeAi.doubleDiamond.define",
          )}`,
        );
        for (const item of analysisResult.doubleDiamondLinks.define) {
          lines.push(`- ${item}`);
        }
        lines.push("");
      }

      if (analysisResult.doubleDiamondLinks.develop?.length) {
        lines.push(
          `### ${t(
            "dd.project.bpmn.editor.analyzeAi.doubleDiamond.develop",
          )}`,
        );
        for (const item of analysisResult.doubleDiamondLinks.develop) {
          lines.push(`- ${item}`);
        }
        lines.push("");
      }

      if (analysisResult.doubleDiamondLinks.deliver?.length) {
        lines.push(
          `### ${t(
            "dd.project.bpmn.editor.analyzeAi.doubleDiamond.deliver",
          )}`,
        );
        for (const item of analysisResult.doubleDiamondLinks.deliver) {
          lines.push(`- ${item}`);
        }
        lines.push("");
      }
    }

    return lines.join("\n");
  };

  const handleCopyAnalysisMarkdown = async () => {
    if (!analysisResult) return;
    try {
      const markdown = buildAnalysisMarkdown();
      await navigator.clipboard.writeText(markdown);
      toast({
        title: t(
          "dd.project.bpmn.editor.analyzeAi.toast.copy.success.title",
        ),
        description: t(
          "dd.project.bpmn.editor.analyzeAi.toast.copy.success.description",
        ),
      });
    } catch (error) {
      console.error("Error copying BPMN AI analysis markdown", error);
      toast({
        title: t(
          "dd.project.bpmn.editor.analyzeAi.toast.copy.error.title",
        ),
        description: t(
          "dd.project.bpmn.editor.analyzeAi.toast.copy.error.description",
        ),
        variant: "destructive",
      });
    }
  };

  const handleDownloadAnalysisMarkdown = () => {
    if (!analysisResult) return;
    try {
      const markdown = buildAnalysisMarkdown();
      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bpmn-analysis.md";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading BPMN AI analysis markdown", error);
    }
  };

  return (
    <div
      className={
        isPresentationMode
          ? "fixed inset-0 z-50 bg-background p-4 flex flex-col space-y-3"
          : "space-y-3"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          disabled={!isReady}
        >
          {t("dd.project.bpmn.editor.zoomOut")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          disabled={!isReady}
        >
          {t("dd.project.bpmn.editor.zoomIn")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomFit}
          disabled={!isReady}
        >
          {t("dd.project.bpmn.editor.zoomFit")}
        </Button>
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyzeWithAi}
          disabled={!isReady || isAnalyzing}
        >
          {isAnalyzing && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isAnalyzing
            ? t("dd.project.bpmn.editor.analyzeAi.button.loading")
            : t("dd.project.bpmn.editor.analyzeAi.button.idle")}
        </Button>
        <Button
          variant={isPresentationMode ? "secondary" : "outline"}
          size="sm"
          onClick={() => setIsPresentationMode((prev) => !prev)}
          disabled={!isReady}
        >
          {isPresentationMode ? (
            <>
              <Minimize2 className="mr-2 h-4 w-4" />
              {t("dd.project.bpmn.editor.presentationExit")}
            </>
          ) : (
            <>
              <Maximize2 className="mr-2 h-4 w-4" />
              {t("dd.project.bpmn.editor.presentationEnter")}
            </>
          )}
        </Button>
      </div>
      <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("dd.project.bpmn.editor.analyzeAi.dialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("dd.project.bpmn.editor.analyzeAi.dialog.subtitle")}
            </DialogDescription>
          </DialogHeader>
          {analysisResult && (
            <>
              <div className="mb-3 flex justify-end gap-2 text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAnalysisMarkdown}
                >
                  {t(
                    "dd.project.bpmn.editor.analyzeAi.actions.copyMd",
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAnalysisMarkdown}
                >
                  {t(
                    "dd.project.bpmn.editor.analyzeAi.actions.downloadMd",
                  )}
                </Button>
              </div>
              <div className="max-h-[60vh] space-y-4 overflow-y-auto text-sm">
              <section>
                <h3 className="text-sm font-semibold">
                  {t("dd.project.bpmn.editor.analyzeAi.overview")}
                </h3>
                <p className="mt-1 whitespace-pre-line">
                  {analysisResult.overview}
                </p>
              </section>

              {analysisResult.bottlenecks?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold">
                    {t("dd.project.bpmn.editor.analyzeAi.bottlenecks")}
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {analysisResult.bottlenecks.map((item, index) => (
                      <li key={`bottleneck-${index}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {analysisResult.unassignedTasks?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold">
                    {t("dd.project.bpmn.editor.analyzeAi.unassignedTasks")}
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {analysisResult.unassignedTasks.map((item, index) => (
                      <li key={`unassigned-${index}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {analysisResult.unclearEnds?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold">
                    {t("dd.project.bpmn.editor.analyzeAi.unclearEnds")}
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {analysisResult.unclearEnds.map((item, index) => (
                      <li key={`unclear-${index}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {analysisResult.improvementIdeas?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold">
                    {t("dd.project.bpmn.editor.analyzeAi.improvementIdeas")}
                  </h3>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {analysisResult.improvementIdeas.map((item, index) => (
                      <li key={`idea-${index}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {analysisResult.doubleDiamondLinks && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    {t("dd.project.bpmn.editor.analyzeAi.doubleDiamond.title")}
                  </h3>
                  {analysisResult.doubleDiamondLinks.discover?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                        {t(
                          "dd.project.bpmn.editor.analyzeAi.doubleDiamond.discover",
                        )}
                      </h4>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {analysisResult.doubleDiamondLinks.discover.map(
                          (item, index) => (
                            <li key={`discover-${index}`}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {analysisResult.doubleDiamondLinks.define?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                        {t(
                          "dd.project.bpmn.editor.analyzeAi.doubleDiamond.define",
                        )}
                      </h4>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {analysisResult.doubleDiamondLinks.define.map(
                          (item, index) => (
                            <li key={`define-${index}`}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {analysisResult.doubleDiamondLinks.develop?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                        {t(
                          "dd.project.bpmn.editor.analyzeAi.doubleDiamond.develop",
                        )}
                      </h4>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {analysisResult.doubleDiamondLinks.develop.map(
                          (item, index) => (
                            <li key={`develop-${index}`}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {analysisResult.doubleDiamondLinks.deliver?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                        {t(
                          "dd.project.bpmn.editor.analyzeAi.doubleDiamond.deliver",
                        )}
                      </h4>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {analysisResult.doubleDiamondLinks.deliver.map(
                          (item, index) => (
                            <li key={`deliver-${index}`}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </section>
              )}
            </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <div className={`border rounded-md ${isPresentationMode ? "flex-1" : "h-[500px]"}`}>
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
