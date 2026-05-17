import React, { useState } from 'react';
import { Search, MapPin, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useProperties } from '../hooks/useProperties';
import PropertyCard from '../components/PropertyCard';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Property } from '../types';

export default function Home() {
  const { properties } = useProperties();
  const [filter, setFilter] = useState('Todos');
  
  const filteredProperties = properties
    .filter(p => filter === 'Todos' || p.operation === filter || p.type === filter)
    .slice(0, 8);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h1 className="text-[72px] font-black tracking-[-0.04em] leading-[0.9] text-[#111111]">
                Encontrá tu <br />
                lugar.
              </h1>
              <p className="text-[18px] text-gray-500 font-medium max-w-lg">
                La Plata · City Bell · Villa Elisa y zona sur del Gran Buenos Aires. Más de 10 años conectando hogares.
              </p>
            </div>

            <div className="bg-[#f4f4f4] p-[6px] rounded-2xl flex flex-col md:flex-row gap-2 max-w-[500px] shadow-sm">
              <input
                type="text"
                placeholder="¿Qué tipo de propiedad buscás?"
                className="flex-grow bg-transparent border-none focus:ring-0 px-5 text-[15px] font-medium outline-none"
              />
              <button className="bg-[#2563EB] text-white px-7 py-3.5 rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-colors">
                Buscar
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-[4/5] rounded-[24px] bg-[#eee] overflow-hidden shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
                alt="Luxury Home"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Theme Floating Badges */}
            <div className="absolute -top-5 -right-5 bg-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[13px] font-bold">47 Propiedades Activas</span>
            </div>

            <div className="absolute top-1/2 -left-10 bg-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-2">
              <span className="text-yellow-400 font-bold">⭐</span>
              <span className="text-[13px] font-bold">+10 Años en La Plata</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            {['Todos', 'Venta', 'Alquiler', 'Casa', 'Departamento', 'PH'].map((btn) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={cn(
                  "px-[18px] py-2 rounded-full text-[13px] font-semibold transition-all border-1.5",
                  filter === btn
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-white text-gray-900 border-[#eee] hover:border-gray-300"
                )}
              >
                {btn}
              </button>
            ))}
            <div className="flex-grow" />
            <button className="px-[18px] py-2 rounded-full text-[13px] font-semibold bg-white text-gray-400 border-1.5 border-[#eee] border-dashed">
              Filtros Avanzados
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-heading">Nuevos ingresos.</h2>
            <p className="text-gray-500 font-medium">Propiedades seleccionadas en la región.</p>
          </div>
          <Link to="/mapa" className="text-blue-600 font-bold hover:underline">Ver todas en mapa →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProperties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
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
