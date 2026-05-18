import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, TrendingUp, Users, ShieldCheck, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../hooks/useFavorites';
import PropertyCard from '../components/PropertyCard';
import { useToastContext } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { cn, formatPrice } from '../lib/utils';
import { Property } from '../types';

export default function Home() {
  const { properties } = useProperties();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToast } = useToastContext();
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [minBaths, setMinBaths] = useState<number>(0);
  const [minM2, setMinM2] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent'>('recent');
  
  const filteredProperties = properties
    .filter(p => {
      const matchesFilter = filter === 'Todos' || p.operation === filter || p.type === filter;
      const matchesSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesBeds = p.beds >= minBeds;
      const matchesBaths = p.baths >= minBaths;
      const matchesM2 = p.m2 >= minM2;
      return matchesFilter && matchesSearch && matchesPrice && matchesBeds && matchesBaths && matchesM2;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    })
    .slice(0, 8);

  const searchResults = searchQuery.length > 1 
    ? properties.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const searchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Encontrá tu <br />
                lugar.
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-md">
                La Plata, City Bell, Villa Elisa y zona sur del GBA. +10 años conectando hogares.
              </p>
            </div>

            <div className="relative" ref={searchRef}>
              <div className="bg-gray-100 p-2 rounded-lg flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar propiedad..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                  className="flex-grow bg-transparent border-none focus:ring-0 px-4 text-sm outline-none"
                />
                <button 
                  onClick={() => {
                    if (searchQuery) {
                      setFilter('Todos');
                      setShowSearchResults(true);
                    }
                  }}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Buscar
                </button>
              </div>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/propiedad/${p.id}`}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.neighborhood} • {p.type}</p>
                      </div>
                      <span className="text-sm font-black text-blue-600 shrink-0">
                        {formatPrice(p.price, p.currency)}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
              {showSearchResults && searchQuery.length > 1 && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-center z-50"
                >
                  <p className="text-gray-500 font-medium">No se encontraron propiedades</p>
                  <p className="text-sm text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-[4/5] rounded-lg bg-gray-200 overflow-hidden shadow-lg relative">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
                alt="Luxury Home"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
              <span className="text-[12px] font-semibold text-gray-600">47 propiedades</span>
            </div>

            <div className="absolute top-1/2 -left-8 bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
              <span className="text-[12px] font-semibold text-gray-600">+10 años</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0 hide-scrollbar">
            {['Todos', 'Venta', 'Alquiler', 'Casa', 'Departamento', 'PH'].map((btn) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                  filter === btn
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {btn}
              </button>
            ))}
            <div className="flex-grow shrink-0" />
            <button 
              onClick={() => setShowAdvancedFilters(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-400 border border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-24"
            onClick={() => setShowAdvancedFilters(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-2xl font-black">Filtros Avanzados</h3>
                <button 
                  onClick={() => setShowAdvancedFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Price Range */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">
                    Rango de Precio (USD)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-medium"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-medium"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">
                    Dormitorios
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => setMinBeds(n)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                          minBeds === n 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {n === 0 ? 'Sin filtro' : n === 4 ? '4+' : n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">
                    Baños
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((n) => (
                      <button
                        key={n}
                        onClick={() => setMinBaths(n)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                          minBaths === n 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {n === 0 ? 'Sin filtro' : n === 3 ? '3+' : n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Surface */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">
                    Superficie mínima (m²)
                  </label>
                  <input
                    type="number"
                    value={minM2}
                    onChange={(e) => setMinM2(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-medium"
                    placeholder="ej: 50"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">
                    Ordenar por
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('recent')}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                        sortBy === 'recent' 
                          ? "bg-[#111] text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      Más Recientes
                    </button>
                    <button
                      onClick={() => setSortBy('price-asc')}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                        sortBy === 'price-asc' 
                          ? "bg-green-600 text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      ↑
                      Menor Precio
                    </button>
                    <button
                      onClick={() => setSortBy('price-desc')}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                        sortBy === 'price-desc' 
                          ? "bg-green-600 text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      ↓
                      Mayor Precio
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => {
                    setPriceRange([0, 1000000]);
                    setMinBeds(0);
                    setMinBaths(0);
                    setMinM2(0);
                    setSortBy('recent');
                  }}
                  className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                >
                  Limpiar Filtros
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="flex-[2] px-6 py-4 rounded-2xl bg-[#111] text-white font-bold hover:bg-gray-800 transition-all"
                >
                  Aplicar Filtros
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-heading">Nuevos ingresos.</h2>
            <p className="text-gray-500 font-medium">Propiedades seleccionadas en la región.</p>
          </div>
          <Link to="/mapa" className="text-blue-600 font-bold hover:underline">Ver todas en mapa →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProperties.map((p, i) => (
            <PropertyCard 
              key={p.id} 
              property={p} 
              index={i} 
              isFavorite={isFavorite(p.id)}
              onToggleFavorite={(id) => {
                toggleFavorite(id);
                addToast(isFavorite(id) ? 'Eliminado de favoritos' : 'Agregado a favoritos', 'success');
              }}
            />
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-black font-heading mb-4">¿Por qué elegirnos?</h2>
          <p className="text-gray-500 font-medium">Más de una década conectando personas con su lugar ideal.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: 'Confianza Total', desc: 'Operaciones legales claras y transparentes para tu tranquilidad.', color: 'green' },
            { icon: MapPin, title: 'Conocimiento Local', desc: 'Expertos en cada barrio de La Plata, Berisso y Ensenada.', color: 'blue' },
            { icon: Users, title: 'Atención Personalizada', desc: 'Un agente dedicado a entender tus necesidades desde el primer día.', color: 'purple' },
          ].map((item, i) => (
            <div key={i} className={cn("p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-lg transition-shadow border-l-[6px]", `spectrum-border-${item.color}`)}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", `bg-${item.color}-50 text-${item.color}-600`)}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-4">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
