'use client'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Page = () => {
    const [distributer, setDistributer] = useState<File>();
    const router = useRouter();
    const handleUpload = (e: any)=>{
        e.preventDefault();
        setDistributer(e.target.value);
        console.log("file uploaded");
        router.push("/");
    }
    useEffect(()=>{
        console.log("distributor",distributer)
    },[distributer])
    return (
        <div>
            Purchase Form
            <input placeholder='distributor name' onInput={(e)=>{handleUpload(e)}}></input>
        </div>
    );
}

export default Page;

// step 1 user se file  lena hai..
// step 2 state me worksheet ka data save karna... 
// step 3 