/**
 * Digital Rams case study — canonical copy.
 * Source of truth for the detail page.
 */

/** Overview section (header right column). */
export const digitalRamsOverview = {
  heading: "Overview",
  paragraphs: [
    "Digital Rams is a speculative 3D interaction study exploring how iconic industrial products can be experienced immersively in a digital environment.",
    "Rather than presenting Dieter Rams' work as static images or historical documentation, this project reconstructs his objects as spatial, interactive 3D artifacts. The goal was simple but demanding: Can a digital interface preserve the clarity, proportion, and tactile logic of Rams' objects through spatial interaction?",
  ],
};

export type DigitalRamsContentKey = "context" | "experience" | "process" | "reflection";

export const digitalRamsCopy: Record<
  DigitalRamsContentKey,
  { heading: string; content: string }
> = {
  context: {
    heading: "Context",
    content: `When physical products are translated into digital interfaces, much of their tactile logic and spatial clarity can disappear. Objects become images or decorative references, disconnected from how they were meant to be handled.

Digital Rams explores how interaction principles like rotation, proportion, feedback, and control hierarchy can be translated into a digital format.`,
  },
  experience: {
    heading: "Experience",
    content: `Each product exists as an interactive artifact within the app.

Users can:

- Rotate and inspect objects to understand proportion and surface detail
- Interact directly with functional components such as dials, sliders, and switches
- Trigger responsive audio tied to mechanical interaction

A 3D view supports spatial understanding, allowing users to examine the object from multiple angles and interact with it in context.

Controls behave as they would physically:

- Circular gestures map to rotary knobs
- Linear gestures move sliders along constrained tracks
- Buttons respond with slight delay and depth

Sensors

The prototype leveraged device sensors to explore embodied interaction:

- Gyroscope input for perspective shifts
- Motion-based inspection
- Haptic feedback tied to mechanical interaction`,
  },
  process: {
    heading: "Prototyping",
    content: `The project was prototyped using Origami Studio, enabling:

- Rapid iteration of gesture mapping
- Real-time sensor testing
- Interaction timing refinement
- Audio-linked behavioral responses`,
  },
  reflection: {
    heading: "Reflection",
    content: `Digital Rams was an exploration of how digital interfaces can respect the logic of physical products. It became a study in translating interaction, not just form.`,
  },
};
