"use client";

import { useAuth } from "@/components/auth-provider";
import { ArrowLeft, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role") === "admin" ? "admin" : "customer";
  const [role, setRole] = useState<"customer" | "admin">(requestedRole);
  const [email, setEmail] = useState(
    requestedRole === "admin" ? "admin@example.com" : "customer@example.com",
  );
  const [password, setPassword] = useState("demo1234");
  const { signIn } = useAuth();
  const router = useRouter();

  function submit(event: FormEvent) {
    event.preventDefault();
    signIn(email, role);
    router.push(role === "admin" ? "/dashboard" : "/");
  }

  function selectRole(nextRole: "customer" | "admin") {
    setRole(nextRole);
    setEmail(nextRole === "admin" ? "admin@example.com" : "customer@example.com");
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3] px-5 py-10 text-[#1f2522]">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold">
          <ArrowLeft size={16} /> Back
        </Link>
        <section className="soft-card p-6 md:p-8">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#1f4336] text-white">
            <LockKeyhole size={21} />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-[#617069]">
            Demo accounts use browser storage only.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-[#d7ded6] bg-[#eef3ef] p-1">
            {[
              ["customer", UserRound, "Customer"],
              ["admin", ShieldCheck, "Admin"],
            ].map(([value, Icon, label]) => {
              const RoleIcon = Icon as typeof UserRound;
              return (
                <button
                  type="button"
                  key={String(value)}
                  onClick={() => selectRole(value as "customer" | "admin")}
                  className={`flex h-11 items-center justify-center gap-2 rounded-md text-sm font-extrabold ${
                    role === value ? "bg-white shadow-sm" : "text-[#617069]"
                  }`}
                >
                  <RoleIcon size={16} /> {String(label)}
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label>
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                Email
              </span>
              <input
                className="field"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em]">
                Password
              </span>
              <input
                className="field"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button className="btn-primary w-full" type="submit">
              Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
