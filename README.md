This is a [Next.js](https://nextjs.org/) with [Supabase](https://supabase.com/) project.

## Getting Started

First, create an free instance of Supabase project, open the Supabase SQL console and copy paste `db.sql` file from the project root. Copy paste .env.example file to .env and plug the environment keys which are exposed in project settings in Supabase.

Secondly, run the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

You have your instance of Buy me a Pizza running! In case of modifying the DB, document the changes and include them into the /migration/ folder.
