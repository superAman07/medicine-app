'use client'
import React, { useEffect, useState } from 'react';

const Page = () => {
    const [distributer, setDistributer] = useState('');
    useEffect(()=>{
        console.log("distributor",distributer)
    },[distributer])
    return (
        <div>
            Purchase Form
            <input placeholder='distributor name' onChange={(e)=>{setDistributer(e.target.value)}}></input>
        </div>
    );
}

export default Page;

// step 1 user se file  lena hai..
// step 2 state me worksheet ka data save karna... 
// step 3 