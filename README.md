# Kalpak Korde — portfolio

Static site. No build step, no dependencies, no framework. Edit the files and push;
Vercel redeploys automatically.

```
portfolio/
  index.html          the home page
  work/*.html         one page per project — same shell, own content
  css/style.css       design tokens at the top, then sections in document order
  js/main.js          theme, nav, scroll reveal, lightbox, backdrop cross-fade
  favicon.svg
  robots.txt
  sitemap.xml
  assets/             images (.jpg + .webp pair each), og-image.png
```

All pages share `css/style.css` and `js/main.js`. Project pages sit one directory
down, so they reference those as `../css/style.css` and `../assets/…`.

## Contact

There is no contact form — deliberately. A form is a thing that can silently fail, and
the previous one did exactly that for months. Contact is a mailto button plus a
"Find me elsewhere" panel of profile links, which cannot break.

To add a profile, copy one `<li>` inside `.profile-list` in `index.html` and swap three
things: the `href`, the icon (`#i-linkedin`, `#i-github`, `#i-discord`, `#i-briefcase`
for job boards), and the two labels. There is a commented-out pair of examples right
there showing the shape.

## Editing content

Everything is plain HTML in `index.html`, in the order it appears on the page:
hero → selected work → experience → skills → credentials → contact.

**Adding a project.** Two steps. On the home page, copy an existing
`<article class="case">` (large, for flagship work) or `<article class="mini">` (card,
for smaller work) and edit the text — keep the `reveal` class, that is what drives the
scroll animation. Then copy any file in `work/` as the starting point for its detail
page, and fix up the prev/next links at the bottom of the neighbouring pages.

**Project page backgrounds.** Each detail page has a `.proj-bg` block behind the
headline. If the project has a photo it goes there, blurred and scrimmed, and drifts
slowly as you scroll. If it does not, a faint drifting rule field is used instead. Both
respect `prefers-reduced-motion`.

**Adding an image.** Save it in `assets/` as both `.jpg` and `.webp`, then reference it
with a `<picture>` block like the existing ones. Always set `width` and `height`
attributes so the page does not jump while loading, and `loading="lazy"` for anything
below the fold.

Images are heavily optimised (the whole set is ~560 KB as WebP). If you add a photo
straight from a phone camera, compress it first — a single 4 MB upload undoes the work.

## Design

Colours, fonts and spacing are CSS custom properties in the `:root` and
`[data-theme="dark"]` blocks at the top of `style.css`. Change them there and the whole
site follows. Both themes are checked against WCAG AA contrast (all pairs ≥ 5.7:1).

The accent is a single burnt-ochre; keep it as the only accent, used sparingly, or the
restraint that makes the page feel considered goes away.

## Things to keep current

- The résumé download button is currently **removed** from the hero. The markup is
  still there, commented out, next to the "Get in touch" button in `index.html` — drop
  a new `assets/resume.pdf` in and uncomment it. Keep the site's copy and the résumé
  telling the same story; they drifted badly once before.
- `sitemap.xml` — add new project pages here and bump `<lastmod>`.
- The `og-image.png` social card mentions the domain; regenerate it if the URL changes.

## Local preview

```bash
cd portfolio && python -m http.server 8899
```

Then open <http://127.0.0.1:8899>.
