# Brownie Research

Website for Brownie Research, a student-led foundation model research lab.

The site is plain HTML, CSS, and JavaScript. No build step or package installation is required.

## Publishing

GitHub Pages publishes the root of the `main` branch. Edit the website files and push to `main` to update the site.

## Files

- `index.html`: page content
- `styles.css`: layout and styling
- `app.js`: design preview selection and copyright year
- `assets/`: logo, fonts, and font licenses

## Design comparisons

The default uses Departure Mono headings, Verdana text, and a compact early desktop
interface. Use `?theme=terminal` for VT323 and a text interface, or `?theme=classic`
for Georgia and a plain academic page.

The geometric illustration is a static SVG. No animation or framework is needed.
Departure Mono and VT323 are self-hosted under their included SIL Open Font
Licenses. Georgia and Verdana use the visitor's available system fonts.

Font sources:
- https://github.com/rektdeckard/departure-mono
- https://github.com/google/fonts/tree/main/ofl/vt323

## Local preview

Run `python3 -m http.server 4173` in this directory, then visit http://localhost:4173.
