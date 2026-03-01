import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { farmerAPI } from '../services/api';
import { COLORS } from '../constants/config';

interface FarmerData {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  farm_name: string;
  location?: {
    region: string;
    district: string;
    village: string;
  };
  farm_size?: number;
  coffee_varieties?: string;
  years_farming?: number;
  sms_notifications?: boolean;
  sms_language?: string;
  registered_since?: string;
}

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const [farmer, setFarmer] = useState<FarmerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      if (loading) {
        setError('Request timed out. Please try again.');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    loadFarmerProfile();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadFarmerProfile = async () => {
    try {
      console.log('📱 Loading farmer profile...');
      const data = await farmerAPI.getProfile();
      console.log('📱 Farmer profile loaded:', data);
      setFarmer(data);
      setError(null);
    } catch (error) {
      console.error('Failed to load farmer profile:', error);
      setError('Failed to load profile. Pull down to refresh.');
    } finally {
      setLoading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadFarmerProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {farmer?.full_name?.charAt(0) || user?.username?.charAt(0).toUpperCase() || 'F'}
          </Text>
        </View>
        <Text style={styles.name}>{farmer?.full_name || user?.username || 'Farmer'}</Text>
        <Text style={styles.farmName}>{farmer?.farm_name || 'Coffee Farmer'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{farmer?.phone || 'Not provided'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || 'Not provided'}</Text>
        </View>
      </View>

      {farmer?.location && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Region:</Text>
            <Text style={styles.value}>{farmer.location.region}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.value}>{farmer.location.district}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Village:</Text>
            <Text style={styles.value}>{farmer.location.village}</Text>
          </View>
        </View>
      )}

      {(farmer?.farm_size || farmer?.coffee_varieties || farmer?.years_farming) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Farm Details</Text>
          
          {farmer?.farm_size && (
            <View style={styles.row}>
              <Text style={styles.label}>Farm Size:</Text>
              <Text style={styles.value}>{farmer.farm_size} acres</Text>
            </View>
          )}
          
          {farmer?.coffee_varieties && (
            <View style={styles.row}>
              <Text style={styles.label}>Coffee Varieties:</Text>
              <Text style={styles.value}>{farmer.coffee_varieties}</Text>
            </View>
          )}
          
          {farmer?.years_farming && (
            <View style={styles.row}>
              <Text style={styles.label}>Years Farming:</Text>
              <Text style={styles.value}>{farmer.years_farming}</Text>
            </View>
          )}
        </View>
      )}

      {farmer?.registered_since && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Member Since</Text>
          <Text style={styles.value}>{farmer.registered_since}</Text>
        </View>
      )}

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
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  farmName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: COLORS.surface,
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  logoutButton: {
    backgroundColor: COLORS.error,
    margin: 16,
    marginTop: 8,
    marginBottom: 40,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;