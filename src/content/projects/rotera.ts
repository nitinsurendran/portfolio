import { ProjectContent } from "../types";

// Helper to split body content into paragraphs
const paragraphs = (text: string): string[] => {
  return text.split("\n\n").filter((p) => p.trim());
};

const bodyContent1 = `Version 1 defined the baseline: a quiet, reliable 3D canvas focused on viewing the product in three dimensions. Something to test the waters with - that's it.

The interface remained deliberately quiet. A dedicated modal, framed in neutral lighting, free of decision-making pressure. This allowed the object itself - its form, proportions, and presence to take precedence over the interface surrounding it.

Colour variants were integrated directly into the 3D view, enabling quick comparison without breaking focus or context. The interaction was intentionally lightweight: select a variant, observe the change, move on. At this stage, the goal was not configuration.

An AR entry point was included from the start as a natural extension of the 3D experience. Available when the screen was no longer enough and the product needed to be understood in physical space.

Version 1 laid the foundations of the system. It set the baseline for all subsequent iterations, allowing later versions to build complexity without losing clarity.`;

const bodyContent2 = `With the foundations in place, this iteration brought conversion closer to the surface.

The add-to-bag action became a clear, primary element of the experience - no longer something that required stepping back out of 3D. The intent was simple: if a customer is confident enough to explore a product in three dimensions, they should be able to act on that confidence without friction.

3D product exploration and shopping were no longer treated as separate modes. Instead, 3D became a natural part of the purchasing flow, sitting alongside familiar IKEA shopping behaviours rather than outside of them.

This version also expanded how context was explored. When exploring AR view, I tried showing products as they might appear in real, imperfect spaces. Furniture was placed in lived-in environments: rooms with clutter, rooms with pets, rooms that felt occupied or unfinished.`;

const bodyContent3 = `This iteration introduced dimensions directly into the 3D view, anchoring measurements to the product itself rather than pushing them into specifications or tables elsewhere on the page. Height, width, and depth became part of the visual experience.

Measurements were designed to appear lightly, without overwhelming the product. They surfaced when needed and receded when not, allowing customers to move between visual exploration and practical evaluation without leaving the 3D canvas.

By placing dimensions on the object, the experience reduced the mental translation customers often have to perform: switching between numbers, imagination, and space.

This approach was applied across different categories, from storage to lighting, reinforcing that scale matters regardless of product type. Whether tall, wide, or suspended, each product communicated its physical presence directly through the 3D view.`;

const bodyContent4 = `Up to this point, the 3D experience had been centred on the product: how it looks, how big it is, how confidently it can be chosen. Version 3 introduced a new question - how would it look inside a room?

This was the first time the 3D product view was explicitly linked to IKEA Kreativ. A simple but deliberate toggle allowed customers to move between "3D view" and "Design in a room," signalling a shift from isolated inspection to spatial composition.

The transition into Kreativ was designed to feel continuous. Inside the room view, the selected product appeared already placed, grounded in realistic lighting and scale, surrounded by empty space ready to be shaped.

Version 3 established the foundations for embedded room experiences at IKEA. It demonstrated how a product-level interaction could naturally extend into room-level design, and how planning tools like Kreativ could be introduced earlier in the shopping journey; without overwhelming users or breaking flow.`;

const bodyContent5 = `Alongside the shift into room-based exploration, we also revisited how colour variants were represented. Rather than relying on hex colour swatches or miniature product photos, we introduced a new approach that used close-up images of the product itself - which allowed users to look at the textures.`;

const bodyContent6 = `Planners are powerful, but demanding. Kreativ is spatial and intuitive, but open-ended. This version explored how both could live closer to the product - without forcing users to commit too early.

To soften the jump into planners, we experimented with a snapshot view. Just enough of the planner to hint at what's possible. Kreativ was brought in with the same restraint. Room selection, early placement, and variant changes happened before entering the full tool.`;

export const rotera: ProjectContent = {
  slug: "rotera",
  title: "Rotera",
  description:
    "A 3D product experience system for IKEA, exploring how spatial commerce can bridge the gap between digital exploration and physical purchase.",
  badges: [
    { label: "Contextual Suggestions", icon: "Sparkles" },
    { label: "3D Product Bundling", icon: "Cuboid" },
  ],
  blocks: [
    { type: "ProjectTitle" },
    { type: "BackNavigation" },
    {
      type: "ProjectDescription",
      description:
        "A 3D product experience system for IKEA, exploring how spatial commerce can bridge the gap between digital exploration and physical purchase.",
      badges: [
        { label: "Contextual Suggestions", icon: "Sparkles" },
        { label: "3D Product Bundling", icon: "Cuboid" },
      ],
    },
    {
      type: "HeroMedia",
      key: "hero",
    },
    { type: "ProjectOverview" },
    {
      type: "ImageLarge",
      key: "section1",
    },
    {
      type: "ImageSmall",
      key: "section1",
    },
    {
      type: "ImageSmall",
      key: "section2",
    },
    {
      type: "Body",
      content: paragraphs(bodyContent1),
      heading: "Version 1: Establishing the 3D Canvas",
    },
    { type: "Divider" },
    {
      type: "ImageLarge",
      key: "section3",
    },
    {
      type: "Body",
      content: paragraphs(bodyContent2),
      heading: "Version 1.1: Making 3D Part of the Shopping Journey",
    },
    { type: "Divider" },
    {
      type: "ImageLarge",
      key: "section4",
    },
    {
      type: "ImageSmall",
      key: "section5",
    },
    {
      type: "Body",
      content: paragraphs(bodyContent3),
      heading: "Version 2: Making Scale Explicit",
    },
    { type: "Divider" },
    {
      type: "ImageLarge",
      key: "section6",
    },
    {
      type: "ImageLarge",
      key: "section7",
      width: 929,
    },
    {
      type: "Body",
      content: paragraphs(bodyContent4),
      heading: "Version 3: From Product to Room",
    },
    { type: "Divider" },
    {
      type: "ImageLarge",
      key: "section8",
    },
    {
      type: "Body",
      content: paragraphs(bodyContent5),
      heading: "Version 3.1: Texture swatches",
    },
    { type: "Divider" },
    {
      type: "ImageSmall",
      key: "section9",
    },
    {
      type: "Body",
      content: paragraphs(bodyContent6),
      heading: "Version 4: Embedding Planning Tools Without Breaking the Journey",
    },
    { type: "Divider" },
    { type: "OtherProjects" },
    { type: "Footer", variant: "default" },
    { type: "Footer", variant: "alt" },
  ],
};

