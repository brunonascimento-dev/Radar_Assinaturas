import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categoryIcons = {
  'Streaming': 'tv-outline',
  'Música': 'musical-notes-outline',
  'Produtividade': 'briefcase-outline',
  'Jogos': 'game-controller-outline',
  'Educação': 'school-outline',
  'Saúde': 'fitness-outline',
  'Outros': 'ellipsis-horizontal-outline',
};

const categoryColors = {
  'Streaming': '#E50914',
  'Música': '#1DB954',
  'Produtividade': '#0078D4',
  'Jogos': '#00C851',
  'Educação': '#FF6900',
  'Saúde': '#FF3B30',
  'Outros': '#666',
};

const statusColors = {
  'active': '#00C851',
  'paused': '#FF6900',
  'expired': '#FF3B30',
};

const statusLabels = {
  'active': 'Ativa',
  'paused': 'Pausada',
  'expired': 'Vencida',
};

export default function SubscriptionCard({ 
  subscription, 
  onPress, 
  onToggleStatus,
  showActions = true 
}) {
  const categoryIcon = categoryIcons[subscription.category] || 'ellipsis-horizontal-outline';
  const categoryColor = categoryColors[subscription.category] || '#666';
  const statusColor = statusColors[subscription.status] || '#666';
  const statusLabel = statusLabels[subscription.status] || subscription.status;

  // Calcular dias até o vencimento
  const getDaysUntilPayment = () => {
    const today = new Date();
    const paymentDate = new Date(subscription.nextPayment);
    const diffTime = paymentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilPayment = getDaysUntilPayment();
  const isExpiringSoon = daysUntilPayment <= 3 && daysUntilPayment >= 0;
  const isExpired = daysUntilPayment < 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getPaymentStatus = () => {
    if (isExpired) {
      return { text: 'Vencida', color: '#FF3B30' };
    } else if (isExpiringSoon) {
      return { text: `${daysUntilPayment} dias`, color: '#FF6900' };
    } else {
      return { text: `${daysUntilPayment} dias`, color: '#666' };
    }
  };

  const paymentStatus = getPaymentStatus();

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isExpiringSoon && styles.cardExpiringSoon,
        isExpired && styles.cardExpired,
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryColor + '20' }]}>
            <Ionicons name={categoryIcon} size={20} color={categoryColor} />
          </View>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>{subscription.name}</Text>
            <Text style={styles.serviceCategory}>{subscription.category}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Price and Payment Info */}
      <View style={styles.paymentInfo}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R$ {subscription.price.toFixed(2)}</Text>
          <Text style={styles.priceLabel}>por mês</Text>
        </View>
        <View style={styles.nextPaymentContainer}>
          <Text style={styles.nextPaymentLabel}>Próximo pagamento</Text>
          <View style={styles.paymentDateContainer}>
            <Text style={styles.nextPaymentDate}>{formatDate(subscription.nextPayment)}</Text>
            <Text style={[styles.paymentStatusText, { color: paymentStatus.color }]}>
              {paymentStatus.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onToggleStatus && onToggleStatus(subscription)}
          >
            <Ionicons 
              name={subscription.status === 'active' ? 'pause-outline' : 'play-outline'} 
              size={16} 
              color="#007AFF" 
            />
            <Text style={styles.actionButtonText}>
              {subscription.status === 'active' ? 'Pausar' : 'Reativar'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={16} color="#007AFF" />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card-outline" size={16} color="#007AFF" />
            <Text style={styles.actionButtonText}>Pagar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Warning indicators */}
      {isExpiringSoon && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={16} color="#FF6900" />
          <Text style={styles.warningText}>Vence em breve!</Text>
        </View>
      )}
      
      {isExpired && (
        <View style={[styles.warningContainer, styles.expiredContainer]}>
          <Ionicons name="alert-circle-outline" size={16} color="#FF3B30" />
          <Text style={[styles.warningText, styles.expiredText]}>Vencida!</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardExpiringSoon: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6900',
  },
  cardExpired: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  nextPaymentContainer: {
    alignItems: 'flex-end',
  },
  nextPaymentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  paymentDateContainer: {
    alignItems: 'flex-end',
  },
  nextPaymentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  expiredContainer: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
  },
  warningText: {
    fontSize: 12,
    color: '#FF6900',
    marginLeft: 6,
    fontWeight: '600',
  },
  expiredText: {
    color: '#FF3B30',
  },
});