import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Components
import SubscriptionCard from '../components/SubscriptionCard';
import FinancialSummary from '../components/FinancialSummary';

// Services
import subscriptionService from '../services/SubscriptionService';

export default function HomeScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyTotal: 0,
    yearlyTotal: 0,
    activeCount: 0,
    upcomingPayments: 0,
  });

  // Carregar dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const subs = await subscriptionService.getSubscriptions();
      const monthlyTotal = await subscriptionService.getMonthlyTotal();
      const yearlyTotal = await subscriptionService.getYearlyTotal();
      const activeSubscriptions = await subscriptionService.getActiveSubscriptions();
      const upcomingPayments = await subscriptionService.getUpcomingPayments(7);

      setSubscriptions(subs);
      setStats({
        monthlyTotal,
        yearlyTotal,
        activeCount: activeSubscriptions.length,
        upcomingPayments: upcomingPayments.length,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleStatus = async (subscription) => {
    try {
      const newStatus = await subscriptionService.toggleSubscriptionStatus(subscription.id);
      Alert.alert(
        'Status Alterado',
        `Assinatura ${newStatus === 'active' ? 'reativada' : 'pausada'} com sucesso!`
      );
      await loadData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status da assinatura');
    }
  };

  const handleViewDetails = (type) => {
    // Implementar navegação para tela de detalhes/relatórios
    console.log('Ver detalhes:', type);
  };

  const renderSubscriptionCard = ({ item }) => (
    <SubscriptionCard
      subscription={item}
      onPress={() => navigation.navigate('Details', { subscription: item })}
      onToggleStatus={handleToggleStatus}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Olá! 👋</Text>
        <Text style={styles.welcomeSubtext}>Gerencie suas assinaturas</Text>
      </View>
      
      <FinancialSummary
        stats={stats}
        onViewDetails={handleViewDetails}
      />

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddSubscription')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Adicionar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="analytics-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Relatórios</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Lembretes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Suas Assinaturas</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando assinaturas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={subscriptions}
        renderItem={renderSubscriptionCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
});