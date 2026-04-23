import { useState } from "react";
import { BrainIcon } from "../components/icons/BrainIcon";
import { SignIn } from "./Signin";
import { SignUp } from "./Signup";

export function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-primary/10 shadow-sm p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <BrainIcon/>
          </div>
          <span className="text-lg font-semibold tracking-wide text-primary">Second Brain</span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-primary">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-primary/40 mt-1">
            {mode === "signin"
              ? "Welcome back, enter your details."
              : "Get started, it's free."}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg bg-secondary p-1 mb-6">
          {(["signin", "signup"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMode(tab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                mode === tab
                  ? "bg-white text-primary shadow-sm"
                  : "text-primary/40 hover:text-primary/60"
              }`}
            >
              {tab === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        {mode === "signin"
          ? <SignIn onSwitch={() => setMode("signup")} />
          : <SignUp onSwitch={() => setMode("signin")} />
        }
      </div>
    </div>
  );
}