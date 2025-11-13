import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef } from "react";
import { Scheduler, Lane } from "../components";
import {
  useAppointmentValidation,
  validateNewAppointment,
} from "../index";
import type { Appointment, ValidationResult } from "../types";

const meta: Meta<typeof Lane> = {
  title: "Utils/Validation",
  component: Lane,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Component for the useAppointmentValidation hook example
 */
function WithHookValidationComponent() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", startSlot: 0, duration: 2, title: "Appointment 1" },
    { id: "2", startSlot: 5, duration: 3, title: "Appointment 2" },
  ]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { validateAppointment } = useAppointmentValidation({
    laneId: "lane-1",
    appointments,
    blockedSlots: [3, 4],
    totalSlots: 20,
  });

  const handleAddAppointment = () => {
    const newApt = { startSlot: 8, duration: 2, title: "New appointment" };
    const validation = validateAppointment(newApt);

    if (!validation.valid) {
      setValidationErrors((prev) => [
        ...prev,
        validation.error || "Unknown error",
      ]);
      return;
    }

    const appointmentWithId = {
      ...newApt,
      id: `${Date.now()}`,
    };
    setAppointments((prev) => [...prev, appointmentWithId]);
    setValidationErrors([]);
  };

  const handleValidationError = (error: ValidationResult) => {
    setValidationErrors((prev) => [
      ...prev,
      error.error || "Error desconocido",
    ]);
  };

  return (
    <div className="space-y-4">
      <Scheduler>
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Lane with validation (Hook)</h3>
          <Lane
            laneId="lane-1"
            appointments={appointments}
            blockedSlots={[3, 4]}
            totalSlots={20}
            onValidationError={handleValidationError}
            onAppointmentChange={(updated) => {
              const validation = validateAppointment(updated);
              if (!validation.valid) {
                handleValidationError(validation);
                return;
              }
              setAppointments((prev) =>
                prev.map((apt) => (apt.id === updated.id ? updated : apt))
              );
            }}
          />
        </div>
      </Scheduler>

      <button
        onClick={handleAddAppointment}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add valid appointment
      </button>

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <h4 className="font-bold text-red-700 mb-2">Validation errors:</h4>
          <ul className="space-y-1">
            {validationErrors.map((error, idx) => (
              <li key={idx} className="text-red-600 text-sm">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export const WithHookValidation: Story = {
  render: () => <WithHookValidationComponent />,
};

/**
 * Component for the pure function validateNewAppointment example
 */
function WithPureValidationComponent() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", startSlot: 0, duration: 2, title: "Appointment 1" },
  ]);
  const [message, setMessage] = useState<string>("");

  const handleValidateSlot = (startSlot: number) => {
    const newApt = { startSlot, duration: 2, title: "New appointment" };

    const result = validateNewAppointment(newApt, {
      appointments,
      blockedSlots: [3, 4, 10],
      totalSlots: 20,
      laneId: "lane-1",
    });

    if (result.valid) {
      setMessage(`✓ Slot ${startSlot} is valid`);
      setAppointments((prev) => [
        ...prev,
        { ...newApt, id: `${Date.now()}` },
      ]);
    } else {
      setMessage(`✗ ${result.error}`);
    }
  };

  return (
    <div className="space-y-4">
      <Scheduler>
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Lane with validation (Pure function)</h3>
          <Lane
            laneId="lane-1"
            appointments={appointments}
            blockedSlots={[3, 4, 10]}
            totalSlots={20}
            onAppointmentChange={(updated) => {
              const result = validateNewAppointment(updated, {
                appointments,
                blockedSlots: [3, 4, 10],
                totalSlots: 20,
                laneId: "lane-1",
              });

              if (!result.valid) {
                setMessage(`✗ ${result.error}`);
                return;
              }

              setAppointments((prev) =>
                prev.map((apt) => (apt.id === updated.id ? updated : apt))
              );
            }}
          />
        </div>
      </Scheduler>

      <div className="flex gap-2">
        {[0, 5, 8, 15].map((slot) => (
          <button
            key={slot}
            onClick={() => handleValidateSlot(slot)}
            className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Slot {slot}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`p-3 rounded ${
            message.startsWith("✓")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export const WithPureValidation: Story = {
  render: () => <WithPureValidationComponent />,
};

/**
 * Component for the custom validator example
 */
function WithCustomValidatorComponent() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", startSlot: 0, duration: 2, title: "Priority appointment" },
  ]);
  const [message, setMessage] = useState<string>("");
  const idCounterRef = useRef(0);

  const customValidator = (appointment: Appointment): ValidationResult => {
    // Custom validation: appointments cannot last longer than 5 slots
    if (appointment.duration > 5) {
      return {
        valid: false,
        error: "Appointments cannot last longer than 5 slots",
      };
    }

    // Custom validation: appointments cannot start before slot 2
    if (appointment.startSlot < 2) {
      return {
        valid: false,
        error: "Appointments must start at slot 2 or later",
      };
    }

    return { valid: true };
  };

  const handleAddAppointment = (startSlot: number) => {
    const appointmentToValidate = {
      startSlot,
      duration: 2,
      title: "New appointment",
    };

    const validation = customValidator({
      ...appointmentToValidate,
      id: `temp-${startSlot}`,
    });
    if (!validation.valid) {
      setMessage(`✗ ${validation.error}`);
      return;
    }

    idCounterRef.current += 1;
    const newApt: Appointment = {
      ...appointmentToValidate,
      id: `apt-${idCounterRef.current}`,
    };

    setMessage(`✓ Appointment added at slot ${startSlot}`);
    setAppointments((prev) => [...prev, newApt]);
  };

  return (
    <div className="space-y-4">
      <Scheduler>
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Lane with custom validator</h3>
          <p className="text-sm text-gray-600 mb-2">
            Restrictions: max duration 5 slots, min start slot 2
          </p>
          <Lane
            laneId="lane-1"
            appointments={appointments}
            totalSlots={20}
            customValidator={customValidator}
            onAppointmentChange={(updated) => {
              const validation = customValidator(updated);
              if (!validation.valid) {
                setMessage(`✗ ${validation.error}`);
                return;
              }
              setAppointments((prev) =>
                prev.map((apt) => (apt.id === updated.id ? updated : apt))
              );
            }}
          />
        </div>
      </Scheduler>

      <div className="flex gap-2">
        {[0, 2, 5, 10, 15].map((slot) => (
          <button
            key={slot}
            onClick={() => handleAddAppointment(slot)}
            className="px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
          >
            Slot {slot}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`p-3 rounded ${
            message.startsWith("✓")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export const WithCustomValidator: Story = {
  render: () => <WithCustomValidatorComponent />,
};

/**
 * Component for the allowed overlaps example
 */
function WithAllowOverlapComponent() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      startSlot: 0,
      duration: 3,
      title: "Main appointment",
      allowOverlap: false,
    },
    {
      id: "2",
      startSlot: 1,
      duration: 2,
      title: "Allowed overlapping appointment",
      allowOverlap: true,
    },
  ]);
  const idCounterRef = useRef(2);

  const { validateAppointment } = useAppointmentValidation({
    laneId: "lane-1",
    appointments,
    blockedSlots: [],
    totalSlots: 20,
  });

  const handleAddOverlappingAppointment = () => {
    const newApt = {
      startSlot: 1,
      duration: 2,
      title: "Another overlapping appointment",
      allowOverlap: true,
    };

    const validation = validateAppointment(newApt);
    if (!validation.valid) {
      alert(`Error: ${validation.error}`);
      return;
    }

    idCounterRef.current += 1;
    setAppointments((prev) => [
      ...prev,
      { ...newApt, id: `${idCounterRef.current}` },
    ]);
  };

  return (
    <div className="space-y-4">
      <Scheduler>
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Lane with allowed overlaps</h3>
          <p className="text-sm text-gray-600 mb-2">
            Appointments with allowOverlap: true can overlap
          </p>
          <Lane
            laneId="lane-1"
            appointments={appointments}
            totalSlots={20}
            onAppointmentChange={(updated) => {
              setAppointments((prev) =>
                prev.map((apt) => (apt.id === updated.id ? updated : apt))
              );
            }}
          />
        </div>
      </Scheduler>

      <button
        onClick={handleAddOverlappingAppointment}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Add allowed overlapping appointment
      </button>
    </div>
  );
}

export const WithAllowOverlap: Story = {
  render: () => <WithAllowOverlapComponent />,
};
