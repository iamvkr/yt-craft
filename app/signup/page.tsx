import React from 'react'
import SignupForm from './SignupForm'

const page = () => {
  return (
    <div className="flex min-h-[cacl(100vh_-_4rem)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm h-full">
        <SignupForm/>
      </div>
    </div>
  )
}

export default page