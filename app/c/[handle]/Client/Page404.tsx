"use client"
import { Button } from '@/components/ui/button'
import { ArrowUpLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Page404 = ({message}:{message:string}) => {
  return (
    <div className='w-full h-screen flex items-center justify-center text-center flex-col gap-6'>
            <Image src="https://cdn-icons-png.flaticon.com/512/3551/3551629.png" alt="404" className='h-24' />
        <div>
        <span className='text-xl'>{message}</span>
        </div>
        <Button><ArrowUpLeft/><Link href={"/"}> Go to Home</Link></Button>
    </div>
  )
}

export default Page404