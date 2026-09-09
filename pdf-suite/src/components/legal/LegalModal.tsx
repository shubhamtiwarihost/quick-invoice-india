import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  HelpCircle,
  Mail,
  Send,
  CheckCircle2,
  Lock,
  Cpu,
  AlertCircle,
} from 'lucide-react';
import type { LegalPageId } from './legalContent';
import { LEGAL_PAGES } from './legalContent';

interface LegalModalProps {
  pageId: LegalPageId | null;
  onClose: () => void;
  onSwitchPage: (pageId: LegalPageId) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  pageId,
  onClose,
  onSwitchPage,
}) => {
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: 'General Feedback',
    message: '',
  });

  if (!pageId) return null;

  const page = LEGAL_PAGES[pageId];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      alert('Please fill in all required fields.');
      return;
    }
    // Pure client-side confirmation
    setContactFormSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100/70 text-indigo-700">
              {pageId === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {pageId === 'terms' && <FileText className="w-5 h-5" />}
              {pageId === 'about' && <HelpCircle className="w-5 h-5" />}
              {pageId === 'contact' && <Mail className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{page.title}</h2>
              <p className="text-xs text-slate-500">{page.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Pills */}
        <div className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-white border-b border-slate-100 overflow-x-auto text-xs shrink-0">
          {(['privacy', 'terms', 'about', 'contact'] as LegalPageId[]).map((id) => (
            <button
              key={id}
              onClick={() => {
                onSwitchPage(id);
                setContactFormSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                pageId === id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {LEGAL_PAGES[id].title}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          {pageId === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <strong>In-Browser Privacy:</strong> When you use SwiftGST PDF Tools, your files are processed directly in your device&apos;s web browser. Every calculation, preview render, and document manipulation happens in your local computer or smartphone.
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. Information We Do NOT Collect</h3>
                <p>
                  SwiftGST PDF does not require user registration, logins, or payment details. Because file processing (merging, rotating, deleting pages, watermarking, converting, and password encryption) executes in your local browser tab, <strong>we have zero access to:</strong>
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                  <li>Your PDF documents, pages, or textual content.</li>
                  <li>Images uploaded for conversion (JPG, PNG, WebP).</li>
                  <li>Passwords you set to protect or encrypt documents.</li>
                  <li>Metadata, author details, or timestamps embedded within your files.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. In-Memory Processing</h3>
                <p>
                  When you select or drag &amp; drop a file into SwiftGST PDF, the file is read into your browser&apos;s temporary session memory as an <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">ArrayBuffer</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">Blob</code>. Once you close or reload the browser tab, the memory is immediately deallocated.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Cookies &amp; Third-Party Advertising (Google AdSense)</h3>
                <p>
                  To keep SwiftGST PDF free for users worldwide, we may display non-intrusive advertisements served by third-party advertising partners such as <strong>Google AdSense</strong>.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                  <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.</li>
                  <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.</li>
                  <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">AboutAds.info</a>.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">4. Web Analytics</h3>
                <p>
                  We may collect anonymous, aggregated technical metrics (such as browser type, device category, screen resolution, and country) solely to optimize user interface responsiveness and maintain high performance across mobile and desktop devices. No personal identifying information (PII) is ever collected.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">5. Updates to This Policy</h3>
                <p>
                  We may periodically update this Privacy Policy to reflect technical enhancements or regulatory guidelines. Continued use of the website constitutes acceptance of the prevailing policy.
                </p>
              </div>
            </div>
          )}

          {pageId === 'terms' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using SwiftGST PDF, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the utility suite immediately.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">2. Permitted Use</h3>
                <p>
                  You are free to use SwiftGST PDF for personal, educational, non-profit, or commercial document processing tasks. You agree not to use the application to process unlawful, defamatory, infringing, or malicious content.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">3. Intellectual Property Rights</h3>
                <p>
                  <strong>You retain complete ownership and copyright of all documents and images you process.</strong> SwiftGST PDF does not claim, store, or assert any rights over your files.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">4. &ldquo;As-Is&rdquo; Service &amp; Limitation of Liability</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2">
                  <p>
                    SwiftGST PDF is provided on an <strong>&ldquo;AS IS&rdquo;</strong> and <strong>&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, whether express or implied.
                  </p>
                  <p>
                    While we utilize rigorous PDF standards compliance, the developers and operators of SwiftGST PDF shall not be liable for any direct, indirect, incidental, or consequential damages resulting from document corruption, accidental data loss, or system interruption. <strong>We strongly advise always keeping backup copies of critical documents.</strong>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">5. Document Encryption Notice</h3>
                <p>
                  When utilizing the &ldquo;Protect PDF&rdquo; tool, ensure you memorize or securely store the password you set. Because SwiftGST PDF processes files locally without a database, <strong>it is technically impossible for us to recover or reset forgotten passwords for your protected files.</strong>
                </p>
              </div>
            </div>
          )}

          {pageId === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Why We Built SwiftGST PDF Tools</h3>
                <p>
                  Millions of businesses, accountants, and individuals need everyday PDF utilities: merging invoices, extracting tax receipts, rotating scanned paperwork, or protecting financial statements.
                </p>
                <p className="mt-2">
                  SwiftGST PDF provides fast, seamless utilities directly in your browser without requiring external uploads or subscription fees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Pure In-Browser Engines</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Powered by industry standards: <code className="text-indigo-700">pdf-lib</code>, <code className="text-indigo-700">pdfjs-dist</code>, and <code className="text-indigo-700">jsPDF</code>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Private &amp; Secure</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Your documents stay on your device and are processed locally in your browser.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Lightweight Architecture</h3>
                <p>
                  SwiftGST PDF is built as an ultra-fast application running directly in your modern web browser.
                </p>
              </div>
            </div>
          )}

          {pageId === 'contact' && (
            <div className="space-y-6">
              {contactFormSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-emerald-950">Thank You for Reaching Out!</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Your feedback has been received. You can also email our team directly at{' '}
                    <a href="mailto:support@swiftgst.in" className="font-bold underline">
                      support@swiftgst.in
                    </a>.
                  </p>
                  <button
                    onClick={() => setContactFormSubmitted(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <select
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white cursor-pointer"
                    >
                      <option value="General Feedback">General Feedback &amp; Suggestions</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Privacy Inquiry">Privacy / Compliance Inquiry</option>
                      <option value="AdSense / Partnership">Advertising &amp; Partnerships</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactData.message}
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      placeholder="How can we help or improve your PDF workflows?"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      Direct email inquiries: <a href="mailto:support@swiftgst.in" className="font-semibold text-indigo-600 hover:underline">support@swiftgst.in</a>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Last Updated: {page.lastUpdated}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
