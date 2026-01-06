import whatIfScenariosData from "./whatif-scenarios.json";

export interface WhatIfDataPoint {
  month: string;
  utilization: number;
  available: number;
}

export interface WhatIfScenarioData {
  "add-capacity": {
    default: WhatIfDataPoint[];
    "high-growth": WhatIfDataPoint[];
  };
  "remove-capacity": {
    default: WhatIfDataPoint[];
  };
  "growth-adjust": {
    "low-growth": WhatIfDataPoint[];
    "medium-growth": WhatIfDataPoint[];
    "high-growth": WhatIfDataPoint[];
  };
  redesign: {
    default: WhatIfDataPoint[];
  };
}

export const whatIfScenarios = whatIfScenariosData as WhatIfScenarioData;

