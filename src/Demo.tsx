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
  const [totalSlotsCount, setTotalSlotsCount] = useState(48); // 48 slots = 24 hours with 30min slots
  const [lanes, setLanes] = useState<LaneData[]>([
    {
      id: "lane1",
      name: "Room 1",
      appointments: [
        {
          id: "apt1",
          startSlot: 4,
          duration: 6,
          title: "Appointment A (3h)",
          allowOverlap: false,
        },
        {
          id: "apt2",
          startSlot: 12,
          duration: 4,
          title: "Appointment B (2h)",
          allowOverlap: true,
        },
        {
          id: "apt3",
          startSlot: 20,
          duration: 8,
          title: "Blocked Appointment C",
          locked: true,
        },
      ],
      blockedSlots: [16, 17],
    },
    {
      id: "lane2",
      name: "Room 2",
      appointments: [
        {
          id: "apt4",
          startSlot: 6,
          duration: 4,
          title: "Appointment D",
          allowOverlap: false,
        },
        {
          id: "apt5",
          startSlot: 14,
          duration: 6,
          title: "VIP Appointment (can use blocked slots)",
          allowOverlap: false,
          onBlockedSlot: (slotIndex, laneId) => {
            console.log(
              `VIP Appointment on blocked slot ${slotIndex} in ${laneId}`
            );
            return true;
          },
        },
      ],
      blockedSlots: [10, 22, 23, 24],
    },
    {
      id: "lane3",
      name: "Room 3",
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
      // If it's the same lane, just update the position
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

      // If it's a different lane, remove from source and add to destination
      return prev.map((lane) => {
        // Remove from source lane
        if (lane.id === sourceLaneId) {
          return {
            ...lane,
            appointments: lane.appointments.filter(
              (apt) => apt.id !== appointment.id
            ),
          };
        }
        // Add to destination lane
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
      title: `New ${slotIdx}`,
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

  // Function to render grouped slots (2 slots = 1 hour)
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
          🎯 Drag appointments between lanes, resize them from the edges, or
          double click to create new ones
        </p>

        {/* Configuration control */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total slots (each slot = 30 minutes)
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
            💡 Slots are rendered with <code>renderSlot</code> showing hours and
            half hours grouped visually
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
          <h3 className="font-semibold mb-2">Features:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✓ Drag & drop between different lanes</li>
            <li>✓ Resize from the edges</li>
            <li>✓ Snap to slots with visual feedback</li>
            <li>
              ✓ <strong>Customizable renderSlot</strong> - In the demo: 2 slots
              = 1 hour (each slot = 30min)
            </li>
            <li>✓ Blocked slots (red) - normally don't allow appointments</li>
            <li>
              ✓ <strong>onBlockedSlot</strong>: The "VIP Appointment" CAN go
              over blocked slots
            </li>
            <li>✓ Locked appointments (with padlock)</li>
            <li>✓ Red preview when position is not valid</li>
            <li>✓ Touch support for mobile</li>
            <li>✓ Double click to create</li>
          </ul>

          <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm font-medium text-green-800">
              🎨 Composition with renderSlot:
            </p>
            <p className="text-xs text-green-700 mt-1">
              The <code>renderSlot</code> function allows total visual
              flexibility. In this demo, we show full hours in bold (0:00,
              1:00...) and half hours more subtly (:30). You can customize it to
              show what you need: dates, days, shifts, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
