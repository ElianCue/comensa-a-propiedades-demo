import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Share2, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-white font-sans text-[#111111]">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-5">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Inicio</Link>
              <Link to="/mapa" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Mapa</Link>
              <Link to="/favoritos" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="hidden lg:inline">Favoritos</span>
                {favorites.length > 0 && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{favorites.length}</span>}
              </Link>
              <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Admin</Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Contactar
              </button>
            </nav>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div className="spectrum-line" />
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Inicio</Link>
              <Link to="/mapa" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Mapa</Link>
              <Link to="/favoritos" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold flex items-center justify-center gap-2">
                Favoritos {favorites.length > 0 && <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">{favorites.length}</span>}
              </Link>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Admin</Link>
              <button className="bg-[#2563EB] text-white py-4 rounded-xl text-lg font-bold">
                Contactar
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} Comensaña Propiedades. Matrícula 7521.
          </div>
          <div className="flex gap-5 text-xs text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">WhatsApp</span>
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">Email</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
