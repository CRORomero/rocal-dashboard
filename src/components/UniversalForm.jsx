// UNIVERSAL FORM — 100% compatible con tus tablas reales
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

function UniversalForm({ type = 'proveedores', initialData = null, onClose, onDone }) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  // FORM STRUCTURE BASED ON REAL DB COLUMNS
  const getInitial = () => {
    switch (type) {
      case "proveedores":
        return { name: "", phone: "", supplierType: "", cost: "", notes: "" };

      case "materiales":
        return { name: "", unit: "", price: "", category: "", notes: "" };

      case "destajos":
        return { name: "", worker: "", cost: "", status: "", notes: "" };

      default:
        return {};
    }
  };

  const [formData, setFormData] = useState(getInitial());

  useEffect(() => {
    if (initialData) setFormData({ ...initialData });
    else setFormData(getInitial());
  }, [initialData, type]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));


  // ✔ CREA EL PAYLOAD DINÁMICAMENTE SEGÚN TABLA
  const buildPayload = () => {
    if (type === "proveedores") {
      return {
        name: formData.name,
        phone: formData.phone,
        supplierType: formData.supplierType,
        cost: formData.cost ? Number(formData.cost) : null,
        notes: formData.notes
      };
    }

    if (type === "materiales") {
      return {
        name: formData.name,
        unit: formData.unit,
        price: formData.price ? Number(formData.price) : null,
        category: formData.category,
        notes: formData.notes
      };
    }

    if (type === "destajos") {
      return {
        name: formData.name,
        worker: formData.worker,
        cost: formData.cost ? Number(formData.cost) : null,
        status: formData.status,
        notes: formData.notes
      };
    }

    return {};
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) throw new Error("Usuario no autenticado");

      const table = type;
      const payload = buildPayload();

      // UPDATE
      if (initialData) {
        const { error } = await supabase
          .from(table)
          .update({ ...payload, updatedAt: new Date().toISOString() })
          .eq("id", initialData.id);

        if (error) throw error;
        toast({ title: "Registro actualizado correctamente" });
      }

      // INSERT
      else {
        const { error } = await supabase
          .from(table)
          .insert([{
            ...payload,
            createdBy: user.id,
            createdAt: new Date().toISOString(),
          }]);

        if (error) throw error;
        toast({ title: "Registro agregado correctamente" });
      }

      onDone?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
      });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
            {initialData ? "Editar" : "Agregar"} {type}
          </h2>
          <button onClick={onClose} className="text-white/60">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PROVEEDORES */}
          {type === "proveedores" && (
            <>
              <Field label="Nombre" name="name" value={formData.name} onChange={handleChange} />
              <Field label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
              <Field label="Tipo" name="supplierType" value={formData.supplierType} onChange={handleChange} />
              <Field label="Costo" name="cost" type="number" value={formData.cost} onChange={handleChange} />
            </>
          )}

          {/* MATERIALES */}
          {type === "materiales" && (
            <>
              <Field label="Nombre del material" name="name" value={formData.name} onChange={handleChange} />
              <Field label="Unidad" name="unit" value={formData.unit} onChange={handleChange} />
              <Field label="Precio" name="price" type="number" value={formData.price} onChange={handleChange} />
              <Field label="Categoría" name="category" value={formData.category} onChange={handleChange} />
            </>
          )}

          {/* DESTAJOS */}
          {type === "destajos" && (
            <>
              <Field label="Trabajo" name="name" value={formData.name} onChange={handleChange} />
              <Field label="Trabajador" name="worker" value={formData.worker} onChange={handleChange} />
              <Field label="Costo" name="cost" type="number" value={formData.cost} onChange={handleChange} />
              <Field label="Estado" name="status" value={formData.status} onChange={handleChange} />
            </>
          )}

          {/* NOTES */}
          <div>
            <Label className="text-white">Notas</Label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="bg-white/10 text-white"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

const Field = ({ label, ...props }) => (
  <div>
    <Label className="text-white">{label}</Label>
    <Input {...props} className="bg-white/10 text-white" />
  </div>
);

export default UniversalForm;

