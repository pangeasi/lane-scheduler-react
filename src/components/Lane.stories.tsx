import type { Meta, StoryObj } from "@storybook/react";
import { Lane } from "./Lane";
import type { Appointment } from "../types";
import { action } from "storybook/actions";
import { StatefulLaneWrapper } from "../../.storybook/story-utils";
import {
  defaultSampleAppointments as sampleAppointments,
  vipAppointments,
  extendedSampleAppointments,
  type ExtendedAppointment,
} from "../../.storybook/story-constants";

// The StatefulLaneWrapper is now imported from .storybook/story-utils.tsx

const meta: Meta<typeof Lane> = {
  title: "Components/Lane",
  component: Lane,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Lane** component represents a single scheduling lane that can contain appointments. 
It supports drag & drop, resizing, blocked slots, and custom rendering.

## Features
- 🎯 **Drag & Drop** - Move appointments within and between lanes
- 📏 **Resizable** - Adjust appointment duration from both ends  
- 🔒 **Blocked Slots** - Define unavailable time slots
- 🎨 **Custom Rendering** - Full control over slot and appointment appearance
- 📱 **Touch Support** - Works on mobile devices
- ⚡ **TypeScript** - Full type safety

## Usage
The Lane component should be wrapped in a Scheduler component to enable drag & drop between lanes.
        `,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // For interactive stories that override the decorator, use their own render
      if (
        context.story === "Interactive" ||
        context.story === "Interactive Custom Setup" ||
        context.story === "Interactive with Custom Rendering" ||
        context.story === "Interactive Minimal" ||
        context.story === "Interactive VIP"
      ) {
        return <Story />;
      }

      // For basic stories, wrap with StatefulLaneWrapper using the story's args
      return (
        <StatefulLaneWrapper
          initialAppointments={context.args.appointments || sampleAppointments}
          initialBlockedSlots={context.args.blockedSlots || [0, 1, 22, 23]}
          showControls={false}
          showDebugInfo={false}
          {...context.args}
        />
      );
    },
  ],
  argTypes: {
    laneId: {
      description: "Unique identifier for the lane",
    },
    totalSlots: {
      description: "Total number of time slots",
    },
    appointments: {
      description: "Array of appointments to display",
    },
    blockedSlots: {
      description: "Array of blocked slot indices",
    },
    config: {
      description: "Visual configuration options",
    },
    onSlotDoubleClick: {
      description: "Callback when a slot is double-clicked",
    },
    onSlotClick: {
      description: "Callback when a slot is clicked",
    },
    onAppointmentChange: {
      description: "Callback when an appointment is modified",
    },
  },
  args: {
    laneId: "demo-lane",
    totalSlots: 24,
    appointments: sampleAppointments,
    blockedSlots: [0, 1, 22, 23],
    config: {
      height: 80,
      slotWidth: 60,
    },
    onSlotDoubleClick: action("onSlotDoubleClick"),
    onSlotClick: action("onSlotClick"),
    onAppointmentChange: action("onAppointmentChange"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Lane story
export const Default: Story = {
  name: "Default Lane",
  parameters: {
    docs: {
      description: {
        story:
          "A basic lane with appointments, blocked slots, and default styling.",
      },
    },
  },
};

// Empty Lane
export const Empty: Story = {
  name: "Empty Lane",
  args: {
    appointments: [],
    blockedSlots: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "An empty lane with no appointments or blocked slots. Double-click to create appointments.",
      },
    },
  },
};

// Lane with many appointments
export const Busy: Story = {
  name: "Busy Lane",
  args: {
    appointments: [
      { id: "1", startSlot: 2, duration: 2, title: "Morning Standup" },
      { id: "2", startSlot: 5, duration: 3, title: "Design Review" },
      { id: "3", startSlot: 9, duration: 1, title: "Quick Call" },
      { id: "4", startSlot: 11, duration: 4, title: "Client Meeting" },
      { id: "5", startSlot: 16, duration: 2, title: "Team Sync" },
      { id: "6", startSlot: 19, duration: 3, title: "Project Planning" },
    ],
    blockedSlots: [0, 1, 22, 23],
  },
  parameters: {
    docs: {
      description: {
        story: "A busy lane with multiple appointments throughout the day.",
      },
    },
  },
};

// Lane with overlapping appointments
export const WithOverlaps: Story = {
  name: "Overlapping Appointments",
  args: {
    appointments: [
      {
        id: "1",
        startSlot: 4,
        duration: 6,
        title: "Main Meeting",
        allowOverlap: true,
      },
      {
        id: "2",
        startSlot: 6,
        duration: 4,
        title: "Overlapping Call",
        allowOverlap: true,
      },
      {
        id: "3",
        startSlot: 8,
        duration: 2,
        title: "Quick Check-in",
        allowOverlap: true,
      },
    ],
    blockedSlots: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Appointments that can overlap with each other (allowOverlap: true).",
      },
    },
  },
};

// Lane with locked appointments
export const WithLockedAppointments: Story = {
  name: "Locked Appointments",
  args: {
    appointments: [
      { id: "1", startSlot: 2, duration: 3, title: "Editable Meeting" },
      {
        id: "2",
        startSlot: 8,
        duration: 4,
        title: "Locked Meeting",
        locked: true,
      },
      { id: "3", startSlot: 16, duration: 2, title: "Another Editable" },
    ],
    blockedSlots: [0, 22, 23],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Some appointments are locked and cannot be moved or resized (shown with padlock icon).",
      },
    },
  },
};

// Lane with VIP appointments that can override blocked slots
export const WithVIPAppointments: Story = {
  name: "VIP Appointments",
  args: {
    appointments: vipAppointments,
    blockedSlots: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  parameters: {
    docs: {
      description: {
        story:
          "VIP appointments can be placed on blocked slots using the onBlockedSlot callback.",
      },
    },
  },
};

// Custom sized lane
export const CustomSize: Story = {
  name: "Custom Size",
  args: {
    config: {
      height: 120,
      slotWidth: 80,
    },
    totalSlots: 12,
    appointments: [
      { id: "1", startSlot: 2, duration: 3, title: "Morning Session" },
      { id: "2", startSlot: 7, duration: 2, title: "Afternoon Break" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Lane with custom height and slot width, showing fewer total slots.",
      },
    },
  },
};

// Lane with custom slot rendering
export const CustomSlotRendering: Story = {
  name: "Custom Slot Rendering",
  args: {
    renderSlot: (slotIndex: number, isBlocked: boolean) => {
      const hour = Math.floor(slotIndex / 2);
      const isHalfHour = slotIndex % 2 === 1;

      if (isBlocked) {
        return (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {isHalfHour ? ":30" : `${hour}:00`}
          </div>
        );
      }

      return (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isHalfHour ? "#f3f4f6" : "#ffffff",
            border: "1px solid #e5e7eb",
            fontSize: "12px",
            color: isHalfHour ? "#6b7280" : "#374151",
            fontWeight: isHalfHour ? "normal" : "bold",
          }}
        >
          {isHalfHour ? ":30" : `${hour}:00`}
        </div>
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Custom slot rendering showing hours and half-hours with different styling.",
      },
    },
  },
};

// Lane with custom appointment content
export const CustomAppointmentContent: Story = {
  name: "Custom Appointment Content",
  args: {
    appointments: extendedSampleAppointments,
    renderAppointmentContent: (appointment: Appointment) => {
      const extAppt = appointment as ExtendedAppointment;
      return (
        <div style={{ padding: "8px", height: "100%", overflow: "hidden" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            {appointment.title}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            📍 {extAppt.location}
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            👥 {extAppt.attendees?.join(", ")}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: extAppt.priority === "high" ? "#dc2626" : "#59a848",
              fontWeight: "bold",
              marginTop: "2px",
            }}
          >
            {extAppt.priority?.toUpperCase()} PRIORITY
          </div>
        </div>
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Custom appointment content rendering with additional information like location, attendees, and priority.",
      },
    },
  },
};

// Compact lane for mobile
export const Mobile: Story = {
  name: "Mobile Layout",
  args: {
    config: {
      height: 60,
      slotWidth: 40,
    },
    totalSlots: 24,
    appointments: [
      { id: "1", startSlot: 4, duration: 4, title: "Meeting" },
      { id: "2", startSlot: 10, duration: 2, title: "Call" },
      { id: "3", startSlot: 16, duration: 6, title: "Workshop" },
    ],
    renderAppointmentContent: (appointment: Appointment) => (
      <div
        style={{
          padding: "4px",
          fontSize: "10px",
          fontWeight: "bold",
          textAlign: "center",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {appointment.title}
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Compact lane configuration suitable for mobile devices with smaller slots and simplified content.",
      },
    },
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
