"use client"

import { useLogoutApiMutation } from '@/store/api'
import { logout, toggleLoginDialogue } from '@/store/slice/userSlice'
import { RootState } from '@/store/store'
import { BookOpen, Heart,  LogOut,  ShoppingCart, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import NoData from '../component/NoData/NoData'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const navigation = [
    {
        title: "My Profile",
        href: "/account/profile",
        icon: User,
        color: "bg-rose-500"
    },
    {
        title: "My Orders",
        href: "/account/orders",
        icon: ShoppingCart,
        color: "bg-rose-500"
    },
    {
        title: "Selling Products",
        href: "/account/selling-products",
        icon: BookOpen,
        color: "bg-rose-500"
    },
    {
        title: "Wishlist",
        href: "/account/wishlist",
        icon: Heart,
        color: "bg-rose-500"
    }
]

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [logoutApi] = useLogoutApiMutation();

    const userPlaceholder: string = user?.name
        .split(" ")
        .map((word: string): string => word[0])
        .join("")
        .toUpperCase()

    const handleLogout = async () => {
        try {
            await logoutApi({}).unwrap();
            dispatch(logout());
            toast.success("User logged out successfully");
            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error("Failed to logout");
        }
    };

    const handleOpenLogin = () => {
        dispatch(toggleLoginDialogue());
    };

    if (!user) {
        return (
            <NoData
                message="Please log in to access your cart."
                description="You need to be logged in to view your cart and checkout."
                buttonText="Login"
                imageUrl="/images/login.jpg"
                onClick={handleOpenLogin}
            />
        );
    }

    return (
        <div className='grid p-4 w-[90%] mx-auto lg:grid-cols-[370px_1fr]'>
            <div className=' border-r m-5 rounded-lg p-2 bg-gradient-to-b from-violet-500 to-purple-700'>
                <div className='flex flex-col gap-2'>
                    <div className='flex h-[60px] items-center px-6'>
                        <Link href={"/"} className='flex items-center gap-2 font-semibold text-white'>
                            <span className='text-2xl'>Your Account</span>
                        </Link>
                    </div>
                   <div className='px-6 py-2'>
                    <div className='flex items-center gap-4'>
                       <Avatar className='w-12 h-12 rounded-full'>
                             {
                                user?.profilePicture ?(
                                    <AvatarImage src={user?.profilePicture} alt={"user_image"}></AvatarImage>
                                ):(
                                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                                )
                             }
                        </Avatar>
                        <div className='space-y-1'>
                           <p className='text-sm font-medium leading-none text-white'>{user?.name}</p>
                           <p className='text-xs text-purple-200'>{user?.email}</p>
                        </div>
                    </div>
                   </div>
                   <Separator className='bg-purple-400'/>
                   <div className='space-4-1 px-2'>
                          <div className='grid items-start px-2 py-2 text-sm font-medium'>
                             {
                                navigation.map((item)=>{
                                    const Icon=item.icon;
                                    const isActive=pathname=== item.href;
                                    return(
                                      <Link key={item.href} href={item.href} className={`flex font-semibold items-center gap-3 rounded-lg px-3 py-3 mb-2 transition-all ${isActive? `bg-gradient-to-r ${item.color} text-white`:"text-purple-100 hover:bg-purple-600"}`}>
                                        <Icon className='h-4 w-4'/>
                                        {item.title}
                                      </Link>
                                    )
                                })
                             }
                        </div> 
                   </div>
                <div className='mt-auto flex p-4 '>
                    <Button variant={"secondary"} className='w-full justify-start cursor-pointer' onClick={handleLogout}>
                       <LogOut className='h-4 w-4'/>
                       Logout
                    </Button>
                </div>
                </div>
            </div>
            <div className='p-4'>
                {children}
            </div>
        </div>
    );
};

export default Layout;
