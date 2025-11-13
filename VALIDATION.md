# Appointment Validation System

This document describes how to use the appointment validation system in `lane-scheduler-react`.

## Overview

The validation system provides two ways to validate appointments:

1. **Hook `useAppointmentValidation`**: For reactive validation within React components
2. **Pure function `validateNewAppointment`**: For validation without depending on React

Both perform the same validations:
- Initial slot within the allowed range
- Appointment does not exceed the total number of slots
- No blocked slots in the proposed position
- No invalid overlaps with other appointments

## Types

### `ValidationResult`

```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
  conflictingAppointments?: Appointment[];
}
```

## Option 1: Hook `useAppointmentValidation`

### Usage

```typescript
import { useAppointmentValidation } from '@pangeasi/lane-scheduler-react';

const MyComponent = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { validateAppointment, canAddAppointment } = useAppointmentValidation({
    laneId: "lane-1",
    appointments,
    blockedSlots: [3, 4],
    totalSlots: 20
  });

  // Validate a new appointment
  const handleAddAppointment = (newApt: Omit<Appointment, 'id'>) => {
    const result = validateAppointment(newApt);

    if (!result.valid) {
      console.error(result.error); // "The appointment overlaps with an existing one"
      if (result.conflictingAppointments) {
        console.log('Conflicting appointments:', result.conflictingAppointments);
      }
      return;
    }

    // Add the appointment if it's valid
    const appointmentWithId = { ...newApt, id: generateId() };
    setAppointments(prev => [...prev, appointmentWithId]);
  };

  // Quick check (just true/false)
  const handleSlotDoubleClick = (slot: number) => {
    const newApt = { startSlot: slot, duration: 2, title: 'New' };

    if (canAddAppointment(newApt)) {
      handleAddAppointment(newApt);
    } else {
      toast.warning('Cannot create appointment here');
    }
  };

  return (
    <Scheduler>
      <Lane
        laneId="lane-1"
        appointments={appointments}
        onSlotDoubleClick={handleSlotDoubleClick}
        onAppointmentChange={(updated) => {
          const validation = validateAppointment(updated);
          if (!validation.valid) {
            onValidationError?.(validation);
            return;
          }
          setAppointments(prev =>
            prev.map(apt => apt.id === updated.id ? updated : apt)
          );
        }}
      />
    </Scheduler>
  );
};
```

### Hook props

```typescript
interface UseAppointmentValidationProps {
  laneId: string;
  appointments: Appointment[];
  blockedSlots: number[];
  totalSlots: number;
}
```

### Hook return value

```typescript
{
  validateAppointment: (appointment) => ValidationResult,
  canAddAppointment: (appointment) => boolean
}
```

## Option 2: Pure function `validateNewAppointment`

### Usage

```typescript
import { validateNewAppointment } from '@pangeasi/lane-scheduler-react';

const result = validateNewAppointment(
  {
    startSlot: 0,
    duration: 2,
    title: "Nueva cita"
  },
  {
    appointments: existingAppointments,
    blockedSlots: [3, 4],
    totalSlots: 20,
    laneId: "lane-1"
  }
);

if (!result.valid) {
  console.error(result.error);
} else {
  // Proceed
}
```

### When to use this option

- Validate appointments outside of a React component
- In services or utilities
- In Web Workers
- In synchronous validations without the need for reactive dependencies

## Option 3: Validation props on Lane

### Callback `onValidationError`

Executed when there is a validation error in the Lane:

```typescript
<Lane
  laneId="lane-1"
  appointments={appointments}
  onValidationError={(error) => {
    toast.error(error.error);
    if (error.conflictingAppointments) {
      console.log('Conflicts:', error.conflictingAppointments);
    }
  }}
/>
```

### `customValidator`

Allows you to add custom validation logic:

```typescript
const customValidator = (appointment: Appointment): ValidationResult => {
  // Appointments cannot last more than 8 hours (16 slots)
  if (appointment.duration > 16) {
    return {
      valid: false,
      error: 'Appointments cannot last more than 8 hours'
    };
  }

  // Appointments cannot start on odd slots
  if (appointment.startSlot % 2 !== 0) {
    return {
      valid: false,
      error: 'Appointments must start on even slots'
    };
  }

  return { valid: true };
};

<Lane
  laneId="lane-1"
  appointments={appointments}
  customValidator={customValidator}
/>
```

### `strictMode`

When enabled, prevents even the attempt to drag to invalid zones (future):

```typescript
<Lane
  laneId="lane-1"
  appointments={appointments}
  strictMode={true}
/>
```

