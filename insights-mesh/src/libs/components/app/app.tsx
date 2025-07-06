import store from "@/libs/state/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { NextPageContext } from "next";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
