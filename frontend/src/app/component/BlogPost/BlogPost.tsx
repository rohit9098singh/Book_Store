import React from 'react'
import { ArrowRight, BookOpen, Library, Store, } from "lucide-react";
import { Button } from '@/components/ui/button';
const blogPosts = [
    {
        imageSrc:
            "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
        title: "Where and how to sell old books online?",
        description:
            "Get started with selling your used books online and earn money from.",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
        imageSrc:
            "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
        title: "What to do with old books?",
        description:
            "Learn about different ways to make use of your old books and get value from them.",
        icon: <Library className="w-6 h-6 text-primary" />,
    },
    {
        imageSrc:
            "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
        title: "What is BookKart?",
        description:
            "Discover how BookKart helps you buy and sell used books online easily.",
        icon: <Store className="w-6 h-6 text-primary" />,
    },
];


const BlogPost = () => {
    return (
        <div className='py-16 bg-amber-100'>
            <div className='px-4 mx-auto max-w-6xl'>
                <h1 className="text-center font-bold mb-8 text-3xl text-black">Read From Our Blog</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.map((post, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden p-6 flex flex-col items-center text-center">
                            <img src={post.imageSrc} alt={post.title} className="w-full h-48 object-cover rounded-md mb-4" />
                            <div className="flex flex-col items-center gap-2 mb-3">
                                <div className="bg-gray-200 p-3 rounded-full">{post.icon}</div>
                                <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
                            </div>
                            <p className="text-gray-600 text-sm">{post.description}</p>
                            <Button
                             
                             className='cursor-pointer mt-auto'
                             variant="link" 
                             >
                                Read More <ArrowRight className='w-4 h-4 animate-bounce'/>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BlogPost
