"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userData } from '@/lib/types/type';
import { useUpdateUserMutation } from '@/store/api';
import { setUser } from '@/store/slice/userSlice';
import { RootState } from '@/store/store';
import { Mail, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const Page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state?.user?.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm<userData>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, reset]);

  const handleProfileEdit = async (data: userData) => {
    const { name, phoneNumber } = data;
    try {
      const result = await updateUser({
        userId: user?._id,
        userData: { name, phoneNumber },
      });

      if (result && result.data) {
        // If your API returns { success: true, data: { name, phoneNumber, ... } }
        const updatedUser = result.data.data || result.data;
        dispatch(setUser(updatedUser));
        setIsEditing(false);
        toast.success("User updated successfully");
      } else {
        throw new Error("Could not update the profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='bg-gradient-to-r from-pink-500 to-rose-500 text-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-4xl font-bold mb-2'>My Profile</h1>
        <p className='text-pink-200'>Manage Your Personal Information And Preferences</p>
      </div>

      <Card className='border border-t-pink-500 shadow-lg'>
        <CardHeader className='bg-gradient-to-r from-pink-50 to-rose-50'>
          <CardTitle className='text-2xl text-pink-700'>Personal Information</CardTitle>
          <CardDescription>Update your Profile Details And Contact Information</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4 pt-6'>
          <form onSubmit={handleSubmit(handleProfileEdit)}>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {/* Username */}
              <div className='space-y-2'>
                <Label htmlFor='username'>Username</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <Input
                    id='username'
                    placeholder='Enter your name'
                    disabled={!isEditing}
                    className='pl-10'
                    {...register("name")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <Input
                    id='email'
                    placeholder='john@gmail.com'
                    disabled
                    className='pl-10'
                    {...register("email")}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className='space-y-2'>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <Input
                    id='phoneNumber'
                    placeholder='9999999999'
                    disabled={!isEditing}
                    className='pl-10'
                    {...register("phoneNumber")}
                  />
                </div>
              </div>
            </div>

            <CardFooter className='pt-4'>
              {!isEditing ? (
                <Button
                  type='button'
                  onClick={() => setIsEditing(true)}
                  className='bg-pink-500 hover:bg-pink-600 text-white px-5 py-1.5 rounded mr-4 cursor-pointer'
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    type='button'
                    onClick={() => {
                      reset();
                      setIsEditing(false);
                    }}
                    className='bg-gray-500 hover:bg-gray-600 text-white px-5 py-1.5 rounded mr-4 cursor-pointer'
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded cursor-pointer'
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
