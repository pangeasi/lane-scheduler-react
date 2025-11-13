import type { Appointment } from "../types";

/**
 * Verifica si un slot está bloqueado
 */
export const isSlotBlocked = (slot: number, blockedSlots: number[]): boolean => {
  return blockedSlots.includes(slot);
};

/**
 * Calcula el slot a partir de la coordenada X relativa a la caja del lane
 */
export const getSlotFromX = (
  x: number,
  rect: DOMRect | null | undefined,
  slotWidth: number,
  totalSlots: number
): number | null => {
  if (!rect) return null;
  const relativeX = x - rect.left;
  const slot = Math.max(0, Math.floor(relativeX / slotWidth));
  return slot < totalSlots ? slot : null;
};

/**
 * Verifica si un punto (x, y) está dentro del lane
 */
export const isPointOverLane = (
  x: number,
  y: number,
  rect: DOMRect | null | undefined
): boolean => {
  if (!rect) return false;
  return (
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  );
};

/**
 * Verifica si una posición es válida para un appointment
 */
export const isValidPosition = (
  startSlot: number,
  duration: number,
  appointmentId: string,
  totalSlots: number,
  blockedSlots: number[],
  appointments: Appointment[],
  laneId: string,
  appointmentData: Appointment | null = null
): boolean => {
  if (startSlot < 0 || startSlot + duration > totalSlots) return false;

  const apt =
    appointmentData || appointments.find((a) => a.id === appointmentId);

  for (let i = startSlot; i < startSlot + duration; i++) {
    if (isSlotBlocked(i, blockedSlots)) {
      if (apt?.onBlockedSlot) {
        if (!apt.onBlockedSlot(i, laneId)) return false;
      } else {
        return false;
      }
    }
  }
  return true;
};

/**
 * Obtiene los appointments que se solapan con la posición especificada
 */
export const getOverlappingAppointments = (
  startSlot: number,
  duration: number,
  excludeId: string,
  appointments: Appointment[]
): Appointment[] => {
  return appointments.filter((apt) => {
    if (apt.id === excludeId) return false;
    const aptEnd = apt.startSlot + apt.duration;
    const newEnd = startSlot + duration;
    return !(aptEnd <= startSlot || apt.startSlot >= newEnd);
  });
};

/**
 * Verifica si hay un solapamiento inválido (sin allowOverlap)
 * Optimizado para cortarse temprano
 */
export const hasInvalidOverlap = (
  overlaps: Appointment[],
  allowOverlap: boolean
): boolean => {
  if (allowOverlap) return false;
  return overlaps.length > 0;
};

/**
 * Extrae las coordenadas de un evento de mouse o touch
 */
export const getEventCoordinates = (
  e: MouseEvent | TouchEvent
): { x: number; y: number } => {
  if ("touches" in e) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }
  return {
    x: e.clientX,
    y: e.clientY,
  };
};

/**
 * Extrae las coordenadas de un evento React de mouse o touch
 */
export const getReactEventCoordinates = (
  e: React.MouseEvent | React.TouchEvent
): { x: number; y: number } => {
  if ("touches" in e) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }
  return {
    x: e.clientX,
    y: e.clientY,
  };
};
