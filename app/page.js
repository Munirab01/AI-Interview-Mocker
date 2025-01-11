"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
      <p className="text-lg mb-6">To get started, go to the dashboard</p>
      <Link href="/dashboard">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
}
