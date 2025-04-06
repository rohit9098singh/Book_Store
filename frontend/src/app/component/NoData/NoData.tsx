import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

 interface NoDataProps{
    message:string
    imageUrl:string
    description:string
    onClick?: () => void
    buttonText:string 
}


const NoData :React.FC<NoDataProps>= ({message,imageUrl,buttonText="Try Again",description,onClick}) => {
  return (
    <div className='flex flex-col items-center justify-center p-6 bg-white overflow-x-hidden spce-y-6 mx-auto'>
        <div className='relative w-60 md:w-80'>
              <Image
                src={imageUrl}
                alt='no data'
                width={320}
                height={320}
                className='shadow-md hover:shadow-lg rounded-xl currsor-pointer  transition duration-300'
              />
        </div>
        <div className='text-center max-w-md space-y-4'>
             <p className='text-2xl font-bold text-gray-900 '>{message}</p>
             <p className='mb-4 text-sm text-gray-600'>{description}</p>
        </div>
        {
            onClick && (
                <Button
                 onClick={onClick}
                 className='px-6 w-60 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-400 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer'
                 >
                 {buttonText}
                </Button>
            )
        }
    </div>
  )
}

export default NoData
