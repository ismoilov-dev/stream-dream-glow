# StreamPlay - Premium Streaming Platform

A modern, production-ready Netflix-style movie and series streaming platform built with Next.js 15, React, TypeScript, and TailwindCSS.

## Features

✨ **Premium User Experience**
- Beautiful dark theme with cinema aesthetic
- Smooth animations and transitions with Framer Motion
- Fully responsive design (mobile, tablet, desktop)
- Modern glass-morphism effects

📱 **Core Features**
- Movies and Series catalog with filtering and search
- Trending and new releases sections
- User authentication with JWT
- User profiles with watch history
- Continue watching functionality
- Favorites and watchlist system
- Advanced search capabilities

🎬 **Content Management**
- Movie detail pages with cast and similar recommendations
- Series detail pages with seasons and episodes
- Genre filtering
- Rating and review system
- Age ratings display

👤 **User Features**
- Secure authentication (login/register)
- User profiles and preferences
- Watch history tracking
- Favorite collections
- Continue watching tracking
- Account settings and password management

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **API Client**: Axios with interceptors
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)
- **API Integration**: OpenAPI/Swagger generated types

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
echo "NEXT_PUBLIC_API_URL=http://16.170.235.75" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Generate API types from OpenAPI schema
npx openapi-typescript http://16.170.235.75/api/schema/ --output src/lib/api-types.ts
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── movies/            # Movies pages
│   ├── series/            # Series pages
│   ├── search/            # Search page
│   ├── profile/           # User profile
│   ├── settings/          # Settings page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── home/             # Home page sections
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utilities and hooks
│   ├── api.ts           # Axios configuration
│   ├── store/           # Zustand stores
│   └── hooks/           # React hooks
└── styles/              # Global styles
```

## API Endpoints

All endpoints are automatically integrated via the StreamPlay API:

- **Authentication**: Login, Register, Token Refresh, Email Verification
- **Movies**: Browse, Search, Filter, Details, Trending, New Releases
- **Series**: Browse, Search, Filter, Details, Seasons, Episodes
- **Genres**: Browse by genre
- **User**: Profile, Preferences, Watch History, Favorites
- **Analytics**: Continue Watching, Watch Progress

API Documentation: http://16.170.235.75/swagger/

## Performance Features

- Image optimization with Next.js Image
- Code splitting with dynamic imports
- Query caching with React Query
- Lazy loading for image galleries
- Debounced search input
- Optimistic updates for better UX

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Color contrast compliance
- Form validation and error messages
- Screen reader friendly

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://16.170.235.75
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT License - feel free to use this project

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
