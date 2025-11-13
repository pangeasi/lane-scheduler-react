import type { Appointment, ValidationResult } from "../types";
import {
  isSlotBlocked,
  getOverlappingAppointments,
  hasInvalidOverlap,
} from "./laneUtils";

export interface AppointmentValidationContext {
  appointments: Appointment[];
  blockedSlots: number[];
  totalSlots: number;
  laneId: string;
}

/**
 * Validates an appointment using a pure function (without hooks)
 *
 * Performs the following validations:
 * 1. The initial slot is within the allowed range [0, totalSlots)
 * 2. The appointment does not exceed the total number of slots
 * 3. None of the appointment slots are blocked (respects onBlockedSlot)
 * 4. There are no invalid overlaps with other appointments
 *
 * @param newAppointment - The appointment to validate (without ID or with ID for updates)
 * @param context - Validation context with appointments, blockedSlots, totalSlots and laneId
 *
 * @returns ValidationResult with valid status and error message if applicable
 *
 * @example
 * ```typescript
 * const result = validateNewAppointment(
 *   { startSlot: 0, duration: 2, title: "New appointment" },
 *   { appointments: [], blockedSlots: [5], totalSlots: 20, laneId: "lane-1" }
 * );
 *
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateNewAppointment(
  newAppointment: {
    startSlot: number;
    duration: number;
    id?: string;
    title?: string;
    locked?: boolean;
    allowOverlap?: boolean;
    onBlockedSlot?: (slotIndex: number, laneId: string) => boolean;
    [key: string]: unknown;
  },
  context: AppointmentValidationContext
): ValidationResult {
  const { appointments, blockedSlots, totalSlots, laneId } = context;

  // Validation: initial slot within the allowed range
  if (newAppointment.startSlot < 0 || newAppointment.startSlot >= totalSlots) {
    return {
      valid: false,
      error: "The initial slot is out of the allowed range",
    };
  }

  // Validation: the appointment does not exceed the total number of slots
  if (newAppointment.startSlot + newAppointment.duration > totalSlots) {
    return {
      valid: false,
      error: "The appointment exceeds the total number of slots",
    };
  }

  // Validation: none of the slots are blocked
  for (let i = 0; i < newAppointment.duration; i++) {
    const currentSlot = newAppointment.startSlot + i;

    if (isSlotBlocked(currentSlot, blockedSlots)) {
      // Check if the appointment has a handler for blocked slots
      if (typeof newAppointment.onBlockedSlot === "function") {
        const canUseBlockedSlot = newAppointment.onBlockedSlot(
          currentSlot,
          laneId
        );
        if (!canUseBlockedSlot) {
          return {
            valid: false,
            error: `Slot ${currentSlot} is blocked`,
          };
        }
      } else {
        return {
          valid: false,
          error: `Slot ${currentSlot} is blocked`,
        };
      }
    }
  }

  // Validation: check overlaps
  const overlaps = getOverlappingAppointments(
    newAppointment.startSlot,
    newAppointment.duration,
    newAppointment.id || "",
    appointments
  );

  const allowOverlap = typeof newAppointment.allowOverlap === "boolean" ? newAppointment.allowOverlap : false;
  if (hasInvalidOverlap(overlaps, allowOverlap)) {
    return {
      valid: false,
      error: "The appointment overlaps with an existing one",
      conflictingAppointments: overlaps,
    };
  }

  return { valid: true };
}
