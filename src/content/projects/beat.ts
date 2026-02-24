/**
 * BEAT case study — canonical body copy (VERBATIM).
 * Do not paraphrase, correct, or alter. Source of truth for the detail page.
 */
export const beatCopy = {
  challenge: {
    heading: "The challenge",
    content: `Drivers experience ride requests in motion: in traffic, under glare, with limited attention and real economic pressure. Despite this, the system expected repeated, fast, and rational decisions, often seconds apart. Internally, we observed that a significant share of requests timed out rather than being explicitly accepted or rejected, triggering aggressive rebroadcasting and creating a loop of interruptions.

The surface-level framing—"drivers are rejecting too many rides"—failed to explain the behavior we were seeing. We needed to understand what the system was teaching drivers to do.`,
  },
  researchIntro: {
    heading: "Research: fear, ambiguity, and avoidance",
    content: `Interviews with experienced drivers across markets revealed a consistent mental model. Drivers did not clearly understand the consequences of rejecting a request. Many believed it would negatively affect their evaluation, acceptance rate, or access to future rides.

One driver summarized it succinctly:`,
  },
  researchQuote1: `"I don't want to tap on 'Reject'. I think that might negatively affect my evaluation. I want to keep a good evaluation, so I don't get punished or blocked."`,
  researchMid: {
    heading: null,
    content: `Another explained the inconsistency this created:`,
  },
  researchQuote2: `"Sometimes I reject, sometimes I accept. Honestly, I don't know if there's any difference."`,
  researchEnd: {
    heading: null,
    content: `Ignoring a request felt safer than making an explicit choice. What looked like indecision was, in fact, a rational response to uncertainty and fear.`,
  },
  evidence: {
    heading: "Evidence from the marketplace",
    content: `System data confirmed the behavioral pattern. Twenty-six percent of new ride broadcasts were triggered within two seconds of a previous request being ignored or rejected, effectively spamming drivers during peak periods. Across multiple markets, acceptance rates showed a correlation of 0.9 with the time elapsed since the previous request. The shorter the gap between requests, the lower the likelihood of acceptance.

The system was optimized for speed, but at the cost of decision quality. Haste, not demand, was driving rejection and avoidance.`,
  },
  framingIntro: {
    heading: "Framing the problem",
    content: `From this synthesis, three core questions emerged:`,
  },
  framingHMW: `How might we reduce fear-driven avoidance at the moment of decision, without coercing drivers or degrading trust?

How might we give drivers enough clarity to make a conscious choice in seconds, while on the move?

How might we improve the quality of intent signals feeding dispatch and ML models, without increasing incentives or friction?`,
  framingOutro: {
    heading: null,
    content: `These questions reframed the work from interface redesign to marketplace intervention.`,
  },
  intervention1: {
    heading: "Intervention 1: changing the tempo of the system",
    content: `The first lever addressed request pacing. We introduced a short buffer between consecutive requests, allowing drivers a brief cognitive reset before being asked to decide again. The intent was not to slow the marketplace, but to prevent the system from overwhelming its participants.

In a controlled experiment in Mexico, a five-second buffer led to a measurable improvement: acceptance rates increased by 8.5%, completed rides increased by 5.2%, and rides per driver increased by 4.9%. These gains came without changes to incentives, demonstrating that timing alone could shift marketplace behavior.`,
  },
  intervention2: {
    heading: "Intervention 2: changing the meaning of rejection",
    content: `The second lever addressed language. "Reject" carried the weight of punishment and loss. We introduced "Skip" to signal a different intent: readiness for the next opportunity.

This semantic change reframed driver agency. Skipping no longer felt like failure, but like an explicit preference. For drivers, this reduced anxiety. For the system, it produced cleaner intent data. For machine learning models, it improved the quality of signals used to predict acceptance and match future requests.
Language became a structural component of the system, not a cosmetic choice.`,
  },
  fromMicroInterventions: {
    heading: "From Micro-Interventions to Full Redesign",
    content: `The introduction of a pacing buffer and the semantic shift from "Reject" to "Skip" were deliberately modest interventions. They did not alter incentives or pricing mechanics. They simply adjusted tempo and meaning. Yet their impact was measurable. Acceptance improved. Drivers skipped more consciously.

Those results revealed something deeper. If small systemic adjustments could meaningfully influence behavior, then the request page itself — the surface where decisions are made — deserved a more fundamental rethink`,
  },
  theMap: {
    heading: "The Map",
    content: `The first place I looked was the map.

The existing map offered minimal decision support. Drivers could see their own location and a passenger pin. There was no temporal framing, no preview of route effort, and no clear distinction between pickup and drop-off in terms of time cost. For a decision that directly affects income, that abstraction was insufficient.  To improve decision-making, the interface began surfacing what riders actually calculate mentally: route visibility, time to passenger, total journey duration, and clearly differentiated pickup and drop-off points. The goal was simple — make effort visible.

But increasing informational richness does not automatically increase clarity. As more data appeared, hierarchy weakened. Labels competed. Icons multiplied. The map grew denser without becoming easier to read.

The breakthrough was not in adding information, but in structuring attention. Clarity emerged by defining what matters first, what supports it second, and what can quietly recede. The interface shifted from showing more to guiding focus.`,
  },
  increasingAffordance: {
    heading: "Increasing Affordance to Accept",
    content: `With the map clarified, the next focus was agency.
The previous acceptance screen lacked clear affordance. There was no distinct primary CTA. Drivers tapped the card area out of habit rather than intuition. For a livelihood-dependent action, the interaction felt learned rather than invited.`,
  },
  designingForDeliberateAction: {
    heading: "Designing for Deliberate Action",
    content: `I explored multiple interaction patterns. Some emphasized large text and explicit buttons. Others experimented with gesture-based confirmation. While visually expressive, several variants felt heavy or required relearning familiar behaviors. Delight, if overdone, risked slowing comprehension.`,
  },
  finalAcceptanceScreen: {
    heading: "The Final Acceptance Screen",
    content: `The final acceptance surface integrated clarity and restraint. A clear primary "Accept" CTA anchored the screen. Rich contextual information — fare, pickup, drop-off, time, and distance — was presented with strong hierarchy. The map remained visible and legible, reinforcing spatial understanding. "Skip" remained available, framed as preference rather than penalty.`,
  },
  outcomes: {
    heading: "Outcomes",
    content: `Across test markets, the combined interventions produced higher acceptance rates, increased ride throughput, and fewer unnecessary rebroadcasts. Drivers reported clearer expectations and less hesitation at the moment of decision. The system benefited from cleaner behavioral signals, improving dispatch efficiency without escalating incentive spend.

Most importantly, the marketplace became calmer. Decisions improved not because drivers were pushed harder, but because the system stopped punishing them for being honest.`,
  },
} as const;

export type BeatContentKey = keyof typeof beatCopy;
