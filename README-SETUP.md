# Aurevix website — deployment and private admin setup

## Included
- `index.html`, `styles.css`, `app.js`: responsive public website.
- `assets/mahad.jpg`: portrait supplied for the founder portfolio.
- `admin.html`, `dashboard.html`: private sign-in and blog dashboard.
- `admin-config.example.js`: safe browser configuration template.
- `supabase-schema.sql`: database tables, role controls and Row Level Security policies.

## 1. Publish the public website free
1. Create a GitHub repository and upload the contents of this folder.
2. In GitHub, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. GitHub Pages will provide a public `https://YOUR-USERNAME.github.io/REPOSITORY/` address.
5. A custom `.com` domain is optional and usually costs money.

Netlify is another simple option: drag the project folder into Netlify's manual deploy area.

## 2. Enable secure blog publishing (Supabase)
A static GitHub Pages website cannot safely keep a private password or server secret in browser code. This project therefore uses Supabase Auth + PostgreSQL Row Level Security for blog management.

1. Create a project at https://supabase.com/.
2. Open **SQL Editor**, paste all of `supabase-schema.sql`, and run it.
3. In **Authentication → Users**, create your own user with your private email and a strong password. Disable public sign-ups in Authentication settings.
4. In SQL Editor, replace `YOUR-ADMIN-EMAIL@example.com` in the final statement with the exact email you created, then run that statement. This grants admin rights to that account only.
5. Open **Project Settings → API**. Copy the Project URL and anon/public key.
6. Edit the included `admin-config.js` and enter those two values. Upload `admin-config.js` to your repository. The anon key is intended for browser use; database RLS is what protects the content.
7. Visit `/admin.html`, sign in, and use the dashboard to publish or delete blog posts.

**Never put a Supabase `service_role` key, database password, or any secret key in this website or GitHub.** The admin role is controlled by the database; merely knowing the project URL and anon key does not grant write access.

## 3. Important notes
- The public page automatically displays published blog posts from Supabase once configured. Without Supabase, it displays three starter articles.
- The contact form opens the visitor's email app. It does not silently store or send messages. Replace `hello@aurevix.com` in `app.js` with your real business email before publishing.
- The portfolio includes the education and skills details supplied. Company names, employment dates, project names, certificates and client testimonials were not provided, so no employers or achievements have been invented.
- Verify the phone number and Lahore address before making the site public.
- The website is a static front end; Supabase provides authenticated blog administration. Do not describe it as a complete custom backend for all business operations.

## 4. Personalize before launch
- Add your real project screenshots and project descriptions.
- Add employer names and dates only if you want them public and can verify them.
- Add a real business email and social profile links.
- Consider purchasing a domain such as `aurevix.com` if available. Domain availability has not been checked.
