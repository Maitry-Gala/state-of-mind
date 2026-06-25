import { signinSchema } from "../../../backend/src/schemas/user.schema";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import api from "../libs/axios";
import { useNavigate } from "react-router";


type SigninInputs = z.infer<typeof signinSchema>;

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

const inputClass = `
  w-full px-3 py-2.5 text-sm rounded-md border border-primary/20
  bg-white text-primary placeholder-primary/30
  outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
  transition-all duration-150
`;


export function SignIn({ onSwitch }: { onSwitch: () => void }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninInputs>({ resolver: zodResolver(signinSchema) });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SigninInputs> = async (data) => {
    try{
      const response = await api.post("/user/signin",data);
      const {token} = response.data;

      localStorage.setItem("token", token);
      toast.success("Welcome back");
      navigate("/dashboard");
      //redirect or set auth state here
    }catch(error){
      if(axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (message === "Invalid credentials") {
          setError("root", { message: "Email or password is incorrect." });
          toast.error("Sign in failed", { description: "Check your credentials." });
        } else {
          toast.error("Something went wrong", { description: message });
          setError("root", { message: message ?? "Try again later." });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Field label="Email" error={errors.email?.message}>
        <input type="email" placeholder="you@example.com" className={inputClass} {...register("email")} />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <input type="password" placeholder="••••••••" className={inputClass} {...register("password")} />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 mt-1 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs text-primary/40">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-brand-500 hover:underline font-medium">
          Sign up
        </button>
      </p>
    </form>
  );
}