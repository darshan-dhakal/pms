"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background" />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-foreground mb-6">ProjectHub</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Manage your projects, tasks, and team collaboration all in one place
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition border border-border"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
