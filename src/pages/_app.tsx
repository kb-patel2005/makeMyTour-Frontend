import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import store from "@/store";
import { Provider } from "react-redux";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Fotter";
import { Client } from "@stomp/stompjs";
import SocketProvider from "@/components/SocketProvider";

let stompClient: Client | null = null;

const Myapp = ({ Component, pageProps }: AppProps) => {

  return (
    <div className="min-h-screen ">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
};
export default function App(props: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>MakeMyTour</title>
      </Head>
      <SocketProvider />
      <Myapp {...props} />
    </Provider>
  );
}
