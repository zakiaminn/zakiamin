// Framer Motion's animation features, split out so they load after the page
// instead of in the first bundle. The first screen animates in CSS and needs
// none of this.
export { domAnimation as default } from 'framer-motion';
