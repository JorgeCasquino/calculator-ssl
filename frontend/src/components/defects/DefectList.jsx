import React, { useState } from 'react';
import { useDefects } from '../../hooks/useDefects';
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import DefectForm from './DefectForm';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';

const DefectList = () => {
  const { defects, loading, deleteDefect } = useDefects();
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Lista de Defectos</h2>
        <Button onClick={() => setShowForm(true)}>Nuevo Defecto</Button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <Table>
          <TableHeader>
            <tr>
              <th>Tipo</th>
              <th>Proceso</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </TableHeader>
          <tbody>
            {defects.map((defect) => (
              <TableRow key={defect.id}>
                <TableCell>{defect.type}</TableCell>
                <TableCell>{defect.process}</TableCell>
                <TableCell>{new Date(defect.date).toLocaleDateString()}</TableCell>
                <TableCell>{defect.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedDefect(defect);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setSelectedDefect(defect);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      {showForm && (
        <DefectForm
          defect={selectedDefect}
          onClose={() => {
            setShowForm(false);
            setSelectedDefect(null);
          }}
        />
      )}

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          if (selectedDefect) {
            deleteDefect(selectedDefect.id);
          }
          setShowDeleteDialog(false);
          setSelectedDefect(null);
        }}
        title="Eliminar Defecto"
        message="¿Estás seguro de que deseas eliminar este defecto? Esta acción no se puede deshacer."
      />
    </div>
  );
};
