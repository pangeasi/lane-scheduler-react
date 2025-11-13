import React, { useRef, useCallback, useContext, useEffect, useMemo } from "react";
import { SchedulerContext } from "../context/SchedulerContext";
import { DEFAULT_CONFIG } from "../constants";
import type { Appointment, LaneProps } from "../types";
import {
  isSlotBlocked,
  getSlotFromX,
  isPointOverLane,
  isValidPosition,
  getOverlappingAppointments,
  getEventCoordinates,
  getReactEventCoordinates,
  hasInvalidOverlap,
} from "../utils/laneUtils";

export const Lane: React.FC<LaneProps> = ({
  laneId,
  appointments = [],
  blockedSlots = [],
  totalSlots = 24,
  renderSlot,
  renderAppointmentContent,
  config = {},
  onSlotDoubleClick,
  onSlotClick,
  onAppointmentChange,
}) => {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  const laneRef = useRef<HTMLDivElement>(null);
  const { dragState, setDragState, resizeState, setResizeState } =
    useContext(SchedulerContext) || {};

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, appointment: Appointment) => {
      if (appointment.locked || !setDragState) return;

      e.stopPropagation();
      const { x: startX, y: startY } = getReactEventCoordinates(e);

      const rect = laneRef.current?.getBoundingClientRect();
      if (!rect) return;

      const appointmentLeft =
        appointment.startSlot * finalConfig.slotWidth + rect.left;
      const offsetX = startX - appointmentLeft;

      setDragState({
        appointmentId: appointment.id,
        appointment: appointment,
        startX,
        startY,
        currentX: startX,
        currentY: startY,
        offsetX,
        originalStartSlot: appointment.startSlot,
        currentStartSlot: appointment.startSlot,
        sourceLaneId: laneId,
        targetLaneId: laneId,
        isOverValidLane: true,
      });
    },
    [laneId, setDragState, finalConfig.slotWidth]
  );

  const handleDragOver = useCallback(
    (x: number, y: number) => {
      const rect = laneRef.current?.getBoundingClientRect();

      if (
        !dragState ||
        !setDragState ||
        (dragState.sourceLaneId === laneId && !isPointOverLane(x, y, rect))
      ) {
        return;
      }

      if (isPointOverLane(x, y, rect)) {
        const adjustedX = x - (dragState.offsetX || 0);
        const slot = getSlotFromX(
          adjustedX,
          rect,
          finalConfig.slotWidth,
          totalSlots
        );

        if (slot !== null) {
          const apt = dragState.appointment;
          const overlaps = getOverlappingAppointments(
            slot,
            apt.duration,
            apt.id,
            appointments
          );
          const invalidOverlap = hasInvalidOverlap(overlaps, apt.allowOverlap ?? false);
          const isValid =
            !invalidOverlap &&
            isValidPosition(
              slot,
              apt.duration,
              apt.id,
              totalSlots,
              blockedSlots,
              appointments,
              laneId,
              apt
            );

          setDragState((prev) =>
            prev
              ? {
                  ...prev,
                  currentX: x,
                  currentY: y,
                  currentStartSlot: slot,
                  targetLaneId: laneId,
                  isOverValidLane: isValid,
                }
              : null
          );
        }
      } else {
        setDragState((prev) =>
          prev
            ? {
                ...prev,
                currentX: x,
                currentY: y,
              }
            : null
        );
      }
    },
    [
      dragState,
      laneId,
      finalConfig.slotWidth,
      totalSlots,
      blockedSlots,
      appointments,
      setDragState,
    ]
  );

  useEffect(() => {
    if (!dragState) return;

    const controller = new AbortController();
    const { signal } = controller;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getEventCoordinates(e);
      handleDragOver(x, y);
    };

    window.addEventListener("mousemove", handleMove, { signal });
    window.addEventListener("touchmove", handleMove, {
      passive: false,
      signal,
    });

    return () => {
      controller.abort();
    };
  }, [dragState, handleDragOver]);

  const handleResizeStart = useCallback(
    (
      e: React.MouseEvent | React.TouchEvent,
      appointment: Appointment,
      edge: "start" | "end"
    ) => {
      if (appointment.locked || !setResizeState) return;

      e.stopPropagation();
      const { x: startX } = getReactEventCoordinates(e);

      setResizeState({
        appointmentId: appointment.id,
        laneId: laneId,
        edge,
        startX,
        originalStartSlot: appointment.startSlot,
        originalDuration: appointment.duration,
        currentStartSlot: appointment.startSlot,
        currentDuration: appointment.duration,
      });
    },
    [laneId, setResizeState]
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!resizeState || !setResizeState || resizeState.laneId !== laneId)
        return;

      const { x: currentX } = getEventCoordinates(e);
      const deltaX = currentX - resizeState.startX;
      const deltaSlots = Math.round(deltaX / finalConfig.slotWidth);

      let newStartSlot = resizeState.originalStartSlot;
      let newDuration = resizeState.originalDuration;

      if (resizeState.edge === "start") {
        newStartSlot = Math.max(0, resizeState.originalStartSlot + deltaSlots);
        newDuration = resizeState.originalDuration - deltaSlots;
      } else {
        newDuration = Math.max(1, resizeState.originalDuration + deltaSlots);
      }

      if (newDuration < 1) return;

      const apt = appointments.find((a) => a.id === resizeState.appointmentId);
      if (!apt) return;

      const overlaps = getOverlappingAppointments(
        newStartSlot,
        newDuration,
        apt.id,
        appointments
      );
      const invalidOverlap = hasInvalidOverlap(overlaps, apt.allowOverlap ?? false);

      if (
        !invalidOverlap &&
        isValidPosition(
          newStartSlot,
          newDuration,
          apt.id,
          totalSlots,
          blockedSlots,
          appointments,
          laneId
        )
      ) {
        setResizeState((prev) =>
          prev
            ? {
                ...prev,
                currentStartSlot: newStartSlot,
                currentDuration: newDuration,
              }
            : null
        );
      }
    },
    [
      resizeState,
      laneId,
      finalConfig.slotWidth,
      totalSlots,
      blockedSlots,
      appointments,
      setResizeState,
    ]
  );

  const handleResizeEnd = useCallback(() => {
    if (!resizeState || resizeState.laneId !== laneId || !setResizeState)
      return;

    const apt = appointments.find((a) => a.id === resizeState.appointmentId);
    if (!apt) return;

    const changed =
      resizeState.currentStartSlot !== resizeState.originalStartSlot ||
      resizeState.currentDuration !== resizeState.originalDuration;

    if (changed) {
      onAppointmentChange?.({
        ...apt,
        startSlot: resizeState.currentStartSlot,
        duration: resizeState.currentDuration,
      });
    }

    setResizeState(null);
  }, [resizeState, laneId, appointments, onAppointmentChange, setResizeState]);

  useEffect(() => {
    if (resizeState && resizeState.laneId === laneId) {
      const controller = new AbortController();
      const { signal } = controller;

      const handleMove = (e: MouseEvent | TouchEvent) => handleResizeMove(e);
      const handleEnd = () => handleResizeEnd();

      window.addEventListener("mousemove", handleMove, { signal });
      window.addEventListener("mouseup", handleEnd, { signal });
      window.addEventListener("touchmove", handleMove, { signal });
      window.addEventListener("touchend", handleEnd, { signal });

      return () => {
        controller.abort();
      };
    }
  }, [resizeState, laneId, handleResizeMove, handleResizeEnd]);

  const renderAppointment = useCallback((appointment: Appointment) => {
    const isDraggingThis =
      dragState?.appointmentId === appointment.id &&
      dragState?.sourceLaneId === laneId;
    const isShowingPreview =
      dragState?.appointmentId === appointment.id &&
      dragState?.targetLaneId === laneId;
    const isResizing =
      resizeState?.appointmentId === appointment.id &&
      resizeState?.laneId === laneId;

    let startSlot = appointment.startSlot;
    let duration = appointment.duration;
    let opacity = 1;

    if (isDraggingThis) {
      opacity = 0.3;
    }

    if (isShowingPreview && dragState?.targetLaneId === laneId) {
      startSlot = dragState.currentStartSlot;
      opacity = dragState.isOverValidLane ? 0.7 : 0.3;
    } else if (isResizing) {
      startSlot = resizeState!.currentStartSlot;
      duration = resizeState!.currentDuration;
      opacity = 0.7;
    }

    const left = startSlot * finalConfig.slotWidth;
    const width = duration * finalConfig.slotWidth;

    if (
      isShowingPreview &&
      dragState?.sourceLaneId !== laneId &&
      dragState?.targetLaneId !== laneId
    ) {
      return null;
    }

    return (
      <div
        key={appointment.id}
        className="absolute top-0"
        style={{
          left: `${left}px`,
          width: `${width}px`,
          height: `${finalConfig.height}px`,
          opacity: opacity,
          transition: isDraggingThis || isResizing ? "none" : "all 0.2s ease",
          touchAction: "none",
          zIndex: isDraggingThis ? 1000 : 1,
        }}
      >
        <div
          className={`h-full ${
            dragState?.isOverValidLane === false && isShowingPreview
              ? "bg-red-500"
              : "bg-blue-500"
          } text-white rounded shadow-md flex items-center justify-center relative overflow-hidden ${
            appointment.locked ? "cursor-not-allowed" : "cursor-move"
          }`}
          onMouseDown={(e) => handleDragStart(e, appointment)}
          onTouchStart={(e) => handleDragStart(e, appointment)}
        >
          {!appointment.locked && (
            <>
              <div
                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-700 z-10"
                onMouseDown={(e) => handleResizeStart(e, appointment, "start")}
                onTouchStart={(e) => handleResizeStart(e, appointment, "start")}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-700 z-10"
                onMouseDown={(e) => handleResizeStart(e, appointment, "end")}
                onTouchStart={(e) => handleResizeStart(e, appointment, "end")}
              />
            </>
          )}

          <div className="px-2 text-sm truncate pointer-events-none">
            {renderAppointmentContent
              ? renderAppointmentContent(appointment)
              : appointment.title || `Apt ${appointment.id}`}
          </div>

          {appointment.locked && (
            <div className="absolute top-1 right-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }, [dragState, resizeState, laneId, finalConfig, renderAppointmentContent, handleDragStart, handleResizeStart]);

  const showPreviewFromOtherLane =
    dragState &&
    dragState.sourceLaneId !== laneId &&
    dragState.targetLaneId === laneId;

  const slotElements = useMemo(() => {
    return Array.from({ length: totalSlots }).map((_, idx) => {
      const isBlocked = isSlotBlocked(idx, blockedSlots);

      return (
        <div
          key={idx}
          className="absolute top-0 bottom-0 border-r"
          style={{
            left: `${idx * finalConfig.slotWidth}px`,
            width: `${finalConfig.slotWidth}px`,
            backgroundColor: isBlocked ? "#fee2e2" : finalConfig.slotColor,
            borderColor: finalConfig.slotBorderColor,
          }}
          onClick={() => onSlotClick?.(idx, laneId)}
          onDoubleClick={() => onSlotDoubleClick?.(idx, laneId)}
        >
          {renderSlot ? (
            renderSlot(idx, isBlocked)
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400">
              {idx}
            </div>
          )}
        </div>
      );
    });
  }, [totalSlots, blockedSlots, finalConfig, renderSlot, onSlotClick, onSlotDoubleClick, laneId]);

  return (
    <div
      ref={laneRef}
      className="relative select-none"
      style={{
        height: `${finalConfig.height}px`,
        width: `${totalSlots * finalConfig.slotWidth}px`,
      }}
    >
      {slotElements}

      {appointments.map(renderAppointment)}

      {showPreviewFromOtherLane && dragState && (
        <div
          className="absolute top-0"
          style={{
            left: `${dragState.currentStartSlot * finalConfig.slotWidth}px`,
            width: `${
              dragState.appointment.duration * finalConfig.slotWidth
            }px`,
            height: `${finalConfig.height}px`,
            opacity: dragState.isOverValidLane ? 0.7 : 0.3,
            zIndex: 999,
          }}
        >
          <div
            className={`h-full ${
              dragState.isOverValidLane ? "bg-blue-500" : "bg-red-500"
            } text-white rounded shadow-md flex items-center justify-center`}
          >
            <div className="px-2 text-sm truncate pointer-events-none">
              {renderAppointmentContent
                ? renderAppointmentContent(dragState.appointment)
                : dragState.appointment.title ||
                  `Apt ${dragState.appointment.id}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
