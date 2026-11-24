"use client";
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import {User} from "next-auth";
const Navbar = () => {
  const { data: session } = useSession();
  const user:User=session?.user as User;

  return (
    <nav className='bg-gray-200'>
      <div className='flex justify-between items-center p-4'>
        <a href="/">Mystery Message</a>
        {
          session ? (
            <>
              <span className=''>Welcome, {user.username || user.email}</span>
              <button className='bg-blue-500 text-white p-2 rounded' onClick={() => signOut()}>Sign Out</button>
            </>
          ) : (
            <Link className='bg-blue-500 text-white p-2 rounded' href="/sign-in">Sign In</Link>
          )
        }
      </div>
    </nav>
      
  )
}

export default Navbar
