import Providers from '@/components/Providers/Providers';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Manual Predial',
  description: 'Manual Predial',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="pt">
      <body className={nunito.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
