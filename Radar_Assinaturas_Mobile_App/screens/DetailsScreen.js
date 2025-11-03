import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { subscriptionService } from '../services/SubscriptionService';

export default function DetailsScreen({ route, navigation }) {
  const { subscription } = route.params;
  const [isActive, setIsActive] = useState(subscription.status === 'active');

  const getDaysUntilPayment = (dateString) => {
    const paymentDate = new Date(dateString);
    const today = new Date();
    const diffTime = paymentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = () => {
    const daysUntil = getDaysUntilPayment(subscription.nextPayment);
    if (daysUntil <= 3) return '#FF3B30';
    if (daysUntil <= 7) return '#FF9500';
    return '#34C759';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleToggleStatus = () => {
    Alert.alert(
      isActive ? 'Pausar Assinatura' : 'Reativar Assinatura',
      isActive 
        ? 'Tem certeza que deseja pausar esta assinatura?' 
        : 'Tem certeza que deseja reativar esta assinatura?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: isActive ? 'Pausar' : 'Reativar',
          style: isActive ? 'destructive' : 'default',
          onPress: () => setIsActive(!isActive),
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Assinatura',
      'Tem certeza que deseja excluir esta assinatura? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            // Aqui você implementaria a lógica de exclusão
          },
        },
      ]
    );
  };

  const daysUntil = getDaysUntilPayment(subscription.nextPayment);
  const statusColor = getStatusColor();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditSubscription', { subscription })}
          >
            <Ionicons name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Subscription Info Card */}
        <View style={styles.infoCard}>
          <View style={[styles.iconContainer, { backgroundColor: subscription.color + '20' }]}>
            <Ionicons name={subscription.icon} size={48} color={subscription.color} />
          </View>
          
          <Text style={styles.subscriptionName}>{subscription.name}</Text>
          <Text style={styles.subscriptionCategory}>{subscription.category}</Text>
          
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Valor mensal</Text>
            <Text style={styles.price}>R$ {subscription.price.toFixed(2)}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {isActive ? 'Ativa' : 'Pausada'}
            </Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Pagamento</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Próximo pagamento</Text>
            </View>
            <Text style={[styles.infoValue, { color: statusColor }]}>
              {formatDate(subscription.nextPayment)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Dias restantes</Text>
            </View>
            <Text style={[styles.infoValue, { color: statusColor }]}>
              {daysUntil > 0 ? `${daysUntil} dias` : 'Vencido'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="repeat-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Frequência</Text>
            </View>
            <Text style={styles.infoValue}>Mensal</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>R$ {(subscription.price * 12).toFixed(2)}</Text>
              <Text style={styles.statLabel}>Gasto anual</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Meses ativos</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleToggleStatus}
          >
            <Ionicons 
              name={isActive ? "pause-outline" : "play-outline"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.primaryButtonText}>
              {isActive ? 'Pausar Assinatura' : 'Reativar Assinatura'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              Alert.alert('Lembrete', 'Lembrete configurado para 3 dias antes do vencimento!');
            }}
          >
            <Ionicons name="notifications-outline" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Configurar Lembrete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={styles.dangerButtonText}>Excluir Assinatura</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  subscriptionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subscriptionCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  dangerButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});