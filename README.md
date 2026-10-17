# Hobie Labs website

A responsive static website for Hobie’s AI video production services, with a Team page, video portfolio, animated profiles and comment gallery.

## Preview locally

No installation or build step is required. From the project folder, run:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/ in your browser.

## Files

- `index.html` — homepage, services, portfolio, FAQs and enquiry form
- `style.css` and `app.js` — shared styling and homepage interactions
- `contact-form.js` — enquiry submission, validation and delivery status
- `full-time-unpaid-interns.html` — Team page
- `interns.css` and `interns.js` — Team styling and animations
- `assets/` — local video, image and audio files
- `robots.txt` and `sitemap.xml` — search-engine discovery

## Put this project on GitHub

1. Unzip the archive.
2. Create a GitHub repository.
3. Upload the contents of the `hobie-labs` folder, including `assets`, into the repository root. Upload the extracted files, not the ZIP itself.
4. Commit the files.

For GitHub Pages, choose **Settings → Pages → Deploy from a branch**, then select your branch and its root folder. No build command is needed. The included `.nojekyll` file keeps this a plain static site.

## Production setup

Canonical URLs, social previews and the sitemap currently use **https://www.hobielabs.com/**. Configure your chosen host and domain before launch. If using another public URL, update the canonical tags, social URLs, JSON-LD URLs, robots.txt and sitemap.xml to match it.

The contact form posts to FormSubmit for **collab@hobielabs.com**. Complete FormSubmit’s email activation and verify a real submission after publishing. Hosted visitors submit without leaving the page; local previews use FormSubmit’s standard verification flow. Failed submissions retain the entered details, and the form prevents duplicate sends while a request is pending. The site contains no email credentials or private backend.

Instagram profile numbers are fixed screenshot values with count-up animation; they are not live account data. Profile cards link to the real Instagram profiles.

The site loads its media from relative paths in `assets/`. Keep that folder alongside `index.html`. Fonts and contact-form submission need an internet connection.

## Technical SEO

Both pages include canonical URLs, social preview metadata and linked JSON-LD entities. The homepage describes the organization, its service and website; the Team page connects its existing AboutPage and people to the same website. Keep page titles and descriptions synchronized only when copy changes are approved.

`vercel.json` permanently redirects `/index.html` to `/` on Vercel to consolidate the duplicate homepage URL. Other hosts need an equivalent redirect configured separately. `robots.txt` and `sitemap.xml` list the www production domain; keep domain redirects, canonicals and the sitemap aligned. The non-www domain requires working DNS and a host-level redirect to www.

After deployment, verify both sitemap URLs return 200, `/index.html` redirects to `/`, and inspect the pages in Google Search Console. Search Console verification and sitemap submission are account-level steps, not performed by these files.

## Editing

Edit these HTML, CSS and JavaScript files directly. No framework, package manager or bundled local-preview folder is required. Publish the files at the repository root as the website root.
