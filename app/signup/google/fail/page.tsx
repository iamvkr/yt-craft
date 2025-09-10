"use client"
import React, { useEffect, useState } from 'react'

const page = () => {
    const [Error, setError] = useState({
        message:"",
        type:"",
        code:""
    })
    useEffect(() => {
        const url = new URL(window.location.href);
        const search = url.searchParams;
        const err = search.get("error");
        if (err) {
            const js = JSON.parse(err)
            setError({
                message:js.message,
                type:js.type,
                code:js.code
            })
        }
    }, [])
    
  return (
    <div className='h-[60vh] flex flex-col items-center justify-center'>
        <h4>Login Failed</h4>
        <p>
            {Error.message}
        </p>
        <p>
            {Error.type}
        </p>
        <p>
            {Error.code}
        </p>
    </div>
  )
}

export default page