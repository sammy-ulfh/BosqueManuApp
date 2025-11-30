import { useState, useEffect, useCallback } from 'react';
import { VoluntariosModel } from '../models/VoluntariosModel';

export function useVoluntariosController() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);

  const loadData = async () => {
    const { data, error } = await VoluntariosModel.getVolunteers();

    if (!error && data) {
      const formattedData = data.map((item, index) => ({
        id: `${item.user_id}-${item.event_id}-${index}`,
        name: `${item.users?.nombre || 'Voluntario'} ${item.users?.apellido || ''}`.trim(),
        email: item.users?.email || 'Sin correo',
        // joined es la fecha
        joined: item.events?.date 
          ? new Date(item.events.date).toLocaleDateString('es-ES', { 
              day: '2-digit', month: '2-digit', year: 'numeric' 
            }) 
          : 'Fecha pendiente',
        eventName: item.events?.description || 'Evento general'
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
