import { useState } from "react";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import { grid } from "../assets";
import { Gradient } from "./design/Roadmap";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const adminPortalUrl = (
    import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
  ).replace(/\/+$/, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setContactMessage('');

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch(`${adminPortalUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData.success !== false) {
        setContactMessage('Message sent successfully! We will get back to you shortly.');
        form.reset();
        
        setTimeout(() => {
          setContactMessage('');
        }, 5000);
      } else {
        setContactMessage(resData.error || 'Message not sent. Please try again.');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      setContactMessage('Could not connect to server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="overflow-hidden" id="contact">
      <div className="container md:pb-10">
        <Heading tag="Ready to get started" title="Get in touch with us" />

        <div className="relative p-0.25 rounded-[2.5rem] bg-n-6">
          <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
            <div className="absolute top-0 left-0 max-w-full">
              <img
                className="w-full"
                src={grid}
                width={550}
                height={550}
                alt="Grid"
              />
            </div>
            <div className="relative z-1">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block body-2 text-n-1 mb-4" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors"
                    type="text"
                    id="name"
                    name="name"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label className="block body-2 text-n-1 mb-4" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors"
                    type="email"
                    id="email"
                    name="email"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label className="block body-2 text-n-1 mb-4" htmlFor="message">
                    Your Message
                  </label>
                  <textarea
                    className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors min-h-[150px]"
                    id="message"
                    name="message"
                    required
                  />
                </div>

                <div className="flex justify-between items-center">
                  {contactMessage && (
                    <p className={`body-2 ${
                      contactMessage.includes('successfully') 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {contactMessage}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={isSubmitting ? 'opacity-50' : ''}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Gradient />
      </div>
    </Section>
  );
};

export default Contact;
