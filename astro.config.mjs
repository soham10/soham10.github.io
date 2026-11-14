// @ts-check
import { defineConfig } from 'astro/config';

// User-page deploy: https://soham10.github.io — served from the domain root,
// so no `base` is needed. Built output goes to dist/ and is published by
// .github/workflows/deploy.yml.
export default defineConfig({
	site: 'https://soham10.github.io',
	trailingSlash: 'ignore',
	// The warp runs for 480ms and only then sets location.href, so without
	// this the fetch for the next page starts after the animation instead of
	// during it. Hovering a link now warms the HTML, so the jump at the end
	// lands on an already-cached page.
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	// /notes was its own page until 2026-09-24, when it was folded into
	// /writing. The note PDFs still live at /notes/<course>/<file>.pdf, so only
	// the index moves; this keeps any link to the old page working.
	redirects: {
		'/notes': '/writing#notes',
	},
	build: {
		format: 'directory',
	},
	markdown: {
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
			wrap: true,
		},
	},
});
