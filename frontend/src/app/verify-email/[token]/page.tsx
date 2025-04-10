"use client"
import { useVerifyEmailMutation } from '@/store/api';
import { authStatus, setEmailVerified } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { motion, spring } from "framer-motion"
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const page: React.FC = () => {
    const params = useParams();
    const router=useRouter();
    const token = params?.token;
    const dispatch = useDispatch();
    const [verifyEmail] = useVerifyEmailMutation();
    const isVerifyEmail = useSelector((state: RootState) => state.user.isEmailVerified);
    const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "alreadyVerified" | "failed">("loading");

    useEffect(() => {
        const verify = async () => {
            if (isVerifyEmail) {
                setVerificationStatus("alreadyVerified");
                return;
            }
            try {
                const result = await verifyEmail( token ).unwrap();
                console.log("email result at here", result)
                if (result.success) {
                    dispatch(setEmailVerified(true));
                    setVerificationStatus("success")
                    dispatch(authStatus());
                    toast.success("Email verfied Successfully");
                    setTimeout(() => {
                        window.location.href = "/"
                    }, 3000);
                }
                else {
                    throw new Error(result.message || "verification failed")
                }
            } catch (error) {
                // toast.error("failed to verify your email ")
                console.log(error)
            }
        }
        if (token) {
            verify();
        }
    }, [token, verifyEmail, dispatch, isVerifyEmail])
    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg text-center"
            >
                {/* Loading State */}
                {verificationStatus === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait while we confirm your email address.</p>
                    </div>
                )}

                {/* Success State */}
                {verificationStatus === "success" && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="flex flex-col items-center"
                    >
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
                        <p className="text-gray-500">Your email has been verified successfully. You will be redirected shortly.</p>
                    </motion.div>
                )}

                {/* Already Verified State */}
                {verificationStatus === "alreadyVerified" && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="flex flex-col items-center"
                    >
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Already Verified</h2>
                        <p className="text-gray-500">You're all set! You can continue using our services.</p>
                        <Button
                         onClick={()=>router.push("/")}
                         className='bg-blue-500 mt-4 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer'
                        >
                            Go To HomePage    
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default page
