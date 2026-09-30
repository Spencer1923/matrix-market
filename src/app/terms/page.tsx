import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Terms | Matrix Market" };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of service"
      sections={[
        { heading: "About us", text: "Matrix Market is operated by Alejandro Sosa." },
        { heading: "Prices and payment", text: "Prices are in Canadian dollars and exclude shipping and applicable taxes, which are shown at checkout. Payment is processed securely by Stripe." },
        { heading: "Orders", text: "We may cancel and refund an order if an item is out of stock or a pricing or listing error occurred." },
        { heading: "Product information", text: "We try to keep descriptions and images accurate, but they may not always be error-free." },
        { heading: "Liability", text: "To the extent permitted by law, our liability is limited to the amount you paid for the product." },
        { heading: "Governing law", text: "These terms are governed by the laws of Ontario, Canada." },
      ]}
    />
  );
}