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
	{ src: '/images/gallery/main_building.png', alt: 'IITB Main Building', caption: 'Annoying yet beautiful Main Building' },
	// { src: '/images/gallery/inter-iit.jpg', alt: 'The quiz team holding a trophy', caption: 'Inter IIT, Patna' },
	// { src: '/images/gallery/pondicherry.jpg', alt: 'A street in Pondicherry', portrait: true, caption: 'Pondicherry' },
];

