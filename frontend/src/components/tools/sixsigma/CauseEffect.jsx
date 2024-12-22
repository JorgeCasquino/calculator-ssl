import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const CauseEffect = () => {
  const [causes, setCauses] = useState({
    method: [],
    machine: [],
    material: [],
    manpower: [],
    measurement: [],
    environment: []
  });

  const [effect, setEffect] = useState('');

  const addCause = (category, cause) => {
    setCauses({
      ...causes,
      [category]: [...causes[category], cause]
    });
  };

  const removeCause = (category, index) => {
    setCauses({
      ...causes,
      [category]: causes[category].filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Diagrama de Causa y Efecto</h2>

      <div className="mb-4">
        <label className="mb-2 block font-medium">Efecto</label>
        <input
          type="text"
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Describe el efecto..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {Object.entries(causes).map(([category, categoryCauses]) => (
          <Card key={category} className="p-4">
            <h3 className="mb-2 font-semibold capitalize">{category}</h3>
            <div className="space-y-2">
              {categoryCauses.map((cause, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{cause}</span>
                  <button
                    onClick={() => removeCause(category, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cause = e.target.cause.value;
                  if (cause) {
                    addCause(category, cause);
                    e.target.cause.value = '';
                  }
                }}
                className="flex gap-2"
              >
                <input
                  name="cause"
                  className="flex-1 rounded border p-1"
                  placeholder="Nueva causa..."
                />
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-2 py-1 text-white"
                >
                  +
                </button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};