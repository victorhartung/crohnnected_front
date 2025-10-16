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
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/hub/stories/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Story not found");
        } else {
          setError("Failed to load story");
        }
        return;
      }

      const data = await response.json();
      setStory(data);
    } catch (error) {
      setError("An unexpected error occurred");
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
          <AlertDescription>Story not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {canEdit && (
            <Button asChild>
              <Link href={`/hub/stories/${story.slug || story.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Story
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
                {formatDate(story.createdAt)}
              </div>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {story.tags.map((tag) => (
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
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
