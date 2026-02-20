# Specification: Explorer Mode & Layer Toggling

## Goal
Provide an 'Explorer Mode' that allows users to independently toggle map layers (Extrusion Height and Color Mapping) outside of the fixed narrative flow.

## Functional Requirements
- **Mode Toggle:** A prominent UI switch between 'Narrativo' and 'Explorador'.
- **Independent Controls (Explorer Mode only):**
    - **Height Selector:** Options for [Ninguna, Normatividad, Registro, Brecha].
    - **Color Selector:** Options for [Barrios, Cumplimiento, Disponibilidad].
- **Adaptive Legend:** The legend must update dynamically based on the selected color mapping in Explorer Mode.
- **Live Statistics:** Maintain real-time volume calculation based on the current height selection.

## Technical Requirements
- **State Management:** A global `appMode` variable to branch UI and Map logic.
- **Dynamic Styles:** Refactor `getStyle` logic to be reusable across modes.
- **Persistence:** Ensure switching back to Narrative Mode restores the correct step state.
