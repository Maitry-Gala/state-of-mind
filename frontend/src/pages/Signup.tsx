import { useForm } from "react-hook-form";
import { signupSchema } from "../../../backend/src/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import type { z } from "zod";
import axios from 'axios';
import { toast } from "sonner";
import api from "../libs/axios";

type SignupInputs = z.infer<typeof signupSchema>;

const inputClass = `
  w-full px-3 py-2.5 text-sm rounded-md border border-primary/20
  bg-white text-primary placeholder-primary/30
  outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
  transition-all duration-150
`;
type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-primary/70">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function SignUp({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupInputs>({ resolver: zodResolver(signupSchema) });

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    try{
      const response = await api.post("/user/signup",data);
      console.log("Success:",response.data);
      toast.success("Account created!",{
        description: "Welcome aboard. You can now sign in.",
      });

      onSwitch();

    } catch (error) {
      if(axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === "Email already exists") {
          setError("email", { message: "This email is already registered" });
        } else {
          // Generic root-level error
          toast.error("Signup failed", {
            description: message ?? "Something went wrong. Try again.",
          });
          setError("root", { message: "Signup failed. Try again." });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" error={errors.firstName?.message}>
          <input placeholder="Jane" className={inputClass} {...register("firstName")} />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input placeholder="Doe" className={inputClass} {...register("lastName")} />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <input type="email" placeholder="you@example.com" className={inputClass} {...register("email")} />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <input type="password" placeholder="••••••••" className={inputClass} {...register("password")} />
      </Field>

      {errors.root && (
        <p className="text-xs text-red-500 text-center -mb-2">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 mt-1 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-xs text-primary/40">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-brand-500 hover:underline font-medium">
          Sign in
        </button>
      </p>
    </form>
  );
}