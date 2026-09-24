// @ts-check
import { defineConfig } from 'astro/config';

// User-page deploy: https://soham10.github.io — served from the domain root,
// so no `base` is needed. Built output goes to dist/ and is published by
// .github/workflows/deploy.yml.
export default defineConfig({
	site: 'https://soham10.github.io',
	trailingSlash: 'ignore',
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
