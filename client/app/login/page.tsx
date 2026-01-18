"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { useAuth } from "@/context/auth-context";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [showVerificationLink, setShowVerificationLink] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.requestLoginOTP(email, password);

      if (!response.success) {
        setError(response.message || "Failed to send OTP. Please try again.");
        setIsLoading(false);
        return;
      }

      // Advance to OTP step
      setStep(2);
      setOtp("");
      setOtpError("");
      setTimeLeft(300);
      setError("");
      setPassword("");
      setIsLoading(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during login",
      );
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setIsLoading(true);

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.verifyLoginOTP(email, otp);

      if (!response.success) {
        setOtpError(response.message || "OTP verification failed");
        setIsLoading(false);
        return;
      }

      const data = response.data as any;
      const token = data.token || data.accessToken;
      const user = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
        firstName: data.user?.firstName || "",
        lastName: data.user?.lastName || "",
        role: data.user?.role || data.role,
      };

      login(user, token);

      if (data.isEmailVerified === false) {
        setEmailNotVerified(true);
        setShowVerificationLink(true);
        setOtpError("");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpError("");
    setIsLoading(true);

    try {
      const response = await authApi.requestLoginOTP(email, password);

      if (!response.success) {
        setOtpError("Failed to resend OTP");
        setIsLoading(false);
        return;
      }

      setOtp("");
      setTimeLeft(300);
      setOtpError("");
      setIsLoading(false);
    } catch (error) {
      setOtpError("Failed to resend OTP");
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep(1);
    setOtp("");
    setOtpError("");
    setTimeLeft(0);
    setPassword("");
    setEmailNotVerified(false);
    setShowVerificationLink(false);
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">
            {step === 2 ? "Verify OTP" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {step === 2
              ? `Enter the 6-digit code sent to ${email}`
              : "Sign in to your ProjectHub account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
                {isLoading ? "Sending OTP..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              {otpError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {otpError}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]"
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        const newOtp = otp.split("");
                        newOtp[index] = value;
                        setOtp(newOtp.join(""));
                        if (value && index < 5) {
                          const nextInput = document.querySelector(
                            `input[data-otp-index="${index + 1}"]`,
                          ) as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        const paste = e.clipboardData
                          .getData("text")
                          .replace(/[^0-9]/g, "");
                        if (paste.length === 6) {
                          e.preventDefault();
                          setOtp(paste);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          const prevInput = document.querySelector(
                            `input[data-otp-index="${index - 1}"]`,
                          ) as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      data-otp-index={index}
                      className="w-12 h-12 text-center text-lg font-semibold border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {timeLeft > 0 ? (
                  <span>
                    Resend OTP in{" "}
                    {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-primary hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || otp.length !== 6 || !/^\d{6}$/.test(otp)}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                Back to Login
              </Button>
              {showVerificationLink && emailNotVerified && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 mb-2">
                      ⚠️ Email Not Verified
                    </p>
                    <p className="text-xs text-yellow-800 mb-3">
                      Your email is not verified. Please verify your email to
                      unlock all features.
                    </p>
                    <Link
                      href="/verify-email"
                      className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
                    >
                      Verify Email Now
                    </Link>
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => router.push("/dashboard")}
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </form>
          )}
          {step === 1 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
