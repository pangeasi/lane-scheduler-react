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
 * Valida una cita usando una función pura (sin hooks)
 *
 * Realiza las siguientes validaciones:
 * 1. El slot inicial está dentro del rango permitido [0, totalSlots)
 * 2. La cita no excede el número total de slots
 * 3. Ninguno de los slots de la cita está bloqueado (respeta onBlockedSlot)
 * 4. No hay solapamientos inválidos con otras citas
 *
 * @param newAppointment - La cita a validar (sin ID o con ID para actualizaciones)
 * @param context - Contexto de validación con appointments, blockedSlots, totalSlots y laneId
 *
 * @returns ValidationResult con estado valid y mensaje de error si aplica
 *
 * @example
 * ```typescript
 * const result = validateNewAppointment(
 *   { startSlot: 0, duration: 2, title: "Nueva cita" },
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
}
