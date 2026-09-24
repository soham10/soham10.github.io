/**
 * Public code, listed under "Code" on /writing.
 *
 * TO ADD A REPO — add one line below:
 *
 *   { repo: 'soham10/Some-Repo', desc: 'What it does, in one sentence.' },
 *
 * `repo` is owner/name; the link is built from it. `name` overrides the
 * displayed title (repo names with hyphens and course codes rarely read well).
 * `lang` is a short right-hand label — language, or whatever is most useful.
 *
 * Order here is the order on the page: put the interesting ones first. A
 * reader gives this list about ten seconds, so a repo with no description
 * earns nothing — either write one or leave it off.
 *
 * NOTE: the entries marked "check this" below are seeded from the repo name
 * alone, because the repo has no GitHub description. Rewrite them — you know
 * what is actually in there.
 */

export interface Repo {
	/** owner/name on GitHub. */
	repo: string;
	/** One sentence. Say what it does, not that it exists. */
	desc: string;
	/** Display title. Defaults to the part after the slash. */
	name?: string;
	/** Short label on the right — language, stack, course code. */
	lang?: string;
	/** A link to something the repo produced: a report, a page, a notebook. */
	extra?: { label: string; href: string };
}

export const repos: Repo[] = [
	{ 
		repo: 'soham10/Digital-Lab-PH-222', 
		name: 'Digital electronics lab', 
		desc: 'Code for Arduino Based Finger Movement Tracer and Minesweeper Game on LED Matrix, implemented using OpeCV and Mediapipe libraries, as part of the Digital Electronics Lab course at IIT Bombay', 
		lang: 'C++' 
	},
	
	{ repo: 'soham10/Troxler-Effect', 
		name: 'Troxler effect', 
		desc: 'App for demonstrating the Troxler effect, a visual phenomenon where stationary objects in the peripheral vision fade away when one fixates on a central point. part of course on Optics and Spectroscopy at IIT Bombay', 
		lang: 'HTML' },
	{
		repo: 'soham10/PH819-Advanced-Astrophysics',
		name: 'Shock formation in core-collapse supernovae',
		desc: 'Numerical schemes for a course project on supernova shocks: Burgers shocks, and shock propagation through both uniform and non-uniform density media',
		lang: 'Jupyter',
	},
	{
		repo: 'soham10/Non-Linear-Dynamics',
		name: 'Nonlinear dynamics',
		desc: 'Course simulations and project code for course on Non-linear Dynamics at IITB, the most fun course I have taken so far',
		lang: 'Python',
	},
	{
		repo: 'soham10/Krittika-Summer-Project-2024',
		name: 'Krittika Summer Project 2024',
		desc: 'Aperture photometry on Hubble imagery of star clusters in nearby galaxies, correlating flux with cluster age and ellipticity, Thanks to Tamojeet Rowchaudhury for mentoring me! ',
		lang: 'Jupyter',
		extra: { label: 'report', href: '/notes/summer-projects/krittika-star-clusters.pdf' },
	},
	{
		repo: 'soham10/-Investigation-of-Star-Clusters-to-Plot-the-HR-Diagram-and-Find-Out-Their-Mass-Function',
		name: 'HR diagrams and cluster mass functions',
		desc: 'Group project for PH 556: Astronomy — plotting HR diagrams for star clusters and recovering their mass functions from the photometry. Shoutout to Atharv Maheshwari and Yash Palwe for being great teammates!',
		lang: 'Jupyter',
	},
	{
		// check this — seeded from the repo name
		repo: 'soham10/Quantum-Machine-Learning',
		name: 'Quantum machine learning',
		desc: 'Weekwise notebooks prepared while studying quantum machine learning, includes the simulators for gates and algorithms, and the code for the QML assignments. Thanks to Aditya Saran for mentoring me!',
		lang: 'Jupyter',
	},
	{
		repo: 'soham10/PH447-Optics-and-Spectroscopy-Lab',
		name: 'Optics and spectroscopy lab',
		desc: 'Every experiment from the lab course with the analysis notebooks and post-lab calculations, plus the references that put each one in context',
		lang: 'Jupyter',
	},
	{
		repo: 'soham10/PH227--Artificial-Intelligence-and-Data-Science',
		name: 'AI and data science',
		desc: 'Assignments from course on artificial intelligence and data science',
		lang: 'Jupyter',
	},
];
