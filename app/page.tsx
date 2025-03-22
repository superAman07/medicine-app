'use client';

import Link from "next/link";

export default function Home() {
  return <div className="flex justify-center space-x-4 pt-56">
    <Link href={'/medicine'}>Medicine</Link>
    <Link href={'/distributer'}>Distributer</Link>
  </div>   
}
