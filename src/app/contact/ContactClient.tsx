"use client";

import { useState } from "react";
import { Mail, Clock, MapPin, Send, CheckCircle2, Copy, Check } from "lucide-react";

export function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-fill mailto link so user can send easily from their email client if preferred
    const mailtoUrl = `mailto:support@swiftgst.in?subject=${encodeURIComponent(
      `[SwiftGST Inquiry] ${subject}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    window.open(mailtoUrl, "_blank");
    setSubmitted(true);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("support@swiftgst.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      {/* Left Info Column */}
      <div className="space-y-6 lg:col-span-1">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900">Direct Contact</h2>
          <p className="mt-1 text-xs text-slate-500">
            Reach our support & compliance team directly.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Official Email</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <a
                    href="mailto:support@swiftgst.in"
                    className="text-sm font-semibold text-teal-700 hover:underline"
                  >
                    support@swiftgst.in
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    title="Copy Email"
                    className="inline-flex items-center rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Response Time</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  Within 24–48 business hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">Location</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-5">
          <p className="text-xs font-semibold text-teal-900">Need Immediate Help?</p>
          <p className="mt-1 text-xs text-teal-800/90 leading-relaxed">
            Check out our instant compliance utilities such as the{" "}
            <a href="/gst-state-codes" className="underline font-semibold">
              State Codes Directory
            </a>{" "}
            or{" "}
            <a href="/gstin-validator" className="underline font-semibold">
              GSTIN Checksum Validator
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right Contact Form Column */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
          <p className="mt-1 text-xs md:text-sm text-slate-500">
            Have questions, feedback, or need technical support? Fill out the form below.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-2 text-base font-bold text-emerald-950">
                Message Prepared!
              </h3>
              <p className="mt-1 text-xs text-emerald-800">
                We have also opened your default email client with your message pre-filled to{" "}
                <strong>support@swiftgst.in</strong>. If it didn&apos;t open automatically, you can email us directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setEmail("");
                  setSubject("");
                  setMessage("");
                }}
                className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help?"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-teal-800"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
