import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

function SupplierForm({ supplier, onClose, onDone }) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    supplierType: '',
    cost: '',
    notes: ''
  });

  // Prefill form when editing
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        phone: supplier.phone || '',
        supplierType: supplier.supplierType || '',
        cost: supplier.cost || '',
        notes: supplier.notes || ''
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user || !user.id) {
        throw new Error("Usuario no autenticado");
      }

      // --- UPDATE ---
      if (supplier) {
        const { error } = await supabase
          .from('proveedores')
          .update({
            name: formData.name,
            phone: formData.phone,
            supplierType: formData.supplierType,
            cost: Number(formData.cost),
            notes: formData.notes,
            updatedAt: new Date().toISOString()
          })
          .eq('id', supplier.id);

        if (error) throw error;

        toast({ title: "Proveedor actualizado correctamente" });
      }

      // --- INSERT ---
      else {
        const { error } = await supabase
          .from('proveedores')
          .insert([{
            name: formData.name,
            phone: formData.phone,
            supplierType: formData.supplierType,
            cost: Number(formData.cost),
            notes: formData.notes,
            createdBy: user.id,
            createdAt: new Date().toISOString()
          }]);

        if (error) throw error;

        toast({ title: "Proveedor agregado correctamente" });
      }

      onDone && onDone();
      onClose();

    } catch (err) {
      console.error(err);
      toast({
        title: "Error al guardar",
        description: err.message,
      });
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {supplier ? "Editar Proveedor" : "Agregar Proveedor"}
          </h2>
          <button onClick={onClose} className="text-white/60">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label className="text-white">Nombre *</Label>
            <Input className="bg-white/10 text-white" name="name" value={formData.name} required onChange={handleChange} />
          </div>

          <div>
            <Label className="text-white">Teléfono *</Label>
            <Input className="bg-white/10 text-white" name="phone" required value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-white">Tipo *</Label>
            <Input className="bg-white/10 text-white" name="supplierType" required value={formData.supplierType} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-white">Costo *</Label>
            <Input type="number" name="cost" className="bg-white/10 text-white"
              required value={formData.cost} onChange={handleChange} />
          </div>

          <div>
            <Label className="text-white">Notas</Label>
            <Textarea className="bg-white/10 text-white" rows={4} name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {supplier ? "Actualizar" : "Guardar"}
            </Button>
          </div>

        </form>

      </motion.div>

    </motion.div>
  );
}

export default SupplierForm;

