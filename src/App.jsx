import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Library from './pages/Library.jsx'
import Collections from './pages/Collections.jsx'
import Neighbors from './pages/Neighbors.jsx'
import Community from './pages/Community.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<Collections />} />
          <Route path="/neighbors" element={<Neighbors />} />
          <Route path="/neighbors/:slug" element={<Neighbors />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}