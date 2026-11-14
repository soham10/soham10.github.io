/**
 * Photos for the strip on the home page.
 *
 * To add one:
 *   1. drop the image into  public/images/gallery/
 *   2. add a line below
 *
 * Order here is the order on the page. Tiles are a fixed size and the image
 * is cropped to fill, so anything roughly landscape works best — mark a tall
 * photo with `portrait: true` and it gets a narrower tile instead of a bad crop.
 *
 * alt is for someone who cannot see the photo; caption is for everyone.
 */

export interface Shot {
	src: string;
	alt: string;
	caption?: string;
	portrait?: boolean;
}

export const gallery: Shot[] = [
	{ src: '/images/gallery/main_building.png', alt: 'IITB Main Building'},
	{ src: '/images/gallery/1.jpeg', alt: 'random 1'},
	{ src: '/images/gallery/2.jpeg', alt: 'random 2'},
	{ src: '/images/gallery/3.jpeg', alt: 'random 3'},
	{ src: '/images/gallery/4.jpeg', alt: 'random 4'},
	{ src: '/images/gallery/5.jpeg', alt: 'random 5'},
	{ src: '/images/gallery/6.jpeg', alt: 'random 6'},
	{ src: '/images/gallery/7.jpeg', alt: 'random 7'},
	{ src: '/images/gallery/8.jpeg', alt: 'random 8'},
	{ src: '/images/gallery/9.jpeg', alt: 'random 9'},
	{ src: '/images/gallery/10.jpeg', alt: 'random 10'},
	{ src: '/images/gallery/11.jpeg', alt: 'random 11'},
	{ src: '/images/gallery/12.jpeg', alt: 'random 12'},
	{ src: '/images/gallery/13.jpeg', alt: 'random 13'},
	{ src: '/images/gallery/14.jpeg', alt: 'random 14'}
];

