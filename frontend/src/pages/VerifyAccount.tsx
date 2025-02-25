import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../services/api";
import { LuShieldCheck } from "react-icons/lu";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export const VerifyAccountForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyFormData) => {
    try {
      await authApi.verifyAccount(data);
      toast.success("Account verified successfully!");
      navigate("/login");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to verify account. Please try again.");
      }

      if (error.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach((key: any) => {
          setError(key as keyof VerifyFormData, {
            message: error.response.data.errors[key],
          });
        });
      }
    }
  };

  const handleResendCode = async () => {
    try {
      // TODO: Implement resend code API call
      toast.success("Verification code resent successfully!");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
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
          <LuShieldCheck className="w-16 h-16 text-primary-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Verify Your Account
          </h2>
          <p className="text-gray-600 text-sm text-center mt-2">
            We've sent a verification code to your email/mobile. Enter the code
            below to verify your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Verification Code"
            {...register("code")}
            error={errors.code?.message}
            placeholder="Enter 6-digit code"
            className="text-center text-2xl tracking-wider"
            maxLength={6}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Verify Account
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Resend Code
              </button>
            </p>
            <p className="text-sm text-gray-600">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
