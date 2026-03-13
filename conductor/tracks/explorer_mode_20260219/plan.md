# Implementation Plan: Explorer Mode & Layer Toggling

## Phase 1: Mode Toggle & UI Scaffold
- [x] Task: Implement Mode Toggle in Control Panel [checkpoint: 8ebd59d]
    - [x] Add toggle buttons to `index.html`
    - [x] Update `style.css` for mode-specific UI visibility
- [x] Task: Create Explorer Control Panel [checkpoint: 8ebd59d]
    - [x] Add dropdowns/radios for Height and Color in `index.html`
- [x] Task: Conductor - User Manual Verification 'Mode Toggle & UI Scaffold'

## Phase 2: Dynamic Map Logic
- [x] Task: Refactor Map Update Logic for Mode Awareness [checkpoint: 8ebd59d]
    - [x] Update `map.js` to branch `updateMap` based on mode
    - [x] Implement dynamic Style Expression builder for Explorer Mode
- [x] Task: Sync Legend and Stats in Explorer Mode [checkpoint: 8ebd59d]
    - [x] Ensure legend updates when color mapping changes
    - [x] Ensure volume stats update when height mapping changes
- [x] Task: Conductor - User Manual Verification 'Dynamic Map Logic'

## Phase 3: Polish & Verification
- [x] Task: Add E2E Tests for Mode Switching [checkpoint: f3eab79]
    - [x] Verify console is clean during mode transitions
- [x] Task: Final Responsive UI Review [checkpoint: f3eab79]
- [x] Task: Conductor - User Manual Verification 'Polish & Verification'
