import Link from "next/link";

export default function Footer() {
  const links = [
    ["Shipping", "/shipping"],
    ["Returns", "/returns"],
    ["Privacy", "/privacy"],
    ["Terms", "/terms"],
    ["Contact", "/contact"],
  ];

  return (
    // mt-auto pushes the footer to the bottom of short pages
    <footer className="mt-auto bg-navy px-8 py-8 text-sm text-white">
      <div className="flex flex-wrap gap-6">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="hover:text-aqua">
            {label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-white/60">© Matrix Market · Portfolio demo</p>
    </footer>
  );
}