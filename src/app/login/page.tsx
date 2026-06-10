"use client";

import { useAuth } from "@/components/auth-provider";
import { assetPath } from "@/lib/paths";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("demo1234");
  const { signIn } = useAuth();
  const router = useRouter();

  function submit(event: FormEvent) {
    event.preventDefault();
    signIn(email);
    router.push("/checkout");
  }

  return (
    <main className="grid min-h-screen bg-[#f4ede4] md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${assetPath("/images/fashion-hero.png")}")` }}
        />
        <div className="absolute inset-0 bg-[#3c2b20]/25" />
        <div className="absolute bottom-12 left-12 max-w-md text-white">
          <p className="font-display text-5xl font-semibold leading-none">
            Your wardrobe,
            <br />
            all in one place.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/85">
            Sign in to complete checkout, follow your orders, and keep your
            details ready for next time.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs font-bold">
            <ArrowLeft size={15} /> Back to shop
          </Link>
          <p className="font-display text-3xl font-bold">LUMIÈRE</p>
          <h1 className="font-display mt-10 text-5xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-[#766a61]">
            Use the demo details below, or enter any email to continue.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase">Email</span>
              <input
                className="field"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase">Password</span>
              <input
                className="field"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button className="btn-primary w-full" type="submit">
              Sign in and continue
            </button>
          </form>
          <p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#81736a]">
            <LockKeyhole size={13} /> Production accounts are handled by Supabase Auth.
          </p>
          <div className="mt-8 border-t border-[#dfd4c7] pt-6 text-center">
            <Link
              href="/dashboard"
              className="text-xs font-extrabold text-[#a54f38] underline underline-offset-4"
            >
              Open the owner dashboard demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
