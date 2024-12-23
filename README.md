# Tirai.id

Tirai.id is an e-commerce website specializing in curtain sales, built with [Next.js](https://nextjs.org). The platform offers a comprehensive solution for browsing, customizing, and purchasing curtains online.

## Tech Stack

- **Frontend Framework**: Next.js 15
- **Authentication**: NextAuth.js
- **Database Management**: Prisma ORM
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Cloud Services**: Supabase, Cloudinary

## Project Structure

```
tirai.id/
├── src/
│   ├── app/
│   │   ├── (use-navbar)/
│   │   │   ├── (landing-page)/
│   │   │   ├── about/
│   │   │   ├── account/
│   │   │   ├── article/
│   │   │   ├── cart/
│   │   │   ├── components/
│   │   │   └── shop/
│   │   ├── admin/
│   │   │   ├── article/
│   │   │   ├── chat/
│   │   │   ├── custom-products/
│   │   │   ├── material/
│   │   │   ├── model/
│   │   │   ├── order/
│   │   │   ├── seo/
│   │   │   ├── shop/
│   │   │   └── user/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── confirm-email/
│   │   │   └── reset-password/
│   │   └── api/
│   ├── components/
│   └── styles/
└── public/
```

## Getting Started

1. **Clone the Repository**

```bash
git clone https://github.com/mokletdev/tirai.id.git
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Setup**

- Create `.env.local` file for development
- Create `.env` file for production
- Configure necessary environment variables

4. **Database Setup**

```bash
# Development
npm run prisma:push     # Push schema changes
npm run prisma:seed     # Seed initial data

# Production
npm run prisma:push:prod
npm run prisma:seed:prod
```

5. **Run Development Server**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### Development

- `npm run dev`: Start development server
- `npm run build`: Build the application
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Prisma Commands (Development)

- `npm run prisma:pull`: Pull database schema
- `npm run prisma:push`: Push schema changes
- `npm run prisma:migratedev`: Create and apply migrations
- `npm run prisma:seed`: Run database seeding
- `npm run prisma:seed:transaction`: Run transaction seeder

### Prisma Commands (Production)

- `npm run prisma:pull:prod`: Pull production database schema
- `npm run prisma:push:prod`: Push schema changes to production
- `npm run prisma:migratedev:prod`: Create and apply production migrations
- `npm run prisma:seed:prod`: Run seeding in production

## Authentication Routes

- `/auth/login` - Login Form
- `/auth/register` - Registration Form
- `/auth/confirm-email` - Email verification warning after registration
- `/auth/confirm-email/verify?token={token}` - Email verification for non-Google authentication
- `/auth/reset-password` - Password reset email input
- `/auth/reset-password/reset?token={token}` - New password input with token validation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - Learn about shadcn/ui components

## Author

- mokletdev ([GitHub Profile](https://github.com/mokletdev))

## Repository Information

- **Created**: November 4, 2024
- **License**: Private
