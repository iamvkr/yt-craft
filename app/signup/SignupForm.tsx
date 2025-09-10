"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser, loginUser, signupUser } from "@/lib/appwrite/auth";
import { useMyStore } from "@/zustand/store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, FC, useEffect } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  UseFormRegister,
  FieldError,
} from "react-hook-form";
import { toast } from "sonner";

// Defines the shape of our form data
interface IFormInput extends FieldValues {
  username?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

// Props for the Input component
interface InputProps {
  label: string;
  name: string; // Ensures name is one of the keys from our form data
  register: UseFormRegister<IFormInput>;
  required?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  type?: string;
  error?: FieldError;
  placeholder?: string;
}

const FormInput: FC<InputProps> = ({
  label,
  register,
  name,
  required,
  type = "text",
  error,
  ...rest
}) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      {label}
    </label>
    <Input
      id={name}
      type={type}
      {...register(name, required)}
      {...rest}
      className={
        error
          ? "border-destructive ring-destructive focus:border-destructive focus:ring-destructive text-gray-300"
          : `text-gray-300`
      }
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

// Props for the Button component
interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const FormButton: FC<ButtonProps> = ({ children, ...rest }) => (
  <Button
    {...rest}
    className="w-full dark"
    variant={"default"}
  >
    {children}
  </Button>
);

const SignupForm: FC = () => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const { user, setUser } = useMyStore();
  const router = useRouter();
  const [submitting, setsubmitting] = useState(false);

  // react-hook-form setup with our defined form data type
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, },
    watch,
  } = useForm<IFormInput>({
    mode: "onChange", // Validate on input change for immediate feedback
  });

  async function login(email: string, password: string) {
    setsubmitting(true);
    const { success, message } = await loginUser(email, password);
    if (!success) {
      toast(message);
    } else {
      toast(message);
      //   set user in store - zustand
      const res = await getUser();
      if (res.data) {
        setUser(res.data);
      }
      //  redirect to dashboard
      router.replace("/dashboard");
    }
    setsubmitting(false);
  }

  // Handle form submission with typed data
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (isLoginMode && data.email && data.password) {
      login(data.email, data.password);
    } else {
      // signup:
      if (data.username && data.email && data.password) {
        setsubmitting(true);
        const { success, message } = await signupUser(
          data.username,
          data.email,
          data.password!
        );
        if (!success) {
          toast(message);
          setsubmitting(false);
          return false;
        }
        // now auto login
        login(data.email, data.password);
      }
    }
  };

  // Toggle between form modes and reset the form state
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // reset(); // Clear form fields and errors on mode switch
  };

  // Define validation rules
  const validationRules = {
    username: {
      required: "User Name is required",
      minLength: {
        value: 3,
        message: "Name must be at least 3 characters long",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^\S+@\S+$/i,
        message: "Invalid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters long",
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (value: string) =>
        value === watch("password") || "Passwords don't match",
    },
  };

  useEffect(() => {
    if (user === null) {
      // check login status
      getUser().then((res) => {
        if (res.data) {
          // loggedin:
          setUser(res.data);
          router.replace("/dashboard");
        } else {
          setUser(false);
        }
      });
    } else if (user) {
      router.replace("/dashboard");
    }
  }, []);

  if (user === null) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin text-foreground" />
      </div>
    );
  }

  return (
    user === false && (
      <div className="bg-gray-900  flex items-center justify-center rounded-xl">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-white">
            {isLoginMode ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-center text-gray-400">
            {isLoginMode ? "Log in to continue" : "Sign up to get started"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input (only for Sign Up) */}
            {!isLoginMode && (
              <FormInput
                label="Full Name"
                name="username"
                register={register}
                required={validationRules.username}
                error={errors.username}
                placeholder="John Doe"
              />
            )}

            {/* Email Input */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              register={register}
              required={validationRules.email}
              error={errors.email}
              placeholder="you@example.com"
            />

            {/* Password Input */}
            <FormInput
              label="Password"
              name="password"
              type="password"
              register={register}
              required={validationRules.password}
              error={errors.password}
              placeholder="••••••••"
            />

            {/* Confirm Password Input (only for Sign Up) */}
            {!isLoginMode && (
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                register={register}
                required={validationRules.confirmPassword}
                error={errors.confirmPassword}
                placeholder="••••••••"
              />
            )}

            {/* Submit Button */}
            <FormButton type="submit" disabled={!isValid || submitting}>
                {submitting && <Loader2 className="animate-spin"/>}
              {isLoginMode ? "Login" : "Sign Up"}
            </FormButton>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-gray-300 hover:underline"
            >
              {isLoginMode
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SignupForm;
