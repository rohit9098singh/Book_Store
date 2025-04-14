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
import { Card } from '@/components/ui/card';

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
  selectedAddress: string;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  onAddressSelect,
  selectedAddress,
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

  if(isLoading){
    return <BookLoader/>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
       {
        addresses.map((address:Address)=>(
            <Card>
           
            </Card>
        ))
       }
    </div>
  );
};

export default CheckoutAddress;
