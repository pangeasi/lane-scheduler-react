import { useCallback } from "react";
import type { Appointment, ValidationResult } from "../types";
import {
  isSlotBlocked,
  getOverlappingAppointments,
  hasInvalidOverlap,
} from "../utils/laneUtils";

export interface UseAppointmentValidationProps {
  laneId: string;
  appointments: Appointment[];
  blockedSlots: number[];
  totalSlots: number;
}

/**
 * Hook to validate appointments
 * Provides functions to validate a new appointment before being added or modified
 *
 * @param laneId - ID of the current lane
 * @param appointments - Array of existing appointments in the lane
 * @param blockedSlots - Array of blocked slots
 * @param totalSlots - Total number of available slots
 *
 * @returns Object with validateAppointment and canAddAppointment functions
 *
 * @example
 * ```typescript
 * const { validateAppointment, canAddAppointment } = useAppointmentValidation({
 *   laneId: "lane-1",
 *   appointments: [],
 *   blockedSlots: [2, 5],
 *   totalSlots: 20
 * });
 *
 * const result = validateAppointment({
 *   startSlot: 0,
 *   duration: 2,
 *   title: "New appointment"
 * });
 *
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 * ```
 */
export const useAppointmentValidation = ({
  laneId,
  appointments,
  blockedSlots,
  totalSlots,
}: UseAppointmentValidationProps) => {
  const validateAppointment = useCallback(
    (
      newAppointment: {
        startSlot: number;
        duration: number;
        id?: string;
        title?: string;
        locked?: boolean;
        allowOverlap?: boolean;
        onBlockedSlot?: (slotIndex: number, laneId: string) => boolean;
        [key: string]: unknown;
      }
    ): ValidationResult => {
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
    },
    [appointments, blockedSlots, totalSlots, laneId]
  );

  const canAddAppointment = useCallback(
    (newAppointment: {
      startSlot: number;
      duration: number;
      id?: string;
      title?: string;
      locked?: boolean;
      allowOverlap?: boolean;
      onBlockedSlot?: (slotIndex: number, laneId: string) => boolean;
      [key: string]: unknown;
    }) => {
      return validateAppointment(newAppointment).valid;
    },
    [validateAppointment]
  );

  return { validateAppointment, canAddAppointment };
};
