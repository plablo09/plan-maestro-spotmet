# Implementation Plan: Explorer Mode & Layer Toggling

## Phase 1: Mode Toggle & UI Scaffold
- [x] Task: Implement Mode Toggle in Control Panel
    - [ ] Add toggle buttons to `index.html`
    - [ ] Update `style.css` for mode-specific UI visibility
- [x] Task: Create Explorer Control Panel
    - [ ] Add dropdowns/radios for Height and Color in `index.html`
- [ ] Task: Conductor - User Manual Verification 'Mode Toggle & UI Scaffold' (Protocol in workflow.md)

## Phase 2: Dynamic Map Logic
- [ ] Task: Refactor Map Update Logic for Mode Awareness
    - [ ] Update `map.js` to branch `updateMap` based on mode
    - [ ] Implement dynamic Style Expression builder for Explorer Mode
- [ ] Task: Sync Legend and Stats in Explorer Mode
    - [ ] Ensure legend updates when color mapping changes
    - [ ] Ensure volume stats update when height mapping changes
- [ ] Task: Conductor - User Manual Verification 'Dynamic Map Logic' (Protocol in workflow.md)

## Phase 3: Polish & Verification
- [ ] Task: Add E2E Tests for Mode Switching
    - [ ] Verify console is clean during mode transitions
- [ ] Task: Final Responsive UI Review
- [ ] Task: Conductor - User Manual Verification 'Polish & Verification' (Protocol in workflow.md)
