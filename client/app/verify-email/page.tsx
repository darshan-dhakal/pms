"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { authApi } from "@/lib/api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [verificationMessage, setVerificationMessage] = useState("");

  // Handle email verification from token in URL
  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        setVerificationStatus("verifying");
        try {
          const response = await authApi.verifyEmail(token);

          if (!response.success) {
            setVerificationStatus("error");
            setVerificationMessage(
              response.message || "Failed to verify email",
            );
            return;
          }

          setVerificationStatus("success");
          setVerificationMessage("Your email has been verified successfully!");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } catch (error) {
          setVerificationStatus("error");
          setVerificationMessage(
            error instanceof Error ? error.message : "An error occurred",
          );
        }
      };

      verifyEmail();
    }
  }, [token, router]);

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
            {verificationStatus === "verifying" && "Verifying your email..."}
            {verificationStatus === "success" && "Email verified!"}
            {verificationStatus === "error" && "Verification failed"}
            {verificationStatus === "idle" &&
              "Enter your email address to receive a verification link"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Verification from Token */}
          {token && (
            <>
              {verificationStatus === "verifying" && (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Spinner className="h-8 w-8" />
                  <p className="text-sm text-muted-foreground">
                    Verifying your email...
                  </p>
                </div>
              )}

              {verificationStatus === "success" && (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      {verificationMessage}
                    </AlertDescription>
                  </Alert>
                  <p className="text-sm text-muted-foreground text-center">
                    You will be redirected to the login page in a few seconds...
                  </p>
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                </div>
              )}

              {verificationStatus === "error" && (
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {verificationMessage}
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push("/verify-email")}
                      className="w-full"
                    >
                      Request New Verification Email
                    </Button>
                    <Button
                      onClick={() => router.push("/login")}
                      variant="outline"
                      className="w-full"
                    >
                      Go to Login
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Request Verification Email */}
          {!token && (
            <>
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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Verification Email"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted-foreground/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or
                      </span>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
