import React, { useState, useEffect } from 'react';
import { useDefects } from '../../hooks/useDefects';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const DefectForm = ({ defect, onClose }) => {
  const { createDefect, updateDefect } = useDefects();
  const [formData, setFormData] = useState({
    type: '',
    process: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (defect) {
      setFormData({
        ...defect,
        date: new Date(defect.date).toISOString().split('T')[0]
      });
    }
  }, [defect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (defect) {
        await updateDefect(defect.id, formData);
      } else {
        await createDefect(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar defecto:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defect ? 'Editar Defecto' : 'Nuevo Defecto'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Defecto</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="process">Proceso</Label>
            <Input
              id="process"
              value={formData.process}
              onChange={(e) =>
                setFormData({ ...formData, process: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
             id="description"
             value={formData.description}
             onChange={(e) =>
               setFormData({ ...formData, description: e.target.value })
             }
             rows={4}
             className="resize-none"
           />
         </div>

         <div className="flex justify-end space-x-2">
           <Button variant="outline" type="button" onClick={onClose}>
             Cancelar
           </Button>
           <Button type="submit">
             {defect ? 'Actualizar' : 'Guardar'}
           </Button>
         </div>
       </form>
     </DialogContent>
   </Dialog>
 );
};