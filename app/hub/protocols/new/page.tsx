"use client";

import { useLanguage } from "@/components/language-provider";
import { MultiSelect } from "@/components/multi-select";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createProtocolSchema,
  type CreateProtocolInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const PROTOCOL_TAGS = [
  "Diagnóstico",
  "Tratamento",
  "Cirurgia",
  "Medicação",
  "Monitoramento",
  "Emergência",
  "Pediatria",
  "Adulto",
  "Endoscopia",
].map((tag) => ({ label: tag, value: tag }));

export default function NewProtocolPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<CreateProtocolInput>({
    resolver: zodResolver(createProtocolSchema(t)),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      tags: [],
      isPublic: true,
    },
  });

  const canCreate = ["MODERATOR", "ADMIN", "DOCTOR"].includes(
    session?.user?.role || ""
  );

  const onSubmit = async (data: CreateProtocolInput) => {
    if (!canCreate) {
      setError(t("hub.contentPermission"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hub/protocols", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || t("hub.failedContentCreation"));
        return;
      }

      toast.success(t("hub.addProtocol"));
      router.push("/hub?tab=protocols");
    } catch (error) {
      setError(t("auth.unexpectedError"));
      console.error("Protocol creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("hub.signInContent")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("hub.contentPermission")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hub.backToHub")}
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            {t("hub.createNewProtocol")}
          </h1>
          <p className="text-muted-foreground">{t("hub.shareContent")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("hub.details")}</CardTitle>
            <CardDescription>{t("hub.contentInfo")}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t("hub.titleLabel")} *</Label>
                <Input
                  id="title"
                  placeholder={t("hub.titlePlaceholder", { type: "protocolo" })}
                  {...form.register("title")}
                  disabled={isLoading}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">{t("hub.slugOptional")}</Label>
                <Input
                  id="slug"
                  placeholder={t("hub.slugPlaceholder")}
                  {...form.register("slug")}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  {t("hub.generateFromTitle")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">{t("hub.summaryOptional")}</Label>
                <Textarea
                  id="summary"
                  placeholder={t("hub.summaryPlaceholder")}
                  {...form.register("summary")}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("hub.commonTags")}</Label>
                <MultiSelect
                  options={PROTOCOL_TAGS}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder={t("hub.selectTags")}
                  searchPlaceholder={t("hub.searchTags")}
                  emptyText={t("hub.noTagsFound")}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t("hub.contentLabel")} *</Label>
                <Textarea
                  id="content"
                  placeholder={t("hub.contentPlaceholderProtocol")}
                  {...form.register("content")}
                  disabled={isLoading}
                  rows={15}
                  className="min-h-[400px]"
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={form.watch("isPublic")}
                  onCheckedChange={(checked) =>
                    form.setValue("isPublic", checked)
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="isPublic">{t("hub.publicContent")}</Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("hub.createNewProtocol")}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => router.push("/hub")}
                  disabled={isLoading}
                >
                  {t("hub.backToHub")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
