"use client";

import { useLanguage } from "@/components/language-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  Save,
  Tag,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  createdBy: {
    name?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EditArticlePage() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [article, setArticle] = useState<Article | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const slugParam = params?.slug as string;
  const canEdit =
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "DOCTOR";

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (session && !canEdit) {
      toast.error(t("hub.insufficientPermissions"));
      router.push("/hub");
    }
  }, [session, canEdit, router, t]);

  useEffect(() => {
    if (slugParam && canEdit) {
      loadArticle();
    }
  }, [slugParam, canEdit]);

  const loadArticle = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/hub/articles/${slugParam}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError(t("hub.articleNotFound"));
        } else {
          setError(t("hub.failedToLoad"));
        }
        return;
      }

      const data = await response.json();
      setArticle(data);
      // Populate form fields
      setTitle(data.title);
      setSlug(data.slug || "");
      setSummary(data.summary || "");
      setContent(data.content);
      setTags(data.tags || []);
      setIsPublic(data.isPublic);
    } catch (error) {
      setError(t("auth.unexpectedError"));
      console.error("Failed to load article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error(t("hub.titleRequired"));
      return;
    }

    if (!content.trim()) {
      toast.error(t("hub.contentRequired"));
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/hub/articles/${slugParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          summary: summary.trim() || undefined,
          content: content.trim(),
          tags,
          isPublic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            t("hub.failedToUpdate").replace(
              "{type}",
              t("hub.articlesLabel").toLowerCase().slice(0, -1)
            )
        );
      }

      const updatedArticle = await response.json();

      toast.success(
        t("hub.updated").replace("{type}", t("hub.articlesLabel").slice(0, -1))
      );
      // Redirect to the article page
      router.push(
        `/hub/articles/${updatedArticle.data.slug || updatedArticle.data.id}`
      );
    } catch (error) {
      console.error("Failed to update article:", error);
      toast.error(
        t("hub.failedToUpdate").replace(
          "{type}",
          t("hub.articlesLabel").toLowerCase().slice(0, -1)
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlugFromTitle = () => {
    if (!title.trim()) return;

    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 100);

    setSlug(generatedSlug);
  };

  if (!canEdit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("hub.noPermissionToEdit").replace(
              "{type}",
              t("hub.articlesLabel").toLowerCase()
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button asChild variant="ghost">
            <Link href="/hub">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("hub.backToHub")}
            </Link>
          </Button>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/hub">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hub.backToHub")}
          </Link>
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("hub.articleNotFound")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link href={`/hub/articles/${article.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("hub.backToArticle")}
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {t("hub.saveChanges")}
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("hub.editArticle")}</CardTitle>
              <CardDescription>
                {t("hub.updateDesc").replace(
                  "{type}",
                  t("hub.articlesLabel").toLowerCase().slice(0, -1)
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  {t("hub.titleLabel")} *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("hub.titlePlaceholder").replace(
                    "{type}",
                    t("hub.articlesLabel").toLowerCase().slice(0, -1)
                  )}
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="slug" className="text-sm font-medium">
                    {t("hub.slugLabel")}
                  </label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={generateSlugFromTitle}
                  >
                    {t("hub.generateFromTitle")}
                  </Button>
                </div>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={t("hub.slugPlaceholder")}
                />
                <p className="text-sm text-muted-foreground">
                  {t("hub.slugHelper")}
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <label htmlFor="summary" className="text-sm font-medium">
                  {t("hub.summaryLabel")}
                </label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={t("hub.summaryPlaceholder")}
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  {t("hub.contentLabel")} *
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("hub.contentPlaceholder")}
                  rows={15}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {t("hub.contentHelper")}
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  {t("hub.tagsLabel")}
                </label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t("hub.addTagPlaceholder")}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    {t("hub.add")}
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    {t("hub.makePublic")}
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("hub.visibilityHelper")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("hub.articleInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("hub.createdBy")}:{" "}
                  {article.createdBy.name || article.createdBy.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("hub.created")}: {formatDate(article.createdAt, t)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("hub.lastUpdated")}: {formatDate(article.updatedAt, t)}
                </span>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
