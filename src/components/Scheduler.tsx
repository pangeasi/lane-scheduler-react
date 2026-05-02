import React, { useState, useCallback, useEffect, useMemo } from "react";
import { SchedulerContext } from "../context/SchedulerContext";
import type {
  SchedulerProps,
  DragState,
  ResizeState,
  RegisteredLane,
} from "../types";
import { resolveAppointmentMove } from "../utils/laneUtils";

export const Scheduler: React.FC<SchedulerProps> = ({
  children,
  collisionStrategy = "reject",
  onAppointmentMove,
}) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [lanes, setLanes] = useState<Record<string, RegisteredLane>>({});

  const registerLane = useCallback((lane: RegisteredLane) => {
    setLanes((prev) => ({
      ...prev,
      [lane.laneId]: lane,
    }));
  }, []);

  const unregisterLane = useCallback((laneId: string) => {
    setLanes((prev) => {
      const next = { ...prev };
      delete next[laneId];
      return next;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dragState) return;

    const {
      appointment,
      sourceLaneId,
      targetLaneId,
      currentStartSlot,
      moveDetails,
      originalStartSlot,
    } = dragState;
    const resolvedMove = resolveAppointmentMove({
      appointment,
      sourceLaneId,
      targetLaneId,
      newStartSlot: currentStartSlot,
      originalStartSlot,
      collisionStrategy,
      lanes,
    });
    const finalMoveDetails = resolvedMove.details || moveDetails;

    if (
      resolvedMove.valid &&
      finalMoveDetails &&
      (sourceLaneId !== targetLaneId ||
        currentStartSlot !== appointment.startSlot)
    ) {
      onAppointmentMove?.(
        appointment,
        sourceLaneId,
        targetLaneId,
        currentStartSlot,
        finalMoveDetails
      );
    }

    setDragState(null);
  }, [dragState, collisionStrategy, lanes, onAppointmentMove]);

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

  const contextValue = useMemo(
    () => ({
      dragState,
      setDragState,
      resizeState,
      setResizeState,
      collisionStrategy,
      lanes,
      registerLane,
      unregisterLane,
    }),
    [
      dragState,
      resizeState,
      collisionStrategy,
      lanes,
      registerLane,
      unregisterLane,
    ]
  );

  return (
    <SchedulerContext.Provider
      value={contextValue}
    >
      {children}
    </SchedulerContext.Provider>
  );
};
