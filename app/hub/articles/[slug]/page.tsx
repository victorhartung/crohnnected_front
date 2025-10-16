"use client";

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
import { formatDate } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Edit,
  Loader2,
  Tag,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function ArticleDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [article, setArticle] = useState<Article | null>(null);

  const slug = params?.slug as string;
  const canEdit =
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "DOCTOR";

  useEffect(() => {
    console.log("Slug from params:", slug);
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Loading article with slug:", slug);
      const response = await fetch(`/api/hub/articles/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Article not found");
        } else {
          setError(`Failed to load article: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      console.log("Article data loaded:", data);
      setArticle(data);
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Failed to load article:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          {error.includes("not found") && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  The article you're looking for might have been moved or
                  deleted.
                </p>
                <Button asChild>
                  <Link href="/hub">Return to Information Hub</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Article not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/hub?tab=articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>

          {canEdit && (
            <Button asChild>
              <Link href={`/hub/articles/${article.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Article
              </Link>
            </Button>
          )}
        </div>

        {/* Article Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{article.title}</CardTitle>
            {article.summary && (
              <CardDescription className="text-lg">
                {article.summary}
              </CardDescription>
            )}

            {/* Meta information */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.createdBy.name || article.createdBy.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(article.createdAt)}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div
              className="prose prose-gray max-w-none dark:prose-invert whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
