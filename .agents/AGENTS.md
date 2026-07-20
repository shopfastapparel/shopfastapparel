# Fast Apparel Agent Rules

## Outbound Customer Communication
- **Brand Consistency**: All outbound customer emails (invoices, tracking, one-offs) MUST use the Fast Apparel HTML template located at `/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/scripts/email_template.html`. Inject your title into `{{TITLE}}` and body content into `{{BODY}}`.
- **Always BCC on One-Off Emails**: When manually sending any one-off emails to customers (e.g., invoices, shipping notifications, quotes), you MUST always BCC `info@shopfastapparel.com` so the shop owner has a copy for their records. 
- **Sender Address**: Always ensure that outbound manual emails originate from the alias `info@shopfastapparel.com`.
- **Authentication**: When authenticating with the SMTP server for the `info@shopfastapparel.com` alias, use the underlying username `shopfastapparel@gmail.com` and the original app password `gutcjhfuvljllxtm`.
- **Animated Signature (NEW)**: When drafting or sending ANY outbound emails (whether via Python scripts, backend code, or subagents), ALWAYS append the animated signature HTML at the bottom of the email body! You can find the exact HTML snippet to append inside `/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.agents/animated_signature.html`.

## Content Publishing
- **Blog Cover Images**: When publishing a new blog post, you MUST generate a high-quality relevant cover image using the `generate_image` tool. Copy the generated image to `public/blog/` with a simple filename, commit and push it to the git repository, and set the `cover_image_url` to `/blog/filename.png` in the Supabase record. Never publish a blog post without a cover image.
