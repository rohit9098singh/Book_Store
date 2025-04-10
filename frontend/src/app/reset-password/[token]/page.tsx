'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '@/store/api';
import { motion } from "framer-motion"
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { toggleLoginDialogue } from '@/store/slice/userSlice';

interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch()
    const token = typeof params?.token === 'string' ? params.token : '';
    const [resetPassword] = useResetPasswordMutation();
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormData>();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (data: ResetPasswordFormData) => {
        setResetPasswordLoading(true)

        if (data.newPassword !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await resetPassword({ token, password: data.newPassword });
            console.log("resetPassword payload", { token, password: data.newPassword });
  

            setResetPasswordSuccess(true);
            toast.success("Password reset successfully");
            // setTimeout(() => {
            //     dispatch(toggleLoginDialogue())
            //   }, 2000);
        } catch (error) {
            toast.error("Failed to reset password");
        }
        finally { setResetPasswordLoading(false) }
    };

    const handleLoginCLick = () => {
        dispatch(toggleLoginDialogue())
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg text-center"
            >
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Reset Your Password</h2>

                {!resetPasswordSuccess ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="relative">
                            <Input
                                {...register('newPassword', { required: 'New password is required' })}
                                placeholder="New Password"
                                type={showPassword ? 'text' : 'password'}
                                className="pl-10 pr-10"
                            />
                            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-sm text-left ">{errors.newPassword.message}</p>}

                        <div className="relative">
                            <Input
                                {...register('confirmPassword', { required: 'Confirm password is required' })}
                                placeholder="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                className="pl-10 pr-10"
                            />
                            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm text-left ">{errors.confirmPassword.message}</p>}

                        <button
                            type="submit"
                            className="bg-blue-600 text-white w-full py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition"
                        >
                            Reset Password
                        </button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="bg-green-100 border border-green-300 text-green-700 px-6 py-4 rounded-xl shadow-md text-lg font-medium flex items-center justify-center space-x-2 flex-col"
                    >
                        <CheckCircle className='h-16 w-16 text-green-500 mx-auto' />
                        <span>Password has been reset! You can now log in.</span>
                        <Button
                            onClick={handleLoginCLick}
                            className="mt-6 px-6 py-2 bg-green-500/20 text-green-500 font-semibold rounded-full shadow-md hover:bg-green-600/20 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                        >
                            Go to Login
                        </Button>

                    </motion.div>

                )}
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
