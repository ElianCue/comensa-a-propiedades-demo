import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-[#111111]">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[70px]">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-[14px] font-semibold hover:text-blue-600 transition-colors">Inicio</Link>
              <Link to="/mapa" className="text-[14px] font-semibold hover:text-blue-600 transition-colors">Mapa</Link>
              <Link to="/admin" className="text-[14px] font-semibold hover:text-blue-600 transition-colors">Admin</Link>
              <button className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Portal Inmobiliario
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
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Admin</Link>
              <button className="bg-[#2563EB] text-white py-4 rounded-xl text-lg font-bold">
                Contactar
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[11px] font-medium opacity-60">
            © {new Date().getFullYear()} Comensaña Propiedades. Matrícula 7521.
          </div>
          <div className="flex gap-6 text-[11px] font-medium opacity-60">
            <span className="hover:opacity-100 cursor-pointer transition-opacity">WhatsApp</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Instagram</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Email</span>
          </div>
        </div>
        <div className="spectrum-line" />
      </footer>
    </div>
  );
}
