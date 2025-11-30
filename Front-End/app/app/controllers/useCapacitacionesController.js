import { useState, useEffect, useCallback } from 'react';
import { CapacitacionesModel } from '../models/CapacitacionesModel';

export function useCapacitacionesController() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);

  const loadData = async () => {
    const { data, error } = await CapacitacionesModel.getUpcomingRegistrations();

    if (!error && data) {
      const formattedData = data.map((item, index) => ({
        id: `${item.user_id}-${item.course_id}-${index}`,
        name: `${item.users?.nombre || 'Usuario'} ${item.users?.apellido || ''}`.trim(),
        email: item.users?.email || 'Sin correo',
        date: item.courses?.date 
          ? new Date(item.courses.date).toLocaleDateString('es-ES', { 
              day: '2-digit', month: '2-digit', year: 'numeric' 
            }) 
          : 'Fecha pendiente',
        rawDate: item.courses?.date
      }));
      setItems(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  return {
    drawerVisible,
    setDrawerVisible,
    loading,
    refreshing,
    items,
    onRefresh
  };
}
