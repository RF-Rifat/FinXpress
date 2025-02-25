import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LuKeySquare } from "react-icons/lu";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const forgotPinSchema = z.object({
  mobileOrEmail: z.string().min(1, "Mobile or email is required"),
  nid: z.string().regex(/^\d{10}$|^\d{13}$|^\d{17}$/, "Invalid NID number"),
});

type ForgotPinFormData = z.infer<typeof forgotPinSchema>;

export const ForgotPinForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPinFormData>({
    resolver: zodResolver(forgotPinSchema),
  });

  const onSubmit = async (data: ForgotPinFormData) => {
    // TODO: Implement forgot PIN logic
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="flex flex-col items-center mb-8">
          <LuKeySquare className="w-16 h-16 text-primary-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Reset Your PIN</h2>
          <p className="text-gray-600 text-sm text-center">
            Enter your details to receive a PIN reset link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Mobile Number or Email"
            {...register("mobileOrEmail")}
            error={errors.mobileOrEmail?.message}
            placeholder="Enter your registered mobile or email"
          />
          <Input
            label="NID Number"
            {...register("nid")}
            error={errors.nid?.message}
            placeholder="Enter your NID number"
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-gray-600">
            Remember your PIN?{" "}
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
