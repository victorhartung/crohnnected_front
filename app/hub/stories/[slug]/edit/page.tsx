"use client";

import { useLanguage } from "@/components/language-provider";
import { MultiSelect } from "@/components/multi-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createStorySchema, type CreateStoryInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function EditStoryPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const slug = params?.slug as string;
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (slug) fetchStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function fetchStory() {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/hub/stories/${slug}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t("hub.failedToLoad"));
        return;
      }

      const data = await res.json();
      form.reset({
        title: data.title || "",
        summary: data.summary || "",
        content: data.content || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        isPublic: !!data.isPublic,
      });
      setSelectedTags(Array.isArray(data.tags) ? data.tags : []);
    } catch (err) {
      console.error(err);
      setError(t("auth.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: CreateStoryInput) {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/hub/stories/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, tags: selectedTags }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error ||
            t("hub.failedToUpdate").replace(
              "{type}",
              t("hub.storiesLabel").toLowerCase().slice(0, -1)
            )
        );
        return;
      }

      toast.success(
        t("hub.updated").replace("{type}", t("hub.storiesLabel").slice(0, -1))
      );
      router.push(`/hub/stories/${slug}`);
    } catch (err) {
      console.error(err);
      setError(t("auth.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading" || isLoading) {
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
          <AlertDescription>{t("profile.signInToView")}</AlertDescription>
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
            {t("common.back")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("hub.editStory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">{t("hub.titleLabel")}</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="summary">{t("hub.summaryLabel")}</Label>
                <Textarea id="summary" {...form.register("summary")} rows={3} />
              </div>

              <div>
                <Label>{t("hub.tagsLabel")}</Label>
                <MultiSelect
                  options={STORY_TAGS}
                  value={selectedTags}
                  onChange={setSelectedTags}
                />
              </div>

              <div>
                <Label htmlFor="content">{t("hub.contentLabel")}</Label>
                <Textarea
                  id="content"
                  {...form.register("content")}
                  rows={12}
                  className="min-h-[300px]"
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("isPublic")}
                  onCheckedChange={(v) => form.setValue("isPublic", v)}
                />
                <Label>{t("hub.publicContent")}</Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit">{t("hub.saveChanges")}</Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => router.push("/hub?tab=stories")}
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
