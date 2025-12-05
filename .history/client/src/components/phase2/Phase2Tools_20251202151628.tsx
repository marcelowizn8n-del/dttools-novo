import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, HelpCircle, Filter } from "lucide-react";
import PovStatementTool from "./PovStatementTool";
import HmwQuestionTool from "./HmwQuestionTool";
import GuidingCriteriaTool from "./GuidingCriteriaTool";
import { useLanguage } from "@/contexts/LanguageContext";

interface Phase2ToolsProps {
  projectId: string;
}

export default function Phase2Tools({ projectId }: Phase2ToolsProps) {
  const [activeTab, setActiveTab] = useState("pov-statements");
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">2</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("phase2.header.title")}</h1>
            <p className="text-gray-600">
              {t("phase2.header.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pov-statements" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t("phase2.tab.pov")}
          </TabsTrigger>
          <TabsTrigger value="hmw-questions" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            {t("phase2.tab.hmw")}
          </TabsTrigger>
          <TabsTrigger value="guiding-criteria" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t("phase2.tab.guidingCriteria")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pov-statements" className="space-y-6">
          <PovStatementTool projectId={projectId} />
        </TabsContent>

        <TabsContent value="hmw-questions" className="space-y-6">
          <HmwQuestionTool projectId={projectId} />
        </TabsContent>

        <TabsContent value="guiding-criteria" className="space-y-6">
          <GuidingCriteriaTool projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}