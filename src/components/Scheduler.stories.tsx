import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Scheduler } from "./Scheduler";
import { Lane } from "./Lane";
import type { Appointment } from "../types";
import { action } from "storybook/actions";

// Sample data for multi-lane scenarios
interface LaneData {
  id: string;
  name: string;
  appointments: Appointment[];
  blockedSlots: number[];
}

const initialLanes: LaneData[] = [
  {
    id: "room-1",
    name: "Conference Room A",
    appointments: [
      {
        id: "apt-1",
        startSlot: 4,
        duration: 6,
        title: "Team Meeting",
        allowOverlap: false,
      },
      {
        id: "apt-2",
        startSlot: 12,
        duration: 4,
        title: "Client Call",
        allowOverlap: true,
      },
    ],
    blockedSlots: [0, 1, 22, 23],
  },
  {
    id: "room-2",
    name: "Conference Room B",
    appointments: [
      {
        id: "apt-3",
        startSlot: 6,
        duration: 4,
        title: "Design Review",
        allowOverlap: false,
      },
      {
        id: "apt-4",
        startSlot: 14,
        duration: 6,
        title: "Workshop",
        allowOverlap: false,
      },
    ],
    blockedSlots: [10, 11],
  },
  {
    id: "room-3",
    name: "Meeting Room C",
    appointments: [
      {
        id: "apt-5",
        startSlot: 8,
        duration: 2,
        title: "Quick Standup",
        allowOverlap: false,
      },
      {
        id: "apt-6",
        startSlot: 16,
        duration: 4,
        title: "Planning Session",
        locked: true,
      },
    ],
    blockedSlots: [2, 3, 20, 21],
  },
];

// Interactive Scheduler Story Component
const InteractiveScheduler = () => {
  const [lanes, setLanes] = useState<LaneData[]>(initialLanes);

  const handleAppointmentMove = (
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

    setLanes((prev) => {
      // If moving within same lane
      if (sourceLaneId === targetLaneId) {
        return prev.map((lane) => {
          if (lane.id === sourceLaneId) {
            return {
              ...lane,
              appointments: lane.appointments.map((apt) =>
                apt.id === appointment.id
                  ? { ...apt, startSlot: newStartSlot }
                  : apt
              ),
            };
          }
          return lane;
        });
      }

      // If moving between different lanes
      return prev.map((lane) => {
        // Remove from source lane
        if (lane.id === sourceLaneId) {
          return {
            ...lane,
            appointments: lane.appointments.filter(
              (apt) => apt.id !== appointment.id
            ),
          };
        }
        // Add to target lane
        if (lane.id === targetLaneId) {
          return {
            ...lane,
            appointments: [
              ...lane.appointments,
              { ...appointment, startSlot: newStartSlot },
            ],
          };
        }
        return lane;
      });
    });
  };

  const handleAppointmentChange = (
    laneId: string,
    updatedAppointment: Appointment
  ) => {
    action("onAppointmentChange")(laneId, updatedAppointment);
    setLanes((prev) =>
      prev.map((lane) => {
        if (lane.id === laneId) {
          return {
            ...lane,
            appointments: lane.appointments.map((apt) =>
              apt.id === updatedAppointment.id ? updatedAppointment : apt
            ),
          };
        }
        return lane;
      })
    );
  };

  const handleSlotDoubleClick = (slotIdx: number, laneId: string) => {
    action("onSlotDoubleClick")(slotIdx, laneId);
    const newAppointment = {
      id: `apt-${Date.now()}`,
      startSlot: slotIdx,
      duration: 2,
      title: `New Meeting`,
      allowOverlap: false,
    };

    setLanes((prev) =>
      prev.map((lane) =>
        lane.id === laneId
          ? { ...lane, appointments: [...lane.appointments, newAppointment] }
          : lane
      )
    );
  };

  const renderSlotWithHours = (slotIdx: number, isBlocked: boolean) => {
    const isHourMark = slotIdx % 2 === 0;
    const hour = Math.floor(slotIdx / 2);

    if (isBlocked) {
      return (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            fontSize: "10px",
          }}
        >
          {isHourMark ? (
            <span style={{ fontWeight: "bold" }}>{hour}:00</span>
          ) : (
            <span>:30</span>
          )}
        </div>
      );
    }

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          fontSize: "10px",
        }}
      >
        {isHourMark ? (
          <span style={{ fontWeight: "bold", color: "#374151" }}>
            {hour}:00
          </span>
        ) : (
          <span style={{ color: "#6b7280" }}>:30</span>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Multi-Lane Scheduler Demo
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          🎯 Drag appointments between lanes, resize them, or double-click to
          create new ones
        </p>

        <Scheduler onAppointmentMove={handleAppointmentMove}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {lanes.map((lane) => (
              <div
                key={lane.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  {lane.name}
                </h3>
                <Lane
                  laneId={lane.id}
                  appointments={lane.appointments}
                  blockedSlots={lane.blockedSlots}
                  totalSlots={24}
                  config={{
                    height: 80,
                    slotWidth: 60,
                  }}
                  renderSlot={renderSlotWithHours}
                  onSlotDoubleClick={handleSlotDoubleClick}
                  onAppointmentChange={(apt) =>
                    handleAppointmentChange(lane.id, apt)
                  }
                />
              </div>
            ))}
          </div>
        </Scheduler>
      </div>
    </div>
  );
};

const meta: Meta<typeof Scheduler> = {
  title: "Components/Scheduler",
  component: Scheduler,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **Scheduler** component provides the context and coordination for drag & drop operations between multiple lanes.
It manages the global drag state and enables appointments to be moved between different lanes.

## Features
- 🔄 **Drag & Drop Context** - Coordinates drag operations between lanes
- 🎯 **Cross-Lane Movement** - Move appointments between different lanes
- 🔒 **State Management** - Handles drag and resize states globally
- ⚡ **Event Coordination** - Provides callbacks for appointment movements

## Usage
Wrap your Lane components with the Scheduler component and provide an \`onAppointmentMove\` callback
to handle appointments being moved between lanes.
        `,
      },
    },
  },
  argTypes: {
    onAppointmentMove: {
      description: "Callback when an appointment is moved between lanes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive multi-lane scheduler
export const MultiLane: Story = {
  name: "Multi-Lane Interactive",
  render: () => <InteractiveScheduler />,
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive scheduler with multiple lanes. Try dragging appointments between different rooms, resizing them, and creating new ones by double-clicking empty slots.",
      },
    },
  },
};

