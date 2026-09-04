"use client";

import { useState } from "react";
import {
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import {
  sanitizeInput,
  validateEmail,
  checkRateLimit,
  recordActionTimestamp,
  HONEYPOT_FIELD_NAME,
} from "@/lib/security";

export function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Bot Honeypot Check: If filled, silently mock success
    if (honeypot.trim()) {
      setSubmitted(true);
      return;
    }

    // 2. Client-Side Rate Limit Check (Cooldown 30s, max 5/hr)
    const rateCheck = checkRateLimit("contact_form", {
      minIntervalSeconds: 30,
      maxPerHour: 5,
    });
    if (!rateCheck.allowed) {
      setErrorMessage(
        rateCheck.error || "Please wait a moment before sending another message."
      );
      return;
    }

    // 3. Sanitize inputs to neutralize any XSS / injection payloads
    const cleanName = sanitizeInput(name, 100);
    const cleanEmail = email.trim();
    const cleanSubject = sanitizeInput(subject, 150);
    const cleanMessage = sanitizeInput(message, 3000, true);

    // 4. Validate fields
    if (!cleanName || cleanName.length < 2) {
      setErrorMessage("Please enter a valid name (at least 2 characters).");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!cleanSubject || cleanSubject.length < 3) {
      setErrorMessage("Please enter a subject (at least 3 characters).");
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      setErrorMessage("Please write a message with at least 10 characters.");
      return;
    }

    // 5. Record submission timestamp for client-side rate limiting
    recordActionTimestamp("contact_form");

    // 6. Construct safe mailto URI
    const mailtoUrl = `mailto:support@swiftgst.in?subject=${encodeURIComponent(
      `[SwiftGST Inquiry] ${cleanSubject}`
    )}&body=${encodeURIComponent(
      `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`
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
          <div className="flex items-center gap-2 text-teal-900 font-semibold text-xs">
            <ShieldCheck className="h-4 w-4 text-teal-700" />
            <span>Encrypted & Privacy Protected</span>
          </div>
          <p className="mt-1 text-xs text-teal-800/90 leading-relaxed">
            All messages are sanitized and processed client-side. We never sell or
            store your email address in third-party marketing databases.
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

          {errorMessage ? (
            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

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
                  setErrorMessage(null);
                }}
                className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Anti-Spam Honeypot Field (hidden from human visitors) */}
              <div
                aria-hidden="true"
                style={{
                  opacity: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: 0,
                  width: 0,
                  zIndex: -1,
                  pointerEvents: "none",
                }}
              >
                <label htmlFor={HONEYPOT_FIELD_NAME}>Leave this field blank</label>
                <input
                  type="text"
                  id={HONEYPOT_FIELD_NAME}
                  name={HONEYPOT_FIELD_NAME}
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
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
                    maxLength={254}
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
                  maxLength={150}
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
                  maxLength={3000}
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
