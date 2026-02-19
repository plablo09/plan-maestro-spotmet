# Implementation Plan: Refine the Interactive Narrative and Legend UI

## Phase 1: Narrative Structure & Content
- [~] Task: Update Narrative Labels and Descriptions in `map.js`
    - [ ] Define new `steps` array with descriptive titles and policy-focused descriptions
    - [ ] Update `updateMap` function to reflect these changes
- [x] Task: Refine Legend and Statistics Labels
    - [ ] Update `statsLabel` for each step to match the narrative
    - [ ] Ensure legend items clearly explain the color mappings for each step
- [ ] Task: Conductor - User Manual Verification 'Narrative Structure & Content' (Protocol in workflow.md)

## Phase 2: Logic and Interaction Refinement
- [ ] Task: Write Tests for UI State Transitions
    - [ ] Ensure `currentStepIndex` updates correctly and triggers the right UI changes
- [x] Task: Implement Robust Step Transitioning
    - [ ] Ensure map layers and paint properties are applied reliably on step change
- [x] Task: Update Building Popups for Narrative Context
    - [ ] Adjust popup content to highlight the most relevant data for the current active step
- [x] Task: Implement E2E "Console Guard" Test
    - [x] Install `@playwright/test`
    - [x] Create `tests/e2e/smoke.test.js` to detect console errors/warnings
    - [x] Update `ci.yml` to run E2E tests
- [ ] Task: Conductor - User Manual Verification 'Logic and Interaction Refinement' (Protocol in workflow.md)

## Phase 3: Visual Polish & Cleanup
- [ ] Task: Fix Legend Layout for Multiline Support
    - [ ] Update `style.css` to allow legend items to wrap without overflowing
- [x] Task: Refine Control Panel CSS for Professional Aesthetic
    - [ ] Adjust spacing, typography, and contrast in `style.css`
- [ ] Task: Final Cross-Browser & Mobile Verification
- [ ] Task: Conductor - User Manual Verification 'Visual Polish & Cleanup' (Protocol in workflow.md)
