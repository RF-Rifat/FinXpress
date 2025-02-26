/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { BiUser } from "react-icons/bi";
import toast from "react-hot-toast";
import { authApi } from "../services/api";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobileNumber: z
      .string()
      .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi mobile number"),
    nid: z.string().regex(/^\d{10}$|^\d{13}$|^\d{17}$/, "Invalid NID number"),
    pin: z.string().length(5, "PIN must be exactly 5 digits"),
    confirmPin: z.string().length(5, "PIN must be exactly 5 digits"),
    accountType: z.enum(["user", "agent"]),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      accountType: "user",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await authApi.signup(data);
      toast.success(
        "Account created successfully! Please verify your account."
      );
      navigate("/login");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }

      if (error.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach((key: any) => {
          setError(key as keyof SignupFormData, {
            message: error.response.data.errors[key],
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
        <div className="flex flex-col items-center mb-6">
          <BiUser className="w-16 h-16 text-primary-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 text-sm">
            Join our secure financial network
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            {...register("name")}
            error={errors.name?.message}
            placeholder="Enter your full name"
          />
          <Input
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="Enter your email"
          />
          <Input
            label="Mobile Number"
            {...register("mobileNumber")}
            error={errors.mobileNumber?.message}
            placeholder="01XXXXXXXXX"
          />
          <Input
            label="NID Number"
            {...register("nid")}
            error={errors.nid?.message}
            placeholder="Enter your NID number"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="PIN"
              type="password"
              {...register("pin")}
              error={errors.pin?.message}
              placeholder="5-digit PIN"
              maxLength={5}
            />
            <Input
              label="Confirm PIN"
              type="password"
              {...register("confirmPin")}
              error={errors.confirmPin?.message}
              placeholder="Confirm PIN"
              maxLength={5}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              {...register("accountType")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
            >
              <option value="user">User Account</option>
              <option value="agent">Agent Account</option>
            </select>
            {errors.accountType && (
              <p className="text-sm text-red-600">
                {errors.accountType.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
