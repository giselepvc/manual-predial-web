import { theme } from '@/styles/theme';
import NextNProgress from 'nextjs-progressbar';

export const ProgressLoading = () => {
  return <NextNProgress color={theme.colors.primary} />;
};
