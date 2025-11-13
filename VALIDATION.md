# Sistema de Validación de Citas

Este documento describe cómo utilizar el sistema de validación de citas en `lane-scheduler-react`.

## Descripción general

El sistema de validación proporciona dos formas de validar appointments:

1. **Hook `useAppointmentValidation`**: Para validación reactiva dentro de componentes React
2. **Función pura `validateNewAppointment`**: Para validación sin depender de React

Ambas realizan las mismas validaciones:
- Slot inicial dentro del rango permitido
- Cita no excede el número total de slots
- No hay slots bloqueados en la posición propuesta
- No hay solapamientos inválidos con otras citas

## Tipos

### `ValidationResult`

```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
  conflictingAppointments?: Appointment[];
}
```

## Opción 1: Hook `useAppointmentValidation`

### Uso

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

  // Validar una nueva cita
  const handleAddAppointment = (newApt: Omit<Appointment, 'id'>) => {
    const result = validateAppointment(newApt);

    if (!result.valid) {
      console.error(result.error); // "La cita se solapa con otra existente"
      if (result.conflictingAppointments) {
        console.log('Citas en conflicto:', result.conflictingAppointments);
      }
      return;
    }

    // Añadir la cita si es válida
    const appointmentWithId = { ...newApt, id: generateId() };
    setAppointments(prev => [...prev, appointmentWithId]);
  };

  // Verificación rápida (solo true/false)
  const handleSlotDoubleClick = (slot: number) => {
    const newApt = { startSlot: slot, duration: 2, title: 'Nueva' };

    if (canAddAppointment(newApt)) {
      handleAddAppointment(newApt);
    } else {
      toast.warning('No se puede crear la cita aquí');
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

### Props del hook

```typescript
interface UseAppointmentValidationProps {
  laneId: string;
  appointments: Appointment[];
  blockedSlots: number[];
  totalSlots: number;
}
```

### Retorno del hook

```typescript
{
  validateAppointment: (appointment) => ValidationResult,
  canAddAppointment: (appointment) => boolean
}
```

## Opción 2: Función pura `validateNewAppointment`

### Uso

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
  // Proceder
}
```

### Cuando usar esta opción

- Validar citas fuera de un componente React
- En servicios o utilidades
- En Web Workers
- En validaciones síncronas sin necesidad de reactive dependencies

## Opción 3: Props de validación en Lane

### Callback `onValidationError`

Se ejecuta cuando hay un error de validación en el Lane:

```typescript
<Lane
  laneId="lane-1"
  appointments={appointments}
  onValidationError={(error) => {
    toast.error(error.error);
    if (error.conflictingAppointments) {
      console.log('Conflictos:', error.conflictingAppointments);
    }
  }}
/>
```

### `customValidator`

Permite añadir lógica de validación personalizada:

```typescript
const customValidator = (appointment: Appointment): ValidationResult => {
  // Las citas no pueden durar más de 8 horas (16 slots)
  if (appointment.duration > 16) {
    return {
      valid: false,
      error: 'Las citas no pueden durar más de 8 horas'
    };
  }

  // Las citas no pueden empezar en slots impares
  if (appointment.startSlot % 2 !== 0) {
    return {
      valid: false,
      error: 'Las citas deben empezar en slots pares'
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

Cuando está habilitado, previene incluso el intento de drag a zonas inválidas (futuro):

```typescript
<Lane
  laneId="lane-1"
  appointments={appointments}
  strictMode={true}
/>
```

## Casos de uso comunes

### 1. Validar antes de añadir una nueva cita

```typescript
const handleAddAppointment = (startSlot: number) => {
  const newApt: Omit<Appointment, 'id'> = {
    startSlot,
    duration: 2,
    title: 'Nueva cita'
  };

  const validation = validateAppointment(newApt);

  if (!validation.valid) {
    showErrorToast(validation.error);
    return;
  }

  // Proceder a añadir
};
```

### 2. Validar durante drag-and-drop

```typescript
const handleAppointmentChange = (updated: Appointment): boolean => {
  const validation = validateAppointment(updated);

  if (!validation.valid) {
    onValidationError?.(validation);
    return false; // Rechazar el cambio
  }

  setAppointments(prev =>
    prev.map(apt => apt.id === updated.id ? updated : apt)
  );
  return true;
};
```

### 3. Mostrar zonas disponibles antes de crear

```typescript
const isSlotAvailable = (slot: number): boolean => {
  return canAddAppointment({
    startSlot: slot,
    duration: 2,
    title: 'Demo'
  });
};

// Usar para renderizar slots disponibles visualmente
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

### 4. Permitir solapamientos seleccionados

```typescript
const appointment: Appointment = {
  id: "1",
  startSlot: 0,
  duration: 2,
  title: "Cita con solapamiento permitido",
  allowOverlap: true // Permite solaparse con otras citas
};

// El validador no rechazará solapamientos si allowOverlap es true
const result = validateAppointment(appointment);
```

## Mensajes de error

El sistema proporciona mensajes de error descriptivos:

| Situación | Error |
|-----------|-------|
| Slot inicial fuera de rango | "El slot inicial está fuera del rango permitido" |
| Cita excede total slots | "La cita excede el número total de slots" |
| Slot bloqueado | "El slot {N} está bloqueado" |
| Solapamiento inválido | "La cita se solapa con otra existente" |

## Manejo de slots bloqueados

Si una cita tiene un callback `onBlockedSlot`, puede decidir si permitir el uso de ese slot:

```typescript
const appointment: Appointment = {
  id: "1",
  startSlot: 0,
  duration: 2,
  title: "Cita especial",
  onBlockedSlot: (slotIndex, laneId) => {
    // Retornar true para permitir, false para rechazar
    // Por ejemplo: solo permitir en el lane "special"
    return laneId === "special";
  }
};
```

## Integración con estado global

Si usas Redux, Zustand u otro state manager:

```typescript
// En tu store/slice
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

### Con vitest/jest

```typescript
import { validateNewAppointment } from '@pangeasi/lane-scheduler-react';

describe('Validación de citas', () => {
  it('rechaza citas fuera del rango', () => {
    const result = validateNewAppointment(
      { startSlot: 25, duration: 2 },
      { appointments: [], blockedSlots: [], totalSlots: 20, laneId: 'test' }
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('fuera del rango');
  });

  it('acepta citas válidas', () => {
    const result = validateNewAppointment(
      { startSlot: 0, duration: 2 },
      { appointments: [], blockedSlots: [], totalSlots: 20, laneId: 'test' }
    );

    expect(result.valid).toBe(true);
  });

  it('rechaza citas que se solapan', () => {
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

- El hook usa `useCallback` con dependencias precisas para evitar re-renders innecesarios
- La función pura es O(n) donde n es el número de citas existentes
- Las validaciones se ejecutan de forma corta-circuitada (fail-fast)

## Changelog

### v1.2.0
- ✨ Añadido sistema de validación con hook y función pura
- ✨ Nuevas props en Lane: `onValidationError`, `customValidator`, `strictMode`
- 📝 Documentación completa con ejemplos

## Contribuir

Si encuentras casos de uso no cubiertos o mejoras posibles, abre un issue en GitHub.
