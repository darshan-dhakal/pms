"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/lib/api";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);

        if (!response.success) {
          setStatus("error");
          setMessage(response.message || "Failed to verify email");
          return;
        }

        setStatus("success");
        setMessage("Your email has been verified successfully!");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "An error occurred",
        );
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Verification successful!"}
            {status === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  ✓ Email Verified
                </p>
                <p className="text-xs text-green-800 mt-2">{message}</p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Redirecting to login...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  ✗ Verification Failed
                </p>
                <p className="text-xs text-destructive/80 mt-2">{message}</p>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => router.push("/verify-email")}
                >
                  Request New Verification Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
