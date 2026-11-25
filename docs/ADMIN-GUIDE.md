# Merova admin guide

Sign in at **/admin**. What you see depends on your role.

| Role | Can do |
|---|---|
| Super Administrator | Everything, including users, settings, brand & appearance and the audit log |
| Content Administrator | Pages, homepage, knowledge centre, resources, media, navigation, SEO & redirects |
| Product Administrator | Segments, products, industries and their mappings, media |
| Sales Administrator | Enquiries (view, assign, status, notes, export) and read-only catalogue |
| Read-Only User | View the dashboard, catalogue and content without changes |

## Publishing workflow
Every record has a status: **Draft → Pending review → Approved → Published → Archived**. Only Published content appears on the website, in search results, in the sitemap and in MIRA. Users without publishing rights can save drafts and **Submit for review**. Set a future **Publish date** to schedule. Every save keeps a revision — open **Revision history** and **Restore** to roll back (review, then save). Use **Preview** to see a draft on the real page layout.

## Products
Products → open a product (or **Add product**).
- **Basics** — name, unique product ID, URL slug, primary segment, product family.
- **Content** — overview, applications, formats, materials, printing, customisation, quality, FAQs.
- **Technical** — specification table (mark values “Confirmed at quotation” unless verified), quote form profile, availability classification (*Capability pending* shows a notice publicly), verification status, MOQ/lead time only if confirmed.
- **Industries & related** — add the industries the product genuinely serves; it then appears automatically on each industry page and in the industry finder. Remove an industry to remove it from that page only.
- **Media & flyer** — images (first = primary; set alt text and image type honestly), video, and the product flyer PDF. Replacing the PDF updates every download link.
- **SEO** — keywords, title, description, social image, canonical, noindex.

Changing the slug offers an automatic **301 redirect** from the old URL. **Duplicate** creates a draft copy. Incomplete products can stay in Draft until verified.

## Segments
Edit names, short names, codes, families, technologies, FAQs, images and SEO; **Reorder** sets menu/page order. A segment that still contains products cannot be deleted — use **Reassign & delete** to move its products first, or archive it.

## Industries
Edit the introduction, sub-industries, typical requirements, FAQs, images and SEO. **Product mapping** lists the products shown on that industry page, in order, with optional application context and relevance. This edits the same relationship as the product's Industries tab — a product exists once and can appear on many industry pages.

## Homepage & pages
Content → **Homepage** (or Pages → any page). Pages are built from approved sections: hero, statement, text, image & text, highlights, process steps, statistics, gallery, product segments, industry finder, product grid, industry grid, testimonials, client logos, FAQs, video, downloads, latest articles, “awaiting confirmation”, contact form and call-to-action. Click a section to edit; drag or use the arrows to reorder; use the eye to hide/show; duplicate or remove. Layouts adapt automatically, so content cannot break the design. Preview at desktop, tablet and mobile widths (shows the last saved version).

Statistics, testimonials and client logos are published only when ticked as verified / approved / authorised. New pages use paths like `about/new-page`; system pages (homepage, legal) keep their paths.

## Knowledge centre
Write articles in Markdown sections (paragraphs, lists, `### ` sub-headings, `> ` notes, `| tables |`, `![alt](url)` images), add a featured image, related products and FAQs. Articles stay out of search engines until **Technical review** is set to *Reviewed* with a named reviewer.

## Resources & PDFs
Catalogue, company profile, brochures and technical documents shown on the Resources page. Replace a PDF and every link updates.

## Media library
Upload images, PDFs and MP4 video (4 MB per file; images are optimised automatically). Add titles, alt text, credits, source and licence; flag stock images. **Check usage** shows where a file is used. Files in use cannot be deleted. **Upload a new version** keeps the same URL; **Replace everywhere** swaps one image for another across the site — use it to replace stock photography with authentic Merova photography.

## Navigation & footer
Edit primary menu items (label, link, menu type, visibility, order) and grouped dropdown links; edit footer statement, link columns and legal links. The Products and Industries mega menus build themselves from the catalogue.

## Brand & appearance
Brand colours (HEX or picker), font pairing, base text size, heading weight, corner radius, content width and section spacing, with a live preview. **Load defaults** returns to the official Merova palette (Merova Red #D52B1E, Charcoal #454040, Cloud Dancer #FFFAF3). Keep Merova Red as the primary colour and use only official logo artwork.

## SEO & redirects
Global title template, default description and social image, indexing switch; manual redirects (automatic ones are added when URLs change); **SEO health** lists missing descriptions, alt text, long titles, duplicates and unreviewed articles. The sitemap and robots.txt update automatically.

## Enquiries
Every website submission is stored with its industry, products and per-product specifications, files, source page and UTM data. Filter by status, type, industry, product, assignee or date; open an enquiry to change status (New → Contacted → Requirement under review → Quotation in progress → Quotation sent → Negotiation → Converted / Closed – not converted), assign it, add internal notes and download attachments. **Export CSV** exports the filtered list. Deleting removes attachments too — follow your retention policy.

## Users & security
Super Administrators create users (a temporary password is shown once), change roles, reset passwords or two-step verification, and deactivate accounts. Everyone should enable **two-step verification** in My account. Accounts lock for 15 minutes after five failed sign-ins. The **Audit log** records who changed what and when.

## Settings
Company details, verified contact channels, WhatsApp number and default message, addresses, map, hours, GSTIN, social links, enquiry notification recipients, analytics IDs and the cookie banner. The Integrations panel shows which services are configured (secrets live in the hosting environment, never in the dashboard).
