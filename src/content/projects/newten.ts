/**
 * NewTen case study — canonical copy.
 * Source of truth for the detail page.
 */

/** Overview section (header right column). */
export const newtenOverview = {
  heading: "Overview",
  paragraphs: [
    "NewTen is a tangible news device that lets people control how far their news travels.",
    "Instead of infinite scrolling and algorithmic feeds, NewTen offers a simple physical interaction: choose a category, rotate a disc, and listen to the top ten credible headlines - from your neighborhood to the other side of the world.",
    "Each rotation increases the geographical radius. Hyper-local becomes regional. Regional becomes national. National becomes global.",
    "News becomes something you tune, not something that chases you.",
  ],
};

export type NewtenContentKey =
  | "objective"
  | "earlyPrototypes"
  | "evolution"
  | "interaction"
  | "technology"
  | "designMicroInteractions";

export const newtenCopy: Record<
  NewtenContentKey,
  { heading: string; content: string }
> = {
  objective: {
    heading: "Objective",
    content: `In a world where online information can influence elections and shape public opinion, credibility has become difficult to navigate.

NewTen was designed to make trustworthy news more accessible — removing the noise, the endless feeds, and the uncertainty of unverified sources.

The ambition was simple: Create a calm, reliable way to access fact-checked news highlights, without distraction.`,
  },
  earlyPrototypes: {
    heading: "Early prototypes",
    content: `Early explorations focused on how a physical object could communicate abstract ideas like category and distance in a simple, intuitive way.

Each interchangeable disc represented a different news category, allowing the device to remain modular and adaptable.

To communicate geographical distance, we experimented with using dots as a visual indicator. The logic was straightforward: the more dots on the disc, the farther away the news originates.

We also explored alternative affordances to express distance more intuitively — testing variations in texture, spacing, and visual hierarchy to see what felt most legible and immediate.`,
  },
  evolution: {
    heading: "Evolution",
    content: `NewTen began as a tangible weather-telling device. Over time, it evolved into a system for delivering accurate, credible, and fact-checked news.

This shift came from a simple observation: people rarely question weather reports. They trust them almost implicitly. The ambition became clear - bring that same sense of reliability to news consumption.

The radio emerged as the guiding metaphor. It helped shape NewTen into a device that feels familiar, calm, and dependable.`,
  },
  interaction: {
    heading: "Interaction",
    content: `NewTen uses interchangeable discs to select categories such as:

Sports · Science · Entertainment · Gaming · Weather · Politics · Education · Fashion · Environment

Each disc contains a series of dots. The number of dots indicates the geographical distance — more dots mean news from farther away.

To use the device:

1. Place a disc on top.

2. Rotate it.

3. With each click, NewTen reads out headlines from progressively wider regions.

The modular structure allows discs to be swapped easily, tailoring the experience to different interests.`,
  },
  technology: {
    heading: "Technology",
    content: `NewTen is powered by an Arduino Uno, connected to Processing (P3) to fetch data from a trusted news API.

- Fact-checked headlines are retrieved digitally
- Audio is delivered through an integrated speaker
- A 64-LED NeoPixel array visualizes the selected location radius

As the disc rotates, the LEDs glow radially — expanding outward to reflect increasing distance.

When a disc is placed correctly, it completes the circuit and activates the system. The interaction is immediate and physical.`,
  },
  designMicroInteractions: {
    heading: "Design & Micro-Interactions",
    content: `The experience borrows from the tactile familiarity of radios and rotary controls.

The core interaction is rotation. The feedback is visual (expanding light), auditory (spoken headlines), and haptic (disc placement click).

Small details — like the subtle resistance when turning the disc or the satisfaction of snapping a disc into place — reinforce the idea that accessing news can be intentional and controlled.

NewTen reframes news consumption as something deliberate.`,
  },
};
