import Drawer from '@/layout/drawer'
import NavBar from '@/layout/navbar'
import { wrapper } from '@/redux/store'
import '@/styles/globals.css'

export default wrapper.withRedux(function App({ Component, pageProps }) {
  return <>
    <div className="flex">
      <Drawer />
      <div className='flex-1 h-screen overflow-y-scroll'>
        <NavBar />
        <Component {...pageProps} />
      </div>
    </div>
  </>
})