import{j as e}from"./storybook-Bou6zQpf.js";import{useMDXComponents as r}from"./index-CxX9bOV-.js";import"./vendor-OvXVS5lI.js";function s(i){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{id:"lane-scheduler-react",children:"Lane Scheduler React"}),`
`,e.jsx(n.p,{children:"A flexible, drag-and-drop scheduler component library for React with full TypeScript support."}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsx(n.p,{children:"Lane Scheduler React provides a powerful and flexible scheduling interface that allows users to:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Drag & Drop"})," appointments within and between lanes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Resize"})," appointments by dragging their edges"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Block"})," specific time slots"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Lock"})," appointments to prevent modification"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Customize"})," rendering with render props"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Handle"})," touch events for mobile support"]}),`
`]}),`
`,e.jsx(n.h2,{id:"core-concepts",children:"Core Concepts"}),`
`,e.jsx(n.h3,{id:"scheduler",children:"Scheduler"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"Scheduler"})," component provides the context for drag & drop operations. It coordinates state between multiple lanes and handles cross-lane appointment movements."]}),`
`,e.jsx(n.h3,{id:"lane",children:"Lane"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"Lane"})," component represents a single scheduling timeline. Each lane can contain multiple appointments and has its own blocked slots and configuration."]}),`
`,e.jsx(n.h3,{id:"appointments",children:"Appointments"}),`
`,e.jsx(n.p,{children:"Appointments are the schedulable items that can be moved and resized. They have properties like:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"startSlot"})," - The starting time slot"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"duration"})," - How many slots the appointment spans"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"title"})," - Display text"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"locked"})," - Whether the appointment can be modified"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"allowOverlap"})," - Whether appointments can overlap"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"onBlockedSlot"})," - Custom logic for blocked slot handling"]}),`
`]}),`
`,e.jsx(n.h2,{id:"key-features",children:"Key Features"}),`
`,e.jsx(n.h3,{id:"-drag--drop",children:"🎯 Drag & Drop"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Move appointments within lanes or between different lanes"}),`
`,e.jsx(n.li,{children:"Visual feedback during dragging"}),`
`,e.jsx(n.li,{children:"Snap to slot boundaries"}),`
`,e.jsx(n.li,{children:"Invalid position indicators"}),`
`]}),`
`,e.jsx(n.h3,{id:"-resizable-appointments",children:"📏 Resizable Appointments"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Resize from start or end edges"}),`
`,e.jsx(n.li,{children:"Minimum duration constraints"}),`
`,e.jsx(n.li,{children:"Overlap detection and prevention"}),`
`,e.jsx(n.li,{children:"Visual resize handles"}),`
`]}),`
`,e.jsx(n.h3,{id:"-blocked-slots",children:"🔒 Blocked Slots"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Define unavailable time periods"}),`
`,e.jsxs(n.li,{children:["Custom logic with ",e.jsx(n.code,{children:"onBlockedSlot"})," callback"]}),`
`,e.jsx(n.li,{children:"Visual indicators for blocked times"}),`
`,e.jsx(n.li,{children:"VIP appointments can override blocks"}),`
`]}),`
`,e.jsx(n.h3,{id:"-customizable-rendering",children:"🎨 Customizable Rendering"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"renderSlot"})," - Custom slot appearance and content"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"renderAppointmentContent"})," - Custom appointment display"]}),`
`,e.jsx(n.li,{children:"Flexible styling with CSS classes"}),`
`,e.jsx(n.li,{children:"Responsive design support"}),`
`]}),`
`,e.jsx(n.h3,{id:"-mobile-support",children:"📱 Mobile Support"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Touch event handling"}),`
`,e.jsx(n.li,{children:"Responsive layouts"}),`
`,e.jsx(n.li,{children:"Mobile-optimized interactions"}),`
`,e.jsx(n.li,{children:"Viewport-aware controls"}),`
`]}),`
`,e.jsx(n.h2,{id:"typescript-support",children:"TypeScript Support"}),`
`,e.jsx(n.p,{children:"The library is built with TypeScript and provides comprehensive type definitions for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"All component props and configurations"}),`
`,e.jsx(n.li,{children:"Appointment and lane data structures"}),`
`,e.jsx(n.li,{children:"Event handler signatures"}),`
`,e.jsx(n.li,{children:"Custom render function types"}),`
`]}),`
`,e.jsx(n.h2,{id:"architecture",children:"Architecture"}),`
`,e.jsx(n.p,{children:"The library uses React Context to coordinate drag & drop state between components:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`<Scheduler> (provides drag context)
  └── <Lane> (individual timeline)
      ├── Appointments (draggable/resizable)
      └── Time Slots (clickable/droppable)
`})}),`
`,e.jsx(n.p,{children:"This architecture allows for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Clean separation of concerns"}),`
`,e.jsx(n.li,{children:"Efficient state management"}),`
`,e.jsx(n.li,{children:"Easy composition of multiple lanes"}),`
`,e.jsx(n.li,{children:"Extensible functionality"}),`
`]}),`
`,e.jsx(n.h2,{id:"browser-support",children:"Browser Support"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Modern browsers with ES2018+ support"}),`
`,e.jsx(n.li,{children:"Touch devices (iOS Safari, Android Chrome)"}),`
`,e.jsx(n.li,{children:"Desktop browsers (Chrome, Firefox, Safari, Edge)"}),`
`,e.jsx(n.li,{children:"React 18+ required"}),`
`]}),`
`,e.jsx(n.h2,{id:"performance",children:"Performance"}),`
`,e.jsx(n.p,{children:"The library is optimized for performance with:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Efficient re-rendering using React hooks"}),`
`,e.jsx(n.li,{children:"Minimal DOM updates during drag operations"}),`
`,e.jsx(n.li,{children:"Debounced event handlers"}),`
`,e.jsx(n.li,{children:"Lazy calculation of overlap detection"}),`
`]})]})}function d(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{d as default};
