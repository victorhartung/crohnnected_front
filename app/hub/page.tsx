"use client";

import { useLanguage } from "@/components/language-provider";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  FileText,
  Heart,
  Loader2,
  Plus,
  Search,
  Tag,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface HubContent {
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

export default function HubPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<HubContent[]>([]);
  const [protocols, setProtocols] = useState<HubContent[]>([]);
  const [stories, setStories] = useState<HubContent[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Permissões diferenciadas por tipo de conteúdo
  const canCreateArticles =
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "DOCTOR";

  const canCreateProtocols =
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "DOCTOR";

  const canCreateStories =
    session?.user?.role === "MODERATOR" ||
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "DOCTOR" ||
    session?.user?.role === "PATIENT";

  // Função para verificar se pode criar conteúdo baseado na aba ativa
  const canCreateContent = () => {
    switch (activeTab) {
      case "articles":
        return canCreateArticles;
      case "protocols":
        return canCreateProtocols;
      case "stories":
        return canCreateStories;
      default:
        return false;
    }
  };

  useEffect(() => {
    const tabFromUrl = searchParams?.get("tab");
    if (
      tabFromUrl &&
      ["articles", "protocols", "stories"].includes(tabFromUrl)
    ) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tab);
    router.push(`/hub?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);

    try {
      const [articlesRes, protocolsRes, storiesRes] = await Promise.all([
        fetch("/api/hub/articles"),
        fetch("/api/hub/protocols"),
        fetch("/api/hub/stories"),
      ]);

      let articlesData: HubContent[] = [];
      let protocolsData: HubContent[] = [];
      let storiesData: HubContent[] = [];

      if (articlesRes.ok) articlesData = await articlesRes.json();
      if (protocolsRes.ok) protocolsData = await protocolsRes.json();
      if (storiesRes.ok) storiesData = await storiesRes.json();

      setArticles(articlesData);
      setProtocols(protocolsData);
      setStories(storiesData);

      const allContent = [...articlesData, ...protocolsData, ...storiesData];
      const tags = Array.from(
        new Set(allContent.flatMap((item) => item.tags || []))
      ).sort();
      setAllTags(tags);
    } catch (error) {
      toast.error(t("hub.failedToLoad"));
      console.error("Failed to load hub content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentContent = () => {
    switch (activeTab) {
      case "articles":
        return articles;
      case "protocols":
        return protocols;
      case "stories":
        return stories;
      default:
        return [];
    }
  };

  const filterContent = (content: HubContent[]) => {
    return content.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        !selectedTag || (item.tags && item.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  };

  const getTabIcon = (tab: string, size: "small" | "large" = "small") => {
    const sizeClass = size === "large" ? "h-12 w-12" : "h-4 w-4";

    switch (tab) {
      case "articles":
        return <BookOpen className={sizeClass} />;
      case "protocols":
        return <FileText className={sizeClass} />;
      case "stories":
        return <Heart className={sizeClass} />;
      default:
        return null;
    }
  };

  const getCreateLink = (type: string) => `/hub/${type}/new`;

  const currentContent = getCurrentContent();
  const filteredContent = filterContent(currentContent);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{t("header.hub")}</h1>
            <p className="text-muted-foreground">{t("footer.educationalHub")}</p>
          </div>

          {canCreateContent() && (
            <Button asChild>
              <Link href={getCreateLink(activeTab)}>
                <Plus className="mr-2 h-4 w-4" />
                {activeTab === "articles" &&
                  (t("hub.newArticle") || "New Article")}
                {activeTab === "protocols" &&
                  (t("hub.newProtocol") || "New Protocol")}
                {activeTab === "stories" && (t("hub.newStory") || "New Story")}
              </Link>
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      t("hub.searchPlaceholder") || "Search content..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === "" ? "default" : "whiteline"}
                  size="sm"
                  onClick={() => setSelectedTag("")}
                >
                  {t("hub.allTopics") || "All Topics"}
                </Button>
                {allTags.slice(0, 6).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "whiteline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              {getTabIcon("articles", "small")}
              {t("hub.articlesLabel") || `Articles (${articles.length})`}
            </TabsTrigger>
            <TabsTrigger value="protocols" className="flex items-center gap-2">
              {getTabIcon("protocols", "small")}
              {t("hub.protocolsLabel") || `Protocols (${protocols.length})`}
            </TabsTrigger>
            <TabsTrigger value="stories" className="flex items-center gap-2">
              {getTabIcon("stories", "small")}
              {t("hub.storiesLabel") || `Stories (${stories.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredContent.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="mx-auto mb-4 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                    {getTabIcon(activeTab, "large")}
                    <p className="text-muted-foreground">
                      {searchQuery || selectedTag
                        ? t("hub.noMatchingContent", { type: activeTab })
                        : t("hub.noContentYet", { type: activeTab })}
                    </p>
                  </div>
                  {canCreateContent() && !searchQuery && !selectedTag && (
                    <Button asChild className="mt-4">
                      <Link href={getCreateLink(activeTab)}>
                        {activeTab === "articles" &&
                          (t("hub.createFirstArticle") ||
                            "Create the first article")}
                        {activeTab === "protocols" &&
                          (t("hub.createFirstProtocol") ||
                            "Create the first protocol")}
                        {activeTab === "stories" &&
                          (t("hub.createFirstStory") ||
                            "Create the first story")}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-md transition-shadow flex flex-col justify-between h-[360px]"
                  >
                    <CardHeader className="pb-2 flex flex-col justify-between flex-grow">
                      <div>
                        <CardTitle className="text-lg line-clamp-2 h-[48px] flex items-start mb-4">
                          {item.title}
                        </CardTitle>

                        {item.summary && (
                          <CardDescription className="line-clamp-2 h-[40px] mt-1">
                            {item.summary}
                          </CardDescription>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {item.createdBy.name || item.createdBy.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col justify-between flex-grow">
                      <div className="flex flex-wrap gap-2 overflow-hidden">
                        {item.tags?.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {item.tags?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <Button asChild className="mt-auto w-full">
                        <Link href={`/hub/${activeTab}/${item.id}`}>
                          {t("hub.readMore")}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
