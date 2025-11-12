import React, { useState, useCallback } from "react";
import { Lane } from "./components/Lane";
import { Scheduler } from "./components/Scheduler";
import type { Appointment } from "./types";

interface LaneData {
  id: string;
  name: string;
  appointments: Appointment[];
  blockedSlots: number[];
}

const Demo: React.FC = () => {
  const [totalSlotsCount, setTotalSlotsCount] = useState(48); // 48 slots = 24 horas con slots de 30min
  const [lanes, setLanes] = useState<LaneData[]>([
    {
      id: "lane1",
      name: "Sala 1",
      appointments: [
        {
          id: "apt1",
          startSlot: 4,
          duration: 6,
          title: "Cita A (3h)",
          allowOverlap: false,
        },
        {
          id: "apt2",
          startSlot: 12,
          duration: 4,
          title: "Cita B (2h)",
          allowOverlap: true,
        },
        {
          id: "apt3",
          startSlot: 20,
          duration: 8,
          title: "Cita C Bloqueada",
          locked: true,
        },
      ],
      blockedSlots: [16, 17],
    },
    {
      id: "lane2",
      name: "Sala 2",
      appointments: [
        {
          id: "apt4",
          startSlot: 6,
          duration: 4,
          title: "Cita D",
          allowOverlap: false,
        },
        {
          id: "apt5",
          startSlot: 14,
          duration: 6,
          title: "Cita VIP (puede slots bloq.)",
          allowOverlap: false,
          onBlockedSlot: (slotIndex, laneId) => {
            console.log(
              `Cita VIP sobre slot bloqueado ${slotIndex} en ${laneId}`
            );
            return true;
          },
        },
      ],
      blockedSlots: [10, 22, 23, 24],
    },
    {
      id: "lane3",
      name: "Sala 3",
      appointments: [],
      blockedSlots: [2, 4, 30],
    },
  ]);

  const handleAppointmentChange = (
    laneId: string,
    updatedAppointment: Appointment
  ) => {
    setLanes((prev) =>
      prev.map((lane) => {
        if (lane.id === laneId) {
          return {
            ...lane,
            appointments: lane.appointments.map((apt) =>
              apt.id === updatedAppointment.id ? updatedAppointment : apt
            ),
          };
        }
        return lane;
      })
    );
  };

  const handleAppointmentMove = (
    appointment: Appointment,
    sourceLaneId: string,
    targetLaneId: string,
    newStartSlot: number
  ) => {
    setLanes((prev) => {
      // Si es la misma lane, solo actualizamos la posición
      if (sourceLaneId === targetLaneId) {
        return prev.map((lane) => {
          if (lane.id === sourceLaneId) {
            return {
              ...lane,
              appointments: lane.appointments.map((apt) =>
                apt.id === appointment.id
                  ? { ...apt, startSlot: newStartSlot }
                  : apt
              ),
            };
          }
          return lane;
        });
      }

      // Si es diferente lane, quitamos de origen y añadimos a destino
      return prev.map((lane) => {
        // Quitar de la lane origen
        if (lane.id === sourceLaneId) {
          return {
            ...lane,
            appointments: lane.appointments.filter(
              (apt) => apt.id !== appointment.id
            ),
          };
        }
        // Añadir a la lane destino
        if (lane.id === targetLaneId) {
          return {
            ...lane,
            appointments: [
              ...lane.appointments,
              { ...appointment, startSlot: newStartSlot },
            ],
          };
        }
        return lane;
      });
    });
  };

  const handleSlotDoubleClick = (slotIdx: number, laneId: string) => {
    const newApt = {
      id: `apt${Date.now()}`,
      startSlot: slotIdx,
      duration: 2,
      title: `Nueva ${slotIdx}`,
      allowOverlap: false,
    };

    setLanes((prev) =>
      prev.map((lane) =>
        lane.id === laneId
          ? { ...lane, appointments: [...lane.appointments, newApt] }
          : lane
      )
    );
  };

  // Función para renderizar slots agrupados (2 slots = 1 hora)
  const renderSlotWithHourGroups = useCallback(
    (slotIdx: number, isBlocked: boolean) => {
      const isHourMark = slotIdx % 2 === 0;
      const hour = Math.floor(slotIdx / 2);

      if (isBlocked) {
        return (
          <div className="h-full flex flex-col items-center justify-center bg-red-100">
            {isHourMark ? (
              <span className="text-xs font-bold text-red-700">{hour}:00</span>
            ) : (
              <span className="text-xs text-red-400">:30</span>
            )}
          </div>
        );
      }

      return (
        <div className="h-full flex flex-col items-center justify-center">
          {isHourMark ? (
            <span className="text-xs font-bold text-gray-700">{hour}:00</span>
          ) : (
            <span className="text-xs text-gray-400">:30</span>
          )}
        </div>
      );
    },
    []
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Lane Scheduler</h1>
        <p className="text-gray-600 mb-4">
          🎯 Arrastra citas entre lanes, redimensiónalas desde los bordes, o haz
          doble click para crear nuevas
        </p>

        {/* Control de configuración */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total de slots (cada slot = 30 minutos)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="24"
                  max="96"
                  step="2"
                  value={totalSlotsCount}
                  onChange={(e) => setTotalSlotsCount(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold bg-purple-100 px-3 py-1 rounded whitespace-nowrap">
                  {totalSlotsCount} slots = {totalSlotsCount / 2}h
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Los slots se renderizan con <code>renderSlot</code> mostrando
            horas y medias horas agrupadas visualmente
          </p>
        </div>

        <Scheduler onAppointmentMove={handleAppointmentMove}>
          <div className="space-y-6">
            {lanes.map((lane) => (
              <div key={lane.id} className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">{lane.name}</h3>
                <div className="overflow-x-auto">
                  <Lane
                    laneId={lane.id}
                    appointments={lane.appointments}
                    blockedSlots={lane.blockedSlots}
                    totalSlots={totalSlotsCount}
                    renderSlot={renderSlotWithHourGroups}
                    config={{
                      height: 80,
                      slotWidth: 60,
                      slotColor: "#f9fafb",
                      slotBorderColor: "#e5e7eb",
                    }}
                    onAppointmentChange={(apt) =>
                      handleAppointmentChange(lane.id, apt)
                    }
                    renderAppointmentContent={(apt) => (
                      <div className="text-center">
                        <div className="font-medium">{apt.title}</div>
                        <div className="text-xs opacity-75">
                          Slot {apt.startSlot} → {apt.startSlot + apt.duration}
                        </div>
                      </div>
                    )}
                    onSlotDoubleClick={handleSlotDoubleClick}
                  />
                </div>
              </div>
            ))}
          </div>
        </Scheduler>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Características:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✓ Drag & drop entre lanes diferentes</li>
            <li>✓ Redimensionar desde los extremos</li>
            <li>✓ Snap a slots con feedback visual</li>
            <li>
              ✓ <strong>renderSlot personalizable</strong> - En el demo: 2 slots
              = 1 hora (cada slot = 30min)
            </li>
            <li>
              ✓ Slots bloqueados (rojos) - normalmente no permiten appointments
            </li>
            <li>
              ✓ <strong>onBlockedSlot</strong>: La "Cita VIP" SÍ puede ir sobre
              slots bloqueados
            </li>
            <li>✓ Appointments bloqueados (con candado)</li>
            <li>✓ Preview rojo cuando posición no válida</li>
            <li>✓ Soporte touch para mobile</li>
            <li>✓ Doble click para crear</li>
          </ul>

          <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm font-medium text-green-800">
              🎨 Composición con renderSlot:
            </p>
            <p className="text-xs text-green-700 mt-1">
              La función <code>renderSlot</code> permite total flexibilidad
              visual. En este demo, mostramos horas completas en negrita (0:00,
              1:00...) y medias horas más sutiles (:30). Puedes personalizarlo
              para mostrar lo que necesites: fechas, días, turnos, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
