"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  doctorProfileSchema,
  patientProfileSchema,
  type DoctorProfileInput,
  type PatientProfileInput,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Shield, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<any>(null);

  const isPatient = session?.user?.role === "PATIENT";
  const isDoctor = session?.user?.role === "DOCTOR";

  const patientForm = useForm<PatientProfileInput>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      sex: undefined,
      country: "",
      state: "",
      city: "",
      diagnosisDate: "",
    },
  });

  const doctorForm = useForm<DoctorProfileInput>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      specialty: "",
      country: "",
      state: "",
      city: "",
    },
  });

  // We'll handle form registration separately for each role to avoid type conflicts

  useEffect(() => {
    if (session?.user) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/users/me");
      if (response.ok) {
        const result = await response.json();
        const userData = result.data?.user || result;
        setProfileData(userData);

        // Populate form with existing data
        if (isPatient && userData.patientProfile) {
          patientForm.reset({
            name: userData.name || "",
            birthDate: userData.patientProfile.birthDate?.split("T")[0] || "",
            sex: userData.patientProfile.sex || undefined,
            country: userData.patientProfile.country || "",
            state: userData.patientProfile.state || "",
            city: userData.patientProfile.city || "",
            diagnosisDate:
              userData.patientProfile.diagnosisDate?.split("T")[0] || "",
          });
        } else if (isDoctor && userData.doctorProfile) {
          doctorForm.reset({
            name: userData.name || "",
            licenseNumber: userData.doctorProfile.licenseNumber || "",
            specialty: userData.doctorProfile.specialty || "",
            country: userData.doctorProfile.country || "",
            state: userData.doctorProfile.state || "",
            city: userData.doctorProfile.city || "",
          });
        } else {
          // Initialize with user's basic info
          const basicData = { name: userData.name || "" };
          if (isPatient) {
            patientForm.reset(basicData);
          } else if (isDoctor) {
            doctorForm.reset({ ...basicData, licenseNumber: "" });
          }
        }
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const onSubmit = async (data: PatientProfileInput | DoctorProfileInput) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      await update(); // Refresh session
      loadProfile(); // Reload profile data
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile information.
          </p>
        </div>

        <Tabs
          defaultValue={isPatient || isDoctor ? "profile" : "account"}
          className="space-y-4"
        >
          <TabsList>
            {(isPatient || isDoctor) && (
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile Information
              </TabsTrigger>
            )}
            <TabsTrigger value="account">
              <Shield className="w-4 h-4 mr-2" />
              Account Details
            </TabsTrigger>
          </TabsList>

          {(isPatient || isDoctor) && (
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={
                      isPatient
                        ? patientForm.handleSubmit(onSubmit)
                        : doctorForm.handleSubmit(onSubmit)
                    }
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        {...(isPatient
                          ? patientForm.register("name")
                          : doctorForm.register("name"))}
                        disabled={isLoading}
                      />
                      {(isPatient
                        ? patientForm.formState.errors.name
                        : doctorForm.formState.errors.name) && (
                        <p className="text-sm text-destructive">
                          {isPatient
                            ? patientForm.formState.errors.name?.message
                            : doctorForm.formState.errors.name?.message}
                        </p>
                      )}
                    </div>

                    {isPatient && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="birthDate">Birth Date</Label>
                            <Input
                              id="birthDate"
                              type="date"
                              {...patientForm.register("birthDate")}
                              disabled={isLoading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sex">Sex</Label>
                            <Select
                              value={patientForm.watch("sex") || ""}
                              onValueChange={(value) =>
                                patientForm.setValue("sex", value as any)
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select sex" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="INTERSEX">
                                  Intersex
                                </SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                                <SelectItem value="UNSPECIFIED">
                                  Prefer not to say
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                          <Input
                            id="diagnosisDate"
                            type="date"
                            {...patientForm.register("diagnosisDate")}
                            disabled={isLoading}
                          />
                        </div>
                      </>
                    )}

                    {isDoctor && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="licenseNumber">License Number</Label>
                          <Input
                            id="licenseNumber"
                            type="text"
                            placeholder="Enter your license number"
                            {...doctorForm.register("licenseNumber")}
                            disabled={isLoading}
                          />
                          {doctorForm.formState.errors.licenseNumber && (
                            <p className="text-sm text-destructive">
                              {
                                doctorForm.formState.errors.licenseNumber
                                  .message
                              }
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialty">Specialty</Label>
                          <Input
                            id="specialty"
                            type="text"
                            placeholder="Enter your specialty"
                            {...doctorForm.register("specialty")}
                            disabled={isLoading}
                          />
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          type="text"
                          placeholder="Country"
                          {...(isPatient
                            ? patientForm.register("country")
                            : doctorForm.register("country"))}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="State/Province"
                          {...(isPatient
                            ? patientForm.register("state")
                            : doctorForm.register("state"))}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="City"
                          {...(isPatient
                            ? patientForm.register("city")
                            : doctorForm.register("city"))}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>
                  View your account information and role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Email Address</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session?.user?.email}
                    </p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session?.user?.role}
                    </p>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profileData?.createdAt
                        ? new Date(profileData.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
