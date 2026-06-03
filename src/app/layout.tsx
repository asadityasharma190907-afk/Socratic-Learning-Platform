import type { Metadata } from 'next';
import './globals.css';
import ServiceWorkerRegister from './sw-register';

export const metadata: Metadata = {
  title: 'SahAI for Shiksha — Socratic Learning Platform',
  description: 'AI-powered Socratic offline challenge platform for schools. Think deeper, learn smarter.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#635bff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
