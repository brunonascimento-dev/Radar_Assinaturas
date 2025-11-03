import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import AddSubscriptionScreen from './screens/AddSubscriptionScreen';
import SettingsScreen from './screens/SettingsScreen';

// Services
import notificationService from './services/NotificationService';
import subscriptionService from './services/SubscriptionService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator para as telas principais
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Inicializar serviços
      await notificationService.initialize();
      await subscriptionService.loadSubscriptions();

      // Configurar listeners de notificação
      const notificationListener = notificationService.addNotificationReceivedListener(
        (notification) => {
          console.log('Notificação recebida:', notification);
        }
      );

      const responseListener = notificationService.addNotificationResponseReceivedListener(
        (response) => {
          console.log('Resposta da notificação:', response);
          const { data } = response.notification.request.content;
          
          if (data?.type === 'subscription_reminder' && data?.subscription) {
            // Navegar para detalhes da assinatura
            // navigation.navigate('Details', { subscription: data.subscription });
          }
        }
      );

      // Simular verificação de autenticação
      setTimeout(() => {
        setIsAuthenticated(false); // Começar na tela de login
        setIsLoading(false);
      }, 1000);

      // Cleanup listeners quando o app for fechado
      return () => {
        notificationService.removeNotificationSubscription(notificationListener);
        notificationService.removeNotificationSubscription(responseListener);
      };
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // Ou uma tela de loading
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Telas de autenticação
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          // Telas principais
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="Details" 
              component={DetailsScreen}
              options={{
                headerShown: true,
                headerTitle: 'Detalhes da Assinatura',
                headerStyle: {
                  backgroundColor: '#fff',
                },
                headerTintColor: '#333',
                headerTitleStyle: {
                  fontWeight: '600',
                },
              }}
            />
            <Stack.Screen 
              name="AddSubscription" 
              component={AddSubscriptionScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
