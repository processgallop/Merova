import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { Paperclip } from "lucide-react";
import { getDb, schema as t } from "@/db";
import { requireUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { ENQUIRY_TYPES } from "@/lib/quote";
import { EnquiryControls } from "@/components/admin/EnquiryControls";
import { markReadAction } from "../actions";

export const metadata = { title: "Enquiry" };

function Row({ k, v }: { k: string; v?: string | null }) {
  return v ? <div className="grid grid-cols-3 gap-3 border-b border-line py-2 text-sm last:border-0"><dt className="text-muted">{k}</dt><dd className="col-span-2 whitespace-pre-wrap text-heading">{v}</dd></div> : null;
}

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("enquiries.view");
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = await getDb();
  const [e] = await db.select().from(t.enquiries).where(eq(t.enquiries.id, id));
  if (!e) notFound();
  if (!e.isRead) await markReadAction(id);
  const [notes, users] = await Promise.all([db.select().from(t.enquiryNotes).where(eq(t.enquiryNotes.enquiryId, id)).orderBy(asc(t.enquiryNotes.createdAt)), db.select({ id: t.users.id, name: t.users.name, active: t.users.active }).from(t.users)]);
  return (
    <div>
      <Link href="/admin/enquiries" className="text-xs font-semibold text-muted hover:text-red">← Enquiries</Link>
      <div className="mt-1 flex flex-wrap items-baseline gap-3">
        <h1 className="font-display text-3xl font-bold">{e.name}{e.company ? ` · ${e.company}` : ""}</h1>
        <span className="text-sm text-muted">{e.reference} · {e.createdAt.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</span>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-[3px] border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Contact</h2>
            <dl className="mt-3">
              <Row k="Name" v={e.name} />
              <Row k="Company" v={e.company} />
              <div className="grid grid-cols-3 gap-3 border-b border-line py-2 text-sm"><dt className="text-muted">Email</dt><dd className="col-span-2"><a href={`mailto:${e.email}?subject=${encodeURIComponent(`Re: your enquiry ${e.reference}`)}`} className="text-red underline">{e.email}</a></dd></div>
              {e.phone ? <div className="grid grid-cols-3 gap-3 border-b border-line py-2 text-sm"><dt className="text-muted">Phone</dt><dd className="col-span-2"><a href={`tel:${e.phone}`} className="text-red underline">{e.phone}</a></dd></div> : null}
              <Row k="Location" v={e.location} />
            </dl>
          </section>
          <section className="rounded-[3px] border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Requirement</h2>
            <dl className="mt-3">
              <Row k="Type" v={ENQUIRY_TYPES[e.type as keyof typeof ENQUIRY_TYPES] ?? e.type} />
              <Row k="Routed to" v={e.team} />
              <Row k="Industry" v={e.industry} />
              <Row k="Quantity" v={e.quantity} />
              <Row k="Delivery" v={e.delivery} />
              <Row k="Timeline" v={e.timeline} />
              {Object.entries(e.details).map(([k, v]) => <Row key={k} k={k} v={v} />)}
              <Row k="Message" v={e.message} />
            </dl>
            {e.products.length ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-heading">{e.products.length} product{e.products.length > 1 ? "s" : ""}</p>
                {e.products.map((p) => (
                  <div key={p.slug} className="rounded-[3px] border border-line p-3">
                    <p className="font-semibold text-heading">{p.name} <span className="text-xs font-normal text-muted">· {p.segment}</span></p>
                    {p.specs && Object.keys(p.specs).length ? <dl className="mt-2">{Object.entries(p.specs).map(([k, v]) => <Row key={k} k={k} v={v} />)}</dl> : <p className="mt-1 text-xs text-muted">No specifications given.</p>}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
          {e.files.length ? (
            <section className="rounded-[3px] border border-line bg-white p-5">
              <h2 className="font-display text-lg font-bold">Files</h2>
              <ul className="mt-3 space-y-2 text-sm">{e.files.map((f) => <li key={f.mediaId}><a href={`/media/${f.mediaId}/${encodeURIComponent(f.name)}`} className="flex items-center gap-2 text-red underline"><Paperclip className="size-4" />{f.name}</a> <span className="text-xs text-muted">{Math.ceil(f.size / 1024)} KB</span></li>)}</ul>
            </section>
          ) : null}
          <section className="rounded-[3px] border border-line bg-white p-5 text-sm">
            <h2 className="font-display text-lg font-bold">Source</h2>
            <dl className="mt-3"><Row k="Page" v={e.source.page} /><Row k="Referrer" v={e.source.referrer} /><Row k="UTM" v={e.source.utm ? Object.entries(e.source.utm).map(([k, v]) => `${k}=${v}`).join(" ") : null} /><Row k="Notifications" v={e.deliveryLog.join("\n") || "No external channels configured — stored in the dashboard only."} /></dl>
          </section>
        </div>
        <EnquiryControls
          id={e.id}
          status={e.status}
          assignedTo={e.assignedTo}
          users={users.filter((u) => u.active).map((u) => ({ id: u.id, name: u.name }))}
          notes={notes.map((n) => ({ id: n.id, kind: n.kind, body: n.body, userName: n.userName, createdAt: n.createdAt.toISOString() }))}
          canEdit={can(user.role, "enquiries.edit")}
          canDelete={can(user.role, "enquiries.delete")}
        />
      </div>
    </div>
  );
}
