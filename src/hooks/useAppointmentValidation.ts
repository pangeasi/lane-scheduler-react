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
 * Hook para validar appointments
 * Proporciona funciones para validar una nueva cita antes de ser añadida o modificada
 *
 * @param laneId - ID del lane actual
 * @param appointments - Array de citas existentes en el lane
 * @param blockedSlots - Array de slots bloqueados
 * @param totalSlots - Número total de slots disponibles
 *
 * @returns Objeto con funciones validateAppointment y canAddAppointment
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
 *   title: "Nueva cita"
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
      // Validación: slot inicial dentro del rango permitido
      if (newAppointment.startSlot < 0 || newAppointment.startSlot >= totalSlots) {
        return {
          valid: false,
          error: "El slot inicial está fuera del rango permitido",
        };
      }

      // Validación: la cita no excede el número total de slots
      if (newAppointment.startSlot + newAppointment.duration > totalSlots) {
        return {
          valid: false,
          error: "La cita excede el número total de slots",
        };
      }

      // Validación: ninguno de los slots está bloqueado
      for (let i = 0; i < newAppointment.duration; i++) {
        const currentSlot = newAppointment.startSlot + i;

        if (isSlotBlocked(currentSlot, blockedSlots)) {
          // Verificar si la cita tiene un manejador para slots bloqueados
          if (typeof newAppointment.onBlockedSlot === "function") {
            const canUseBlockedSlot = newAppointment.onBlockedSlot(
              currentSlot,
              laneId
            );
            if (!canUseBlockedSlot) {
              return {
                valid: false,
                error: `El slot ${currentSlot} está bloqueado`,
              };
            }
          } else {
            return {
              valid: false,
              error: `El slot ${currentSlot} está bloqueado`,
            };
          }
        }
      }

      // Validación: verificar solapamientos
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
          error: "La cita se solapa con otra existente",
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
