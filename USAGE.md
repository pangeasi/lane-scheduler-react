# Lane Scheduler React - Usage Examples

## Installation

```bash
npm install @pangeasi/lane-scheduler-react
# or
yarn add @pangeasi/lane-scheduler-react
```

## Peer Dependencies

Make sure you have React 18+ installed:

```bash
npm install react react-dom
```

## Basic Usage

```tsx
import React, { useState } from "react";
import { Scheduler, Lane } from "@pangeasi/lane-scheduler-react";
import "@pangeasi/lane-scheduler-react/styles.css";
import type { Appointment } from "@pangeasi/lane-scheduler-react";

function MyScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      startSlot: 2,
      duration: 3,
      title: "Meeting with client",
      allowOverlap: false,
    },
    {
      id: "2",
      startSlot: 8,
      duration: 2,
      title: "Team standup",
      allowOverlap: false,
    },
  ]);

  const handleAppointmentMove = (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number
  ) => {
    console.log("Appointment moved:", {
      appointment,
      from: sourceLaneId,
      to: targetLaneId,
      newSlot: newStartSlot,
    });

    // Update your state here
  };

  return (
    <Scheduler onAppointmentMove={handleAppointmentMove}>
      <Lane
        laneId="room-1"
        appointments={appointments}
        totalSlots={24}
        config={{
          height: 80,
          slotWidth: 60,
          blockedSlots: [0, 1, 22, 23], // Block first 2 and last 2 slots
        }}
        renderAppointmentContent={(apt) => (
          <div className="p-2">
            <div className="font-semibold">{apt.title}</div>
            <div className="text-sm opacity-75">
              {apt.startSlot}:00 - {apt.startSlot + apt.duration}:00
            </div>
          </div>
        )}
        onAppointmentChange={(updatedAppointment) => {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === updatedAppointment.id ? updatedAppointment : apt
            )
          );
        }}
      />
    </Scheduler>
  );
}

export default MyScheduler;
```

## Custom Styling

The component uses Tailwind CSS classes. You can override them or provide your own styles:

```tsx
<Lane
  config={{
    height: 100,
    slotWidth: 80,
    className: "my-custom-lane",
  }}
  renderSlot={(slotIndex, isBlocked) => (
    <div
      className={`
        border border-gray-200 
        ${isBlocked ? "bg-red-100" : "bg-white hover:bg-gray-50"}
      `}
    >
      {slotIndex}:00
    </div>
  )}
/>
```

## TypeScript Support

The library comes with full TypeScript definitions:

```tsx
import type {
  Appointment,
  LaneConfig,
  LaneProps,
  SchedulerProps,
} from "@pangeasi/lane-scheduler-react"; // Your strongly typed components
const MyComponent: React.FC<{
  appointments: Appointment[];
  config: LaneConfig;
}> = ({ appointments, config }) => {
  // ...
};
```
