-- Allow the site owner email to manage blog posts and roles
-- without needing a pre-existing user_roles entry.
-- This solves the bootstrap problem when no service role key is available.

-- Blog posts: allow site owner full access
create policy "Site owner manages blog posts" on public.blog_posts
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'shopfastapparel@gmail.com')
  with check (auth.jwt() ->> 'email' = 'shopfastapparel@gmail.com');

-- User roles: allow site owner to manage roles
create policy "Site owner manages roles" on public.user_roles
  for all to authenticated
  using (auth.jwt() ->> 'email' = 'shopfastapparel@gmail.com')
  with check (auth.jwt() ->> 'email' = 'shopfastapparel@gmail.com');
