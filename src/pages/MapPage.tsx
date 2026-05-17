import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BedDouble, Bath, Maximize, ChevronRight, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProperties } from '../hooks/useProperties';
import { Property, SPECTRUM_HEX } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

// Custom Marker Creator
const createIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>`,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 14);
  return null;
}

export default function MapPage() {
  const { properties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'Venta' | 'Alquiler'>('Venta');
  const [center, setCenter] = useState<[number, number]>([-34.9215, -57.9545]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => p.operation === activeTab && p.active);
  }, [properties, activeTab]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Casa': return SPECTRUM_HEX.green;
      case 'Departamento': return SPECTRUM_HEX.blue;
      case 'PH': return SPECTRUM_HEX.purple;
      case 'Local': return SPECTRUM_HEX.orange;
      default: return SPECTRUM_HEX.cyan;
    }
  };

  return (
    <div className="fixed inset-0 pt-20 flex flex-col overflow-hidden bg-white">
      {/* Top filter bar */}
      <div className="h-16 border-b border-gray-100 px-6 flex items-center justify-between shrink-0 bg-white z-20">
        <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('Venta')}
            className={cn(
              "px-6 py-1.5 rounded-lg text-xs font-bold transition-all",
              activeTab === 'Venta' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Venta
          </button>
          <button
            onClick={() => setActiveTab('Alquiler')}
            className={cn(
              "px-6 py-1.5 rounded-lg text-xs font-bold transition-all",
              activeTab === 'Alquiler' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Alquiler
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            {filteredProperties.length} Propiedades
          </div>
          <button className="flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-[#111]">
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <aside className="w-[360px] hidden md:flex flex-col border-r border-gray-100 bg-white h-full overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {filteredProperties.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setCenter([p.lat, p.lng]);
                  setSelectedProperty(p);
                }}
                className={cn(
                  "flex gap-4 p-3 rounded-2xl border-l-[4px] cursor-pointer transition-all hover:bg-gray-50 group",
                  selectedProperty?.id === p.id ? "bg-blue-50/50 border-blue-500 shadow-sm" : "border-transparent bg-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]"
                )}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{p.type}</span>
                  <p className="font-bold text-sm truncate mb-1">{formatPrice(p.price, p.currency)}</p>
                  <p className="text-xs text-gray-500 truncate">{p.address}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer center={center} zoom={14} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredProperties.map(p => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={createIcon(getTypeColor(p.type))}
                eventHandlers={{
                  click: () => setSelectedProperty(p),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[140px]">
                    <div className="h-20 w-full mb-2 rounded-lg overflow-hidden">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-[13px] m-0">{formatPrice(p.price, p.currency)}</p>
                    <p className="text-[10px] text-gray-500 m-0 mb-2 truncate">{p.address}</p>
                    <Link to={`/propiedad/${p.id}`} className="block w-full bg-blue-600 text-white py-1.5 rounded-lg text-center text-[10px] font-bold no-underline">
                      Ver Detalles
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
            <ChangeView center={center} />
          </MapContainer>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden absolute bottom-0 inset-x-0 z-30">
        <AnimatePresence>
          {selectedProperty ? (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white p-6 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-gray-100"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex gap-6">
                <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 shadow-lg">
                  <img src={selectedProperty.images[0]} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-2xl tracking-tight text-blue-600">
                      {formatPrice(selectedProperty.price, selectedProperty.currency)}
                    </h4>
                    <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-gray-100 rounded-full">
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{selectedProperty.type} • {selectedProperty.neighborhood}</p>
                  <p className="text-sm font-medium text-gray-600 mb-4">{selectedProperty.address}</p>
                  <Link to={`/propiedad/${selectedProperty.id}`} className="inline-flex items-center gap-1 bg-[#111] text-white px-4 py-2 rounded-xl text-xs font-bold w-fit">
                    Ver ficha <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              className="bg-white/80 backdrop-blur-md p-4 rounded-t-[32px] border-t border-gray-100 flex justify-center"
            >
              <button 
                onClick={() => {
                  // In a real app we'd open a full list bottom sheet
                  // For now, let's just show the first property as a hint or just a button
                  if (filteredProperties.length > 0) setSelectedProperty(filteredProperties[0]);
                }}
                className="bg-[#111] text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl"
              >
                Ver lista ({filteredProperties.length})
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
