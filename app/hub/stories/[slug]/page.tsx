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
import { useLanguage } from "@/components/language-provider";
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

interface Story {
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

export default function StoryDetailPage() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [story, setStory] = useState<Story | null>(null);

  const slug = params?.slug as string;
  const canEdit =
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "DOCTOR";

  useEffect(() => {
    if (slug) {
      loadStory();
    }
  }, [slug]);

  const loadStory = async () => {
    const slug = params.slug as string;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/hub/stories/${slug}`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError(t("hub.storyNotFound"));
        } else {
          setError(t("hub.failedToLoad"));
        }
        setStory(null);
        return;
      }

      setStory(data);
    } catch (error) {
      setError(t("auth.unexpectedError"));
      console.error("Failed to load story:", error);
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
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("hub.storyNotFound")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hub.backToStories")}
          </Button>

          {canEdit && (
            <Button asChild>
              <Link href={`/hub/stories/${story.slug || story.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                {t("hub.editStory")}
              </Link>
            </Button>
          )}
        </div>

        {/* Story Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{story.title}</CardTitle>
            {story.summary && (
              <CardDescription className="text-lg">
                {story.summary}
              </CardDescription>
            )}

            {/* Meta information */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {story.createdBy.name || story.createdBy.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(story.createdAt, t)}
              </div>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="none">
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
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
