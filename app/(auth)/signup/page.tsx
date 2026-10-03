"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { School, ArrowLeft, AlertCircle, Loader2, User, BookOpen, Award, Mail, Lock } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const full_name = String(formData.get("full_name") ?? "").trim();
    const roll_number = String(formData.get("roll_number") ?? "").trim();
    const class_name = String(formData.get("class_name") ?? "").trim();

    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          roll_number,
          class_name,
        },
      },
    });

    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }

    if (!data.session) {
      setErr("Account registered! Check your email to confirm verification, then proceed to sign in.");
      setBusy(false);
      return;
    }

    router.push("/student");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal Directory</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <img
                src="/logo.jpeg"
                alt="NIAZI REHNUMA"
                className="w-16 h-16 rounded-full border-2 border-slate-200 shadow-md object-cover mx-auto hover:scale-105 transition-transform"
              />
            </Link>
            <div className="pt-2">
              <span className="text-xs font-bold text-indigo-600 block uppercase tracking-wider">
                NIAZI REHNUMA
              </span>
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mt-1">
                Student Registration
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                Create Student Account
              </h1>
              <p className="text-xs text-slate-500">Register your profile to access class homework & tests</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="e.g. Ayaan Khan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Class (e.g. 8-A, 10-B)
                </label>
                <div className="relative">
                  <input
                    name="class_name"
                    type="text"
                    required
                    placeholder="Class Name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Roll Number
                </label>
                <div className="relative">
                  <input
                    name="roll_number"
                    type="text"
                    required
                    placeholder="Roll No"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="student@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {err && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Complete Registration</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/login?role=student" className="font-bold text-indigo-600 hover:underline">
              Sign In here
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
