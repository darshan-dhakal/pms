"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { authApi } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      setIsLoading(false)
      return
    }

    try {
      const response = await authApi.login(email, password)

      if (!response.success) {
        setError(response.message || "Login failed. Please try again.")
        setIsLoading(false)
        return
      }

      // Extract token and user data from response
      const data = response.data as any
      const token = data.token || data.accessToken
      const user = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
        firstName: data.user?.firstName || "",
        lastName: data.user?.lastName || "",
        role: data.user?.role || data.role,
      }

      // Store in context and localStorage
      login(user, token)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during login")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your ProjectHub account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
