import { Stack } from 'expo-router';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#E63946',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="customer/menu"
            options={{
              title: 'Menu',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="customer/cart"
            options={{
              title: 'Cart',
              headerBackTitle: 'Menu',
            }}
          />
          <Stack.Screen
            name="customer/checkout"
            options={{
              title: 'Checkout',
              headerBackTitle: 'Cart',
            }}
          />
          <Stack.Screen
            name="customer/order-status"
            options={{
              title: 'Order Status',
              headerBackTitle: 'Menu',
            }}
          />
          <Stack.Screen
            name="admin/login"
            options={{
              title: 'Admin Login',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/dashboard"
            options={{
              title: 'Admin Dashboard',
              headerBackTitle: 'Home',
            }}
          />
          <Stack.Screen
            name="admin/add-item"
            options={{
              title: 'Add Menu Item',
              headerBackTitle: 'Dashboard',
            }}
          />
          <Stack.Screen
            name="admin/edit-item"
            options={{
              title: 'Edit Menu Item',
              headerBackTitle: 'Dashboard',
            }}
          />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}