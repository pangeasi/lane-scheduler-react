import{j as n}from"./storybook-Bou6zQpf.js";import{L as f,S}from"./Scheduler-N1NCGWXG.js";import"./vendor-OvXVS5lI.js";const i=t=>(...e)=>{console.log(`Action: ${t}`,e)},b=[{id:"meeting-1",startSlot:4,duration:6,title:"Team Meeting",allowOverlap:!1},{id:"call-1",startSlot:12,duration:4,title:"Client Call",allowOverlap:!0},{id:"lunch-1",startSlot:20,duration:4,title:"Lunch Break",locked:!0}],y=[{id:"vip-1",startSlot:14,duration:6,title:"VIP Meeting (can override blocked slots)",allowOverlap:!1,onBlockedSlot:(t,e)=>(i("VIP appointment on blocked slot")(`Slot ${t} in ${e}`),!0)}],x={title:"Components/Lane",component:f,parameters:{layout:"centered",docs:{description:{component:`
The **Lane** component represents a single scheduling lane that can contain appointments. 
It supports drag & drop, resizing, blocked slots, and custom rendering.

## Features
- 🎯 **Drag & Drop** - Move appointments within and between lanes
- 📏 **Resizable** - Adjust appointment duration from both ends  
- 🔒 **Blocked Slots** - Define unavailable time slots
- 🎨 **Custom Rendering** - Full control over slot and appointment appearance
- 📱 **Touch Support** - Works on mobile devices
- ⚡ **TypeScript** - Full type safety

## Usage
The Lane component should be wrapped in a Scheduler component to enable drag & drop between lanes.
        `}}},decorators:[t=>n.jsx(S,{onAppointmentMove:i("onAppointmentMove"),children:n.jsx("div",{style:{padding:"20px",backgroundColor:"#f8f9fa"},children:n.jsx(t,{})})})],argTypes:{laneId:{description:"Unique identifier for the lane"},totalSlots:{description:"Total number of time slots"},appointments:{description:"Array of appointments to display"},blockedSlots:{description:"Array of blocked slot indices"},config:{description:"Visual configuration options"},onSlotDoubleClick:{description:"Callback when a slot is double-clicked"},onSlotClick:{description:"Callback when a slot is clicked"},onAppointmentChange:{description:"Callback when an appointment is modified"}},args:{laneId:"demo-lane",totalSlots:24,appointments:b,blockedSlots:[0,1,22,23],config:{height:80,slotWidth:60},onSlotDoubleClick:i("onSlotDoubleClick"),onSlotClick:i("onSlotClick"),onAppointmentChange:i("onAppointmentChange")}},r={name:"Default Lane",parameters:{docs:{description:{story:"A basic lane with appointments, blocked slots, and default styling."}}}},a={name:"Empty Lane",args:{appointments:[],blockedSlots:[]},parameters:{docs:{description:{story:"An empty lane with no appointments or blocked slots. Double-click to create appointments."}}}},s={name:"Busy Lane",args:{appointments:[{id:"1",startSlot:2,duration:2,title:"Morning Standup"},{id:"2",startSlot:5,duration:3,title:"Design Review"},{id:"3",startSlot:9,duration:1,title:"Quick Call"},{id:"4",startSlot:11,duration:4,title:"Client Meeting"},{id:"5",startSlot:16,duration:2,title:"Team Sync"},{id:"6",startSlot:19,duration:3,title:"Project Planning"}],blockedSlots:[0,1,22,23]},parameters:{docs:{description:{story:"A busy lane with multiple appointments throughout the day."}}}},l={name:"Overlapping Appointments",args:{appointments:[{id:"1",startSlot:4,duration:6,title:"Main Meeting",allowOverlap:!0},{id:"2",startSlot:6,duration:4,title:"Overlapping Call",allowOverlap:!0},{id:"3",startSlot:8,duration:2,title:"Quick Check-in",allowOverlap:!0}],blockedSlots:[]},parameters:{docs:{description:{story:"Appointments that can overlap with each other (allowOverlap: true)."}}}},d={name:"Locked Appointments",args:{appointments:[{id:"1",startSlot:2,duration:3,title:"Editable Meeting"},{id:"2",startSlot:8,duration:4,title:"Locked Meeting",locked:!0},{id:"3",startSlot:16,duration:2,title:"Another Editable"}],blockedSlots:[0,22,23]},parameters:{docs:{description:{story:"Some appointments are locked and cannot be moved or resized (shown with padlock icon)."}}}},p={name:"VIP Appointments",args:{appointments:y,blockedSlots:[10,11,12,13,14,15,16,17,18,19]},parameters:{docs:{description:{story:"VIP appointments can be placed on blocked slots using the onBlockedSlot callback."}}}},c={name:"Custom Size",args:{config:{height:120,slotWidth:80},totalSlots:12,appointments:[{id:"1",startSlot:2,duration:3,title:"Morning Session"},{id:"2",startSlot:7,duration:2,title:"Afternoon Break"}]},parameters:{docs:{description:{story:"Lane with custom height and slot width, showing fewer total slots."}}}},m={name:"Custom Slot Rendering",args:{renderSlot:(t,e)=>{const g=Math.floor(t/2),o=t%2===1;return e?n.jsx("div",{style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#fee2e2",color:"#dc2626",fontSize:"12px",fontWeight:"bold"},children:o?":30":`${g}:00`}):n.jsx("div",{style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:o?"#f3f4f6":"#ffffff",border:"1px solid #e5e7eb",fontSize:"12px",color:o?"#6b7280":"#374151",fontWeight:o?"normal":"bold"},children:o?":30":`${g}:00`})}},parameters:{docs:{description:{story:"Custom slot rendering showing hours and half-hours with different styling."}}}},u={name:"Custom Appointment Content",args:{appointments:[{id:"1",startSlot:4,duration:6,title:"Design Review",attendees:["John","Sarah","Mike"],priority:"high",location:"Conference Room A"},{id:"2",startSlot:12,duration:4,title:"Client Call",attendees:["Alice","Bob"],priority:"medium",location:"Online"}],renderAppointmentContent:t=>{const e=t;return n.jsxs("div",{style:{padding:"8px",height:"100%",overflow:"hidden"},children:[n.jsx("div",{style:{fontWeight:"bold",fontSize:"14px",marginBottom:"4px"},children:t.title}),n.jsxs("div",{style:{fontSize:"12px",color:"#6b7280"},children:["📍 ",e.location]}),n.jsxs("div",{style:{fontSize:"12px",color:"#6b7280"},children:["👥 ",e.attendees?.join(", ")]}),n.jsxs("div",{style:{fontSize:"10px",color:e.priority==="high"?"#dc2626":"#59a848",fontWeight:"bold",marginTop:"2px"},children:[e.priority?.toUpperCase()," PRIORITY"]})]})}},parameters:{docs:{description:{story:"Custom appointment content rendering with additional information like location, attendees, and priority."}}}},h={name:"Mobile Layout",args:{config:{height:60,slotWidth:40},totalSlots:24,appointments:[{id:"1",startSlot:4,duration:4,title:"Meeting"},{id:"2",startSlot:10,duration:2,title:"Call"},{id:"3",startSlot:16,duration:6,title:"Workshop"}],renderAppointmentContent:t=>n.jsx("div",{style:{padding:"4px",fontSize:"10px",fontWeight:"bold",textAlign:"center",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},children:t.title})},parameters:{docs:{description:{story:"Compact lane configuration suitable for mobile devices with smaller slots and simplified content."}},viewport:{defaultViewport:"mobile1"}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "Default Lane",
  parameters: {
    docs: {
      description: {
        story: "A basic lane with appointments, blocked slots, and default styling."
      }
    }
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "Empty Lane",
  args: {
    appointments: [],
    blockedSlots: []
  },
  parameters: {
    docs: {
      description: {
        story: "An empty lane with no appointments or blocked slots. Double-click to create appointments."
      }
    }
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Busy Lane",
  args: {
    appointments: [{
      id: "1",
      startSlot: 2,
      duration: 2,
      title: "Morning Standup"
    }, {
      id: "2",
      startSlot: 5,
      duration: 3,
      title: "Design Review"
    }, {
      id: "3",
      startSlot: 9,
      duration: 1,
      title: "Quick Call"
    }, {
      id: "4",
      startSlot: 11,
      duration: 4,
      title: "Client Meeting"
    }, {
      id: "5",
      startSlot: 16,
      duration: 2,
      title: "Team Sync"
    }, {
      id: "6",
      startSlot: 19,
      duration: 3,
      title: "Project Planning"
    }],
    blockedSlots: [0, 1, 22, 23]
  },
  parameters: {
    docs: {
      description: {
        story: "A busy lane with multiple appointments throughout the day."
      }
    }
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Overlapping Appointments",
  args: {
    appointments: [{
      id: "1",
      startSlot: 4,
      duration: 6,
      title: "Main Meeting",
      allowOverlap: true
    }, {
      id: "2",
      startSlot: 6,
      duration: 4,
      title: "Overlapping Call",
      allowOverlap: true
    }, {
      id: "3",
      startSlot: 8,
      duration: 2,
      title: "Quick Check-in",
      allowOverlap: true
    }],
    blockedSlots: []
  },
  parameters: {
    docs: {
      description: {
        story: "Appointments that can overlap with each other (allowOverlap: true)."
      }
    }
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Locked Appointments",
  args: {
    appointments: [{
      id: "1",
      startSlot: 2,
      duration: 3,
      title: "Editable Meeting"
    }, {
      id: "2",
      startSlot: 8,
      duration: 4,
      title: "Locked Meeting",
      locked: true
    }, {
      id: "3",
      startSlot: 16,
      duration: 2,
      title: "Another Editable"
    }],
    blockedSlots: [0, 22, 23]
  },
  parameters: {
    docs: {
      description: {
        story: "Some appointments are locked and cannot be moved or resized (shown with padlock icon)."
      }
    }
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "VIP Appointments",
  args: {
    appointments: vipAppointments,
    blockedSlots: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  },
  parameters: {
    docs: {
      description: {
        story: "VIP appointments can be placed on blocked slots using the onBlockedSlot callback."
      }
    }
  }
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Custom Size",
  args: {
    config: {
      height: 120,
      slotWidth: 80
    },
    totalSlots: 12,
    appointments: [{
      id: "1",
      startSlot: 2,
      duration: 3,
      title: "Morning Session"
    }, {
      id: "2",
      startSlot: 7,
      duration: 2,
      title: "Afternoon Break"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "Lane with custom height and slot width, showing fewer total slots."
      }
    }
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Custom Slot Rendering",
  args: {
    renderSlot: (slotIndex: number, isBlocked: boolean) => {
      const hour = Math.floor(slotIndex / 2);
      const isHalfHour = slotIndex % 2 === 1;
      if (isBlocked) {
        return <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          fontSize: "12px",
          fontWeight: "bold"
        }}>
            {isHalfHour ? ":30" : \`\${hour}:00\`}
          </div>;
      }
      return <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isHalfHour ? "#f3f4f6" : "#ffffff",
        border: "1px solid #e5e7eb",
        fontSize: "12px",
        color: isHalfHour ? "#6b7280" : "#374151",
        fontWeight: isHalfHour ? "normal" : "bold"
      }}>
          {isHalfHour ? ":30" : \`\${hour}:00\`}
        </div>;
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Custom slot rendering showing hours and half-hours with different styling."
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "Custom Appointment Content",
  args: {
    appointments: [{
      id: "1",
      startSlot: 4,
      duration: 6,
      title: "Design Review",
      // Custom properties
      attendees: ["John", "Sarah", "Mike"],
      priority: "high",
      location: "Conference Room A"
    } as ExtendedAppointment, {
      id: "2",
      startSlot: 12,
      duration: 4,
      title: "Client Call",
      attendees: ["Alice", "Bob"],
      priority: "medium",
      location: "Online"
    } as ExtendedAppointment],
    renderAppointmentContent: (appointment: Appointment) => {
      const extAppt = appointment as ExtendedAppointment;
      return <div style={{
        padding: "8px",
        height: "100%",
        overflow: "hidden"
      }}>
          <div style={{
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "4px"
        }}>
            {appointment.title}
          </div>
          <div style={{
          fontSize: "12px",
          color: "#6b7280"
        }}>
            📍 {extAppt.location}
          </div>
          <div style={{
          fontSize: "12px",
          color: "#6b7280"
        }}>
            👥 {extAppt.attendees?.join(", ")}
          </div>
          <div style={{
          fontSize: "10px",
          color: extAppt.priority === "high" ? "#dc2626" : "#59a848",
          fontWeight: "bold",
          marginTop: "2px"
        }}>
            {extAppt.priority?.toUpperCase()} PRIORITY
          </div>
        </div>;
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Custom appointment content rendering with additional information like location, attendees, and priority."
      }
    }
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Mobile Layout",
  args: {
    config: {
      height: 60,
      slotWidth: 40
    },
    totalSlots: 24,
    appointments: [{
      id: "1",
      startSlot: 4,
      duration: 4,
      title: "Meeting"
    }, {
      id: "2",
      startSlot: 10,
      duration: 2,
      title: "Call"
    }, {
      id: "3",
      startSlot: 16,
      duration: 6,
      title: "Workshop"
    }],
    renderAppointmentContent: (appointment: Appointment) => <div style={{
      padding: "4px",
      fontSize: "10px",
      fontWeight: "bold",
      textAlign: "center",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
        {appointment.title}
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: "Compact lane configuration suitable for mobile devices with smaller slots and simplified content."
      }
    },
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...h.parameters?.docs?.source}}};const A=["Default","Empty","Busy","WithOverlaps","WithLockedAppointments","WithVIPAppointments","CustomSize","CustomSlotRendering","CustomAppointmentContent","Mobile"];export{s as Busy,u as CustomAppointmentContent,c as CustomSize,m as CustomSlotRendering,r as Default,a as Empty,h as Mobile,d as WithLockedAppointments,l as WithOverlaps,p as WithVIPAppointments,A as __namedExportsOrder,x as default};
