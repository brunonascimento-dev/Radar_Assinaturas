import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FinancialSummary({ 
  monthlyTotal = 0, 
  yearlyTotal = 0, 
  activeSubscriptions = 0,
  upcomingPayments = 0,
  onViewDetails 
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const SummaryCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.summaryCard, { borderLeftColor: color }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
        <TouchableOpacity onPress={onViewDetails}>
          <Text style={styles.viewAllText}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryGrid}>
        {/* Gasto Mensal */}
        <SummaryCard
          title="Gasto Mensal"
          value={formatCurrency(monthlyTotal)}
          subtitle="Total das assinaturas ativas"
          icon="card-outline"
          color="#007AFF"
          onPress={() => onViewDetails && onViewDetails('monthly')}
        />

        {/* Gasto Anual */}
        <SummaryCard
          title="Projeção Anual"
          value={formatCurrency(yearlyTotal)}
          subtitle="Baseado no gasto mensal atual"
          icon="trending-up-outline"
          color="#00C851"
          onPress={() => onViewDetails && onViewDetails('yearly')}
        />

        {/* Assinaturas Ativas */}
        <SummaryCard
          title="Assinaturas Ativas"
          value={activeSubscriptions.toString()}
          subtitle="Serviços em uso"
          icon="checkmark-circle-outline"
          color="#1DB954"
          onPress={() => onViewDetails && onViewDetails('active')}
        />

        {/* Próximos Vencimentos */}
        <SummaryCard
          title="Próximos Vencimentos"
          value={upcomingPayments.toString()}
          subtitle="Nos próximos 7 dias"
          icon="time-outline"
          color={upcomingPayments > 0 ? "#FF6900" : "#666"}
          onPress={() => onViewDetails && onViewDetails('upcoming')}
        />
      </View>

      {/* Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>💡 Insights</Text>
        
        {monthlyTotal > 200 && (
          <View style={styles.insightItem}>
            <Ionicons name="warning-outline" size={16} color="#FF6900" />
            <Text style={styles.insightText}>
              Seus gastos mensais estão altos. Considere revisar suas assinaturas.
            </Text>
          </View>
        )}

        {upcomingPayments > 3 && (
          <View style={styles.insightItem}>
            <Ionicons name="calendar-outline" size={16} color="#007AFF" />
            <Text style={styles.insightText}>
              Você tem {upcomingPayments} pagamentos nos próximos dias.
            </Text>
          </View>
        )}

        {activeSubscriptions > 10 && (
          <View style={styles.insightItem}>
            <Ionicons name="apps-outline" size={16} color="#1DB954" />
            <Text style={styles.insightText}>
              Você tem muitas assinaturas ativas. Verifique se está usando todas.
            </Text>
          </View>
        )}

        {monthlyTotal < 50 && activeSubscriptions > 0 && (
          <View style={styles.insightItem}>
            <Ionicons name="thumbs-up-outline" size={16} color="#00C851" />
            <Text style={styles.insightText}>
              Parabéns! Você está controlando bem seus gastos com assinaturas.
            </Text>
          </View>
        )}

        {activeSubscriptions === 0 && (
          <View style={styles.insightItem}>
            <Ionicons name="add-circle-outline" size={16} color="#007AFF" />
            <Text style={styles.insightText}>
              Comece adicionando suas primeiras assinaturas para acompanhar os gastos.
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="add-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>Adicionar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="analytics-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>Relatórios</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="download-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>Exportar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#999',
    lineHeight: 12,
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickActionButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quickActionText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '500',
  },
});