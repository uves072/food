import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { getSocket } from '../../utils/socket';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  table_number?: string;
  notes?: string;
  created_at: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { logout, adminUsername } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    setupSocketListeners();

    return () => {
      const socket = getSocket();
      socket.off('new_order');
    };
  }, [activeTab]);

  const setupSocketListeners = () => {
    const socket = getSocket();
    
    // Join admin room to receive order notifications
    socket.emit('join_admin');

 socket.on('new_order', (newOrder: Order) => {
  setOrders((prev) => [newOrder, ...prev]);
});

if (activeTab === 'orders') {
  const ordersData = await api.getOrders();
  setOrders(ordersData);
} else {
  const menuData = await api.getMenu();
  setMenuItems(menuData);
}
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleStatusChange = async (orderId: string, currentStatus: string) => {
    const statusFlow = ['pending', 'preparing', 'ready', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[currentIndex + 1] || currentStatus;

    try {
      await api.updateOrderStatus(orderId, nextStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: nextStatus } : order
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleDeleteMenuItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteMenuItem(itemId);
              setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'preparing':
        return '#FF9800';
      case 'ready':
        return '#28A745';
      case 'completed':
        return '#6C757D';
      default:
        return '#6C757D';
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderTable}>Table: {item.table_number || 'N/A'}</Text>
          <Text style={styles.orderTime}>
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.orderItemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>

      {item.notes && (
        <Text style={styles.orderNotes}>Note: {item.notes}</Text>
      )}

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>₹{item.total.toFixed(2)}</Text>
        {item.status !== 'completed' && (
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => handleStatusChange(item.id, item.status)}
          >
            <Text style={styles.statusButtonText}>
              {item.status === 'pending' ? 'Start Preparing' :
               item.status === 'preparing' ? 'Mark Ready' : 'Complete'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      <Image source={{ uri: item.image }} style={styles.menuImage} resizeMode="cover" />
      <View style={styles.menuInfo}>
        <View style={styles.menuHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuCategory}>{item.category}</Text>
            <Text style={styles.menuPrice}>₹{item.price.toFixed(2)}</Text>
          </View>
          <View style={styles.menuActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push({ pathname: '/admin/edit-item', params: { itemId: item.id } })}
            >
              <Ionicons name="create" size={20} color="#457B9D" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteMenuItem(item.id)}
            >
              <Ionicons name="trash" size={20} color="#E63946" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#457B9D" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {adminUsername}</Text>
          <Text style={styles.headerSubtext}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#E63946" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => {
            setActiveTab('orders');
            setLoading(true);
          }}
        >
          <Ionicons
            name="list"
            size={20}
            color={activeTab === 'orders' ? '#fff' : '#6C757D'}
          />
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
          onPress={() => {
            setActiveTab('menu');
            setLoading(true);
          }}
        >
          <Ionicons
            name="fast-food"
            size={20}
            color={activeTab === 'menu' ? '#fff' : '#6C757D'}
          />
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
            Menu
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'orders' ? orders : menuItems}
        renderItem={activeTab === 'orders' ? renderOrder : renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={activeTab === 'orders' ? 'receipt-outline' : 'fast-food-outline'}
              size={64}
              color="#CCC"
            />
            <Text style={styles.emptyText}>
              {activeTab === 'orders' ? 'No orders yet' : 'No menu items'}
            </Text>
          </View>
        }
      />

      {activeTab === 'menu' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/admin/add-item')}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  headerSubtext: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#457B9D',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C757D',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderTable: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  orderTime: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItemText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  orderNotes: {
    fontSize: 12,
    color: '#6C757D',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E63946',
  },
  statusButton: {
    backgroundColor: '#28A745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  menuImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E9ECEF',
  },
  menuInfo: {
    padding: 12,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D3557',
  },
  menuCategory: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E63946',
    marginTop: 4,
  },
  menuActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E63946',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
