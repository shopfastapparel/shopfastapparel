import { generateAndStoreBlogPost } from "./src/lib/blog-generator.server";

async function main() {
  try {
    console.log("Starting blog generation...");
    const post = await generateAndStoreBlogPost();
    console.log("SUCCESS: Generated blog post:", post.title, "slug:", post.slug);
  } catch (e) {
    console.error("ERROR generating blog:", e);
  }
}

main();
