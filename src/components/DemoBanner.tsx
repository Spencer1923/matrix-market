// Tells visitors this is a portfolio project and how to try checkout
export default function DemoBanner() {
  return (
    <div className="bg-navy px-4 py-2 text-center text-sm text-white">
      Portfolio demo store: no real products are sold. At checkout, use test card{" "}
      <span className="font-semibold text-aqua">4242 4242 4242 4242</span> with any
      future expiry date and any CVC.
    </div>
  );
}