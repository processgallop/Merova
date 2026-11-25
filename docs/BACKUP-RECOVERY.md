# Database backup & recovery

All managed content, uploaded media and enquiries live in PostgreSQL, so backing up the database backs up the platform. Bundled assets (logos, renders, stock photos, seeded PDFs) are in the Git repository.

## Recommended
1. **Provider point-in-time recovery.** Neon (via Vercel Marketplace), Supabase and RDS provide automatic backups / PITR. Enable the longest retention your plan allows and test a restore to a branch quarterly.
2. **Nightly logical dump** (independent of the provider):
   ```bash
   pg_dump "$DATABASE_URL" --format=custom --no-owner --file=merova-$(date +%F).dump
   ```
   Store dumps encrypted in a separate account (e.g. S3 with lifecycle rules). Keep 30 daily + 12 monthly.
3. **Portable JSON export** (no pg tools needed): `DATABASE_URL=… npm run db:backup` writes `backups/merova-<timestamp>.json` with every table (binary media base64-encoded).

## Restore
- From a custom dump into an empty database:
  ```bash
  pg_restore --no-owner --clean --if-exists --dbname="$NEW_DATABASE_URL" merova-YYYY-MM-DD.dump
  ```
  Point `DATABASE_URL` at the restored database and redeploy. Start-up migrations are idempotent (tracked in `_merova_migrations`) and seeding is skipped because content exists.
- Single record mistakes: use **Revision history → Restore** in the editor, or restore settings from a revision (`revisions` table, `entity_type = 'settings:<key>'`).

## Disaster checklist
1. Create a new database from the latest PITR snapshot or dump.
2. Update `DATABASE_URL` in the hosting environment; redeploy.
3. Sign in, check Admin → Dashboard counts, open a product, an industry page and the latest enquiry.
4. Record the incident in the audit notes.

## Retention of personal data
Enquiries contain personal data. Agree a retention period (e.g. 24 months after last contact) and delete older enquiries from Admin → Enquiries (attachments are deleted with them). Backups older than the retention period should be expired accordingly.
