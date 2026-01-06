"use client";

import { useState } from "react";
import {
  ReportBuilder,
  DataSources,
  VisualizationPicker,
  ReportPreview,
} from "@/components/reports";
import Breadcrumb from "@/components/common/layout/Breadcrumb";

interface ReportConfig {
  visualizationType: string | null;
  dataSource: string[];
  fields: {
    x?: string;
    y?: string;
    category?: string;
  };
  filters: Array<{ field: string; operator: string; value: string }>;
  layout: "single" | "multi";
  theme: "light" | "dark" | "auto";
}

export default function CustomReportBuilderPage() {
  const [config, setConfig] = useState<ReportConfig>({
    visualizationType: null,
    dataSource: [],
    fields: {},
    filters: [],
    layout: "single",
    theme: "light",
  });

  const handleSourceToggle = (sourceId: string) => {
    const newSources = new Set(config.dataSource);
    if (newSources.has(sourceId)) {
      newSources.delete(sourceId);
    } else {
      newSources.add(sourceId);
    }
    setConfig({
      ...config,
      dataSource: Array.from(newSources),
    });
  };

  const handleTypeSelect = (typeId: string) => {
    setConfig({
      ...config,
      visualizationType: typeId,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Breadcrumb />
      </div>
        <div className="flex-1 overflow-y-auto space-y-6">
          <DataSources
            selectedSources={new Set(config.dataSource)}
            onSourceToggle={handleSourceToggle}
          />

          <VisualizationPicker
            selectedType={config.visualizationType}
            onTypeSelect={handleTypeSelect}
          />

          <ReportBuilder config={config} onConfigChange={setConfig} />

          <ReportPreview config={config} />
        </div>
    </div>
  );
}
