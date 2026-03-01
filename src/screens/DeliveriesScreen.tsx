import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { farmerAPI } from '../services/api';
import { Delivery } from '../types';
import { COLORS } from '../constants/config';

interface Props {
  navigation: any;
}

const DeliveriesScreen: React.FC<Props> = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const data = await farmerAPI.getDeliveries(1, 50);
      setDeliveries(data.results);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const renderDelivery = ({ item }: { item: Delivery }) => (
    <TouchableOpacity style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <Text style={styles.batchCode}>{item.batch_code}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.payment_status === 'Paid' ? COLORS.success : COLORS.warning }
        ]}>
          <Text style={styles.statusText}>{item.payment_status}</Text>
        </View>
      </View>
      
      <View style={styles.deliveryRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{item.date}</Text>
      </View>
      
      <View style={styles.deliveryRow}>
        <Text style={styles.label}>Cherry Weight:</Text>
        <Text style={styles.value}>{item.cherry_kg} kg</Text>
      </View>
      
      <View style={styles.deliveryRow}>
        <Text style={styles.label}>Dry Weight:</Text>
        <Text style={styles.value}>{item.dry_kg} kg</Text>
      </View>
      
      <View style={styles.deliveryRow}>
        <Text style={styles.label}>Quality:</Text>
        <Text style={styles.value}>{item.quality}</Text>
      </View>
      
      <View style={styles.deliveryRow}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.amount}>KES {item.total_amount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveries}
        renderItem={renderDelivery}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No deliveries found</Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    padding: 16,
  },
  deliveryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  batchCode: {
    fontSize: 16,
    fontWeight: 'bold',
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
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default DeliveriesScreen;