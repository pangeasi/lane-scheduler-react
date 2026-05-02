import type { ReactNode } from "react";

export interface Appointment {
  id: string;
  startSlot: number;
  duration: number;
  title?: string;
  locked?: boolean;
  allowOverlap?: boolean;
  onBlockedSlot?: (slotIndex: number, laneId: string) => boolean;
  [key: string]: unknown;
}

export interface LaneConfig {
  height?: number;
  slotWidth?: number;
  slotColor?: string;
  slotBorderColor?: string;
  snapThreshold?: number;
}

export interface LaneProps {
  laneId: string;
  appointments?: Appointment[];
  blockedSlots?: number[];
  totalSlots?: number;
  renderSlot?: (slotIndex: number, isBlocked: boolean) => ReactNode;
  renderAppointmentContent?: (
    appointment: Appointment,
    currentStartSlot: number,
    currentDuration: number
  ) => ReactNode;
  renderDragPreviewContent?: (appointment: Appointment) => ReactNode;
  config?: LaneConfig;
  onSlotDoubleClick?: (slotIndex: number, laneId: string) => void;
  onSlotClick?: (slotIndex: number, laneId: string) => void;
  onContextMenu?: (slotIndex: number, laneId: string) => void;
  onAppointmentChange?: (appointment: Appointment) => void;
  // Validación de citas
  onValidationError?: (error: ValidationResult) => void;
  customValidator?: (appointment: Appointment) => ValidationResult;
  strictMode?: boolean;
  // Custom classNames
  appointmentContainerClassName?: string;
  appointmentResizerStartClassName?: string;
  appointmentResizerEndClassName?: string;
  appointmentResizerStartInnerClassName?: string;
  appointmentResizerEndInnerClassName?: string;
}

export interface SchedulerContextType {
  dragState: DragState | null;
  setDragState: React.Dispatch<React.SetStateAction<DragState | null>>;
  resizeState: ResizeState | null;
  setResizeState: React.Dispatch<React.SetStateAction<ResizeState | null>>;
  collisionStrategy: CollisionStrategy;
  lanes: Record<string, RegisteredLane>;
  registerLane: (lane: RegisteredLane) => void;
  unregisterLane: (laneId: string) => void;
}

export type CollisionStrategy = "reject" | "swap";

export interface RegisteredLane {
  laneId: string;
  appointments: Appointment[];
  blockedSlots: number[];
  totalSlots: number;
}

export interface DragState {
  appointmentId: string;
  appointment: Appointment;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX?: number;
  originalStartSlot: number;
  currentStartSlot: number;
  sourceLaneId: string;
  targetLaneId: string;
  isOverValidLane: boolean;
  moveDetails?: AppointmentMoveDetails;
  swapPreview?: AppointmentSwapPreview;
}

export interface ResizeState {
  appointmentId: string;
  laneId: string;
  edge: "start" | "end";
  startX: number;
  originalStartSlot: number;
  originalDuration: number;
  currentStartSlot: number;
  currentDuration: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  conflictingAppointments?: Appointment[];
}

export interface AppointmentSwapPreview {
  appointment: Appointment;
  laneId: string;
  startSlot: number;
}

export interface AppointmentMoveDetails {
  operation: "move" | "swap";
  appointment: Appointment;
  sourceLaneId: string;
  targetLaneId: string;
  newStartSlot: number;
  swappedAppointment?: Appointment;
  swappedAppointmentNewLaneId?: string;
  swappedAppointmentNewStartSlot?: number;
}

export interface SchedulerProps {
  children: ReactNode;
  collisionStrategy?: CollisionStrategy;
  onAppointmentMove?: (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number,
    details: AppointmentMoveDetails
  ) => void;
}
