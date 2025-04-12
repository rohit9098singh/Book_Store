import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import React from 'react'
import { RWebShare } from "react-web-share"

interface RWebShareProps {
    url: string,
    title: string,
    text: string,
}
const ShareButton: React.FC<RWebShareProps> = ({ url, title, text }) => {
    return (
         <RWebShare
           data={{
            text:text,
            url:url,
            title:title,
           }}
           onClick={()=>console.log("shared successfully")}
         >
            <Button size={"sm"} variant={"outline" } className='cursor-pointer'>
                 <Share2 className='h-4 w-4 mr-2'/>
                   <span className='sm:hidden'>share</span>
            </Button>
         </RWebShare>
    )
}

export default ShareButton
