import React, { useRef, useCallback, useContext, useEffect } from "react";
import { SchedulerContext } from "../context/SchedulerContext";
import { DEFAULT_CONFIG } from "../constants";
import type { Appointment, LaneProps } from "../types";

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
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const laneRef = useRef<HTMLDivElement>(null);
  const { dragState, setDragState, resizeState, setResizeState } =
    useContext(SchedulerContext) || {};

  const isSlotBlocked = useCallback(
    (slot: number) => {
      return blockedSlots.includes(slot);
    },
    [blockedSlots]
  );

  const getSlotFromX = useCallback(
    (x: number) => {
      const rect = laneRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const relativeX = x - rect.left;
      const slot = Math.max(0, Math.floor(relativeX / finalConfig.slotWidth));
      return slot < totalSlots ? slot : null;
    },
    [finalConfig.slotWidth, totalSlots]
  );

  const isPointOverLane = useCallback((x: number, y: number) => {
    const rect = laneRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  }, []);

  const isValidPosition = useCallback(
    (
      startSlot: number,
      duration: number,
      appointmentId: string,
      appointmentData: Appointment | null = null
    ) => {
      if (startSlot < 0 || startSlot + duration > totalSlots) return false;

      const apt =
        appointmentData || appointments.find((a) => a.id === appointmentId);

      for (let i = startSlot; i < startSlot + duration; i++) {
        if (isSlotBlocked(i)) {
          if (apt?.onBlockedSlot) {
            if (!apt.onBlockedSlot(i, laneId)) return false;
          } else {
            return false;
          }
        }
      }
      return true;
    },
    [totalSlots, isSlotBlocked, appointments, laneId]
  );

  const getOverlappingAppointments = useCallback(
    (startSlot: number, duration: number, excludeId: string) => {
      return appointments.filter((apt) => {
        if (apt.id === excludeId) return false;
        const aptEnd = apt.startSlot + apt.duration;
        const newEnd = startSlot + duration;
        return !(aptEnd <= startSlot || apt.startSlot >= newEnd);
      });
    },
    [appointments]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, appointment: Appointment) => {
      if (appointment.locked || !setDragState) return;

      e.stopPropagation();
      const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const startY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Calcular el offset del cursor dentro del appointment
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
        offsetX, // Guardar el offset para usarlo en handleDragOver
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
      if (
        !dragState ||
        !setDragState ||
        (dragState.sourceLaneId === laneId && !isPointOverLane(x, y))
      ) {
        return;
      }

      if (isPointOverLane(x, y)) {
        // Ajustar la posición x con el offset del cursor
        const adjustedX = x - (dragState.offsetX || 0);
        const slot = getSlotFromX(adjustedX);

        if (slot !== null) {
          const apt = dragState.appointment;
          const overlaps = getOverlappingAppointments(
            slot,
            apt.duration,
            apt.id
          );
          const hasInvalidOverlap = overlaps.some(() => !apt.allowOverlap);
          const isValid =
            !hasInvalidOverlap &&
            isValidPosition(slot, apt.duration, apt.id, apt);

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
        // Actualizar posición del cursor incluso fuera del lane
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
      isPointOverLane,
      getSlotFromX,
      getOverlappingAppointments,
      isValidPosition,
      setDragState,
    ]
  );

  useEffect(() => {
    if (!dragState) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      handleDragOver(x, y);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
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
      const startX = "touches" in e ? e.touches[0].clientX : e.clientX;

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

      const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
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
        apt.id
      );
      const hasInvalidOverlap = overlaps.some(() => !apt.allowOverlap);

      if (
        !hasInvalidOverlap &&
        isValidPosition(newStartSlot, newDuration, apt.id)
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
      appointments,
      getOverlappingAppointments,
      isValidPosition,
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
      const handleMove = (e: MouseEvent | TouchEvent) => handleResizeMove(e);
      const handleEnd = () => handleResizeEnd();

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);

      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleEnd);
      };
    }
  }, [resizeState, laneId, handleResizeMove, handleResizeEnd]);

  const renderAppointment = (appointment: Appointment) => {
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

    if (isShowingPreview && dragState.targetLaneId === laneId) {
      startSlot = dragState.currentStartSlot;
      opacity = dragState.isOverValidLane ? 0.7 : 0.3;
    } else if (isResizing) {
      startSlot = resizeState.currentStartSlot;
      duration = resizeState.currentDuration;
      opacity = 0.7;
    }

    const left = startSlot * finalConfig.slotWidth;
    const width = duration * finalConfig.slotWidth;

    if (
      isShowingPreview &&
      dragState.sourceLaneId !== laneId &&
      dragState.targetLaneId !== laneId
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
  };

  const showPreviewFromOtherLane =
    dragState &&
    dragState.sourceLaneId !== laneId &&
    dragState.targetLaneId === laneId;

  return (
    <div
      ref={laneRef}
      className="relative select-none"
      style={{
        height: `${finalConfig.height}px`,
        width: `${totalSlots * finalConfig.slotWidth}px`,
      }}
    >
      {Array.from({ length: totalSlots }).map((_, idx) => {
        const isBlocked = isSlotBlocked(idx);

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
      })}

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
