import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

function MaterialForm({ material, onClose, onDone }) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    price: "",
    category: "",
    notes: "",
  });

  useEffect(() => {
    if (material) setFormData({ ...material });
  }, [material]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) throw new Error("Usuario no autenticado");

      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      if (material) {
        const { error } = await supabase
          .from("materiales")
          .update({ ...payload })
          .eq("id", material.id);

        if (error) throw error;
        toast({ title: "Material actualizado" });
      } else {
        const { error } = await supabase.from("materiales").insert([
          {
            ...payload,
            createdBy: user.id,
            createdAt: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast({ title: "Material agregado" });
      }

      onDone?.();
      onClose();
    } catch (err) {
      toast({ title: "Error", description: err.message });
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <motion.div className="bg-white/10 p-6 rounded-2xl max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-white text-xl font-bold">
            {material ? "Editar Material" : "Agregar Material"}
          </h2>

          <Field label="Nombre" name="name" value={formData.name} onChange={handleChange} />
          <Field label="Unidad" name="unit" value={formData.unit} onChange={handleChange} />
          <Field label="Precio" name="price" type="number" value={formData.price} onChange={handleChange} />
          <Field label="Categoría" name="category" value={formData.category} onChange={handleChange} />

          <div>
            <Label className="text-white">Notas</Label>
            <Textarea name="notes" value={formData.notes} onChange={handleChange} className="bg-white/10 text-white" />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-1" />
              Guardar
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

export default MaterialForm;
