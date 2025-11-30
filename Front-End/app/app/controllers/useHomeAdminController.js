import { useState, useEffect, useCallback } from 'react';
import { StatsModel } from '../models/StatsModel';

export function useHomeAdminController() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    volunteers: 0,
    money: 0
  });

  const loadStats = async () => {
    const data = await StatsModel.getDashboardStats();
    
    if (!data.error) {
      setStats({
        users: data.users,
        courses: data.courses,
        volunteers: data.volunteers,
        money: data.money
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
  };

  return {
    drawerVisible,
    setDrawerVisible,
    loading,
    refreshing,
    stats,
    onRefresh,
    formatCurrency
  };
}
