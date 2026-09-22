"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    feedback: "",
    notRobot: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const charsLeft = 7000 - form.feedback.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim() || !form.feedback.trim()) {
      setError("Please fill in all mandatory fields marked with *.");
      return;
    }
    if (!form.notRobot) {
      setError("Please confirm you're not a robot.");
      return;
    }
    setError("");
    setSubmitted(true);
    // Hook this up to your actual submission endpoint / email service.
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Feedback</h1>
      <p className="text-gray-600 leading-relaxed">
        Help us make TechInfo better — share your suggestions and comments below. Your feedback
        will be forwarded to the appropriate team.
      </p>

      <div className="border-t border-gray-200 mt-6 mb-6" />

      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
          <MessageSquare className="h-4.5 w-4.5" />
        </span>
        <p className="font-semibold text-gray-900">
          We appreciate your feedback, please use the form below to communicate with us
        </p>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-8 text-center">
          <p className="text-green-800 font-semibold mb-1">Thanks — your feedback was submitted!</p>
          <p className="text-sm text-green-700">We&apos;ll get back to you if a response is needed.</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200"
        >
          <p className="text-right text-xs text-gray-500 px-6 pt-4 pb-2">
            Fields marked with <span className="text-red-500">*</span> are mandatory
          </p>

          <div className="bg-gray-50 px-6 py-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]"
            />
          </div>

          <div className="bg-gray-50 px-6 py-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946]"
            />
          </div>

          <div className="bg-gray-50 px-6 py-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Country</label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] bg-white"
            >
              <option value="">-Select country-</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 px-6 py-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Feedback<span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.feedback}
              maxLength={7000}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              rows={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] resize-y"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{charsLeft} characters left</p>
          </div>

          <div className="bg-gray-50 px-6 py-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Upload Snapshot</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-md border border-gray-400 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="text-sm text-gray-500">{file ? file.name : "No file chosen"}</span>
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">Image size should be upto 1.5 MB</p>
          </div>

          <div className="bg-gray-50 px-6 py-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Enter the code<span className="text-red-500">*</span>
            </label>
            <label className="inline-flex items-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notRobot}
                onChange={(e) => setForm({ ...form, notRobot: e.target.checked })}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700">I&apos;m not a robot</span>
            </label>
          </div>

          <div className="bg-white px-6 py-6">
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <p className="text-xs text-gray-500 mb-5">
              <span className="font-semibold text-gray-700">Disclaimer:</span> Kindly do not post
              any defamatory, infringing, obscene, indecent, discriminatory or unlawful material or
              information. TechInfo reserves the right to remove without notice any content
              received from users.
            </p>
            <button
              type="submit"
              className="block mx-auto rounded-md bg-[#e63946] px-10 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#d62839]"
            >
              SUBMIT
            </button>
          </div>
        </form>
      )}

      {/* Contact info cards */}
      <div className="mt-8 rounded-xl bg-gray-100 p-4 space-y-3">
        <div className="rounded-lg bg-white px-5 py-4 text-sm text-gray-700 leading-relaxed">
          We are committed to providing our readers with the best possible experience and welcome
          your feedback and suggestions. Please don&apos;t hesitate to reach out to us at the
          following email ID —{" "}
          <a href="mailto:feedback@techinfo.com" className="text-[#e63946] hover:underline">
            feedback@techinfo.com
          </a>
        </div>

        <div className="rounded-lg bg-white px-5 py-4 text-sm text-gray-700">
          You can also write to us on{" "}
          <a href="mailto:support@techinfo.com" className="text-[#e63946] hover:underline">
            support@techinfo.com
          </a>
        </div>

        <div className="rounded-lg bg-white px-5 py-4 text-sm text-gray-700">
          <h3 className="font-bold text-gray-900 mb-1">EDITORIAL</h3>
          <p>
            We highly appreciate and value your opinions and feedback regarding our extensive
            coverage and content. To share your insights, reach out to the email ID -{" "}
            <a href="mailto:editors@techinfo.com" className="text-[#e63946] hover:underline">
              editors@techinfo.com
            </a>
          </p>
        </div>

        <div className="rounded-lg bg-white px-5 py-4 text-sm text-gray-700">
          <h3 className="font-bold text-gray-900 mb-1">MARKETING</h3>
          <p>
            Discover how our marketing team can help elevate your brand&apos;s success. Reach out
            on the email ID —{" "}
            <a href="mailto:marketing@techinfo.com" className="text-[#e63946] hover:underline">
              marketing@techinfo.com
            </a>
          </p>
        </div>

        <div className="rounded-lg bg-white px-5 py-4 text-sm text-gray-700">
          <h3 className="font-bold text-gray-900 mb-1">SALES</h3>
          <p>
            Looking to share an exciting sales pitch? Reach us at —{" "}
            <a href="mailto:sales@techinfo.com" className="text-[#e63946] hover:underline">
              sales@techinfo.com
            </a>
          </p>
        </div>

        <div className="rounded-lg bg-white px-5 py-4 text-sm text-gray-700">
          <h3 className="font-bold text-gray-900 mb-1">SOCIAL MEDIA</h3>
          <p>
            Follow us on{" "}
            <a href="https://twitter.com" className="text-[#e63946] hover:underline">
              X (formerly Twitter)
            </a>
            ,{" "}
            <a href="https://facebook.com" className="text-[#e63946] hover:underline">
              Facebook
            </a>
            ,{" "}
            <a href="https://instagram.com" className="text-[#e63946] hover:underline">
              Instagram
            </a>
            , and{" "}
            <a href="https://youtube.com" className="text-[#e63946] hover:underline">
              YouTube
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
