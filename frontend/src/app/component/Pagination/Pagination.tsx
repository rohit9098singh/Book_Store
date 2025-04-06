import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

interface paginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void
}
const handleClick = () => {
  console.log("first")
}

const Pagination: React.FC<paginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className=' mt-6 flex items-center justify-center gap-2'>
      <Button
        size="icon"
        variant={'outline'}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
        key={page}
         variant={currentPage === page ? "default":"outline"}  
         className={currentPage === page ? "bg-blue-500 text-black cursor-pointer hover:bg-blue-600 ":""}      
         onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
       <Button
        size="icon"
        variant={'outline'}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </Button>

    </div>
  )
}

export default Pagination
