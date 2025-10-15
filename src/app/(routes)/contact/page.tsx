'use client';

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser'
import { addToast, Spinner } from "@heroui/react";


export default function Contact() {

  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    setIsSending(true);

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        }
      )
      .then(
        () => {
          addToast({
            title: "Message sent successfully",
            color: "success",
            variant: "solid",
          });
          // Reset form after successful submission
          if (form.current) {
            form.current.reset();
          }
          setIsSending(false);
        },
        (error) => {
          addToast({
            title: "Message sent failed",
            description: error.text,
            color: "danger",
            variant: "solid",
          });
          setIsSending(false);
        },
      );
  };


  return (
    <>
      <hr className="mt-3 mb-1 hr-text" data-content="CONTACT" />

      <h1 className='mt-8 mb-1 text-4xl font-semibold text-center leading-[1.41176]'>Contact us</h1>

      <p className="mb-10 text-center text-[#212126]/65 text-sm sm:text-base">Feel free to contact us. Submit your message below.</p>

      <div className="-my-10 -mx-5 sm:my-0 sm:w-[444px]  sm:mx-auto scale-80 sm:scale-100">

        <form ref={form} onSubmit={sendEmail}>
          <div className="flex flex-col gap-2 mb-8">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              className="cm-input-2"
              placeholder="Name"
              autoComplete="on"
              required
            />

          </div>

          <div className="flex flex-col gap-2 mb-8">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="cm-input-2"
              placeholder="Enter your email address"
              autoComplete="on"
              required
            />

          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              className="cm-input-2 h-30"
              placeholder="Enter your message"
              autoComplete="on"
              required
            />

          </div>

          <div className="flex flex-col gap-2 mt-10">
            <button
              type="submit"
              className={`cm-button ${isSending ? 'opacity-50' : ''}`}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Spinner size="sm" color='default' />
                </>
              ) : (
                <>
                  Send
                  <svg><path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7.25 5-3.5-2.25v4.5L7.25 5Z"></path></svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}





