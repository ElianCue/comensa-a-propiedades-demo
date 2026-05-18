import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import PropertyDetail from './pages/PropertyDetail';
import Admin from './pages/Admin';
import Favorites from './pages/Favorites';
import { ToastProvider, useToastContext } from './context/ToastContext';
import Toast from './components/Toast';

function ToastWrapper() {
  const { toasts, removeToast } = useToastContext();
  return <Toast toasts={toasts} onRemove={removeToast} />;
}

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/propiedad/:id" element={<PropertyDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/favoritos" element={<Favorites />} />
          </Routes>
        </Layout>
      </Router>
      <ToastWrapper />
    </ToastProvider>
  );
}
