import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BookProps {
    book: {
        title: string;
        classType: string;  
        category: string;
        author: string;
        edition: string;
        condition: string;
        subject: string;
    };
}

const BookDetails: React.FC<BookProps> = ({ book }) => {
    return (
        <Card className='border border-gray-200 shadow-sm'>
            <CardHeader>
                <CardTitle className='text-lg'>
                    Book Details
                </CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4 text-sm' >
                <div className='font-medium text-muted-foreground'>
                    Subject/Title:
                </div>
                <div>{book.subject}</div>
                <div className='font-medium text-muted-foreground'>
                    Course:
                </div>
                <div>{book.classType}</div>
                <div className='font-medium text-muted-foreground'>
                    Category:
                </div>
                <div>{book.category}</div>
                <div className='font-medium text-muted-foreground'>
                    Author:
                </div>
                <div>{book.author}</div>
                <div className='font-medium text-muted-foreground'>
                    Edition:
                </div>
                <div>{book.edition}</div>
                <div className='font-medium text-muted-foreground'>
                    Condition:
                </div>
                <div>{book.condition}</div>
            </CardContent>
        </Card>
    )
}

export default BookDetails
