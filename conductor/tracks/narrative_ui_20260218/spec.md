# Specification: Refine the Interactive Narrative and Legend UI

## Goal
Improve the project's communication capacity by transforming the UI into a narrative-driven experience. The goal is to clearly show public officials the discrepancies between:
1.  **Permitted Levels:** What the law allows.
2.  **Registered Levels:** What is officially recorded in the cadaster.
3.  **Discrepancy (Policy-Reality Gap):** The difference between planning and reality.

## Functional Requirements
- **Structured Narrative Navigation:**
    - Replace generic "Paso 1, 2, 3" with descriptive, narrative steps.
    - Step 1: "Zonificación Máxima (Lo que la ley permite)"
    - Step 2: "Realidad Registrada (Lo que dice el Catastro)"
    - Step 3: "Brecha de Cumplimiento (El potencial disponible o excedido)"
- **Dynamic Legend:**
    - Update legend colors and labels for each step to ensure clarity.
    - Highlight "Exceeded" vs "Available" potential in the final step.
- **Narrative Descriptions:**
    - Expand step descriptions to explain *why* this data matters for policy.
- **Improved Statistics:**
    - Clarify labels for the volume statistics (e.g., "Volumen Total Permitido" vs "Volumen Total Registrado").

## Visual & UX Requirements
- **Theme:** Maintain the Professional/Analytical tone and Dark-Themed aesthetic.
- **Interactivity:** Ensure building popups reflect the narrative of the current step.
- **Focus:** Keep the 3D map and volume statistics front and center.

## Technical Requirements
- **Frontend (MapLibre):** Update `steps` object in `map.js` to reflect the new narrative and statistics logic.
- **Style (CSS):** Refine control panel styling for better readability on both desktop and mobile.
