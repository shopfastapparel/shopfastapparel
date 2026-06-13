import { useEffect, useState, useCallback, useRef } from "react";
import { createFileRoute, useRouter, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { listRecentProjects, uploadProjectImage, deleteProjectImage } from "@/lib/projects-admin.functions";
import { toast } from "sonner";
import { Loader2, Trash2, Camera } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Upload Projects | Fast Apparel" }, { name: "robots", content: "noindex" }] }),
  component: AdminProjects,
});

type ProjectImage = Awaited<ReturnType<typeof listRecentProjects>>[number];

function AdminProjects() {
  const router = useRouter();
  const navigate = useNavigate();
  const list = useServerFn(listRecentProjects);
  const upload = useServerFn(uploadProjectImage);
  const del = useServerFn(deleteProjectImage);

  const [images, setImages] = useState<ProjectImage[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await list();
      setImages(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "Failed to load";
      if (msg.includes("Forbidden")) {
        toast.error("Your account isn't an admin yet.");
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
    load();
  }, [load]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Please upload an image under 5MB.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        await upload({
          data: {
            filename: file.name,
            base64Data,
            contentType: file.type,
          }
        });
        toast.success("Project image uploaded successfully!");
        load();
      };
      reader.readAsDataURL(file);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await del({ data: { filename } });
      toast.success("Image deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Deletion failed");
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">Customer Projects</h1>
            <p className="text-muted-foreground text-sm mt-1 max-w-md">
              Upload photos from your phone. The 25 most recent will be displayed in the slideshow on the homepage.
            </p>
          </div>
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

        {/* Mobile-friendly large upload button */}
        <div className="mt-8 bg-card border-2 border-dashed border-ink/20 rounded-2xl p-8 text-center hover:bg-muted/50 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button 
            size="lg" 
            className="h-16 px-8 text-lg font-display bg-magenta-brand text-background hover:bg-magenta-brand/90 shadow-pop"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Uploading...</>
            ) : (
              <><Camera className="mr-2 h-6 w-6" /> Take or Upload Photo</>
            )}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
        </div>

        <h2 className="mt-12 font-display text-2xl mb-6">Recent Uploads ({images?.length || 0}/25 visible on site)</h2>

        {loading ? (
          <div className="py-20 text-center"><Loader2 className="h-6 w-6 animate-spin inline" /></div>
        ) : !images || images.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground border-2 border-ink rounded-xl bg-card">No project photos uploaded yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl border-2 border-ink bg-card overflow-hidden shadow-sm hover:shadow-pop transition-all aspect-square">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-ink/60 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="font-bold border-2 border-ink shadow-pop-sm md:opacity-100 opacity-80 md:relative absolute bottom-2 right-2"
                    onClick={() => handleDelete(img.name)}
                  >
                    <Trash2 className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
