// src/components/OrderNow.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from './Section';
import Heading from './Heading';
import Button from './Button';
import Header from './Header';
import Footer from './Footer';
import ButtonGradient from '../assets/svg/ButtonGradient';
import { grid } from '../assets';
import { Gradient } from './design/Roadmap';

const OrderNow = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        setSubmitted(true);
        form.reset();
        
        // Redirect to home after 5 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        alert('Order submission failed. Please try again.');
      }
    } catch (error) {
      console.error('FormSubmit error:', error);
      alert('Order submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
          <Header />
          <Section className="overflow-hidden" id="order-success">
            <div className="container md:pb-10">
              <div className="text-center mb-12">
                <div className="mb-8 flex justify-center">
                  <div className="relative w-[100px] h-[100px] rounded-full bg-conic-gradient p-[2px]">
                    <div className="w-full h-full bg-n-8 rounded-full flex items-center justify-center">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <path 
                          d="M15 25L22 32L35 19" 
                          stroke="url(#check-gradient)" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient id="check-gradient" x1="15" y1="19" x2="35" y2="32">
                            <stop stopColor="#AC6AFF" />
                            <stop offset="1" stopColor="#FFC876" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                <h2 className="h2 mb-4">Order Submitted Successfully!</h2>
                <p className="body-1 text-n-2 mb-8">
                  Thank you for choosing Globsoft Tech! Our team will review your order and get back to you within 24 hours.
                </p>
                <Button onClick={() => navigate('/')} white>
                  Back to Home
                </Button>
              </div>
            </div>
          </Section>
          <Footer />
        </div>
        <ButtonGradient />
      </>
    );
  }

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Section className="overflow-hidden" id="order">
          <div className="container md:pb-10">
            <Heading 
              tag="Ready to start your project" 
              title="Place Your Order" 
            />

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
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                  >
                    {/* FormSubmit configuration - hidden fields */}
                    <input type="hidden" name="_subject" value="New Order Submission from Globsoft Tech! (L4tO9mCG) " />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_cc" value="info.globsoft@gmail.com" />
                    <input type="hidden" name="_next" value="https://globsoft.vercel.app/" />
                    
                    {/* Name and Email - Side by side on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block body-2 text-n-1 mb-4" htmlFor="name">
                          Full Name <span className="text-color-1">*</span>
                        </label>
                        <input
                          className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors"
                          type="text"
                          id="name"
                          name="name"
                          placeholder="John Poudel"
                          required
                        />
                      </div>

                      <div>
                        <label className="block body-2 text-n-1 mb-4" htmlFor="email">
                          Email Address <span className="text-color-1">*</span>
                        </label>
                        <input
                          className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors"
                          type="email"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone and Company - Side by side on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block body-2 text-n-1 mb-4" htmlFor="phone">
                          Phone Number <span className="text-color-1">*</span>
                        </label>
                        <input
                          className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors"
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="+977 980-0000000"
                          required
                        />
                      </div>

                      <div>
                        <label className="block body-2 text-n-1 mb-4" htmlFor="company">
                          Company Name <span className="text-color-1">*</span>
                        </label>
                        <input
                          className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors"
                          type="text"
                          id="company"
                          name="company"
                          placeholder="Your Company"
                          required
                        />
                      </div>
                    </div>

                    {/* Service Required */}
                    <div className="mb-8">
                      <label className="block body-2 text-n-1 mb-4" htmlFor="service">
                        Service Required <span className="text-color-1">*</span>
                      </label>
                      <select
                        className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23CAC6DD' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1.5rem center'
                        }}
                        id="service"
                        name="service"
                        required
                      >
                        <option value="">Select a service</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Graphics Designing Services">Graphics Designing Services</option>
                        <option value="Social Media Management">Social Media Management</option>
                        <option value="Tech Solutions">Tech Solutions</option>
                        <option value="Search Engine Optimization (SEO)">Search Engine Optimization (SEO)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Project Details */}
                    <div className="mb-8">
                      <label className="block body-2 text-n-1 mb-4" htmlFor="message">
                        Project Details <span className="text-color-1">*</span>
                      </label>
                      <textarea
                        className="w-full px-6 py-4 bg-n-7 rounded-xl body-2 text-n-1 border border-n-6 focus:border-n-5 transition-colors min-h-[150px]"
                        id="message"
                        name="message"
                        placeholder="Tell us about your project requirements, timeline, and any specific features you need..."
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={isSubmitting ? 'opacity-50' : ''}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Order'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <Gradient />
          </div>
        </Section>
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default OrderNow;