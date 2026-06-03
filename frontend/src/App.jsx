import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import TeamPage from './pages/TeamPage';
import NotFound from './pages/NotFound';

// Utility component to handle smooth scrolling to #hash anchors on page load or navigation
function ScrollToHashElement() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 120);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
