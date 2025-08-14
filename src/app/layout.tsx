import type { Metadata } from 'next';
import { getSession } from '~/auth';
import '~/app/globals.css';
import { APP_NAME, APP_DESCRIPTION } from '~/lib/constants';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#0B3E84] relative">
        <ClientBackground />
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// Client component for the background image
function ClientBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      <img 
        src="/assets/backgrounds/every.png" 
        alt="background"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}
