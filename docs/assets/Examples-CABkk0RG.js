import{j as n}from"./storybook-Bou6zQpf.js";import{useMDXComponents as i}from"./index-CxX9bOV-.js";import"./vendor-OvXVS5lI.js";function o(t){const e={code:"code",h1:"h1",h2:"h2",pre:"pre",...i(),...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{id:"usage-examples",children:"Usage Examples"}),`
`,n.jsx(e.h2,{id:"basic-setup",children:"Basic Setup"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Scheduler, Lane } from "@pangeasi/lane-scheduler-react";
import "@pangeasi/lane-scheduler-react/styles.css";

function MyScheduler() {
  const appointments = [
    {
      id: "1",
      startSlot: 4,
      duration: 6,
      title: "Team Meeting",
      allowOverlap: false,
    },
  ];

  const handleMove = (apt, sourceLane, targetLane, newSlot) => {
    console.log("Appointment moved:", apt, sourceLane, targetLane, newSlot);
  };

  return (
    <Scheduler onAppointmentMove={handleMove}>
      <Lane
        laneId="room-1"
        appointments={appointments}
        totalSlots={24}
        config={{ height: 80, slotWidth: 60 }}
      />
    </Scheduler>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"multi-lane-setup",children:"Multi-Lane Setup"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function MultiRoomScheduler() {
  const [rooms, setRooms] = useState([
    {
      id: 'room-a',
      name: 'Conference Room A',
      appointments: [...],
      blockedSlots: [0, 1, 22, 23]
    },
    {
      id: 'room-b',
      name: 'Conference Room B',
      appointments: [...],
      blockedSlots: [12, 13]
    }
  ]);

  const handleAppointmentMove = (appointment, sourceLaneId, targetLaneId, newStartSlot) => {
    // Update your state to move appointment between rooms
    setRooms(prev => {
      // Remove from source room
      // Add to target room with new start slot
    });
  };

  return (
    <Scheduler onAppointmentMove={handleAppointmentMove}>
      {rooms.map(room => (
        <div key={room.id}>
          <h3>{room.name}</h3>
          <Lane
            laneId={room.id}
            appointments={room.appointments}
            blockedSlots={room.blockedSlots}
            totalSlots={24}
            config={{ height: 80, slotWidth: 60 }}
          />
        </div>
      ))}
    </Scheduler>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"custom-slot-rendering",children:"Custom Slot Rendering"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function TimeSlotScheduler() {
  const renderHourSlots = (slotIndex, isBlocked) => {
    const hour = Math.floor(slotIndex / 2);
    const isHalfHour = slotIndex % 2 === 1;

    return (
      <div className={\`slot \${isBlocked ? "blocked" : ""}\`}>
        {isHalfHour ? ":30" : \`\${hour}:00\`}
      </div>
    );
  };

  return (
    <Scheduler onAppointmentMove={handleMove}>
      <Lane
        laneId="timeline"
        appointments={appointments}
        totalSlots={48} // 24 hours with 30-min slots
        renderSlot={renderHourSlots}
      />
    </Scheduler>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"custom-appointment-content",children:"Custom Appointment Content"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function DetailedScheduler() {
  const renderAppointment = (appointment) => (
    <div className="appointment-details">
      <div className="title">{appointment.title}</div>
      <div className="time">
        {appointment.startSlot}:00 -{" "}
        {appointment.startSlot + appointment.duration}:00
      </div>
      <div className="attendees">👥 {appointment.attendees?.join(", ")}</div>
    </div>
  );

  return (
    <Scheduler onAppointmentMove={handleMove}>
      <Lane
        laneId="detailed"
        appointments={appointments}
        renderAppointmentContent={renderAppointment}
      />
    </Scheduler>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"blocked-slots-with-custom-logic",children:"Blocked Slots with Custom Logic"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function VIPScheduler() {
  const vipAppointments = [
    {
      id: 'vip-1',
      startSlot: 10,
      duration: 4,
      title: 'VIP Client Meeting',
      onBlockedSlot: (slotIndex, laneId) => {
        console.log(\\\`VIP appointment can use blocked slot \\\${slotIndex}\\\`);
        return true; // Allow VIP appointments on blocked slots
      }
    }
  ];

  return (
    <Scheduler onAppointmentMove={handleMove}>
      <Lane
        laneId="vip-room"
        appointments={vipAppointments}
        blockedSlots={[8, 9, 10, 11, 12, 13]} // Lunch time blocked
      />
    </Scheduler>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"event-handling",children:"Event Handling"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function InteractiveScheduler() {
  const handleSlotDoubleClick = (slotIndex, laneId) => {
    const newAppointment = {
      id: \\\`apt-\\\${Date.now()}\\\`,
      startSlot: slotIndex,
      duration: 2,
      title: 'New Meeting',
      allowOverlap: false
    };

    // Add to your appointments state
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleAppointmentChange = (updatedAppointment) => {
    // Handle appointment resize/modification
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
  };

  return (
    <Scheduler onAppointmentMove={handleMove}>
      <Lane
        laneId="interactive"
        appointments={appointments}
        onSlotDoubleClick={handleSlotDoubleClick}
        onAppointmentChange={handleAppointmentChange}
      />
    </Scheduler>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"mobile-optimized-layout",children:"Mobile-Optimized Layout"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function MobileScheduler() {
  return (
    <Scheduler onAppointmentMove={handleMove}>
      <Lane
        laneId="mobile"
        appointments={appointments}
        config={{
          height: 60, // Smaller height
          slotWidth: 40, // Smaller slots
        }}
        renderAppointmentContent={(apt) => (
          <div className="mobile-appointment">{apt.title}</div>
        )}
      />
    </Scheduler>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"configuration-options",children:"Configuration Options"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const laneConfig = {
  height: 100, // Lane height in pixels
  slotWidth: 80, // Width of each time slot
  slotColor: "#ffffff", // Background color for slots
  slotBorderColor: "#e5e7eb", // Border color for slots
  snapThreshold: 0.5, // Snap sensitivity (0-1)
};

<Lane laneId="configured" appointments={appointments} config={laneConfig} />;
`})}),`
`,n.jsx(e.h2,{id:"typescript-usage",children:"TypeScript Usage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import type {
  Appointment,
  LaneConfig,
  LaneProps,
  SchedulerProps,
} from "@pangeasi/lane-scheduler-react";

interface MyAppointment extends Appointment {
  attendees: string[];
  priority: "low" | "medium" | "high";
  location: string;
}

const MyScheduler: React.FC<{
  appointments: MyAppointment[];
  config: LaneConfig;
}> = ({ appointments, config }) => {
  // Fully typed component
};
`})})]})}function r(t={}){const{wrapper:e}={...i(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(o,{...t})}):o(t)}export{r as default};
