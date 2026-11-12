# Nation Builder's Club (NBC) website

React + Vite site with a Supabase database for registrations.

## 1. Set up the database (free)
1. Create a project at https://supabase.com.
2. Open **SQL Editor > New query**, paste everything in `supabase/schema.sql`, click **Run**.
3. Open **Project Settings > API** and copy the **Project URL** and the **anon public** key.

## 2. Run it on your computer
```
cp .env.example .env      # then paste your URL and anon key into .env
npm install
npm run dev
```

## 3. Deploy (free)
Push this folder to GitHub, then import it on **Vercel** or **Netlify**.
Add two environment variables in the host's settings:
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Build command: `npm run build`, output folder: `dist`.
(`vercel.json` and `public/_redirects` already handle page links.)

## Where the registrations go
Supabase dashboard > **Table Editor**:
- `members`: people who joined the club
- `signups`: event and outreach registrations and "notify me" forms
- `messages`: contact form messages
Use the **Export to CSV** button on any table. Visitors can only add rows, they cannot read anyone's data.

## Updating content
- Add real events/outreaches in `src/data.js`. Each shows a Register button automatically.
- Change the WhatsApp link or meeting room link in the same file.
- Replace images in `public/`.
