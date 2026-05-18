import React, { useState } from 'react';
import { LayoutDashboard, Plus, Trash2, Edit3, LogOut, Package, Key, Users, DollarSign, TrendingUp, Home, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProperties } from '../hooks/useProperties';
import { formatPrice, cn } from '../lib/utils';
import { Property, SPECTRUM_COLORS } from '../types';
import Logo from '../components/Logo';
import { useToastContext } from '../context/ToastContext';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { properties, addProperty, updateProperty, deleteProperty, toggleActive } = useProperties();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToastContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'comensaña2024') {
      setIsLoggedIn(true);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    
    const propertyData: Property = {
      id: editingProperty?.id || Math.random().toString(36).substr(2, 9),
      title: `${data.get('type')} en ${data.get('neighborhood')}`,
      address: data.get('address') as string,
      neighborhood: data.get('neighborhood') as string,
      price: Number(data.get('price')),
      currency: 'USD',
      type: data.get('type') as any,
      operation: data.get('operation') as any,
      m2: Number(data.get('m2')),
      beds: Number(data.get('beds')),
      baths: Number(data.get('baths')),
      description: data.get('description') as string,
      images: editingProperty?.images || ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
      lat: Number(data.get('lat')) || -34.9215,
      lng: Number(data.get('lng')) || -57.9545,
      amenities: editingProperty?.amenities || [],
      active: true,
      featured: (data.get('featured') === 'on'),
    };

    if (editingProperty) {
      updateProperty(propertyData);
      addToast('Propiedad actualizada correctamente', 'success');
    } else {
      addProperty(propertyData);
      addToast('Propiedad creada correctamente', 'success');
    }
    setIsModalOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] shadow-2xl p-12 max-w-md w-full border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 spectrum-gradient" />
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Logo />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black">Acceso Staff</h1>
              <p className="text-gray-400 text-sm font-medium">Panel de Gestión Inmobiliaria</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-medium"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 outline-none font-medium"
              />
              <button
                type="submit"
                className="w-full bg-[#111] text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                Ingresar
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeCount = properties.filter(p => p.active).length;
  const sellCount = properties.filter(p => p.operation === 'Venta').length;
  const rentCount = properties.filter(p => p.operation === 'Alquiler').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="h-8 w-px bg-gray-100 hidden md:block" />
          <div className="flex items-center gap-4 text-gray-400">
            <LayoutDashboard className="w-5 h-5" />
            <h1 className="font-bold text-sm uppercase tracking-widest">Dashboard Staff</h1>
          </div>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total', value: properties.length, icon: Home, color: 'blue' },
            { label: 'Venta', value: sellCount, icon: DollarSign, color: 'green' },
            { label: 'Alquiler', value: rentCount, icon: Key, color: 'magenta' },
            { label: 'Visitas', value: 124, icon: TrendingUp, color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className={cn("p-8 rounded-[32px] bg-white shadow-sm border-l-[6px]", `spectrum-border-${stat.color}`)}>
              <stat.icon className="w-6 h-6 text-gray-300 mb-4" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Inventario</h2>
          <button
            onClick={() => { setEditingProperty(null); setIsModalOpen(true); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> Nueva Propiedad
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Propiedad</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operación</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{p.address}</p>
                        <p className="text-xs text-gray-500">{p.neighborhood}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-600">{p.type}</td>
                  <td className="px-6 py-6 font-bold text-sm text-blue-600">{p.operation}</td>
                  <td className="px-6 py-6">
                    <button
                      onClick={() => { toggleActive(p.id); addToast(p.active ? 'Propiedad desactivada' : 'Propiedad activada', 'info'); }}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                        p.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {p.active ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingProperty(p); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { deleteProperty(p.id); addToast('Propiedad eliminada', 'success'); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Placeholder - Simplifed for time/space */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl p-10 max-w-4xl w-full relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">{editingProperty ? 'Editar' : 'Nueva'} Propiedad</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6"/></button>
              </div>
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Dirección</label>
                    <input name="address" required className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.address || ''} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Barrio</label>
                    <select name="neighborhood" defaultValue={editingProperty?.neighborhood || 'Centro'} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium">
                      {['Centro', 'City Bell', 'Tolosa', 'Berisso', 'Los Hornos', 'Villa Elisa', 'Ensenada', 'Ringuelet', 'Villa Elvira', 'Melchor Romero'].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Precio (USD)</label>
                    <input name="price" required className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" type="number" defaultValue={editingProperty?.price || ''} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Tipo</label>
                      <select name="type" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.type || 'Casa'}>
                        <option value="Casa">Casa</option>
                        <option value="Departamento">Departamento</option>
                        <option value="PH">PH</option>
                        <option value="Local">Local</option>
                        <option value="Lote">Lote</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Operación</label>
                      <select name="operation" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.operation || 'Venta'}>
                        <option value="Venta">Venta</option>
                        <option value="Alquiler">Alquiler</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">m²</label>
                      <input name="m2" type="number" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.m2 || 50} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Dorm.</label>
                      <input name="beds" type="number" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.beds || 1} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Baños</label>
                      <input name="baths" type="number" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.baths || 1} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Latitud</label>
                      <input name="lat" type="number" step="any" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.lat || -34.9215} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Longitud</label>
                      <input name="lng" type="number" step="any" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium" defaultValue={editingProperty?.lng || -57.9545} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Descripción</label>
                  <textarea name="description" rows={4} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none outline-none font-medium resize-none" defaultValue={editingProperty?.description || ''} />
                </div>

                <div className="flex items-center gap-4 py-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="featured" defaultChecked={editingProperty?.featured} className="peer sr-only" />
                      <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                    </div>
                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">Destacar propiedad</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-[2] px-8 py-4 rounded-2xl bg-[#111] text-white font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-gray-200">
                    Guardar Propiedad
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
