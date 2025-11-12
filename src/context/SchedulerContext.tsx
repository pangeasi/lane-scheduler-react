import { createContext } from "react";
import type { SchedulerContextType } from "../types";

export const SchedulerContext = createContext<SchedulerContextType | null>(
  null
);
