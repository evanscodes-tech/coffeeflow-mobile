import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/config';
import { DeliveryDetailScreenNavigationProp } from '../types/navigation';

interface Props {
  route: any;
  navigation: DeliveryDetailScreenNavigationProp;
}

const DeliveryDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { delivery } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.batchCode}>{delivery.batch_code}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: delivery.payment_status === 'Paid' ? COLORS.success : COLORS.warning }
        ]}>
          <Text style={styles.statusText}>{delivery.payment_status}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{delivery.date}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Cherry Weight:</Text>
          <Text style={styles.value}>{delivery.cherry_kg} kg</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Dry Weight:</Text>
          <Text style={styles.value}>{delivery.dry_kg} kg</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Conversion Rate:</Text>
          <Text style={styles.value}>5:1</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quality Assessment</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Quality Grade:</Text>
          <Text style={styles.value}>{delivery.quality}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Price per kg:</Text>
          <Text style={styles.value}>KES {delivery.price_per_kg}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.amount}>KES {delivery.total_amount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[
            styles.paymentStatus,
            { color: delivery.payment_status === 'Paid' ? COLORS.success : COLORS.warning }
          ]}>
            {delivery.payment_status}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Deliveries</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  batchCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  paymentStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: COLORS.primary,
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeliveryDetailScreen;