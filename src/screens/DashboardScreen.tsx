import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { farmerAPI } from '../services/api';
import { DashboardData } from '../types';
import { COLORS } from '../constants/config';

const DashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  const loadDashboardData = async () => {
    try {
      const dashboardData = await farmerAPI.getDashboard();
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.farmerName}>{data?.farmer.full_name}</Text>
        <Text style={styles.farmName}>{data?.farmer.farm_name}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data?.stats.total_deliveries}</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data?.stats.total_kgs.toFixed(0)} kg</Text>
          <Text style={styles.statLabel}>Total Coffee</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>KES {data?.stats.paid_payments.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Paid</Text>
        </View>
      </View>

      {/* Pending Payments Alert */}
      {data && data.stats.pending_payments > 0 && (
        <View style={styles.pendingCard}>
          <Text style={styles.pendingTitle}>Pending Payment</Text>
          <Text style={styles.pendingAmount}>
            KES {data.stats.pending_payments.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Recent Deliveries */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Deliveries</Text>
        {data?.recent_deliveries.map((delivery) => (
          <TouchableOpacity key={delivery.id} style={styles.deliveryCard}>
            <View style={styles.deliveryHeader}>
              <Text style={styles.batchCode}>{delivery.batch_code}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: delivery.payment_status === 'Paid' ? COLORS.success : COLORS.warning }
              ]}>
                <Text style={styles.statusText}>{delivery.payment_status}</Text>
              </View>
            </View>
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryDate}>{delivery.date}</Text>
              <Text style={styles.deliveryWeight}>{delivery.cherry_kg} kg</Text>
              <Text style={styles.deliveryAmount}>KES {delivery.total_amount.toFixed(0)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    color: COLORS.background,
    fontSize: 16,
    opacity: 0.9,
  },
  farmerName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  farmName: {
    color: COLORS.background,
    fontSize: 16,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    marginTop: -30,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  pendingCard: {
    backgroundColor: COLORS.warning,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pendingTitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  pendingAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  deliveryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  batchCode: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  deliveryWeight: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  deliveryAmount: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 40,
    padding: 16,
    backgroundColor: COLORS.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;