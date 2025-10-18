"use client";

import { useLanguage } from "@/components/language-provider";
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
import { createArticleSchema, type CreateArticleInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, BookOpen, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const COMMON_TAGS = [
  "Tratamento",
  "Sintomas",
  "Dieta",
  "Medicação",
  "Cirurgia",
  "Pesquisa",
  "Estilo de vida",
  "Saúde Mental",
];

export default function NewArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { t } = useLanguage();

  const form = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema(t)),
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

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const addCommonTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const onSubmit = async (data: CreateArticleInput) => {
    if (!canCreate) {
      setError(t("hub.contentPermission"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hub/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        setError(t("hub.failedContentCreation"));
        return;
      }

      toast.success(t("hub.addArticle"));
      router.push("/hub");
    } catch (error) {
      setError(t("auth.unexpectedError"));
      console.error("Article creation error:", error);
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
          <AlertDescription>
            {t("hub.insufficientPermissions")}
          </AlertDescription>
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
            <BookOpen className="h-8 w-8" />
            {t("hub.createNewArticle")}
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
                  placeholder={t("hub.titlePlaceholder", {
                    type: t("hub.articlesLabel"),
                  })}
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

              <div className="space-y-4">
                <Label>{t("hub.tagsLabel")}</Label>

                <div className="space-y-2">
                  <Input
                    placeholder={t("hub.tagPlaceholder")}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("hub.addTag")}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("hub.commonTags")}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="whiteline"
                        size="sm"
                        onClick={() => addCommonTag(tag)}
                        disabled={isLoading || selectedTags.includes(tag)}
                        className="text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {t("hub.selectedTags")}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm border"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            disabled={isLoading}
                            className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t("hub.contentLabel")} *</Label>
                <Textarea
                  id="content"
                  placeholder={t("hub.contentPlaceholder")}
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
                  {t("hub.newArticle")}
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
