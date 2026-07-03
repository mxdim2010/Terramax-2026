# terramax-dev

This is a recreated Next.js project scaffold based on the Vercel deployment source.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create an environment file:
   ```bash
   copy .env.example .env
   ```

3. Set up the database schema:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Notes

- This project was reconstructed from Vercel deployment source.
- Add any missing source files from the Vercel dashboard as needed.
- Authentication uses Auth.js with Prisma and a PostgreSQL database.
- Interior design projects are stored per authenticated user instead of in a shared local JSON file.
- New accounts require email verification before credentials login is allowed.
- Password reset and a private admin overview are included in the app-owned auth flow.
- Auth events such as signup, login, password changes, and admin access are written to an internal audit log.
- You can promote an existing verified user to admin with `npm run promote-admin -- user@example.com`.
