/**
 * Notes are PDFs, not Markdown.
 *
 * TO ADD A NOTE — two steps, and the second one is optional:
 *
 *   1. Drop the PDF into  public/notes/<folder>/
 *      The folder becomes the heading on the page. Create new folders freely.
 *
 *   2. (optional) Add a line to `notes` below if you want a nicer title,
 *      a sentence of context, or a term label.
 *
 * With no metadata at all a file still shows up: the folder name becomes the
 * heading, the file name becomes the title, and the size and year are read
 * off the file itself. Metadata is polish, never a requirement — the point is
 * that adding a note costs one drag-and-drop.
 *
 * Accepted extensions: .pdf .pptx .ppt  (see notes.astro)
 *
 * URLs are stable: a file at public/notes/optics/interferometry.pdf is served
 * at /notes/optics/interferometry.pdf forever, so a link you send someone
 * keeps working across rebuilds. Use lowercase-with-hyphens file names — no
 * spaces — and the URL stays clean.
 */

export interface CourseMeta {
	/** Heading shown on the page. Defaults to the folder name, prettified. */
	title?: string;
	/** One line under the heading. Optional. */
	blurb?: string;
	/** Lower numbers sort first. Unlisted folders come after listed ones. */
	order?: number;
}

export interface NoteMeta {
	/** Overrides the title derived from the file name. */
	title?: string;
	/** A sentence of context: what it covers, how finished it is. */
	description?: string;
	/** e.g. "Autumn 2025". Shown instead of the file's year. */
	term?: string;
	/** Keep the file in the repo but off the page. */
	hide?: boolean;
}

/** Keyed by folder name under public/notes/ */
export const courses: Record<string, CourseMeta> = {
	astrophysics: {
		title: 'Astrophysics',
		order: 1,
	},
	thermodynamics: {
		title: 'Thermodynamics',
		order: 2,
	},
	'summer-projects': {
		title: 'Summer projects',
		order: 9,
	},
};

/** Keyed by path under public/notes/ — folder plus file name. */
export const notes: Record<string, NoteMeta> = {
	// No `description` on these two — I have not read them, so write your own.
	'astrophysics/advanced-astrophysics.pdf': {
		title: 'Course notes',
	},
	'thermodynamics/carnot-engine.pdf': {
		title: 'The Carnot engine',
		description: 'A fun presentation hehe',
	},
	'summer-projects/elementary-particle-physics.pdf': {
		title: 'Elementary Particle Physics',
		description:
			'EPP report as part of Summer of Science',
	},
	'summer-projects/krittika-star-clusters.pdf': {
		title: 'Star clusters in nearby galaxies',
		description:
			'Krittika Summer Project',
		term: '2024',
	},
};
