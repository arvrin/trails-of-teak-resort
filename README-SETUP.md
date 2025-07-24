# Trails of Teak Resort Platform

A luxury eco-resort management platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Getting Started

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css         # Brand colors and typography
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage with hero section
├── components/
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── lib/                   # Utilities (future)
└── types/                 # TypeScript types (future)

public/
└── images/                # Resort photos and logo
```

## Brand System

### Colors
- **Primary**: #1E3D34 (dark green)
- **Accent**: #D3A24F (gold)  
- **Background**: #F3EFE7 (cream)
- **Text**: #5A4B3B (brown)
- **Divider**: #B8B2A8 (light brown)

### Typography
- **Headings**: Playfair Display
- **Body**: Inter

## Phase 1 ✅ Complete

- [x] Next.js 14 project setup with TypeScript
- [x] Tailwind CSS configuration with brand colors
- [x] Google Fonts integration (Playfair Display, Inter)
- [x] Responsive homepage with hero section
- [x] Header and footer components
- [x] Resort image gallery integration
- [x] Brand-consistent design system

## Next Steps (Phase 2)

1. Set up PocketBase backend
2. Create room listing pages
3. Implement user authentication
4. Build booking system
5. Add admin dashboard

## Technical Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: PocketBase (planned)
- **Database**: SQLite via PocketBase (planned)
- **Authentication**: PocketBase Auth (planned)
- **Deployment**: Vercel (recommended)

## Visual Assets

The project includes:
- High-quality resort photography (11 images)
- Professional logo with brand tagline
- Responsive image optimization via Next.js Image component