import { generatePageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";

export const metadata = generatePageMetadata(
  "Contact",
  "Contact Pinnacle Toolbox with questions, feedback, or tool suggestions. We respond to all inquiries about our free online tools.",
  "/contact",
  ["contact pinnacle toolbox", "tool feedback", "support", "suggestions"]
);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="surface-card p-8">
        <h1 className="text-3xl font-bold text-brand-white">Contact Us</h1>
        <p className="mt-4 text-brand-silver">
          Have a question, suggestion, or feedback? We&apos;d love to hear from you.
        </p>

        <ContactForm />
      </div>
    </div>
  );
}
