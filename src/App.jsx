import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Library from './pages/Library.jsx'
import Collections from './pages/Collections.jsx'
import Gallery from './pages/Gallery.jsx'
import Neighbors from './pages/Neighbors.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    // min-h-screen + flex-col makes this wrapper always at least as
    // tall as the viewport. flex-grow on the routed content below
    // means it expands to fill any leftover space, which pushes
    // Footer down to the bottom edge on short pages instead of it
    // floating right under the content.
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<Collections />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/neighbors" element={<Neighbors />} />
          <Route path="/neighbors/:slug" element={<Neighbors />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}