## Common use cases

### 1. Validate before adding a new appointment

```typescript
const handleAddAppointment = (startSlot: number) => {
  const newApt: Omit<Appointment, 'id'> = {
    startSlot,
    duration: 2,
    title: 'New appointment'
  };

  const validation = validateAppointment(newApt);

  if (!validation.valid) {
    showErrorToast(validation.error);
    return;
  }

  // Proceed to add
};
```

### 2. Validate during drag-and-drop

```typescript
const handleAppointmentChange = (updated: Appointment): boolean => {
  const validation = validateAppointment(updated);

  if (!validation.valid) {
    onValidationError?.(validation);
    return false; // Reject the change
  }

  setAppointments(prev =>
    prev.map(apt => apt.id === updated.id ? updated : apt)
  );
  return true;
};
```

### 3. Show available zones before creating

```typescript
const isSlotAvailable = (slot: number): boolean => {
  return canAddAppointment({
    startSlot: slot,
    duration: 2,
    title: 'Demo'
  });
};

// Use to render available slots visually
<Lane
  renderSlot={(slot, isBlocked) => {
    const isAvailable = isSlotAvailable(slot);
    return (
      <div className={isAvailable ? 'bg-green-100' : 'bg-gray-100'}>
        {slot}
      </div>
    );
  }}
/>
```

### 4. Allow selected overlaps

```typescript
const appointment: Appointment = {
  id: "1",
  startSlot: 0,
  duration: 2,
  title: "Appointment with allowed overlap",
  allowOverlap: true // Allows overlapping with other appointments
};

// The validator will not reject overlaps if allowOverlap is true
const result = validateAppointment(appointment);
```

## Error messages

The system provides descriptive error messages:

| Situation | Error |
|-----------|-------|
| Initial slot out of range | "The initial slot is out of the allowed range" |
| Appointment exceeds total slots | "The appointment exceeds the total number of slots" |
| Blocked slot | "Slot {N} is blocked" |
| Invalid overlap | "The appointment overlaps with an existing one" |

## Handling blocked slots

If an appointment has an `onBlockedSlot` callback, it can decide whether to allow the use of that slot:

```typescript
const appointment: Appointment = {
  id: "1",
  startSlot: 0,
  duration: 2,
  title: "Special appointment",
  onBlockedSlot: (slotIndex, laneId) => {
    // Return true to allow, false to reject
    // For example: only allow in the "special" lane
    return laneId === "special";
  }
};
```

## Integration with global state

If you use Redux, Zustand or another state manager:

```typescript
// In your store/slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: [],
  reducers: {
    addAppointment: (state, action) => {
      const validation = validateNewAppointment(
        action.payload,
        {
          appointments: state,
          blockedSlots: selectBlockedSlots(store.getState()),
          totalSlots: selectTotalSlots(store.getState()),
          laneId: action.payload.laneId
        }
      );

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      state.push({ ...action.payload, id: generateId() });
    }
  }
});
```

## Testing

### With vitest/jest

```typescript
import { validateNewAppointment } from '@pangeasi/lane-scheduler-react';

describe('Appointment validation', () => {
  it('rejects appointments out of range', () => {
    const result = validateNewAppointment(
      { startSlot: 25, duration: 2 },
      { appointments: [], blockedSlots: [], totalSlots: 20, laneId: 'test' }
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('out of the allowed range');
  });

  it('accepts valid appointments', () => {
    const result = validateNewAppointment(
      { startSlot: 0, duration: 2 },
      { appointments: [], blockedSlots: [], totalSlots: 20, laneId: 'test' }
    );

    expect(result.valid).toBe(true);
  });

  it('rejects appointments that overlap', () => {
    const existing: Appointment[] = [
      { id: '1', startSlot: 0, duration: 2 }
    ];

    const result = validateNewAppointment(
      { startSlot: 1, duration: 2 },
      { appointments: existing, blockedSlots: [], totalSlots: 20, laneId: 'test' }
    );

    expect(result.valid).toBe(false);
    expect(result.conflictingAppointments).toHaveLength(1);
  });
});
```

## Performance

- The hook uses `useCallback` with precise dependencies to avoid unnecessary re-renders
- The pure function is O(n) where n is the number of existing appointments
- Validations are executed in short-circuit mode (fail-fast)

## Changelog

### v1.2.0
- ✨ Added appointment validation system with hook and pure function
- ✨ New props on Lane: `onValidationError`, `customValidator`, `strictMode`
- 📝 Complete documentation with examples

## Contributing

If you find uncovered use cases or possible improvements, open an issue on GitHub.
