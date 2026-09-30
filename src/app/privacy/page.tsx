import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Privacy | Matrix Market" };

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy policy"
      sections={[
        { heading: "What we collect", text: "When you place an order we collect your name, email, shipping address, and order details." },
        { heading: "Payments", text: "Payments are processed by Stripe. We never see or store your card number." },
        { heading: "How we use it", text: "We use your information to fulfil and ship your order and to contact you about it. We do not sell your personal information." },
        { heading: "Where it is stored", text: "Order data is stored with our database provider, Supabase. Your shopping cart is kept only in your own browser." },
        { heading: "Your choices", text: "To ask what we hold about you, or to have it corrected or deleted where the law allows, email #########@gmail.com.." },
      ]}
    />
  );
}