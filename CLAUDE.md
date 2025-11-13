# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lane Scheduler React** is a flexible, drag-and-drop scheduler component for React with full TypeScript support. It's unit-agnostic and supports drag operations, resizing, locking, overlapping logic, and custom rendering.

It's published as an npm package (`@pangeasi/lane-scheduler-react`) and is fully self-contained with no peer dependencies except React.

## Build and Development Commands

### Core Commands
- **`npm run build`** - Clean and build the library (TypeScript compilation + Vite bundling)
- **`npm run build:types`** - Generate TypeScript definitions only
- **`npm run lint`** - Run ESLint on the codebase
- **`npm run test`** - Run Playwright tests
- **`npm run storybook`** - Start Storybook dev server (port 6006) with interactive documentation
- **`npm run build:storybook`** - Build static Storybook documentation
- **`npm run preview:storybook`** - Preview built Storybook locally (port 6007)
- **`npm run clean`** - Remove dist/ directory
- **`npm run clean:storybook`** - Remove docs/ directory

## Architecture

### Core Structure

**Context Layer** (`src/context/SchedulerContext.tsx`)
- Central state management using React Context
- Provides `dragState` and `resizeState` to all Lane components
- DragState: tracks appointment movement across lanes
- ResizeState: tracks appointment duration changes from edges

**Components**

1. **Scheduler** (`src/components/Scheduler.tsx`)
   - Root component that wraps all lanes
   - Manages drag/resize state
   - Handles `onAppointmentMove` callback when drag completes

2. **Lane** (`src/components/Lane.tsx`)
   - Individual lane/row in the scheduler
   - Renders slots and appointments
   - Handles drag start, resize start, and local drag/resize validation
   - Supports custom rendering via `renderSlot` and `renderAppointmentContent`
   - Applies cursor styles during interactions (grab, grabbing, ew-resize)

**Utilities** (`src/utils/`)
- `laneUtils.ts` - Slot calculations, overlap detection, position validation, event coordinate extraction
- `classNameUtils.ts` - Intelligent className merging (conflicts override, non-conflicts preserve)
- `appointmentValidation.ts` - Validation logic for blocked slots and overlaps

**Types** (`src/types.ts`)
- Core interfaces: `Appointment`, `LaneConfig`, `DragState`, `ResizeState`
- Component props interfaces: `LaneProps`, `SchedulerProps`

### Key Design Patterns

1. **Unit Agnostic Design**
   - Slots are abstract units with no time/space meaning
   - Users define slot meaning through custom `renderSlot` callback
   - All calculations use slot indices, not real units

2. **Validation Pipeline**
   - `isValidPosition()` checks blocked slots, total slots bounds, overlaps
   - `hasInvalidOverlapWithTargets()` checks if overlaps violate allowOverlap rules
   - Both drag and resize operations validate in real-time

3. **Overlap Rules**
   - `allowOverlap: true` on an appointment = others can overlap with it
   - `allowOverlap: false` (default) = no overlaps allowed
   - Each appointment can have `onBlockedSlot()` callback for custom logic (e.g., VIP slots)

4. **Drag and Resize Flow**
   - **Drag**: Start detection → global mousemove listener → real-time position update → dragEnd on mouseup
   - **Resize**: Start detection → global mousemove listener → real-time size update → resizeEnd on mouseup
   - Both update context state so Lane components re-render with preview positions

### Styling

- **Framework**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **CSS Output**: Pre-built `dist/styles.css` (~15KB gzipped) contains only used Tailwind utilities
- **Custom Styling**: Merge classNames intelligently - conflicting classes override defaults, non-conflicting classes coexist
- **Cursor States** (`src/index.css`): Applied globally via classList on `<html>` element with `!important` to ensure visibility during drag/resize

## Component Props Reference

### Scheduler
- `children`: Lane components
- `onAppointmentMove`: Fired when appointment is dragged to new position/lane

### Lane
- `laneId`: Unique identifier (required)
- `appointments`: Array of appointment objects
- `blockedSlots`: Array of blocked slot indices
- `totalSlots`: Total number of slots (default 24)
- `config`: Visual config (height, slotWidth, colors)
- `renderSlot`, `renderAppointmentContent`: Render prop functions
- `onSlotClick`, `onSlotDoubleClick`: Slot interaction handlers
- `onAppointmentChange`: Fired when appointment duration changes (resize)
- `appointmentContainerClassName`, `appointmentResizerStartClassName`, etc.: Custom classNames for styling

### Appointment Object
- `id`: Unique identifier (required)
- `startSlot`: Starting slot index (required)
- `duration`: Number of slots occupied (required)
- `title`: Display text
- `locked`: Prevents drag/resize if true
- `allowOverlap`: If true, other appointments can overlap this one
- `onBlockedSlot`: Custom function to allow placement on blocked slots

## Testing

- **Framework**: Playwright
- **Run**: `npm run test`
- **Location**: Test files use `.stories.tsx` pattern (Storybook stories for manual testing + Playwright for automation)

## Publishing

The package is published to npm with:
- **CJS**: `dist/index.cjs.js` (CommonJS)
- **ESM**: `dist/index.esm.js` (ES Modules)
- **Types**: `dist/index.d.ts` (TypeScript definitions)
- **Styles**: `dist/styles.css` (Pre-built Tailwind)

Before publishing, run `npm run build` to ensure all artifacts are current.

## Key Implementation Notes

### Cursor Handling
- **Hover**: `grab` cursor applied inline via element style
- **Dragging**: `grabbing` cursor applied via `cursor-grabbing` class on `<html>`
- **Resizing**: `ew-resize` cursor applied via `cursor-ew-resize` class on `<html>`
- Uses classes instead of direct style to ensure `!important` precedence

### Performance Considerations
- `useMemo` for slot elements rendering to prevent unnecessary recalculations
- `useCallback` for all event handlers to maintain identity across renders
- Context-based state means only affected lanes re-render during drag/resize

### Common Tasks

**Adding a new feature**
1. Define types in `src/types.ts`
2. Add render callbacks to Lane component if UI-related
3. Add validation logic to `src/utils/appointmentValidation.ts` if needed
4. Update `src/components/Lane.tsx` or `src/components/Scheduler.tsx`
5. Add Storybook story in `src/stories/` for manual testing
6. Ensure TypeScript compiles: `npm run build:types`
7. Test with `npm run test`

**Debugging drag/resize issues**
- Check `dragState` and `resizeState` in context (use React DevTools)
- Verify event coordinates are correct in `getEventCoordinates()` and `getReactEventCoordinates()`
- Check validation logic in `isValidPosition()` and `hasInvalidOverlapWithTargets()`
- Use Storybook to isolate and test scenarios
