import type {
  Appointment,
  AppointmentMoveDetails,
  CollisionStrategy,
  RegisteredLane,
} from "../types";

/**
 * Checks if a slot is blocked
 */
export const isSlotBlocked = (slot: number, blockedSlots: number[]): boolean => {
  return blockedSlots.includes(slot);
};

/**
 * Calculates the slot from the X coordinate relative to the lane box
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
 * Checks if a point (x, y) is within the lane
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
 * Checks if a position is valid for an appointment
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
 * Gets the appointments that overlap with the specified position
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
 * Checks if there is an invalid overlap (without allowOverlap)
 * Optimized for early exit
 */
export const hasInvalidOverlap = (
  overlaps: Appointment[],
  allowOverlap: boolean
): boolean => {
  if (allowOverlap) return false;
  return overlaps.length > 0;
};

/**
 * Checks if an appointment can overlap with target appointments
 * Returns true if ALL overlapping appointments allow overlap
 * This means: if even ONE overlapping appointment doesn't allow overlap, it's invalid
 */
export const hasInvalidOverlapWithTargets = (
  overlaps: Appointment[]
): boolean => {
  // If no overlaps, it's valid
  if (overlaps.length === 0) return false;

  // Check if ALL overlapping appointments allow overlap
  // If any one doesn't allow overlap, it's invalid
  return overlaps.some((apt) => !apt.allowOverlap);
};

export interface ResolvedAppointmentMove {
  valid: boolean;
  details?: AppointmentMoveDetails;
}

export interface ResolveAppointmentMoveOptions {
  appointment: Appointment;
  sourceLaneId: string;
  targetLaneId: string;
  newStartSlot: number;
  originalStartSlot: number;
  collisionStrategy: CollisionStrategy;
  lanes: Record<string, RegisteredLane>;
}

const withoutAppointments = (
  appointments: Appointment[],
  appointmentIds: string[]
) => {
  const excluded = new Set(appointmentIds);
  return appointments.filter((appointment) => !excluded.has(appointment.id));
};

const canPlaceAppointment = (
  appointment: Appointment,
  lane: RegisteredLane,
  startSlot: number,
  appointments: Appointment[]
) => {
  if (
    !isValidPosition(
      startSlot,
      appointment.duration,
      appointment.id,
      lane.totalSlots,
      lane.blockedSlots,
      appointments,
      lane.laneId,
      appointment
    )
  ) {
    return false;
  }

  const overlaps = getOverlappingAppointments(
    startSlot,
    appointment.duration,
    appointment.id,
    appointments
  );

  return !hasInvalidOverlapWithTargets(overlaps);
};

const getSameLaneSwapCandidateStartSlots = (
  draggedStartSlot: number,
  originalStartSlot: number,
  draggedDuration: number,
  swappedDuration: number
) => {
  const adjacentStartSlot =
    originalStartSlot > draggedStartSlot
      ? draggedStartSlot + draggedDuration
      : draggedStartSlot - swappedDuration;

  return Array.from(new Set([originalStartSlot, adjacentStartSlot]));
};

export const resolveAppointmentMove = ({
  appointment,
  sourceLaneId,
  targetLaneId,
  newStartSlot,
  originalStartSlot,
  collisionStrategy,
  lanes,
}: ResolveAppointmentMoveOptions): ResolvedAppointmentMove => {
  const sourceLane = lanes[sourceLaneId];
  const targetLane = lanes[targetLaneId];

  if (!sourceLane || !targetLane) return { valid: false };

  const targetAppointments = withoutAppointments(targetLane.appointments, [
    appointment.id,
  ]);
  const targetOverlaps = getOverlappingAppointments(
    newStartSlot,
    appointment.duration,
    appointment.id,
    targetAppointments
  );
  const invalidTargetOverlaps = targetOverlaps.filter(
    (targetAppointment) => !targetAppointment.allowOverlap
  );
  const canMoveWithoutSwap =
    invalidTargetOverlaps.length === 0 &&
    canPlaceAppointment(
      appointment,
      targetLane,
      newStartSlot,
      targetAppointments
    );

  if (canMoveWithoutSwap) {
    return {
      valid: true,
      details: {
        operation: "move",
        appointment,
        sourceLaneId,
        targetLaneId,
        newStartSlot,
      },
    };
  }

  if (collisionStrategy !== "swap" || invalidTargetOverlaps.length !== 1) {
    return { valid: false };
  }

  const swappedAppointment = invalidTargetOverlaps[0];
  if (swappedAppointment.locked) return { valid: false };

  const targetAppointmentsAfterSwap = withoutAppointments(
    targetLane.appointments,
    [appointment.id, swappedAppointment.id]
  );
  const sourceAppointmentsAfterSwap = withoutAppointments(
    sourceLane.appointments,
    [appointment.id, swappedAppointment.id]
  );
  const movedAppointment = { ...appointment, startSlot: newStartSlot };
  const isSameLaneSwap = sourceLaneId === targetLaneId;
  const draggingAppointmentCanMove = canPlaceAppointment(
    appointment,
    targetLane,
    newStartSlot,
    targetAppointmentsAfterSwap
  );

  const swappedAppointmentNewStartSlot = isSameLaneSwap
    ? getSameLaneSwapCandidateStartSlots(
        newStartSlot,
        originalStartSlot,
        appointment.duration,
        swappedAppointment.duration
      ).find((candidateStartSlot) =>
        canPlaceAppointment(
          swappedAppointment,
          sourceLane,
          candidateStartSlot,
          [...sourceAppointmentsAfterSwap, movedAppointment]
        )
      )
    : originalStartSlot;
  const swappedAppointmentCanMove =
    swappedAppointmentNewStartSlot !== undefined &&
    canPlaceAppointment(
      swappedAppointment,
      sourceLane,
      swappedAppointmentNewStartSlot,
      sourceAppointmentsAfterSwap
    );

  if (!draggingAppointmentCanMove || !swappedAppointmentCanMove) {
    return { valid: false };
  }

  return {
    valid: true,
    details: {
      operation: "swap",
      appointment,
      sourceLaneId,
      targetLaneId,
      newStartSlot,
      swappedAppointment,
      swappedAppointmentNewLaneId: sourceLaneId,
      swappedAppointmentNewStartSlot,
    },
  };
};

/**
 * Extracts coordinates from a mouse or touch event
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
 * Extracts coordinates from a React mouse or touch event
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
