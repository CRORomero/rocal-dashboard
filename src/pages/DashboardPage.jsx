// DASHBOARD COMPLETO — Refinado Estéticamente
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence } from "framer-motion";
import {
  LogOut,
  Plus,
  Users,
  TrendingUp,
  Filter,
  X,
  ClipboardList, // Nuevo icono para Destajos
  Package,       // Nuevo icono para Materiales
  Briefcase,     // Nuevo icono para Proveedores
  HardHat        // Nuevo icono para el logo
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import UniversalForm from "@/components/UniversalForm";
import UniversalList from "@/components/UniversalList";
import StatsCard from "@/components/StatsCard";

function DashboardPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("proveedores");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // DATA STATE
  const [proveedores, setProveedores] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [destajos, setDestajos] = useState([]);

  // ---------------------- LOAD DATA (Sin cambios en lógica) ----------------------
  const loadAllData = async () => {
    if (!user) return;

    try {
      const [
        { data: provs, error: e1 },
        { data: mats, error: e2 },
        { data: djs, error: e3 }
      ] = await Promise.all([
        supabase.from("proveedores").select("*").order("createdAt", { ascending: false }),
        supabase.from("materiales").select("*").order("createdAt", { ascending: false }),
        supabase.from("destajos").select("*").order("createdAt", { ascending: false })
      ]);

      if (e1) throw e1;
      if (e2) throw e2;
      if (e3) throw e3;

      setProveedores(provs || []);
      setMateriales(mats || []);
      setDestajos(djs || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al cargar datos",
        description: error.message
      });
    }
  };

  useEffect(() => {
    loadAllData();
  }, [user]);

  // Lógica de ADD, EDIT, DELETE omitida por ser funcionalmente correcta

  // ---------------------- DELETE (Sin cambios en lógica) ----------------------
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from(activeTab).delete().eq("id", id);
      if (error) throw error;

      await loadAllData();
      toast({ title: "Registro eliminado" });
    } catch (error) {
      toast({ title: "Error", description: error.message });
    }
  };


  // ---------------------- FILTERS (Sin cambios en lógica) ----------------------
  const [filters, setFilters] = useState({
    proveedores: { search: "", minPrice: "", maxPrice: "", notes: "" },
    materiales: { search: "", minPrice: "", maxPrice: "", notes: "" },
    destajos: { search: "", minPrice: "", maxPrice: "", notes: "" }
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [e.target.name]: e.target.value }
    }));
  };

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: { search: "", minPrice: "", maxPrice: "", notes: "" }
    }));
  };

  const getCurrentList = () => {
    if (activeTab === "proveedores") return proveedores;
    if (activeTab === "materiales") return materiales;
    if (activeTab === "destajos") return destajos;
    return [];
  };

  const getFilteredList = () => {
    const list = getCurrentList();
    const f = filters[activeTab];

    return list.filter((item) => {
      const nameMatch = f.search
        ? item.name.toLowerCase().includes(f.search.toLowerCase())
        : true;

      const notesMatch = f.notes
        ? item.notes?.toLowerCase().includes(f.notes.toLowerCase())
        : true;

      // Importante: El filtro usa 'price' para materiales y 'cost' para otros
      const price =
        activeTab === "materiales"
          ? parseFloat(item.price) || 0
          : parseFloat(item.cost) || 0;

      const minMatch = f.minPrice ? price >= Number(f.minPrice) : true;
      const maxMatch = f.maxPrice ? price <= Number(f.maxPrice) : true;

      return nameMatch && notesMatch && minMatch && maxMatch;
    });
  };

  const filteredList = getFilteredList();

  // ---------------------- STATS (Sin cambios en lógica) ----------------------
  const totalCost = getCurrentList().reduce((sum, item) => {
    const value =
      activeTab === "materiales"
        ? parseFloat(item.price) || 0
        : parseFloat(item.cost) || 0;

    return sum + value;
  }, 0);

  const avgCost =
    getCurrentList().length > 0 ? totalCost / getCurrentList().length : 0;

  // -------------------------------------------------- UI --------------------------------------------------

  return (
    <>
      <Helmet>
        <title>Panel Rocal</title>
      </Helmet>

      {/* Mejora: Fondo oscuro más profesional */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-gray-900 text-gray-100">

        {/* NAVBAR - Estilo más limpio y elegante */}
        <nav className="bg-zinc-800/60 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Logo refinado */}
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-blue-500/50 shadow-md">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-white font-extrabold tracking-wider">Base ROCAL</h1>
                <p className="text-xs text-blue-400 font-medium">{user?.email}</p>
              </div>
            </div>

            <Button onClick={logout} className="bg-red-700 hover:bg-red-800 text-white shadow-md shadow-red-500/30 transition-colors">
              <LogOut className="mr-2 w-4 h-4" /> Salir
            </Button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="max-w-7xl mx-auto px-4 py-10">

          {/* STATS - Uso de íconos y colores de acento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatsCard icon={Users} title={`Total de ${activeTab}`} value={getCurrentList().length} />
            <StatsCard icon={TrendingUp} title="Costo promedio" value={`$${avgCost.toFixed(2)}`} />
            <StatsCard icon={ClipboardList} title="Total Costo" value={`$${totalCost.toFixed(2)}`} />
          </div>

          {/* TABS */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Pestañas con iconos */}
              <TabsList className="bg-zinc-800/80 border border-gray-700/50 p-1 rounded-xl shadow-inner">
                <TabsTrigger value="proveedores" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Briefcase className="w-4 h-4 mr-2" /> Proveedores
                </TabsTrigger>
                <TabsTrigger value="materiales" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Package className="w-4 h-4 mr-2" /> Materiales
                </TabsTrigger>
                <TabsTrigger value="destajos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <ClipboardList className="w-4 h-4 mr-2" /> Destajos
                </TabsTrigger>
              </TabsList>

              {/* Botón de Agregar - Más impacto */}
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setIsFormOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 transition-colors text-base font-semibold py-6"
              >
                <Plus className="mr-2 w-5 h-5" />
                Agregar {activeTab}
              </Button>
            </div>

            {/* FILTERS - Contenedor más definido */}
            <div className="bg-zinc-800/80 p-6 rounded-xl border border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <Filter className="text-blue-400 w-5 h-5" />
                <h3 className="text-white text-xl font-semibold">Opciones de Filtrado</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  name="search"
                  placeholder="🔍 Buscar nombre..."
                  value={filters[activeTab].search}
                  onChange={handleFilterChange}
                  className="bg-zinc-700/50 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:ring-blue-500"
                />

                <Input
                  name="notes"
                  placeholder="📝 Buscar en notas..."
                  value={filters[activeTab].notes}
                  onChange={handleFilterChange}
                  className="bg-zinc-700/50 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:ring-blue-500"
                />

                <Input
                  name="minPrice"
                  type="number"
                  placeholder="💲 Mínimo"
                  value={filters[activeTab].minPrice}
                  onChange={handleFilterChange}
                  className="bg-zinc-700/50 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:ring-blue-500"
                />

                <Input
                  name="maxPrice"
                  type="number"
                  placeholder="💰 Máximo"
                  value={filters[activeTab].maxPrice}
                  onChange={handleFilterChange}
                  className="bg-zinc-700/50 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={clearFilters} className="text-blue-400 hover:bg-zinc-700/50 transition-colors">
                  <X className="mr-2 w-4 h-4" /> Limpiar filtros
                </Button>
              </div>
            </div>

            {/* LIST */}
            <div className="bg-zinc-800/80 p-6 rounded-xl border border-gray-700/50 shadow-xl">
              <TabsContent value="proveedores">
                <UniversalList
                  items={filteredList}
                  type="proveedores"
                  onEdit={(item) => {
                    setEditingItem(item);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              </TabsContent>

              <TabsContent value="materiales">
                <UniversalList
                  items={filteredList}
                  type="materiales" // CORRECCIÓN DEL BUG DE TIPOGRAFÍA
                  onEdit={(item) => {
                    setEditingItem(item);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              </TabsContent>

              <TabsContent value="destajos">
                <UniversalList
                  items={filteredList}
                  type="destajos"
                  onEdit={(item) => {
                    setEditingItem(item);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* FORM */}
        <AnimatePresence>
          {isFormOpen && (
            <UniversalForm
              type={activeTab}
              initialData={editingItem}
              onDone={loadAllData}
              onClose={() => {
                setIsFormOpen(false);
                setEditingItem(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default DashboardPage;