// Simple two-lane example
export const TwoLanes: Story = {
  name: "Two Lanes Example",
  render: () => (
    <Scheduler onAppointmentMove={action("onAppointmentMove")}>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <h3
            style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}
          >
            Room A
          </h3>
          <Lane
            laneId="room-a"
            appointments={[
              { id: "1", startSlot: 4, duration: 4, title: "Morning Meeting" },
              { id: "2", startSlot: 10, duration: 6, title: "Workshop" },
            ]}
            blockedSlots={[0, 1, 22, 23]}
            totalSlots={24}
            config={{ height: 80, slotWidth: 50 }}
          />
        </div>
        <div>
          <h3
            style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "600" }}
          >
            Room B
          </h3>
          <Lane
            laneId="room-b"
            appointments={[
              { id: "3", startSlot: 6, duration: 3, title: "Team Sync" },
              { id: "4", startSlot: 14, duration: 4, title: "Client Call" },
            ]}
            blockedSlots={[12, 13, 20, 21]}
            totalSlots={24}
            config={{ height: 80, slotWidth: 50 }}
          />
        </div>
      </div>
    </Scheduler>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A simple two-lane scheduler setup. Appointments can be dragged between the two rooms.",
      },
    },
  },
};

// Minimal single lane in scheduler context
export const SingleLane: Story = {
  name: "Single Lane",
  render: () => (
    <Scheduler onAppointmentMove={action("onAppointmentMove")}>
      <div style={{ padding: "20px" }}>
        <h3
          style={{ marginBottom: "12px", fontSize: "18px", fontWeight: "600" }}
        >
          Conference Room
        </h3>
        <Lane
          laneId="single-room"
          appointments={[
            { id: "1", startSlot: 8, duration: 4, title: "Team Meeting" },
            { id: "2", startSlot: 14, duration: 3, title: "Client Call" },
            {
              id: "3",
              startSlot: 19,
              duration: 2,
              title: "Wrap-up",
              locked: true,
            },
          ]}
          blockedSlots={[0, 1, 2, 22, 23]}
          totalSlots={24}
          config={{ height: 100, slotWidth: 60 }}
        />
      </div>
    </Scheduler>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A single lane wrapped in a Scheduler context. Even with one lane, the Scheduler provides drag & drop functionality.",
      },
    },
  },
};

export const MultipleLanesConsecutive: Story = {
  name: "Multiple Lanes Consecutive",
  render: () => (
    <Scheduler onAppointmentMove={action("onAppointmentMove")}>
      <div>
        {[1, 2, 3, 4].map((num) => (
          <div key={num}>
            <Lane
              laneId={`lane-${num}`}
              appointments={[
                {
                  id: `${num}-1`,
                  startSlot: 4 + num * 2,
                  duration: 4,
                  title: `Appointment ${num}-1`,
                },
                {
                  id: `${num}-2`,
                  startSlot: 12 + num,
                  duration: 6,
                  title: `Appointment ${num}-2`,
                },
              ]}
              blockedSlots={[0, 1, 22, 23]}
              totalSlots={24}
              config={{ height: 80, slotWidth: 50 }}
            />
          </div>
        ))}
      </div>
    </Scheduler>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A scheduler with multiple consecutive lanes. Appointments can be dragged between any of the lanes.",
      },
    },
  },
};
