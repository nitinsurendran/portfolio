/**
 * Media manifest for rotera project
 * Lists all available media files that exist in /public/media/projects/rotera/
 * 
 * When adding new media:
 * 1. Copy file to appropriate folder under /public/media/projects/rotera/
 * 2. Add filename to this array
 * 3. Refresh page
 */

export const roteraManifest = [
  // Hero
  "hero/hero.mov",
  "posters/hero.jpg",
  
  // Section 1 - Large block
  "sections/section1.mov",
  "posters/section1.jpg",
  
  // Section 1 - Side-by-side block (ImageSmall)
  "sections/section1-left.mov",
  "sections/section1-right.mov",
  "posters/section1-left.jpg",
  "posters/section1-right.jpg",
  
  // Section 2
  "sections/section2-left.jpg",
  "sections/section2-right.jpg",
  
  // Section 3
  "sections/section3.mp4",
  "posters/section3.jpg",
  
  // Section 4
  "sections/section4.mp4",
  "posters/section4.jpg",
  
  // Section 5
  "sections/section5-left.jpg",
  "sections/section5-right.jpg",
  
  // Section 6
  "sections/section6.mp4",
  "posters/section6.jpg",
  
  // Section 7
  "sections/section7.mp4",
  "posters/section7.jpg",
  
  // Section 8
  "sections/section8.jpg",
  
  // Section 9
  "sections/section9-left.jpg",
  "sections/section9-right.jpg",
] as const;

