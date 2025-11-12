# Lane Scheduler

A flexible, drag-and-drop scheduler component for React with full TypeScript support.

## Features

- 🎯 **Drag & Drop** - Move appointments between lanes with smooth animations
- 📏 **Resizable** - Adjust appointment duration from both ends
- 🔒 **Locked Slots** - Block specific time slots with custom logic
- 🎨 **Customizable** - Full control over rendering with render props
- 📱 **Mobile Ready** - Touch events support
- ⚡ **TypeScript** - Full type safety
- 🪶 **Lightweight** - No dependencies except React

## Installation

```bash
npm install @your-username/lane-scheduler
```

## Basic Usage

```tsx
import { Scheduler, Lane } from "@your-username/lane-scheduler";
import "@your-username/lane-scheduler/dist/style.css";

function App() {
  const [appointments, setAppointments] = useState([
    { id: "1", startSlot: 2, duration: 3, title: "Meeting" },
  ]);

  const handleMove = (apt, sourceLane, targetLane, newSlot) => {
    // Handle appointment move
  };

  return (
    <Scheduler onAppointmentMove={handleMove}>
      <Lane
        laneId="room-1"
        appointments={appointments}
        totalSlots={24}
        config={{
          height: 80,
          slotWidth: 60,
        }}
      />
    </Scheduler>
  );
}
```

## Props

### Scheduler

| Prop                | Type        | Description                     |
| ------------------- | ----------- | ------------------------------- |
| `children`          | `ReactNode` | Lane components                 |
| `onAppointmentMove` | `function`  | Callback when appointment moves |

### Lane

| Prop                       | Type            | Default  | Description                |
| -------------------------- | --------------- | -------- | -------------------------- |
| `laneId`                   | `string`        | required | Unique identifier          |
| `appointments`             | `Appointment[]` | `[]`     | Array of appointments      |
| `blockedSlots`             | `number[]`      | `[]`     | Blocked slot indices       |
| `totalSlots`               | `number`        | `24`     | Total number of slots      |
| `config`                   | `LaneConfig`    | `{}`     | Visual configuration       |
| `renderSlot`               | `function`      | -        | Custom slot renderer       |
| `renderAppointmentContent` | `function`      | -        | Custom appointment content |
| `onSlotDoubleClick`        | `function`      | -        | Slot double-click handler  |
| `onAppointmentChange`      | `function`      | -        | Appointment change handler |

## Advanced Usage

### Custom Slot Rendering

```tsx
<Lane
  renderSlot={(slotIdx, isBlocked) => (
    <div>{slotIdx % 2 === 0 ? `${slotIdx / 2}:00` : ":30"}</div>
  )}
/>
```

### Blocked Slots with Custom Logic

```tsx
const vipAppointment = {
  id: "1",
  startSlot: 5,
  duration: 2,
  onBlockedSlot: (slotIndex, laneId) => {
    // Return true to allow VIP appointments on blocked slots
    return true;
  },
};
```

### Styling

The component uses Tailwind CSS internally. To customize colors:

```tsx
<Lane
  config={{
    slotColor: "#f9fafb",
    slotBorderColor: "#e5e7eb",
    height: 100,
    slotWidth: 80,
  }}
/>
```

## TypeScript

Full TypeScript support included:

```typescript
import type {
  Appointment,
  LaneConfig,
  LaneProps,
} from "@your-username/lane-scheduler";
```

## License

MIT
