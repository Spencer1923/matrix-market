import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Shipping | Matrix Market" }; // browser tab title

export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping"
      sections={[
        { heading: "Where we ship", text: "We ship to Canada and the United States." },
        { heading: "Cost", text: "Shipping is a flat $9.99. Orders of $150 or more ship free." },
        { heading: "Processing and delivery", text: "Orders are processed within 1-2 business days. Delivery usually takes 3-7 business days after that." },
        { heading: "Tracking", text: "By email once the order ships." },
        { heading: "Taxes", text: "Applicable sales taxes are calculated at checkout based on your shipping address." },
      ]}
    />
  );
}