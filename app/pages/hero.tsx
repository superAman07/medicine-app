"use client";
import Atropos from "atropos/react";
import "atropos/css";

export default function Hero() {
  return (
    <Atropos className="w-full h-[400px] flex flex-col items-center justify-center gap-4 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-5xl font-extrabold">Welcome to Next.js</h1>
      <p className="text-lg text-gray-300 max-w-lg text-center">
        Build fast, scalable, and interactive web applications with the power of Next.js.
      </p>
      <img
        src="https://nextjs.org/static/images/nextjs-logo.png"
        alt="Next.js Logo"
        className="w-24 h-24"
      />
      <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition">
        Get Started
      </button>
    </Atropos>
  );
}
