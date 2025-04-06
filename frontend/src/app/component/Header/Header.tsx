"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toggleLoginDialogue } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { Heart, Lock, LogOut, PiggyBank, Search, ShoppingCart, User, Package, ShieldCheck, HelpCircle, Info, ChevronRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "../Authpage/AuthPage";

const Header = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const dispatch = useDispatch()

  const isLogginOpen = useSelector((state: RootState) => state.user.isLoggedInDialogueOpen)

  const user = {
    profilePicture: "",
    name: "lauda lehsun",
    email: "leudalehsun.com",
  };

  const userPlaceholder = "LL";

  const handleLoginCLick = () => {
    dispatch(toggleLoginDialogue());
  }

  const navigateTo = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      dispatch(toggleLoginDialogue())
    }
  };

  // Logout Handler
  const handleLogout = () => {
    console.log("User Logged Out");
  };

  const menuItems = [
    { id: "1", icon: <User className="h-5 w-5" />, label: "My Profile", path: "/account/profile" },
    { id: "2", icon: <Package className="h-5 w-5" />, label: "My Orders", path: "/account/orders" },
    { id: "3", icon: <PiggyBank className="h-5 w-5" />, label: "Selling Orders", path: "/account/sellings-products" },
    { id: "4", icon: <ShoppingCart className="h-5 w-5" />, label: "Cart", path: "/checkout/cart" },
    { id: "5", icon: <Heart className="h-5 w-5" />, label: "Wishlist", path: "/account/wishlist" },
    { id: "6", icon: <Lock className="h-5 w-5" />, label: "Login/Sign up", path: "/login" },
    { id: "7", icon: <Info className="h-5 w-5" />, label: "About Us", path: "/about-us" },
    { id: "8", icon: <ShieldCheck className="h-5 w-5" />, label: "Privacy Policy", path: "/privacy-policy" },
    { id: "9", icon: <HelpCircle className="h-5 w-5" />, label: "Help", path: "/how-it-works" },
  ].filter(Boolean);

  return (
    <header className="bg-white shadow-md h-[64px] w-full sticky top-0 z-50">
      <div className="w-[80%] hidden mx-auto lg:flex items-center justify-between p-4">
        <Link href="/">
          <Image src="/images/web-logo.png" height={100} width={450} alt="Logo" className="h-12 w-auto" />
        </Link>

        <div className=" flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Book Name / Author / Publisher / Subject"
              className="w-full pr-12 border rounded-md p-2 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/selling-books">
            <Button className="bg-yellow-400 text-black cursor-pointer hover:bg-yellow-500">Sell Used Book</Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg p-2">
                <Avatar className="w-8 h-8 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="User" />
                  ) : (
                    <AvatarFallback className="bg-gray-400">{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>

            {/* Dropdown Content */}
            <DropdownMenuContent className="w-64 p-2 shadow-lg border bg-white">
              {user ? (
                <div className="flex items-center gap-4 p-2 border-b cursor-pointer">
                  <Avatar className="w-12 h-12 rounded-full">
                    {user.profilePicture ? (
                      <AvatarImage src={user?.profilePicture} alt="User" />
                    ) : (
                      <AvatarFallback>{userPlaceholder}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <span className="font-semibold">{user?.name}</span>
                    <span className="block text-sm text-gray-500">{user?.email}</span>
                  </div>
                </div>
              ) : (
                <button onClick={handleLoginCLick} className="flex items-center gap-2 p-2 w-full cursor-pointer hover:bg-gray-100">
                  <Lock className="h-5 w-5" />
                  Login / Sign Up
                </button>
              )

              }
             
               <button onClick={handleLoginCLick} className="flex items-center gap-2 p-2 w-full cursor-pointer hover:bg-gray-100">
                  <Lock className="h-5 w-5" />
                  Login / Sign Up
                </button>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => (navigateTo(item?.path))}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer w-full text-left"
                >
                  {item?.icon}
                  {item?.label}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              ))}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-2 hover:bg-red-600/40 text-rose-500 rounded-md cursor-pointer w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={"/checkout/cart"}>
            <div className="relative flex items-center cursor-pointer">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {user && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white rounded-full px-1 text-xs flex items-center justify-center w-5 h-5">
                    3
                  </span>
                )}
              </div>
              <span className="ml-2">Cart</span>
            </div>
          </Link>

        </div>
      </div>
      {/**mobile view starts from here  */}

      <div className="mobileContainer mx-auto lg:hidden flex items-center justify-between p-4  bg-white shadow-sm">
        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 ">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="sr-only"></SheetTitle>
            <Link href="/">
              <Image src="/images/web-logo.png" height={40} width={150} alt="mobile_Logo" className="h-10 w-auto" />
            </Link>
            </SheetHeader>

            {/* User Profile Section */}
            {user ? (
              <div className="flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-100">
                <Avatar className="w-12 h-12 rounded-full">
                  {user.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="User" />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <span className="font-semibold block">{user?.name}</span>
                  <span className="text-sm text-gray-500">{user?.email}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLoginCLick}
                className="flex items-center gap-2 p-4 w-full cursor-pointer hover:bg-gray-100 border-b"
              >
                <Lock className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Login / Sign Up</span>
              </button>
            )}

            {/* Menu Items */}
            <div className="p-2 space-y-1 overflow-y-scroll">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item?.path)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer w-full text-left"
                >
                  {item.icon}
                  <span className="text-gray-800">{item?.label}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-500" />
                </button>
              ))}
            </div>

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 hover:bg-red-100 text-red-600 rounded-md cursor-pointer w-full text-left border-t"
              >
                <LogOut className="h-5 w-5" />
                Logout
                <ChevronRight className="h-4 w-4 ml-auto" />
              </button>
            )}
          </SheetContent>
        </Sheet>
        <Link href="/">
          <Image src="/images/web-logo.png" height={100} width={450} alt="Logo" className="h-8 md:h-10 w-20 md:w-auto" />
        </Link>

        <div className=" flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="search books...."
              className="w-full pr-12 border rounded-md p-2 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
          </div>
        </div>
        <Link href={"/checkout/cart"}>
            <div className="relative flex items-center cursor-pointer">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {user && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white rounded-full px-1 text-xs flex items-center justify-center w-5 h-5">
                    3
                  </span>
                )}
              </div>
            </div>
          </Link>
        
      </div>
      {
        isLogginOpen &&
      <AuthPage isLoginOpen={isLogginOpen} setIsLoginOpen={handleLoginCLick}/>
      }
    </header>
  );
};

export default Header;
