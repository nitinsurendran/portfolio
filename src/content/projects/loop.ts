/**
 * Loop case study — canonical body copy.
 * Source of truth for the detail page.
 */

/** Overview section (header right column) — three paragraphs as specified. */
export const loopOverview = {
  heading: "Overview",
  paragraphs: [
    "Loop is a tangible interaction study exploring how physical form, material, and motion can mediate emotional regulation through play.",
    "Inspired by Bill Verplank's interaction design framework: How do you do, feel, and know? The project investigates how simple gestures like spinning, tilting, and rotating can translate into immediate sensory feedback.",
    "Developed through iterative and rapid prototyping, the final wooden objects bridge digital fabrication and hand-finished craft. Loop positions therapeutic play not as a medical device, but as an everyday object that integrates computation, material intelligence, and embodied interaction.",
  ],
};

export const loopCopy = {
  research: {
    heading: "Research",
    content: `The project began with immersion into sensory processing and the lived realities of children on the autism spectrum. I spoke with parents, therapists, and musicians to understand how repetitive gestures, texture sensitivity, and sound preferences influence regulation and focus. These conversations revealed a consistent pattern: children gravitate toward predictable, tactile interactions that provide immediate yet non-overwhelming feedback.

Alongside interviews, I reviewed research on sensory integration, child development, and embodied cognition to frame the design space more rigorously. This shifted the project from designing a "toy" to designing a gesture-driven sensory system, where material, motion, and feedback operate as a single interaction loop.`,
  },
  coCreationInsights: {
    heading: "Co-Creation Insights",
    content: `To move beyond assumptions, I organized multiple co-creation sessions with Julian (5 years old). Rather than introducing finished concepts, I brought simple objects and rough prototypes to observe natural interaction patterns.

The early sessions were deliberately low-fidelity. Everyday kitchen objects like salt shakers, spoons, cups were used to test grip, rotation, weight, and sound response. These objects consistently held attention longer than abstract or visually complex forms.

Several patterns became clear:

- Continuous spinning and rocking gestures were repeated for extended periods.

- Objects that required explanation were ignored.

- Visual interfaces (a screen-based iteration) immediately shifted attention away from tactile interaction.

Overly colorful or feature-dense prototypes distracted rather than grounded engagement.`,
  },
  translatingInsightsIntoForm: {
    heading: "Translating Insights into Form",
    content: `The co-creation sessions clarified that the success of the system would depend on how naturally it invited specific gestures like spinning, rocking, tilting, rotating. The next phase focused on identifying geometries that could embody those movements without explanation.

Circular and rotational forms emerged as promising directions. Spheres encouraged continuous spinning. Multi-faced volumes introduced orientation shifts. Cylindrical forms enabled controlled rotation along a stable axis. Each geometry was selected not for aesthetics, but for the type of movement it afforded.

Rather than designing a single object, the concept evolved into a small family of forms each exploring a distinct gesture pattern. This allowed the interaction system to test how different physical affordances could translate into different rhythmic behaviors.`,
  },
  exploringRhythmSonicFeedback: {
    heading: "Exploring Rhythm & Sonic Feedback",
    content: `Once the preferred physical gestures became clear - spinning, tilting, rocking the next question emerged:
What kind of sound supports these movements without overwhelming them?

The focus shifted from object to rhythm. I began exploring how movement could translate into musical feedback that felt stable, learnable, and calming. Early experiments were conducted using tools such as Max/MSP and Pure Data, allowing me to prototype sensor-to-sound mappings and generative behaviors.

However, I quickly realized that the complexity of these environments was slowing iteration. The project required rapid experimentation - adjusting tempo curves, testing tonal ranges, and refining feedback responsiveness in real time. To support this, I transitioned to p5.js, a simpler and more flexible environment that enabled faster testing and tighter integration between movement input and sound output.`,
  },
  exploringTechnicalInteraction: {
    heading: "Exploring the Technical Interaction",
    content: `With promising physical gestures identified, I began experimenting with how movement could be translated into sound through simple sensing systems. I explored Arduino as a lightweight embedded platform, testing how onboard motion sensors could capture rotation and tilt data in real time.

Rather than immediately designing final enclosures, I attached the Arduino and basic sensor setups to the everyday objects Julian had responded to most strongly during co-creation sessions. Using a Wizard-of-Oz approach, I connected the Arduino to a p5.js sketch running on a laptop, allowing rapid adjustments to sound mappings while observing interaction live.

This setup enabled fast iteration. I could modify tempo curves, tonal ranges, and responsiveness on the fly, then immediately re-test with Julian. The focus at this stage was not on polished hardware, but on validating whether the movement-to-sound relationship reinforced sustained engagement.

By temporarily "augmenting" familiar objects with embedded sensing, I was able to evaluate the interaction loop before committing to final form and fabrication decisions.`,
  },
  iteration1TranslatingGestureIntoForm: {
    heading: "Iteration 1: Translating Gesture into Form",
    content: `After validating the movement-to-sound relationship using augmented everyday objects, I began designing purpose-built forms that embodied the gestures Julian naturally gravitated toward.

I explored and refined the shapes that had proven most engaging like rounded volumes for spinning, multi-faceted geometries for orientation changes, and cylindrical forms for controlled rotation. The goal was not aesthetic novelty, but behavioral clarity: each form had to clearly afford a specific type of movement.

Multiple versions were modeled and 3D printed to test scale, grip comfort, balance, and motion smoothness.

The first full set of prototypes was produced in brightly colored plastic. While visually playful, these versions revealed important limitations during testing. The material lacked durability under rough handling, surfaces felt hard and synthetic, and the acoustic feedback from impact was sharper than intended. What initially appeared engaging visually did not sustain interaction behaviorally.

This iteration clarified an important insight: the objects needed to feel resilient, warm, forgiving, and capable of withstanding repetitive play without degrading in form or experience.

This realization marked the shift toward exploring a more robust and tactile material. Wood.`,
  },
  iteration2MaterialTranslation: {
    heading: "Iteration 2 - Material Translation: Moving to Wood",
    content: `The limitations of the 3D printed prototypes prompted a reconsideration of material, not just form. During testing, it became clear that plastic introduced unintended friction into the interaction.

To address this, I collaborated with a local woodworker and began learning how to shape the forms directly in wood. Rather than treating fabrication as outsourcing, this phase became a hands-on exploration of material behavior - understanding grain direction, edge rounding, surface finishing, and weight distribution through carving and sanding.`,
  },
  systemIntegration: {
    heading: "System Integration - Form, Material, and Sound as One Loop",
    content: `With the wooden forms refined and the movement-to-sound mappings validated, the final phase focused on integrating the physical and digital layers into a cohesive interaction system.

The embedded Arduino Nano 33 IoT was housed within the carved forms, calibrated to capture motion data without disrupting balance or grip.

Sensor data was transmitted to a p5.js environment, where it was mapped to carefully constrained musical parameters. Rather than creating complex compositions, the system emphasized rhythmic stability and tonal safety. Movement directly influenced tempo, pitch, or octave, reinforcing a clear and predictable cause–effect relationship.

gesture → motion sensing → musical response → continued gesture.`,
  },
  reflection: {
    heading: "Reflection",
    content: `Loop reinforced that interaction design begins with behavior, not technology. The most meaningful insights did not come from tools or theory alone, but from observing how a child naturally engages with form, rhythm, and repetition.

The project deepened my understanding that material, movement, and sound are inseparable in tangible systems. Technology is most effective when it disappears into the experience.`,
  },
  collaborationMentorship: {
    heading: "Collaboration & Mentorship",
    content: `Loop was developed through close dialogue with parents, therapists, and musicians who contributed valuable perspectives on sensory regulation and embodied play. Co-creation sessions with Julian and his family were central to grounding the project in lived interaction rather than assumption.

I was mentored by [Bill Verplank](https://en.wikipedia.org/wiki/Bill_Verplank), who helped me to think critically about the relationship between movement, feedback, and embodied interaction.

Conversations with [Dayn Wilberding](https://www.linkedin.com/in/daynw/) further informed the sonic dimension of the project, shaping decisions around rhythm, music softwares, audio UX, and tactile-audio coherence.

Throughout the year, I was guided by [Arvind Sanjeev](https://arvindsanjeev.com/) and [Michael-Owen Liston](https://www.ciid.dk/community/michael-owen-liston), who encouraged rigorous exploration of emerging technologies and continuous prototyping.

While Loop is an independent project, it was strengthened through these exchanges and interdisciplinary insights.`,
  },
};

export type LoopContentKey = keyof typeof loopCopy;
