import { useState, useEffect } from 'react';
import axios from 'axios';

export const useKPI = () => {
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/kpis');
        setKpis(response.data);
      } catch (error) {
        console.error('Error fetching KPIs:', error);
      }
    };

    fetchKPIs();
  }, []);

  return kpis;
};