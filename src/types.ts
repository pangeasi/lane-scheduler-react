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
  renderAppointmentContent?: (appointment: Appointment) => ReactNode;
  renderDragPreviewContent?: (appointment: Appointment) => ReactNode;
  config?: LaneConfig;
  onSlotDoubleClick?: (slotIndex: number, laneId: string) => void;
  onSlotClick?: (slotIndex: number, laneId: string) => void;
  onAppointmentChange?: (appointment: Appointment) => void;
}

export interface SchedulerContextType {
  dragState: DragState | null;
  setDragState: React.Dispatch<React.SetStateAction<DragState | null>>;
  resizeState: ResizeState | null;
  setResizeState: React.Dispatch<React.SetStateAction<ResizeState | null>>;
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

export interface SchedulerProps {
  children: ReactNode;
  onAppointmentMove?: (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number
  ) => void;
}
