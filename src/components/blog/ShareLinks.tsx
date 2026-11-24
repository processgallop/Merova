/** Share via plain URLs: no third-party scripts and no tracking pixels. */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];
  return (
    <span className="flex items-center gap-3">
      <span>Share:</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target={l.label === "Email" ? undefined : "_blank"} rel="noopener" className="font-semibold text-char-800 hover:text-red-600">{l.label}</a>
      ))}
    </span>
  );
}
