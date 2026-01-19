"use client";

import Sidebar from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    fullName: user?.firstName + " " + user?.lastName || "",
    email: user?.email || "",
    phone: "+1 234 567 8900",
    company: "Acme Corporation",
    jobTitle: "Product Manager",
    timezone: "UTC-5 (EST)",
    language: "English",
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    weeklyDigest: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground mb-8">
                Manage your account and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Settings */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Profile Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Full Name
                      </label>
                      <Input
                        value={settings.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Email
                      </label>
                      <Input
                        value={settings.email}
                        disabled
                        className="mt-1 opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Phone
                      </label>
                      <Input
                        value={settings.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Company
                        </label>
                        <Input
                          value={settings.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Job Title
                        </label>
                        <Input
                          value={settings.jobTitle}
                          onChange={(e) =>
                            handleInputChange("jobTitle", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button className="bg-primary text-primary-foreground">
                      Save Changes
                    </Button>
                  </div>
                </Card>

                {/* Preferences */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Timezone
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your current timezone
                        </p>
                      </div>
                      <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground">
                        <option>UTC-5 (EST)</option>
                        <option>UTC-6 (CST)</option>
                        <option>UTC-7 (MST)</option>
                        <option>UTC-8 (PST)</option>
                        <option>UTC (GMT)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Language
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Preferred language
                        </p>
                      </div>
                      <select className="px-3 py-2 border border-input rounded-md bg-background text-foreground">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Chinese</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Notifications */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Notifications
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Email Notifications
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receive email updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleInputChange(
                            "emailNotifications",
                            e.target.checked,
                          )
                        }
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Push Notifications
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receive push notifications
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) =>
                          handleInputChange(
                            "pushNotifications",
                            e.target.checked,
                          )
                        }
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Project Updates
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get notified about project changes
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.projectUpdates}
                        onChange={(e) =>
                          handleInputChange("projectUpdates", e.target.checked)
                        }
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Weekly Digest
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receive weekly summary email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.weeklyDigest}
                        onChange={(e) =>
                          handleInputChange("weeklyDigest", e.target.checked)
                        }
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                </Card>

                {/* Danger Zone */}
                <Card className="p-6 border-red-200 bg-red-50">
                  <h2 className="text-xl font-semibold text-red-700 mb-4">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-red-600 mb-4">
                    These actions cannot be undone. Please be careful.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-100"
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-100"
                    >
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Quick Links */}
              <div>
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Help & Support
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary"
                    >
                      Documentation
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary"
                    >
                      FAQ
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary"
                    >
                      Contact Support
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-primary"
                    >
                      Report Bug
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
