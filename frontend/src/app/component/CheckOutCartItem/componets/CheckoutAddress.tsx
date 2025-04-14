import { Address } from '@/lib/types/type';
import {
  useCreateOrUpdateAddressMutation,
  useGetAddressByUserIdQuery,
} from '@/store/api';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addressSchema } from './Validation/CheckoutForm';
import BookLoader from '@/lib/BookLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@radix-ui/react-checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Create form type from schema
type AddressForm = z.infer<typeof addressSchema>;

interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    address: Address[];
  };
}

interface CheckoutAddressProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId: string;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  onAddressSelect,
  selectedAddressId,
}) => {
  const { data: addressData, isLoading } = useGetAddressByUserIdQuery() as {
    data?: AddressResponse | undefined;
    isLoading: boolean;
  };

  const [createOrUpdateAddress] = useCreateOrUpdateAddressMutation();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState<Address | null>(null);

  const addresses = addressData?.data?.address || [];

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: '',
      addressLine2: '',
      phoneNumber: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const handleEditAddress = (address: Address) => {
    setIsEditingAddress(address);
    reset(address);
    setShowAddressForm(true);
  };

  const onSubmit = async (data: AddressForm) => {
    try {
      let result;
      if (isEditingAddress) {
        const updateAddress = {
          ...isEditingAddress,
          ...data,
          addressId: isEditingAddress._id,
        };
        result = await createOrUpdateAddress(updateAddress).unwrap();
      } else {
        result = await createOrUpdateAddress(data).unwrap();
      }

      setShowAddressForm(false);
      setIsEditingAddress(null);
      reset();
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  if (isLoading) {
    return <BookLoader />
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
      {
        addresses.map((address: Address) => (
          <Card
            key={address._id}
            className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddressId === address._id ? "border-blue-500 shadow-lg" : "border-gray-200 shadow-md hover:shadow-lg"}`}
          >
            <CardContent className='p-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <Checkbox
                  checked={selectedAddressId === address._id}
                  onCheckedChange={() => onAddressSelect(address)}
                  className='h-5 w-5'
                />
                <div className='flex items-center justify-between'>
                  <Button
                    size="icon"
                    variant={"ghost"}
                    onClick={() => handleEditAddress(address)}
                  >
                    <Pencil className='h-5 w-5 text-gray-600 hover:text-blue-500' />
                  </Button>
                </div>
              </div>
              <div className='text-sm text-gray-600'>
                <p>{address?.addressLine1}</p>
                <p>{address?.addressLine2 && (
                  address.addressLine2
                )}</p>
                <p>{address.city},{address.state}{" "}{address.pincode}</p>
                <p className='mt-2 font-medium'>Phone:{address.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>
        ))
      }
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogTrigger asChild>
          <Button className='w-full' variant={"outline"}>
            <Plus className='mr-2 h-4 w-4 ' /> {" "}
            {
              isEditingAddress ? "Edit Address" : "Add New Address"
            }
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {isEditingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>{""}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='addressLine1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Street address ,House number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='addressLine2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='Apartment,suite,unit,etc...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center gap-4'>

                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter city' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter state' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='pincode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter 6-digit pincode' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter 10-digit mobile number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end pt-4'>
                <Button type='submit'>
                  {isEditingAddress ? "Update Address" : "Add Address"}
                </Button>
              </div>
            </form>
          </Form>

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutAddress;
