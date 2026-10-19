import { useState } from "react";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import { grid } from "../assets";
import { Gradient } from "./design/Roadmap";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setContactMessage('Message sent successfully');
        form.reset();
        
        setTimeout(() => {
          setContactMessage('');
        }, 5000);
      } else {
        setContactMessage('Message not sent (service error)');
      }
    } catch (error) {
      console.error('FormSubmit error:', error);
      setContactMessage('Message not sent (service error)');
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
              <form 
                action="https://formsubmit.co/ajax/info.globsoft@gmail.com" 
                method="POST"
                onSubmit={handleSubmit}
              >
                {/* FormSubmit configuration - these are hidden fields */}
                <input type="hidden" name="_subject" value="New contact form submission from your Globsoft Tech! (gHIa5GIq) " />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value="https://globsoft.vercel.app/" />
                
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