"use server";

import ContactForm from "@/components/contact/ContactForm";

const ContactPage = async () => {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <div className="max-w-2xl mx-auto">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
