"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.resendVerificationEmail(email);

      if (!response.success) {
        setError(response.message || "Failed to send verification email");
        setIsLoading(false);
        return;
      }

      setSentEmail(email);
      setEmailSent(true);
      setEmail("");
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            Enter your email address to receive a verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!emailSent ? (
            <>
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Verification Email"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Back to Login</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                <p className="text-sm font-medium text-green-900">
                  ✓ Email Sent Successfully
                </p>
                <p className="text-xs text-green-800">
                  A verification link has been sent to{" "}
                  <strong>{sentEmail}</strong>
                </p>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Please check your email and click the verification link to
                  verify your account.
                </p>
                <p>
                  If you don't see the email, please check your spam folder.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                >
                  Send to Different Email
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Verification link expires in 24 hours
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
