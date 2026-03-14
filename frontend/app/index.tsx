import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="fast-food" size={80} color="#E63946" />
          <Text style={styles.title}>Food Ordering</Text>
          <Text style={styles.subtitle}>Order delicious food with ease</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.customerButton]}
            onPress={() => router.push('/customer/menu')}
          >
            <Ionicons name="restaurant" size={32} color="#fff" />
            <Text style={styles.buttonText}>Browse Menu</Text>
            <Text style={styles.buttonSubtext}>Start Ordering</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.adminButton]}
            onPress={() => router.push('/admin/login')}
          >
            <Ionicons name="shield-checkmark" size={32} color="#fff" />
            <Text style={styles.buttonText}>Admin Panel</Text>
            <Text style={styles.buttonSubtext}>Manage Orders & Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Food Ordering System</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1D3557',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#457B9D',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  customerButton: {
    backgroundColor: '#E63946',
  },
  adminButton: {
    backgroundColor: '#457B9D',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6C757D',
  },
});