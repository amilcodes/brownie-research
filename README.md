# Brownie Research

Website for Brownie Research, a student-led foundation model research lab.

The site is plain HTML, CSS, and JavaScript. No build step or package installation is required.

## Publishing

GitHub Pages publishes the root of the `main` branch. Edit the website files and push to `main` to update the site.

## Files

- `index.html`: page content
- `styles.css`: layout and styling
- `app.js`: point cloud and interactions
- `assets/`: logo, fonts, and font licenses

## Font comparisons

The default uses IBM Plex Mono for headings and IBM Plex Sans for body text.
Append `?font=mono` to preview IBM Plex Mono throughout, or `?font=source` for
Source Code Pro. These comparisons use the same content and layout.

Font files are self-hosted under their included SIL Open Font Licenses.

## Local preview

Run `python3 -m http.server 4173` in this directory, then visit http://localhost:4173.
