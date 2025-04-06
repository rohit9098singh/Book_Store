"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, easeInOut, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Lock, Mail, User, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import Link from 'next/link';

interface LoginProps {
    isLoginOpen: boolean;
    setIsLoginOpen: (open: boolean) => void;
}
interface LoginFormData {
    email: string;
    password: string;
}
interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    agreeTerms: boolean;
}
interface ForgotPasswordFormData {
    email: string;
}

const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {
    const [currentTab, setCurrentTab] = useState<'login' | 'signup' | 'forgot'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setShowLoginLoading] = useState(false);
    const [signLoading, setShowSignLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordSucess, setForgotPasswordSuccess] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginError } } = useForm<LoginFormData>();
    const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: signUpError } } = useForm<SignUpFormData>();
    const { register: registerForgotPassword, handleSubmit: handleForgotPasswordSubmit, formState: { errors: forgotPasswordError } } = useForm<ForgotPasswordFormData>();

    const loginsubmit=(data:any)=>{
       console.log("first")
    }

    const signUpSubmit=(data:any)=>{
        console.log("Second")
       
    }

    const resetPasswordSubmit=(data:any)=>{
        console.log("Third")
      
    }

    return (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogContent className='max-w-md w-full p-6'>
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl font-bold mb-4'>Welcome To The Book Kart</DialogTitle>
                    <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'login' | 'signup' | 'forgot')}>
                        <TabsList className='grid w-full grid-cols-3 mb-6'>
                            <TabsTrigger value='login'>Login</TabsTrigger>
                            <TabsTrigger value='signup'>Signup</TabsTrigger>
                            <TabsTrigger value='forgot'>Forget</TabsTrigger>
                        </TabsList>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentTab}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}

                            >
                                {/* Login Form */}
                                <TabsContent value='login'>
                                    <form onSubmit={handleLoginSubmit(loginsubmit)} className='space-y-4'>
                                        {/* Email Input Field */}
                                        <div className='relative'>
                                            <Input {...registerLogin('email', { required: 'Email is required' })} placeholder='Email' type='email' className='pl-10' />
                                            <Mail size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                        </div>
                                        {loginError.email && <p className='text-red-500 text-sm mt-1'>{loginError.email.message}</p>}

                                        {/* Password Input Field */}
                                        <div className='relative'>
                                            <Input {...registerLogin('password', { required: 'Password is required' })} placeholder='Password' type={showPassword ? 'text' : 'password'} className='pl-10 pr-10' />
                                            <Lock size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                            <button type='button' onClick={togglePasswordVisibility} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'>
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {loginError.password && <p className='text-red-500 text-sm mt-1'>{loginError.password.message}</p>}

                                        {/* Submit Button */}
                                        <Button type='submit' className='w-full flex items-center justify-center gap-2'>
                                            {loginLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2" size={20} />
                                                    <span>Logging in...</span>
                                                </>
                                            ) : (
                                                "Login"
                                            )}
                                        </Button>
                                    </form>

                                    <div className="flex items-center my-4">
                                        <div className="flex-1 border-t border-gray-300"></div>
                                        <span className="mx-3 text-gray-500 text-sm font-medium">OR</span>
                                        <div className="flex-1 border-t border-gray-300"></div>
                                    </div>

                                    {
                                        googleLoading ? (
                                            <div className='w-full flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 pl-35'>
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                                <span className='text-center font-bold'>Login in google...</span>
                                            </div>
                                        ) : (
                                            <Button variant="outline" className="w-full flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200">
                                                <Image
                                                    src={"/icons/google.svg"}
                                                    alt='google image'
                                                    height={30}
                                                    width={30}
                                                />
                                                Log in with Google
                                            </Button>
                                        )
                                    }


                                </TabsContent>

                                {/* Signup Form */}
                                <TabsContent value='signup'>
                                    <form onSubmit={handleSignUpSubmit((data) => console.log(data))} className='space-y-4'>
                                        <div className='relative'>
                                            <Input {...registerSignUp('name', { required: 'Name is required' })} placeholder='Full Name' type='text' className='pl-10' />
                                            <User size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                        </div>
                                        {signUpError.name && <p className='text-red-500 text-sm'>{signUpError.name.message}</p>}
                                        <div className='relative'>
                                            <Input {...registerSignUp('email', { required: 'Email is required' })} placeholder='Email' type='email' className='pl-10' />
                                            <Mail size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                        </div>
                                        {signUpError.email && <p className='text-red-500 text-sm'>{signUpError.email.message}</p>}
                                        <div className='relative'>
                                            <Input {...registerSignUp('password', { required: 'Password is required' })} placeholder='Password' type={showPassword ? 'text' : 'password'} className='pl-10 pr-10' />
                                            <Lock size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                            <button type='button' onClick={togglePasswordVisibility} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer'>
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {signUpError.password && <p className='text-red-500 text-sm'>{signUpError.password.message}</p>}
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type="checkbox"
                                                {...registerSignUp("agreeTerms", {
                                                    required: "You must agree to the terms and conditions"
                                                })}
                                                className='h-4 w-4'
                                            />
                                            <span>
                                                I agree to the <span className="text-blue-600 hover:underline">Terms and Conditions</span>
                                            </span>
                                        </div>
                                        {signUpError.agreeTerms && <p className='text-red-500 text-sm'>{signUpError.agreeTerms.message}</p>}

                                        <Button type='submit' className='w-full'>
                                            {signLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2" size={20} />
                                                    <span>Signing in...</span>
                                                </>
                                            ) : (
                                                "Sign in"
                                            )}
                                        </Button>
                                    </form>
                                    <div className="flex items-center my-4">
                                        <div className="flex-1 border-t border-gray-300"></div>
                                        <span className="mx-3 text-gray-500 text-sm font-medium">OR</span>
                                        <div className="flex-1 border-t border-gray-300"></div>
                                    </div>
                                    {
                                        googleLoading ? (
                                            <div className='w-full flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 pl-35'>
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                                <span className='text-center font-bold'>Sign in google...</span>
                                            </div>
                                        ) : (
                                            <Button variant="outline" className="w-full flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200">
                                                <Image
                                                    src={"/icons/google.svg"}
                                                    alt='google image'
                                                    height={30}
                                                    width={30}
                                                />
                                                Sign in with Google
                                            </Button>
                                        )
                                    }

                                </TabsContent>

                                {/* Forgot Password Form */}
                                <TabsContent value='forgot'>
                                    {
                                        !forgotPasswordSucess ? (

                                            <form onSubmit={handleForgotPasswordSubmit((data) => console.log(data))} className='space-y-4'>
                                                <div className='relative'>
                                                    <Input {...registerForgotPassword('email', { required: 'Email is required' })} placeholder='Enter your email' type='email' className='pl-10' />
                                                    <Mail size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                                                </div>
                                                {forgotPasswordError.email && <p className='text-red-500 text-sm'>{forgotPasswordError.email.message}</p>}

                                                <Button type='submit' className='w-full font-bold'>
                                                    {
                                                        forgotPasswordLoading ? (
                                                            <Loader2 className="animate-spin mr-2" size={20} />
                                                        ) : (
                                                            "Send Rest Link"
                                                        )
                                                    }
                                                </Button>
                                            </form>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-center space-y-4'
                                            >
                                                <CheckCircle className='w-16 h-16 text-green-500 mx-auto' />
                                                <h3 className='text-xl font-semibold text-gray-700'>Reset Link Send Successfully</h3>
                                                <p className='text-sm text-gray-500'>
                                                    We've sent a password reset link to your email. Please
                                                    check your inbox and follow the instructions to reset your
                                                    password.
                                                </p>
                                                <Button
                                                    onClick={() => setForgotPasswordSuccess(false)}
                                                    className='w-full cursor-pointer'
                                                >
                                                    Send Another Link To YOur Email
                                                </Button>
                                            </motion.div>
                                        )
                                    }
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>
                    <p className="text-sm text-center text-gray-600 mt-2">
                        By clicking "Agree", you agree to our{" "}
                        <Link className="text-blue-500 hover:underline" href="/Terms-Of-Use">
                            Terms of Use
                        </Link>
                        , and our{" "}
                        <Link className="text-blue-500 hover:underline" href="/Privacy-Policy">
                            Privacy Policy
                        </Link>.
                    </p>

                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default AuthPage;