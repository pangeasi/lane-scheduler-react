import React, { useState } from "react";
import { action } from "storybook/actions";
import { Scheduler } from "../src/components/Scheduler";
import { Lane } from "../src/components/Lane";
import type { Appointment } from "../src/types";
import { defaultSampleAppointments } from "./story-constants";
import { validateNewAppointment } from "../src/utils/appointmentValidation";

// Props interface for the stateful wrapper
export interface StatefulLaneWrapperProps {
  initialAppointments?: Appointment[];
  initialBlockedSlots?: number[];
  laneId?: string;
  totalSlots?: number;
  config?: {
    height?: number;
    slotWidth?: number;
  };
  renderSlot?: (slotIndex: number, isBlocked: boolean) => React.ReactNode;
  renderAppointmentContent?: (appointment: Appointment) => React.ReactNode;
  showControls?: boolean;
  showDebugInfo?: boolean;
  onAppointmentMoveOverwrite?: (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number
  ) => void;
  children?: React.ReactNode;
}

const renderAppointmentContentDefault = (appointment: Appointment) => (
  <div
    className={`bg-blue-400 text-white h-full px-4 truncate ${
      appointment.locked ? "cursor-not-allowed" : "cursor-grab"
    }`}
  >
    {appointment.title}
    <br />
    {`(${appointment.startSlot} - ${
      appointment.startSlot + appointment.duration
    })`}

    {appointment.locked && (
      <div className="absolute top-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 m-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    )}
  </div>
);

/**
 * Stateful Lane Wrapper for Storybook stories
 *
 * This wrapper provides:
 * - State management for appointments and blocked slots
 * - Interactive controls for testing
 * - Debug information display
 * - Full drag & drop, resize, and creation functionality
 */
export const StatefulLaneWrapper: React.FC<StatefulLaneWrapperProps> = ({
  initialAppointments = defaultSampleAppointments,
  initialBlockedSlots = [0, 1, 22, 23],
  laneId = "demo-lane",
  totalSlots = 24,
  config = { height: 80, slotWidth: 60 },
  renderSlot,
  renderAppointmentContent = renderAppointmentContentDefault,
  showControls = true,
  showDebugInfo = true,
  onAppointmentMoveOverwrite,
  children,
}) => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [blockedSlots, setBlockedSlots] =
    useState<number[]>(initialBlockedSlots);

  // Handler for appointment moves (drag & drop)
  const handleAppointmentMove = (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number
  ) => {
    console.log("🚀 Appointment moved:", {
      appointment,
      sourceLaneId,
      targetLaneId,
      newStartSlot,
    });

    // Use custom handler if provided, otherwise use default behavior
    if (onAppointmentMoveOverwrite) {
      onAppointmentMoveOverwrite(
        appointment,
        sourceLaneId,
        targetLaneId,
        newStartSlot
      );
      return;
    }

    action("onAppointmentMove")(
      appointment,
      sourceLaneId,
      targetLaneId,
      newStartSlot
    );

    // Update the appointment with new position
    if (sourceLaneId === laneId && targetLaneId === laneId) {
      // Moving within the same lane
      setAppointments((prev) => {
        const updated = prev.map((apt) =>
          apt.id === appointment.id ? { ...apt, startSlot: newStartSlot } : apt
        );
        console.log("📋 Updated appointments after move:", updated);
        return updated;
      });
    }
  };

  const handleAppointmentChange = (updatedAppointment: Appointment) => {
    console.log("🔄 Appointment changed:", updatedAppointment);
    action("onAppointmentChange")(updatedAppointment);
    setAppointments((prev) => {
      const updated = prev.map((apt) =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      );
      console.log("📋 Updated appointments:", updated);
      return updated;
    });
  };

  const handleSlotDoubleClick = (slotIndex: number, laneId: string) => {
    console.log("👆 Slot double clicked:", slotIndex, laneId);
    action("onSlotDoubleClick")(slotIndex, laneId);
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      startSlot: slotIndex,
      duration: 2,
      title: `New Meeting`,
      allowOverlap: false,
    };
    console.log("➕ Adding new appointment:", newAppointment);
    const { valid, error } = validateNewAppointment(newAppointment, {
      appointments,
      blockedSlots,
      totalSlots,
      laneId,
    });
    if (!valid) {
      console.error("❌ Cannot add appointment:", error);
      return;
    }
    setAppointments((prev) => {
      const updated = [...prev, newAppointment];
      console.log("📋 All appointments after add:", updated);
      return updated;
    });
  };

  const handleSlotClick = (slotIndex: number, laneId: string) => {
    action("onSlotClick")(slotIndex, laneId);
  };

  // Control button handlers
  const addRandomAppointment = () => {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      startSlot: Math.floor(Math.random() * (totalSlots - 4)),
      duration: Math.floor(Math.random() * 4) + 2,
      title: `Random Meeting`,
      allowOverlap: false,
    };
    console.log("🎯 Adding random appointment:", newAppointment);
    setAppointments((prev) => {
      const updated = [...prev, newAppointment];
      console.log("📋 All appointments after random add:", updated);
      return updated;
    });
  };

  const clearAllAppointments = () => {
    console.log("🗑️ Clearing all appointments");
    setAppointments([]);
  };

  const resetToInitial = () => {
    console.log("🔄 Resetting to initial appointments:", initialAppointments);
    setAppointments(initialAppointments);
  };

  const toggleRandomBlockedSlot = () => {
    const randomSlot = Math.floor(Math.random() * totalSlots);
    setBlockedSlots((prev) =>
      prev.includes(randomSlot)
        ? prev.filter((slot) => slot !== randomSlot)
        : [...prev, randomSlot]
    );
  };

  return (
    <Scheduler onAppointmentMove={handleAppointmentMove}>
      <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        {showControls && (
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={addRandomAppointment}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add Random
            </button>
            <button
              onClick={clearAllAppointments}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
            <button
              onClick={resetToInitial}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              onClick={toggleRandomBlockedSlot}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Toggle Block
            </button>
          </div>
        )}

        {children ? (
          // When used as decorator, render children
          children
        ) : (
          // When used standalone, render Lane with state
          <Lane
            laneId={laneId}
            totalSlots={totalSlots}
            appointments={appointments}
            blockedSlots={blockedSlots}
            config={config}
            onSlotDoubleClick={handleSlotDoubleClick}
            onSlotClick={handleSlotClick}
            onAppointmentChange={handleAppointmentChange}
            renderSlot={renderSlot}
            renderAppointmentContent={renderAppointmentContent}
          />
        )}

        <div style={{ marginTop: "12px", fontSize: "12px", color: "#6b7280" }}>
          💡 Double-click empty slots to create appointments • Drag to move •
          Resize from edges
        </div>

        {showDebugInfo && (
          <div
            style={{
              marginTop: "8px",
              padding: "8px",
              backgroundColor: "#f3f4f6",
              borderRadius: "4px",
              fontSize: "11px",
              fontFamily: "monospace",
            }}
          >
            <strong>Current State:</strong>
            <br />
            Appointments: {appointments.length} | Blocked Slots: [
            {blockedSlots.join(", ")}]
            <br />
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>
    </Scheduler>
  );
};

/**
 * Simplified wrapper that just provides the Scheduler context
 * without any controls or debug info - useful for basic stories
 */
export const SimpleStatefulWrapper: React.FC<{
  children: React.ReactNode;
  onAppointmentMove?: (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number
  ) => void;
}> = ({ children, onAppointmentMove }) => {
  const defaultHandler = (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number
  ) => {
    action("onAppointmentMove")(
      appointment,
      sourceLaneId,
      targetLaneId,
      newStartSlot
    );
  };

  return (
    <Scheduler onAppointmentMove={onAppointmentMove || defaultHandler}>
      <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        {children}
      </div>
    </Scheduler>
  );
};
