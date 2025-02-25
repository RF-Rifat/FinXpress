import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { Input } from "../components/Input";
import { LuKeyRound } from "react-icons/lu";
import { Button } from "../components/Button";
import { authApi } from "../services/api";
import toast from "react-hot-toast";

const loginSchema = z.object({
  mobileOrEmail: z.string().min(1, "Mobile or email is required"),
  pin: z.string().length(5, "PIN must be exactly 5 digits"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
   const [showPin, setShowPin] = useState(false);
   const navigate = useNavigate();

   const {
     register,
     handleSubmit,
     formState: { errors, isSubmitting },
     setError,
   } = useForm<LoginFormData>({
     resolver: zodResolver(loginSchema),
   });

   const onSubmit = async (data: LoginFormData) => {
     try {
       const response = await authApi.login(data);
       localStorage.setItem("token", response.data.token);
       toast.success("Successfully logged in!");
       navigate("/dashboard");
     } catch (error: unknown) {
       const err = error as { response?: { data?: { message?: string; errors?: Record<string, string> } } };
       if (err.response?.data?.message) {
         toast.error(err.response.data.message);
       } else {
         toast.error("Failed to login. Please try again.");
       }

       if (err.response?.data?.errors) {
         Object.keys(err.response.data.errors).forEach((key: string) => {
           setError(key as keyof LoginFormData, {
             message: err.response?.data?.errors?.[key as keyof LoginFormData],
           });
         });
       }
     }
   };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="flex flex-col items-center mb-8">
          <BiWallet className="w-16 h-16 text-primary-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-sm">Access your account securely</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Mobile Number or Email"
            {...register("mobileOrEmail")}
            error={errors.mobileOrEmail?.message}
            placeholder="Enter your mobile number or email"
          />
          <div className="relative">
            <Input
              label="PIN"
              type={showPin ? "text" : "password"}
              {...register("pin")}
              error={errors.pin?.message}
              placeholder="Enter your 5-digit PIN"
              maxLength={5}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
            >
              <LuKeyRound className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-pin"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Forgot PIN?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create Account
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
