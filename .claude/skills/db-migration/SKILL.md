---
name: db-migration
description: Change the database schema in this repo — edit the table, generate the migration, review its SQL against the checklist, and stop to ask on destructive changes. Use for any new or changed table, column, index, trigger, function or view.
---

# Change the database

Read first: `docs/architecture/conventions.md` → Migrations, and the model doc of the area
(`docs/domain/model/README.md`).

1. **Start the dev database:** `pnpm db:up`, then `pnpm db:migrate`.
2. **Edit `<module>.table.ts`.** Tenant tables have `workspace_id` and composite foreign keys on
   `(workspace_id, id)`. Use `primaryId()`, `timestamps()` and `softDelete()`.
3. **Generate:** `pnpm db:generate --name=<what_changed>`. For functions, triggers or anything Drizzle
   can't express: `pnpm db:generate --custom --name=<what>`, then write the SQL in that file.
4. **Read the SQL, line by line:**
   - new tenant table: RLS enabled and forced, its policy, grants to the app role;
   - `timestamps()`: its `updated_at` trigger;
   - a foreign key that doesn't cascade is `DEFERRABLE INITIALLY DEFERRED`, so workspace erasure works;
   - a CHECK handles NULL explicitly;
   - a view is `security_invoker = true`;
   - a trigger across rows uses a `SECURITY DEFINER` function with `SET search_path = public, pg_temp`;
   - a new enum value can't be used in the same transaction that adds it.
5. **Destructive change (drop, rename, type change, delete of rows): stop and tell the user** before
   it runs anywhere with real data. Say what is lost and how it would be restored.
6. **Apply and test:** `pnpm db:migrate`, then the related `*.integration.test.ts`. For a database rule,
   prove the test can fail: disable the rule locally, see it go red, restore it. Assert the exact
   Postgres error with `postgresErrorCodeOf()`.
7. **Docs:** update the model doc and bump `updated:`.

Never edit a merged migration. One that exists only on your machine may be regenerated: delete its SQL,
snapshot and journal entry, then `pnpm db:reset` and migrate.
