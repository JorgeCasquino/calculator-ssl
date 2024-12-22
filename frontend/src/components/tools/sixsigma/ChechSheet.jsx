import React, { useState } from 'react';
import { Card,  CardHeader, CardTitle } from '../../ui/card';

const CheckSheet = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', count: 0 });

  const addItem = () => {
    if (newItem.name) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', count: 0 });
    }
  };

  const incrementCount = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const decrementCount = (id) => {
    setItems(
      items.map((item) =>
        item.id === id && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Hoja de Verificación</h2>

      <Card className="p-4">
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="flex-1 rounded border p-2"
            placeholder="Nuevo ítem..."
          />
          <Button onClick={addItem}>
            Agregar Ítem
          </Button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ítem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Conteo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="whitespace-nowrap px-6 py-4">{item.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{item.count}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => decrementCount(item.id)}
                      variant="outline"
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => incrementCount(item.id)}
                      variant="outline"
                    >
                      +
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
export default CheckSheet;