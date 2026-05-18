import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../hooks/useFavorites';
import PropertyCard from '../components/PropertyCard';
import { useToastContext } from '../context/ToastContext';

export default function Favorites() {
  const { properties } = useProperties();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToast } = useToastContext();

  const favoriteProperties = properties.filter(p => isFavorite(p.id));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Link 
            to="/" 
            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              Mis Favoritos
            </h1>
            <p className="text-gray-500 font-medium mt-2">
              {favoriteProperties.length} propiedades guardadas
            </p>
          </div>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {favoriteProperties.map((p, i) => (
              <PropertyCard 
                key={p.id} 
                property={p} 
                index={i}
                isFavorite={true}
                onToggleFavorite={(id) => {
                  toggleFavorite(id);
                  addToast('Eliminado de favoritos', 'success');
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black mb-4">No tenés favoritos</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Guardá las propiedades que te interesen haciendo click en el corazón.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-[#111] text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors"
            >
              Explorar Propiedades
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}