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
import { createStorySchema, type CreateStoryInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const STORY_TAGS = [
  "Jornada",
  "Diagnóstico",
  "Tratamento",
  "Recuperação",
  "Desafios",
  "Esperança",
  "Família",
  "Trabalho",
  "Saúde Mental",
  "Sucesso",
  "Apoio",
].map((tag) => ({ label: tag, value: tag }));

export default function NewStoryPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<CreateStoryInput>({
    resolver: zodResolver(createStorySchema(t)),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      tags: [],
      isPublic: false,
    },
  });

  const onSubmit = async (data: CreateStoryInput) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hub/stories", {
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
        setError(errorData.error || t("hub.failedCreateStory"));
        return;
      }

      toast.success(t("hub.addStory"));
      router.push("/hub");
    } catch (error) {
      setError(t("hub.unexpectedError"));
      console.error("Story creation error:", error);
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
          <AlertDescription>{t("hub.signInToShareStory")}</AlertDescription>
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
            <Heart className="h-8 w-8" />
            {t("hub.shareYourStory")}
          </h1>
          <p className="text-muted-foreground">
            {t("hub.shareStoryDescription")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("hub.yourStory")}</CardTitle>
            <CardDescription>{t("hub.yourStoryDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t("hub.storyTitle")} *</Label>
                <Input
                  id="title"
                  placeholder={t("hub.storyTitlePlaceholder")}
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
                <Label htmlFor="summary">{t("hub.storySummary")}</Label>
                <Textarea
                  id="summary"
                  placeholder={t("hub.storySummaryPlaceholder")}
                  {...form.register("summary")}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("hub.storyTags")}</Label>
                <MultiSelect
                  options={STORY_TAGS}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder={t("hub.selectTagsPlaceholder")}
                  searchPlaceholder={t("hub.searchTags")}
                  emptyText={t("hub.noTagsFound")}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t("hub.storyContent")} *</Label>
                <Textarea
                  id="content"
                  placeholder={t("hub.storyContentPlaceholder")}
                  {...form.register("content")}
                  disabled={isLoading}
                  rows={12}
                  className="min-h-[300px]"
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
                <Label htmlFor="isPublic">{t("hub.makeStoryPublic")}</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("hub.storyPrivacyNote")}
              </p>

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
                  {t("hub.shareStory")}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => router.push("/hub")}
                  disabled={isLoading}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
