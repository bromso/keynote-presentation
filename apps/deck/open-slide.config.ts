import type { OpenSlideConfig } from '@open-slide/core';

// The site root by default. GitHub Pages serves the deck from a sub-path, so
// the deploy workflow sets DECK_BASE (for example "/keynote-presentation/").
const openSlideConfig: OpenSlideConfig = {
  base: process.env.DECK_BASE ?? '/',
};

export default openSlideConfig;
