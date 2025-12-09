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

function DestajoForm({ destajo, onClose, onDone }) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    worker: "",
    cost: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    if (destajo) setFormData({ ...destajo });
  }, [destajo]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) throw new Error("Usuario no autenticado");

      const payload = {
        ...formData,
        cost: Number(formData.cost),
      };

      if (destajo) {
        const { error } = await supabase
          .from("destajos")
          .update({ ...payload })
          .eq("id", destajo.id);

        if (error) throw error;
        toast({ title: "Destajo actualizado" });
      } else {
        const { error } = await supabase.from("destajos").insert([
          {
            ...payload,
            createdBy: user.id,
            createdAt: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast({ title: "Destajo agregado" });
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
            {destajo ? "Editar Destajo" : "Agregar Destajo"}
          </h2>

          <Field label="Trabajo" name="name" value={formData.name} onChange={handleChange} />
          <Field label="Trabajador" name="worker" value={formData.worker} onChange={handleChange} />
          <Field label="Costo" name="cost" type="number" value={formData.cost} onChange={handleChange} />
          <Field label="Estado" name="status" value={formData.status} onChange={handleChange} />

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

export default DestajoForm;
