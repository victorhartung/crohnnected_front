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
import { formatDate } from "@/lib/utils";
import {
  createProtocolSchema,
  type CreateProtocolInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Loader2,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Protocol {
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

export default function EditProtocolPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const slugParam = params?.slug as string;
  const canEdit =
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "DOCTOR";

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

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (status === "authenticated" && !canEdit) {
      toast.error(t("hub.insufficientPermissions"));
      router.push("/hub");
    }
  }, [status, canEdit, router, t]);

  useEffect(() => {
    if (slugParam && canEdit) {
      loadProtocol();
    }
  }, [slugParam, canEdit]);

  const loadProtocol = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/hub/protocols/${slugParam}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError(t("hub.protocolNotFound"));
        } else {
          setError(t("hub.failedToLoad"));
        }
        return;
      }

      const data = await response.json();
      setProtocol(data);
      setSelectedTags(data.tags || []);

      // Populate form fields
      form.reset({
        title: data.title,
        slug: data.slug || "",
        summary: data.summary || "",
        content: data.content,
        tags: data.tags || [],
        isPublic: data.isPublic,
      });
    } catch (error) {
      setError(t("auth.unexpectedError"));
      console.error("Failed to load protocol:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateProtocolInput) => {
    if (!canEdit) {
      toast.error(t("hub.insufficientPermissions"));
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/hub/protocols/${slugParam}`, {
        method: "PUT",
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
        throw new Error(
          errorData.error ||
            t("hub.failedToUpdate").replace(
              "{type}",
              t("hub.protocolsLabel").toLowerCase().slice(0, -1)
            )
        );
      }

      const updatedProtocol = await response.json();

      toast.success(
        t("hub.updated").replace("{type}", t("hub.protocolsLabel").slice(0, -1))
      );
      router.push(
        `/hub/protocols/${updatedProtocol.data.slug || updatedProtocol.data.id}`
      );
    } catch (error) {
      console.error("Failed to update protocol:", error);
      toast.error(
        t("hub.failedToUpdate").replace(
          "{type}",
          t("hub.protocolsLabel").toLowerCase().slice(0, -1)
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlugFromTitle = () => {
    const title = form.getValues("title");
    if (!title.trim()) return;

    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 100);

    form.setValue("slug", generatedSlug);
  };

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
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("profile.signInToView")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("hub.noPermissionToEdit").replace(
              "{type}",
              t("hub.protocolsLabel").toLowerCase()
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Button asChild variant="ghost">
            <Link href="/hub?tab=protocols">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("hub.backToProtocols")}
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

  if (!protocol) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/hub?tab=protocols">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("hub.backToProtocols")}
          </Link>
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("hub.protocolNotFound")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link href={`/hub/protocols/${protocol.slug || protocol.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("hub.backToProtocol")}
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            {t("hub.editProtocol")}
          </h1>
          <p className="text-muted-foreground">
            {t("hub.updateDesc").replace(
              "{type}",
              t("hub.protocolsLabel").toLowerCase().slice(0, -1)
            )}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("hub.editProtocol")}</CardTitle>
            <CardDescription>
              {t("hub.updateDesc").replace(
                "{type}",
                t("hub.protocolsLabel").toLowerCase().slice(0, -1)
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t("hub.titleLabel")} *</Label>
                <Input
                  id="title"
                  placeholder={t("hub.titlePlaceholder").replace(
                    "{type}",
                    t("hub.protocolsLabel").toLowerCase().slice(0, -1)
                  )}
                  {...form.register("title")}
                  disabled={isSaving}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">{t("hub.slugOptional")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSlugFromTitle}
                    disabled={isSaving}
                  >
                    {t("hub.generateFromTitle")}
                  </Button>
                </div>
                <Input
                  id="slug"
                  placeholder={t("hub.slugPlaceholder")}
                  {...form.register("slug")}
                  disabled={isSaving}
                />
                <p className="text-sm text-muted-foreground">
                  {t("hub.slugOptional")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">{t("hub.summaryOptional")}</Label>
                <Textarea
                  id="summary"
                  placeholder={t("hub.summaryPlaceholder")}
                  {...form.register("summary")}
                  disabled={isSaving}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("hub.tagsLabel")}</Label>
                <MultiSelect
                  options={PROTOCOL_TAGS}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder={t("hub.tagsOptional")}
                  searchPlaceholder={t("common.search")}
                  emptyText={t("hub.noContentYet").replace(
                    "{type}",
                    t("hub.tagsLabel").toLowerCase()
                  )}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">{t("hub.contentLabel")} *</Label>
                <Textarea
                  id="content"
                  placeholder={t("hub.contentPlaceholder")}
                  {...form.register("content")}
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  {t("hub.saveChanges")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={isSaving}
                >
                  <Link href={`/hub/protocols/${protocol.slug || protocol.id}`}>
                    {t("common.cancel")}
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Protocol Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("hub.metaInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>
                {t("hub.createdBy")}:{" "}
                {protocol.createdBy.name || protocol.createdBy.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {t("hub.createdBy")}: {formatDate(protocol.createdAt, t)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {t("hub.lastUpdated")}: {formatDate(protocol.updatedAt, t)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
