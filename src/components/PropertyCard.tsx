import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Maximize, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Property, SPECTRUM_COLORS } from '../types';
import { formatPrice, cn } from '../lib/utils';

export interface PropertyCardProps {
  property: Property;
  index: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const colorClass = `spectrum-border-${SPECTRUM_COLORS[index % SPECTRUM_COLORS.length]}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 border-l-[6px]",
        colorClass
      )}
    >
      <Link to={`/propiedad/${property.id}`} className="block relative group">
        <div className="h-[140px] overflow-hidden bg-gray-100">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider shadow-sm text-gray-900 border border-black/5">
            {property.operation}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-extrabold text-[20px] tracking-tight text-[#111111]">
          {formatPrice(property.price, property.currency)}
        </h3>
        <p className="text-[12px] text-gray-500 font-medium mb-4">
          {property.neighborhood} | {property.address}
        </p>

        <div className="border-t border-[#f0f0f0] pt-3 flex justify-between items-center text-[11px] font-bold text-gray-500">
          <span>{property.beds} Dorm · {property.baths} Baños</span>
          <span>{property.m2} m²</span>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Link
            to={`/propiedad/${property.id}`}
            className="flex-1 bg-[#111] hover:bg-gray-800 text-white py-2.5 rounded-xl text-center text-[11px] font-bold transition-all shadow-sm active:scale-95"
          >
            Ver Detalle
          </Link>
          <a
            href={`https://wa.me/542211234567?text=Hola! Estoy interesado en la propiedad: ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-gray-600" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
