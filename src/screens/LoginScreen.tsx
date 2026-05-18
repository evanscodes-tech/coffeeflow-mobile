import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/config';

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { requestOtp, verifyOtp } = useAuth();

  // Clear stored tokens when component mounts
  useEffect(() => {
    const clearStorage = async () => {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      console.log('✅ Cleared old tokens from storage');
    };
    clearStorage();
  }, []);

  const handleRequestOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    const success = await requestOtp(phoneNumber);
    setLoading(false);

    if (success) {
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone number');
    } else {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    const success = await verifyOtp(phoneNumber, otpCode);
    setLoading(false);

    if (!success) {
      Alert.alert('Login Failed', 'Invalid OTP code. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const success = await requestOtp(phoneNumber);
    setLoading(false);
    
    if (success) {
      Alert.alert('Success', 'New OTP sent to your phone');
    } else {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  // First screen - Enter phone number
  if (!otpSent) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>☕ CoffeeFlow</Text>
            <Text style={styles.subtitle}>Farmer Portal</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="0712345678"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={12}
              />
              <Text style={styles.hint}>
                Enter the phone number registered with your cooperative
              </Text>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleRequestOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Contact your cooperative if you're not registered
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Second screen - Enter OTP code
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>☕ CoffeeFlow</Text>
          <Text style={styles.subtitle}>Enter OTP Code</Text>
          <Text style={styles.phoneText}>Sent to {phoneNumber}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>6-Digit OTP</Text>
            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="000000"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Verify & Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOtp}
            disabled={loading}
          >
            <Text style={styles.resendButtonText}>Resend OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setOtpSent(false);
              setOtpCode('');
            }}
          >
            <Text style={styles.backButtonText}>← Change phone number</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  phoneText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 8,
  },
  form: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E0D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAF7F4',
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  backButtonText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  footerText: {
    marginTop: 32,
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
  },
});

export default LoginScreen;