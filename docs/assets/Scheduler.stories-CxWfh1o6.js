import{j as e,r as b}from"./storybook-Bou6zQpf.js";import{S as g,L as h}from"./Scheduler-N1NCGWXG.js";import"./vendor-OvXVS5lI.js";const d=u=>(...s)=>{console.log(`Action: ${u}`,s)},y=[{id:"room-1",name:"Conference Room A",appointments:[{id:"apt-1",startSlot:4,duration:6,title:"Team Meeting",allowOverlap:!1},{id:"apt-2",startSlot:12,duration:4,title:"Client Call",allowOverlap:!0}],blockedSlots:[0,1,22,23]},{id:"room-2",name:"Conference Room B",appointments:[{id:"apt-3",startSlot:6,duration:4,title:"Design Review",allowOverlap:!1},{id:"apt-4",startSlot:14,duration:6,title:"Workshop",allowOverlap:!1}],blockedSlots:[10,11]},{id:"room-3",name:"Meeting Room C",appointments:[{id:"apt-5",startSlot:8,duration:2,title:"Quick Standup",allowOverlap:!1},{id:"apt-6",startSlot:16,duration:4,title:"Planning Session",locked:!0}],blockedSlots:[2,3,20,21]}],w=()=>{const[u,s]=b.useState(y),f=(t,n,r,o)=>{d("onAppointmentMove")(t,n,r,o),s(a=>n===r?a.map(i=>i.id===n?{...i,appointments:i.appointments.map(l=>l.id===t.id?{...l,startSlot:o}:l)}:i):a.map(i=>i.id===n?{...i,appointments:i.appointments.filter(l=>l.id!==t.id)}:i.id===r?{...i,appointments:[...i.appointments,{...t,startSlot:o}]}:i))},x=(t,n)=>{d("onAppointmentChange")(t,n),s(r=>r.map(o=>o.id===t?{...o,appointments:o.appointments.map(a=>a.id===n.id?n:a)}:o))},S=(t,n)=>{d("onSlotDoubleClick")(t,n);const r={id:`apt-${Date.now()}`,startSlot:t,duration:2,title:"New Meeting",allowOverlap:!1};s(o=>o.map(a=>a.id===n?{...a,appointments:[...a.appointments,r]}:a))},v=(t,n)=>{const r=t%2===0,o=Math.floor(t/2);return n?e.jsx("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#fee2e2",color:"#dc2626",fontSize:"10px"},children:r?e.jsxs("span",{style:{fontWeight:"bold"},children:[o,":00"]}):e.jsx("span",{children:":30"})}):e.jsx("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#ffffff",border:"1px solid #e5e7eb",fontSize:"10px"},children:r?e.jsxs("span",{style:{fontWeight:"bold",color:"#374151"},children:[o,":00"]}):e.jsx("span",{style:{color:"#6b7280"},children:":30"})})};return e.jsx("div",{style:{padding:"20px",backgroundColor:"#f8f9fa",minHeight:"100vh"},children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{fontSize:"24px",fontWeight:"bold",marginBottom:"8px"},children:"Multi-Lane Scheduler Demo"}),e.jsx("p",{style:{color:"#6b7280",marginBottom:"24px"},children:"🎯 Drag appointments between lanes, resize them, or double-click to create new ones"}),e.jsx(g,{onAppointmentMove:f,children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:u.map(t=>e.jsxs("div",{style:{backgroundColor:"#ffffff",borderRadius:"8px",padding:"16px",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},children:[e.jsx("h3",{style:{fontSize:"18px",fontWeight:"600",marginBottom:"12px"},children:t.name}),e.jsx(h,{laneId:t.id,appointments:t.appointments,blockedSlots:t.blockedSlots,totalSlots:24,config:{height:80,slotWidth:60},renderSlot:v,onSlotDoubleClick:S,onAppointmentChange:n=>x(t.id,n)})]},t.id))})})]})})},M={title:"Components/Scheduler",component:g,parameters:{layout:"fullscreen",docs:{description:{component:`
The **Scheduler** component provides the context and coordination for drag & drop operations between multiple lanes.
It manages the global drag state and enables appointments to be moved between different lanes.

## Features
- 🔄 **Drag & Drop Context** - Coordinates drag operations between lanes
- 🎯 **Cross-Lane Movement** - Move appointments between different lanes
- 🔒 **State Management** - Handles drag and resize states globally
- ⚡ **Event Coordination** - Provides callbacks for appointment movements

## Usage
Wrap your Lane components with the Scheduler component and provide an \`onAppointmentMove\` callback
to handle appointments being moved between lanes.
        `}}},argTypes:{onAppointmentMove:{description:"Callback when an appointment is moved between lanes"}}},p={name:"Multi-Lane Interactive",render:()=>e.jsx(w,{}),parameters:{docs:{description:{story:"A fully interactive scheduler with multiple lanes. Try dragging appointments between different rooms, resizing them, and creating new ones by double-clicking empty slots."}}}},c={name:"Two Lanes Example",render:()=>e.jsx(g,{onAppointmentMove:d("onAppointmentMove"),children:e.jsxs("div",{style:{padding:"20px",display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"8px",fontSize:"16px",fontWeight:"600"},children:"Room A"}),e.jsx(h,{laneId:"room-a",appointments:[{id:"1",startSlot:4,duration:4,title:"Morning Meeting"},{id:"2",startSlot:10,duration:6,title:"Workshop"}],blockedSlots:[0,1,22,23],totalSlots:24,config:{height:80,slotWidth:50}})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"8px",fontSize:"16px",fontWeight:"600"},children:"Room B"}),e.jsx(h,{laneId:"room-b",appointments:[{id:"3",startSlot:6,duration:3,title:"Team Sync"},{id:"4",startSlot:14,duration:4,title:"Client Call"}],blockedSlots:[12,13,20,21],totalSlots:24,config:{height:80,slotWidth:50}})]})]})}),parameters:{docs:{description:{story:"A simple two-lane scheduler setup. Appointments can be dragged between the two rooms."}}}},m={name:"Single Lane",render:()=>e.jsx(g,{onAppointmentMove:d("onAppointmentMove"),children:e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h3",{style:{marginBottom:"12px",fontSize:"18px",fontWeight:"600"},children:"Conference Room"}),e.jsx(h,{laneId:"single-room",appointments:[{id:"1",startSlot:8,duration:4,title:"Team Meeting"},{id:"2",startSlot:14,duration:3,title:"Client Call"},{id:"3",startSlot:19,duration:2,title:"Wrap-up",locked:!0}],blockedSlots:[0,1,2,22,23],totalSlots:24,config:{height:100,slotWidth:60}})]})}),parameters:{docs:{description:{story:"A single lane wrapped in a Scheduler context. Even with one lane, the Scheduler provides drag & drop functionality."}}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Multi-Lane Interactive",
  render: () => <InteractiveScheduler />,
  parameters: {
    docs: {
      description: {
        story: "A fully interactive scheduler with multiple lanes. Try dragging appointments between different rooms, resizing them, and creating new ones by double-clicking empty slots."
      }
    }
  }
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Two Lanes Example",
  render: () => <Scheduler onAppointmentMove={action("onAppointmentMove")}>
      <div style={{
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
        <div>
          <h3 style={{
          marginBottom: "8px",
          fontSize: "16px",
          fontWeight: "600"
        }}>
            Room A
          </h3>
          <Lane laneId="room-a" appointments={[{
          id: "1",
          startSlot: 4,
          duration: 4,
          title: "Morning Meeting"
        }, {
          id: "2",
          startSlot: 10,
          duration: 6,
          title: "Workshop"
        }]} blockedSlots={[0, 1, 22, 23]} totalSlots={24} config={{
          height: 80,
          slotWidth: 50
        }} />
        </div>
        <div>
          <h3 style={{
          marginBottom: "8px",
          fontSize: "16px",
          fontWeight: "600"
        }}>
            Room B
          </h3>
          <Lane laneId="room-b" appointments={[{
          id: "3",
          startSlot: 6,
          duration: 3,
          title: "Team Sync"
        }, {
          id: "4",
          startSlot: 14,
          duration: 4,
          title: "Client Call"
        }]} blockedSlots={[12, 13, 20, 21]} totalSlots={24} config={{
          height: 80,
          slotWidth: 50
        }} />
        </div>
      </div>
    </Scheduler>,
  parameters: {
    docs: {
      description: {
        story: "A simple two-lane scheduler setup. Appointments can be dragged between the two rooms."
      }
    }
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "Single Lane",
  render: () => <Scheduler onAppointmentMove={action("onAppointmentMove")}>
      <div style={{
      padding: "20px"
    }}>
        <h3 style={{
        marginBottom: "12px",
        fontSize: "18px",
        fontWeight: "600"
      }}>
          Conference Room
        </h3>
        <Lane laneId="single-room" appointments={[{
        id: "1",
        startSlot: 8,
        duration: 4,
        title: "Team Meeting"
      }, {
        id: "2",
        startSlot: 14,
        duration: 3,
        title: "Client Call"
      }, {
        id: "3",
        startSlot: 19,
        duration: 2,
        title: "Wrap-up",
        locked: true
      }]} blockedSlots={[0, 1, 2, 22, 23]} totalSlots={24} config={{
        height: 100,
        slotWidth: 60
      }} />
      </div>
    </Scheduler>,
  parameters: {
    docs: {
      description: {
        story: "A single lane wrapped in a Scheduler context. Even with one lane, the Scheduler provides drag & drop functionality."
      }
    }
  }
}`,...m.parameters?.docs?.source}}};const A=["MultiLane","TwoLanes","SingleLane"];export{p as MultiLane,m as SingleLane,c as TwoLanes,A as __namedExportsOrder,M as default};
