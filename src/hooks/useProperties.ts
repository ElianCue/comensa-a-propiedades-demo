import { useState, useEffect } from 'react';
import { Property } from '../types';
import { DUMMY_PROPERTIES } from '../data';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('comensana_properties');
    if (stored) {
      setProperties(JSON.parse(stored));
    } else {
      localStorage.setItem('comensana_properties', JSON.stringify(DUMMY_PROPERTIES));
      setProperties(DUMMY_PROPERTIES);
    }
  }, []);

  const addProperty = (newProp: Property) => {
    const updated = [newProp, ...properties];
    setProperties(updated);
    localStorage.setItem('comensana_properties', JSON.stringify(updated));
  };

  const updateProperty = (updatedProp: Property) => {
    const updated = properties.map(p => p.id === updatedProp.id ? updatedProp : p);
    setProperties(updated);
    localStorage.setItem('comensana_properties', JSON.stringify(updated));
  };

  const deleteProperty = (id: string) => {
    const updated = properties.filter(p => p.id !== id);
    setProperties(updated);
    localStorage.setItem('comensana_properties', JSON.stringify(updated));
  };

  const toggleActive = (id: string) => {
    const updated = properties.map(p => p.id === id ? { ...p, active: !p.active } : p);
    setProperties(updated);
    localStorage.setItem('comensana_properties', JSON.stringify(updated));
  };

  return { properties, addProperty, updateProperty, deleteProperty, toggleActive };
}
