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
    <footer className="mt-auto border-t px-8 py-6 text-sm">
      <div className="flex flex-wrap gap-6">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="hover:underline">
            {label}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-gray-600">© Matrix Market</p>
    </footer>
  );
}