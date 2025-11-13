import type { Appointment } from "../src/types";

// Default sample appointments for stories
export const defaultSampleAppointments: Appointment[] = [
  {
    id: "meeting-1",
    startSlot: 4,
    duration: 6,
    title: "Team Meeting",
    allowOverlap: false,
  },
  {
    id: "call-1",
    startSlot: 12,
    duration: 4,
    title: "Client Call",
    allowOverlap: true,
  },
  {
    id: "lunch-1",
    startSlot: 20,
    duration: 4,
    title: "Lunch Break",
    locked: true,
  },
];

// VIP appointments for special stories
export const vipAppointments: Appointment[] = [
  {
    id: "vip-1",
    startSlot: 14,
    duration: 6,
    title: "VIP Meeting (can override blocked slots)",
    allowOverlap: false,
    onBlockedSlot: (slotIndex, laneId) => {
      console.log(`VIP appointment on blocked slot ${slotIndex} in ${laneId}`);
      return true; // Allow VIP appointments on blocked slots
    },
  },
];

// Extended appointment type for stories with custom properties
export interface ExtendedAppointment extends Appointment {
  attendees?: string[];
  priority?: "low" | "medium" | "high";
  location?: string;
}

// Sample extended appointments
export const extendedSampleAppointments: ExtendedAppointment[] = [
  {
    id: "1",
    startSlot: 4,
    duration: 6,
    title: "Design Review",
    attendees: ["John", "Sarah", "Mike"],
    priority: "high",
    location: "Conference Room A",
  },
  {
    id: "2",
    startSlot: 12,
    duration: 4,
    title: "Client Call",
    attendees: ["Alice", "Bob"],
    priority: "medium",
    location: "Online",
  },
];
