# Implementation Plan: Refine the Interactive Narrative and Legend UI

## Phase 1: Narrative Structure & Content
- [x] Task: Update Narrative Labels and Descriptions in `map.js` [checkpoint: 8ba4eb1]
    - [x] Define new `steps` array with descriptive titles and policy-focused descriptions
    - [x] Update `updateMap` function to reflect these changes
- [x] Task: Refine Legend and Statistics Labels [checkpoint: 8ba4eb1]
    - [x] Update `statsLabel` for each step to match the narrative
    - [x] Ensure legend items clearly explain the color mappings for each step
- [x] Task: Conductor - User Manual Verification 'Narrative Structure & Content'

## Phase 2: Logic and Interaction Refinement
- [x] Task: Write Tests for UI State Transitions [checkpoint: 8ba4eb1]
    - [x] Ensure `currentStepIndex` updates correctly and triggers the right UI changes
- [x] Task: Implement Robust Step Transitioning [checkpoint: 8ba4eb1]
    - [x] Ensure map layers and paint properties are applied reliably on step change
- [x] Task: Update Building Popups for Narrative Context [checkpoint: 8ba4eb1]
    - [x] Adjust popup content to highlight the most relevant data for the current active step
- [x] Task: Implement E2E "Console Guard" Test [checkpoint: 8ba4eb1]
    - [x] Install `@playwright/test`
    - [x] Create `tests/e2e/smoke.test.js` to detect console errors/warnings
    - [x] Update `ci.yml` to run E2E tests
- [x] Task: Conductor - User Manual Verification 'Logic and Interaction Refinement'

## Phase 3: Visual Polish & Cleanup
- [x] Task: Fix Legend Layout for Multiline Support [checkpoint: 8ba4eb1]
    - [x] Update `style.css` to allow legend items to wrap without overflowing
- [x] Task: Refine Control Panel CSS for Professional Aesthetic [checkpoint: 8ba4eb1]
    - [x] Adjust spacing, typography, and contrast in `style.css`
- [x] Task: Final Cross-Browser & Mobile Verification [checkpoint: 8ba4eb1]
- [x] Task: Conductor - User Manual Verification 'Visual Polish & Cleanup'
