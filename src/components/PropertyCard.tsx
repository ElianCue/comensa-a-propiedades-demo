import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Maximize, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Property, SPECTRUM_COLORS } from '../types';
import { formatPrice, cn } from '../lib/utils';

export interface PropertyCardProps {
  property: Property;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index, isFavorite = false, onToggleFavorite }) => {
  const colorClass = `spectrum-border-${SPECTRUM_COLORS[index % SPECTRUM_COLORS.length]}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100",
        colorClass
      )}
    >
      <Link to={`/propiedad/${property.id}`} className="block relative group">
        <div className="h-[140px] overflow-hidden bg-gray-100">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <span className="px-2 py-0.5 rounded bg-white/90 text-[10px] font-semibold text-gray-700">
            {property.operation}
          </span>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(property.id);
              }}
              className="p-1.5 rounded bg-white/90 hover:bg-white transition-colors"
            >
              <Heart 
                className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
              />
            </button>
          )}
        </div>
      </Link>

<div className="p-3">
        <h3 className="font-bold text-lg text-gray-900">
          {formatPrice(property.price, property.currency)}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {property.neighborhood} · {property.address}
        </p>

        <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-xs text-gray-500">
          <span>{property.beds} Dorm · {property.baths} Baños</span>
          <span>{property.m2} m²</span>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Link
            to={`/propiedad/${property.id}`}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-xs font-semibold transition-colors"
          >
            Ver
          </Link>
          <a
            href={`https://wa.me/542211234567?text=Hola! Estoy interesado en la propiedad: ${property.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-gray-600" />
          </a>
        </div>
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
