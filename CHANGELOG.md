# Changelog

## [1.1.1] - 14-11-2025

### Breaking Changes

- **Fixed `allowOverlap` semantics**: The `allowOverlap` property now correctly represents whether OTHER appointments can overlap with this one, not whether this appointment can overlap with others.
  - **Old behavior**: An appointment with `allowOverlap: true` could overlap with any other appointment
  - **New behavior**: An appointment with `allowOverlap: true` allows others to overlap with it. When dragging/resizing, an appointment can only be placed where ALL target appointments have `allowOverlap: true`
  - **Migration**: If you relied on `allowOverlap: true` to allow overlapping, you need to set `allowOverlap: true` on the target appointments instead

### Performance Improvements

- **Refactored pure functions to utilities**: Extracted pure logic functions (`isSlotBlocked`, `getSlotFromX`, `isPointOverLane`, `isValidPosition`, `getOverlappingAppointments`, `getEventCoordinates`, `getReactEventCoordinates`) to `src/utils/laneUtils.ts` for better testability and reusability
- **Eliminated unnecessary useCallback hooks**: Removed 4 unnecessary `useCallback` wrappers by moving logic to pure functions, reducing memoization overhead
- **Implemented AbortController for event listeners**: Replaced manual `removeEventListener` calls with `AbortController.signal` in drag and resize effects for cleaner cleanup and better memory management
- **Memoized finalConfig object**: Wrapped `finalConfig` object creation with `useMemo` to prevent recreation on every render
- **Memoized renderAppointment function**: Wrapped `renderAppointment` with `useCallback` to prevent unnecessary re-renders of appointment elements
- **Optimized slot rendering**: Wrapped slot element creation with `useMemo` to only recalculate when dependencies change
- **Improved overlap validation logic**: Added new `hasInvalidOverlapWithTargets` utility function for validating overlaps based on target appointments during drag/resize operations

### Fixed

- Event listener cleanup now properly handles all registered listeners via AbortController
- Fixed `allowOverlap` validation to check target appointments instead of dragging appointment

## [1.1.0] - 13-11-2025

### Features

- Storybook documentation

## [1.0.0] - 12-11-2025

### Added

- Initial release of Lane Scheduler React
- Drag and drop functionality for appointments
- Resizable appointments
- Lane-based scheduler layout
- TypeScript support
- Flexible rendering with render props
- Touch event support for mobile
- Customizable blocked slots
- Full ES modules and CommonJS support

### Features

- `Scheduler` component for managing appointments across lanes
- `Lane` component for individual lane rendering
- TypeScript definitions for all props and types
- Built-in drag and drop with visual feedback
- Appointment overlap detection and validation
- Configurable slot dimensions and styling
- Custom appointment content rendering
- Custom slot rendering
- Event handlers for appointment changes and moves
