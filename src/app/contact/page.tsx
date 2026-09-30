import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Contact | Matrix Market" };

export default function ContactPage() {
  return (
    <PolicyPage
      title="Contact us"
      sections={[
        { heading: "Email", text: "########@gmail.com. We reply within 1-2 business days." },
        { heading: "Business details", text: "Alejandro Sosa." },
      ]}
    />
  );
}