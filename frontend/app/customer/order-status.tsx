import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';
import { getSocket } from '../../utils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  table_number?: string;
  notes?: string;
  created_at: string;
}

export default function OrderStatusScreen() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    setupSocketListener();

    return () => {
      const socket = getSocket();
      socket.off('order_status_updated');
    };
  }, []);

  const loadOrder = async () => {
    try {
      const orderId = await AsyncStorage.getItem('currentOrderId');
      if (!orderId) {
        router.replace('/customer/menu');
        return;
      }

      const orderData = await api.getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListener = () => {
    const socket = getSocket();
    socket.on('order_status_updated', (updatedOrder: Order) => {
      if (order && updatedOrder.id === order.id) {
        setOrder(updatedOrder);
      }
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: 'time',
          color: '#FFC107',
          title: 'Order Received',
          message: 'Your order has been received and will be prepared soon.',
        };
      case 'preparing':
        return {
          icon: 'restaurant',
          color: '#FF9800',
          title: 'Preparing',
          message: 'Your order is being prepared by our kitchen.',
        };
      case 'ready':
        return {
          icon: 'checkmark-circle',
          color: '#28A745',
          title: 'Ready for Pickup',
          message: 'Your order is ready! Please collect it from the counter.',
        };
      case 'completed':
        return {
          icon: 'checkmark-done-circle',
          color: '#6C757D',
          title: 'Completed',
          message: 'Order has been completed. Thank you!',
        };
      default:
        return {
          icon: 'help-circle',
          color: '#6C757D',
          title: 'Unknown',
          message: 'Order status unknown.',
        };
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E63946" />
        <Text style={styles.loadingText}>Loading order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#E63946" />
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/customer/menu')}
        >
          <Text style={styles.backButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusCard}>
          <View style={[styles.iconContainer, { backgroundColor: statusInfo.color + '20' }]}>
            <Ionicons name={statusInfo.icon as any} size={64} color={statusInfo.color} />
          </View>
          <Text style={styles.statusTitle}>{statusInfo.title}</Text>
          <Text style={styles.statusMessage}>{statusInfo.message}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, order.status !== 'pending' && styles.progressDotActive]} />
            <Text style={styles.progressLabel}>Received</Text>
          </View>
          <View style={[styles.progressLine, order.status !== 'pending' && styles.progressLineActive]} />
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, ['preparing', 'ready', 'completed'].includes(order.status) && styles.progressDotActive]} />
            <Text style={styles.progressLabel}>Preparing</Text>
          </View>
          <View style={[styles.progressLine, ['ready', 'completed'].includes(order.status) && styles.progressLineActive]} />
          <View style={styles.progressStep}>
            <View style={[styles.progressDot, ['ready', 'completed'].includes(order.status) && styles.progressDotActive]} />
            <Text style={styles.progressLabel}>Ready</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{order.id.slice(-8)}</Text>
          </View>
          {order.table_number && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Table:</Text>
              <Text style={styles.detailValue}>{order.table_number}</Text>
            </View>
          )}
          <View style={styles.divider} />
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemText}>{item.quantity}x {item.name}</Text>
              <Text style={styles.itemPrice}>₹(item.price * item.quantity).toFixed(2)</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>₹order.total.toFixed(2)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={() => router.replace('/customer/menu')}
        >
          <Text style={styles.newOrderButtonText}>Place New Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6C757D',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#E63946',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 12,
  },
  statusMessage: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E9ECEF',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: '#28A745',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 8,
    marginBottom: 24,
  },
  progressLineActive: {
    backgroundColor: '#28A745',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6C757D',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D3557',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#495057',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D3557',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E63946',
  },
  newOrderButton: {
    backgroundColor: '#E63946',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});