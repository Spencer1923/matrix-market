import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Returns | Matrix Market" };

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns and refunds"
      sections={[
        { heading: "Return window", text: "You can return most items within 30 days of delivery." },
        { heading: "Condition", text: "Items must be unused and in original packaging. Opened software and games may not be returnable." },
        { heading: "How to return", text: "Email #########@gmail.com with your order number. We will reply with return instructions." },
        { heading: "Refunds", text: "Refunds go back to your original payment method within 5-10 business days after we receive the item." },
        { heading: "Damaged or defective items", text: "Contact us within 7 days of delivery and we will replace or refund the item. Manufacturer warranties may also apply." },
      ]}
    />
  );
}