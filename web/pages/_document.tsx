import Document, { Head, Html, Main, NextScript } from 'next/document';
import { outfit, display } from '../styles/fonts';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className={`${outfit.variable} ${display.variable}`}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
