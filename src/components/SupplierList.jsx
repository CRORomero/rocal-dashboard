// src/components/SupplierList.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Phone, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function SupplierList({ suppliers, onEdit, onDelete }) {
  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
          <Tag className="w-8 h-8 text-blue-300" />
        </div>
        <p className="text-blue-200 text-lg">No hay proveedores</p>
        <p className="text-blue-300 text-sm mt-2">Haz clic en "Agregar" para empezar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suppliers.map((supplier, index) => (
        <motion.div key={supplier.id}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
          className="bg-white/5 rounded-xl p-5 border border-white/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-1">{supplier.name}</h3>
              <div className="flex gap-3 text-sm text-blue-200">
                <div className="flex items-center"><Phone className="w-4 h-4 mr-1" />{supplier.phone}</div>
                <div className="flex items-center"><Tag className="w-4 h-4 mr-1" />{supplier.supplierType}</div>
                <div className="flex items-center text-green-300 font-semibold"><DollarSign className="w-4 h-4 mr-1" />{parseFloat(supplier.cost || 0).toFixed(2)}</div>
              </div>
              {supplier.notes && <p className="text-blue-300 text-sm mt-2 bg-white/5 p-3 rounded">{supplier.notes}</p>}
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(supplier)} className="bg-blue-500 text-white"><Edit2 className="w-4 h-4" /></Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-400"><Trash2 className="w-4 h-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-900 border-white/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Eliminar Proveedor</AlertDialogTitle>
                    <AlertDialogDescription className="text-blue-200">¿Seguro que quieres eliminar "{supplier.name}"? Esta acción no se puede deshacer.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 text-white border-white/20">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(supplier.id)} className="bg-red-500 text-white">Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default SupplierList;

