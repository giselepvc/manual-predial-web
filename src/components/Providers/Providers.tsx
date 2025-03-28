'use client';

import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import NextNProgress from 'nextjs-progressbar';

import StyledComponentsRegistry from '@/lib/registry';
import { GlobalStyle } from '@/styles/global';
import { theme } from '@/styles/theme';
import AuthProvider from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import handleError from '@/utils/handleToast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: handleError,
    },
  },
});

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NextNProgress
              color={theme.colors.primary}
              options={{ easing: 'ease', speed: 500 }}
            />
            <GlobalStyle />
            {children}
          </AuthProvider>
          <ToastContainer
            style={{
              zIndex: 999999,
            }}
          />
        </QueryClientProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
};

export default Providers;
