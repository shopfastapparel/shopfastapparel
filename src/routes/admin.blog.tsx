import { useEffect, useState, useCallback } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownLite } from "@/components/MarkdownLite";
import {
  listAllBlogPosts,
  setBlogPostStatus,
  deleteBlogPost,
  generateBlogPostNow,
} from "@/lib/blog-admin.functions";
import { toast } from "sonner";
import { Loader2, Sparkles, Check, X, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({ meta: [{ title: "Blog drafts | Fast Apparel" }, { name: "robots", content: "noindex" }] }),
  component: AdminBlog,
});

type Row = Awaited<ReturnType<typeof listAllBlogPosts>>[number];

function AdminBlog() {
  const router = useRouter();
  const list = useServerFn(listAllBlogPosts);
  const setStatus = useServerFn(setBlogPostStatus);
  const del = useServerFn(deleteBlogPost);
  const genNow = useServerFn(generateBlogPostNow);

  const [posts, setPosts] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "rejected">("draft");

  const load = useCallback(async () => {
    try {
      const data = await list();
      setPosts(data);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : "Failed to load";
      if (msg.includes("Forbidden")) {
        toast.error("Your account isn't an admin yet. Ask the site owner to grant access.");
      } else if (msg.includes("Unauthorized")) {
        navigate({ to: "/login" });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [list, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          navigate({ to: "/login" });
          return;
        }
        load();
      } catch {
        navigate({ to: "/login" });
      }
    })();
  }, [load, navigate]);

  const onAction = async (id: string, action: "publish" | "reject" | "delete" | "unpublish") => {
    try {
      if (action === "delete") {
        await del({ data: { id } });
        toast.success("Deleted");
      } else if (action === "publish") {
        await setStatus({ data: { id, status: "published" } });
        toast.success("Published");
        router.invalidate();
      } else if (action === "reject") {
        await setStatus({ data: { id, status: "rejected" } });
        toast.success("Rejected");
      } else {
        await setStatus({ data: { id, status: "draft" } });
        toast.success("Moved to drafts");
      }
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    }
  };

  const onGenerate = async () => {
    setGenerating(true);
    try {
      const r = await genNow({});
      toast.success(`Draft created: ${r.title}`);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const filtered = (posts ?? []).filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">Blog drafts</h1>
            <p className="text-muted-foreground text-sm mt-1">
              AI generates new posts every Tuesday & Friday. Review and publish.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onGenerate} disabled={generating}>
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate now
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/login" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {(["draft", "published", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 capitalize ${
                filter === f ? "bg-ink text-background border-ink" : "border-border hover:border-ink/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center"><Loader2 className="h-6 w-6 animate-spin inline" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No posts in this view.</div>
        ) : (
          <div className="mt-6 space-y-6">
            {filtered.map((p) => (
              <article key={p.id} className="border-2 border-ink rounded-xl bg-card p-5 shadow-pop">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge>{p.category}</Badge>
                      {p.city && <Badge variant="outline">{p.city}</Badge>}
                      <Badge variant="secondary" className="capitalize">{p.status}</Badge>
                      <span className="text-muted-foreground">
                        {new Date(p.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl">{p.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.status !== "published" && (
                      <Button size="sm" onClick={() => onAction(p.id, "publish")}>
                        <Check className="h-4 w-4" /> Publish
                      </Button>
                    )}
                    {p.status === "published" && (
                      <Button size="sm" variant="outline" onClick={() => onAction(p.id, "unpublish")}>
                        Unpublish
                      </Button>
                    )}
                    {p.status === "draft" && (
                      <Button size="sm" variant="outline" onClick={() => onAction(p.id, "reject")}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => onAction(p.id, "delete")}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold">Preview body</summary>
                  <div className="mt-3 prose-sm max-w-none">
                    <MarkdownLite content={p.body} />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Keywords: {p.keywords.join(", ")}
                  </div>
                </details>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
