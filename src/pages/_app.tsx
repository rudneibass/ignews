import { AppProps } from '../../node_modules/next/app'
import '../../src/styles/global.scss'
import { Header } from '../components/Header/index'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  )
}

export default MyApp
