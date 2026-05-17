import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Share2, MapPin, BedDouble, Bath, Maximize, Home, ShieldCheck, Clock, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useProperties } from '../hooks/useProperties';
import { SPECTRUM_HEX, Property } from '../types';
import { formatPrice, cn } from '../lib/utils';
import PropertyCard from '../components/PropertyCard';

const icon = L.divIcon({
  html: `<div style="background-color: ${SPECTRUM_HEX.blue}; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>`,
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties } = useProperties();
  
  const property = properties.find(p => p.id === id);
  const related = properties.filter(p => p.id !== id && p.active).slice(0, 3);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">Propiedad no encontrada</h2>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const specs = [
    { label: 'Superficie', value: `${property.m2}m²`, icon: Maximize, color: 'green' },
    { label: 'Ambientes', value: property.beds + 1, icon: Home, color: 'cyan' },
    { label: 'Dormitorios', value: property.beds, icon: BedDouble, color: 'blue' },
    { label: 'Baños', value: property.baths, icon: Bath, color: 'purple' },
  ];

  const amenities = [
    "Cochera", "Piscina", "Parrilla", "Sum", "Seguridad 24hs", 
    "Calefacción", "Aire Acondicionado", "Balcón", "Terraza"
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Immersive Gallery / Hero */}
      <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-gray-900">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
        
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-6 pb-16">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider">
              En {property.operation}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[#DB2777] text-white text-xs font-black uppercase tracking-wider">
              {property.type}
            </span>
            {property.featured && (
              <span className="px-4 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-black uppercase tracking-wider">
                Exclusiva
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight max-w-3xl">
            {property.title}
          </h1>
          <p className="flex items-center gap-2 text-white/80 text-xl font-medium">
            <MapPin className="w-6 h-6 text-blue-400" /> 
            {property.address}, {property.neighborhood}
          </p>
        </div>

        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 left-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20 group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Photo Strip */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {property.images.slice(0, 4).map((img, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="h-32 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Valor de la propiedad</span>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-black text-[#2563EB] tracking-tighter">
                  {formatPrice(property.price, property.currency)}
                </span>
                <span className="text-gray-400 font-bold uppercase text-xs">Final</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
                <Share2 className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specs.map((spec, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-8 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center gap-4 text-center transition-transform hover:scale-[1.02]", 
                  `spectrum-border-${spec.color} border-l-[6px]`
                )}
              >
                <div className="p-3 rounded-2xl bg-gray-50">
                  <spec.icon className="w-8 h-8 text-gray-700" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">{spec.label}</p>
                  <p className="font-black text-2xl text-gray-900">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black">Descripción</h3>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
              {property.description}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-8">
            <h3 className="text-3xl font-black">Características</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              {amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="p-1.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black">Ubicación</h3>
              <p className="text-gray-500 font-bold flex items-center gap-2"><MapPin className="w-5 h-5" /> {property.address}</p>
            </div>
            <div className="h-[450px] rounded-[48px] overflow-hidden border-8 border-gray-50 shadow-inner">
              <MapContainer 
                center={[property.lat, property.lng]} 
                zoom={16} 
                className="h-full w-full"
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[property.lat, property.lng]} icon={icon} />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-8">
          <div className="p-10 rounded-[48px] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gray-100 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h4 className="font-black text-xl">Santiago Comensaña</h4>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Broker Inmobiliario</p>
              </div>
            </div>
            
            <div className="p-6 rounded-3xl bg-gray-50 space-y-2">
              <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                <Clock className="w-4 h-4" /> Responde en menos de 1 hora
              </div>
            </div>

            <div className="space-y-4">
              <a 
                href={`https://wa.me/542211234567?text=Hola Santiago! Quiero consultar por: ${property.title}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <MessageCircle className="w-6 h-6" /> WhatsApp
              </a>
              <button className="w-full bg-[#111] text-white py-6 rounded-3xl font-black text-xl hover:bg-black/90 transition-all">
                Contactar por Email
              </button>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-blue-50/50 border border-blue-100/50 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white shadow-sm">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase">¿Necesitas tasar?</p>
              <p className="text-gray-900 font-black">Coordinamos hoy mismo</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Properties */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-4xl font-black tracking-tight">Propiedades similares</h3>
            <Link to="/mapa" className="text-blue-600 font-bold hover:underline">Ver todas</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {related.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
