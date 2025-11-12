import React, { useState, useCallback, useEffect } from "react";
import { SchedulerContext } from "../context/SchedulerContext";
import type { SchedulerProps, DragState, ResizeState } from "../types";

export const Scheduler: React.FC<SchedulerProps> = ({
  children,
  onAppointmentMove,
}) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  const handleDragEnd = useCallback(() => {
    if (!dragState) return;

    const {
      appointment,
      sourceLaneId,
      targetLaneId,
      currentStartSlot,
      isOverValidLane,
    } = dragState;

    if (
      isOverValidLane &&
      (sourceLaneId !== targetLaneId ||
        currentStartSlot !== appointment.startSlot)
    ) {
      onAppointmentMove?.(
        appointment,
        sourceLaneId,
        targetLaneId,
        currentStartSlot
      );
    }

    setDragState(null);
  }, [dragState, onAppointmentMove]);

  useEffect(() => {
    if (dragState) {
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);

      return () => {
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [dragState, handleDragEnd]);

  return (
    <SchedulerContext.Provider
      value={{ dragState, setDragState, resizeState, setResizeState }}
    >
      {children}
    </SchedulerContext.Provider>
  );
};
