import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Three growing areas, each backed by Markdown files.
 * Adding an entry means adding one file — that is the whole point:
 * a living record only stays current if updating it is cheap.
 *
 * Templates showing each frontmatter shape live in src/content/_templates/
 * and are deliberately outside these collections, so an empty section
 * renders its honest empty state rather than a placeholder.
 */

const writing = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		/**
		 * Set this when the piece lives somewhere else — Notion, a journal, a
		 * gist. The listing links straight out and no local page is built for
		 * it, so an entry never resolves to an empty /writing/<slug>.
		 */
		url: z.string().url().optional(),
	}),
});

const publications = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
	schema: z.object({
		title: z.string(),
		authors: z.string(),
		venue: z.string().optional(),
		date: z.coerce.date(),
		status: z
			.enum(['in preparation', 'submitted', 'preprint', 'published'])
			.default('preprint'),
		arxiv: z.string().optional(),
		doi: z.string().optional(),
		pdf: z.string().optional(),
		summary: z.string().optional(),
	}),
});

/**
 * Notes are deliberately NOT a collection. They are PDFs on disk under
 * public/notes/, discovered at build time by src/pages/notes.astro, with
 * optional metadata in src/data/notes.ts. Adding a note is a drag-and-drop,
 * not a Markdown file. Public code on /writing works the same way, from
 * src/data/repos.ts.
 */

export const collections = { writing, publications };
