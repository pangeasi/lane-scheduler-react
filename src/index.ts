// Import styles
import "./index.css";

export { Lane, Scheduler } from "./components";
export type {
  Appointment,
  LaneConfig,
  LaneProps,
  SchedulerProps,
  ValidationResult,
} from "./types";
export { DEFAULT_CONFIG } from "./constants";
export { SchedulerContext } from "./context";
export { useAppointmentValidation } from "./hooks/useAppointmentValidation";
export type { UseAppointmentValidationProps } from "./hooks/useAppointmentValidation";
export { validateNewAppointment } from "./utils/appointmentValidation";
export type { AppointmentValidationContext } from "./utils/appointmentValidation";
