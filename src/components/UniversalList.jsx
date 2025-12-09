// UNIVERSAL LIST — 100% compatibilidad con tus tablas
import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Phone, DollarSign, Tag, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

function UniversalList({ items = [], type = "proveedores", onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="text-center py-12">
        <p className="text-blue-200 text-lg">No hay registros</p>
        <p className="text-blue-300 text-sm">Agrega uno nuevo</p>
      </div>
    );
  }

  const renderContent = (item) => {
    if (type === "proveedores") {
      return (
        <>
          <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
          <div className="flex gap-3 text-sm text-blue-200">
            <Phone className="w-4 h-4 mr-1" /> {item.phone}
            <Tag className="w-4 h-4 mr-1" /> {item.supplierType}
            <DollarSign className="w-4 h-4 mr-1" /> {item.cost}
          </div>
        </>
      );
    }

    if (type === "materiales") {
      return (
        <>
          <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
          <div className="flex gap-3 text-sm text-blue-200">
            <Package className="w-4 h-4 mr-1" /> {item.unit}
            <DollarSign className="w-4 h-4 mr-1" /> {item.price}
            <Tag className="w-4 h-4 mr-1" /> {item.category}
          </div>
        </>
      );
    }

    if (type === "destajos") {
      return (
        <>
          <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
          <div className="flex gap-3 text-sm text-blue-200">
            <User className="w-4 h-4 mr-1" /> {item.worker}
            <DollarSign className="w-4 h-4 mr-1" /> {item.cost}
            <Tag className="w-4 h-4 mr-1" /> {item.status}
          </div>
        </>
      );
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="bg-white/5 rounded-xl p-5 border border-white/10"
        >
          <div className="flex justify-between">
            <div className="flex-1">
              {renderContent(item)}
              {item.notes && (
                <p className="text-blue-300 text-sm mt-2 bg-white/5 p-3 rounded">
                  {item.notes}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onEdit(item)} size="sm" className="bg-blue-500 text-white">
                <Edit2 className="w-4 h-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-900 border-white/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Eliminar</AlertDialogTitle>
                    <AlertDialogDescription className="text-blue-200">
                      ¿Seguro que deseas eliminar este registro?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 text-white border-white/20">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(item.id)}
                      className="bg-red-500 text-white"
                    >
                      Eliminar
                    </AlertDialogAction>
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

export default UniversalList;

