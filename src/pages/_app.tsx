import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import PageWrapper from "~/components/PageWrapper";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
