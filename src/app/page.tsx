'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Banking App</h1>
      <p>Welcome to testing banking app</p>
      <Button onClick={() => router.push('/deposit')}>Get a Start</Button>
    </div>
  );
}