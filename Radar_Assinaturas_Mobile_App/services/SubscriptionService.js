import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from './NotificationService';

const STORAGE_KEY = '@radar_subscriptions';
const USER_PREFERENCES_KEY = '@user_preferences';

class SubscriptionService {
  constructor() {
    this.subscriptions = [];
    this.isLoaded = false;
  }

  // Carregar assinaturas do storage
  async loadSubscriptions() {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        this.subscriptions = JSON.parse(storedData);
      } else {
        // Dados mock para demonstração
        this.subscriptions = this.getMockData();
        await this.saveSubscriptions();
      }
      this.isLoaded = true;
      return this.subscriptions;
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
      this.subscriptions = this.getMockData();
      return this.subscriptions;
    }
  }

  // Salvar assinaturas no storage
  async saveSubscriptions() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.subscriptions));
      return true;
    } catch (error) {
      console.error('Erro ao salvar assinaturas:', error);
      return false;
    }
  }

  // Obter todas as assinaturas
  async getSubscriptions() {
    if (!this.isLoaded) {
      await this.loadSubscriptions();
    }
    return this.subscriptions;
  }

  // Adicionar nova assinatura
  async addSubscription(subscriptionData) {
    try {
      const newSubscription = {
        id: Date.now().toString(),
        name: subscriptionData.name,
        price: parseFloat(subscriptionData.price),
        category: subscriptionData.category,
        nextPayment: subscriptionData.nextPayment,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentHistory: [],
        notifications: [],
      };

      this.subscriptions.push(newSubscription);
      await this.saveSubscriptions();

      // Agendar notificações
      const notificationIds = await notificationService.scheduleMultipleReminders(newSubscription);
      if (notificationIds.length > 0) {
        newSubscription.notifications = notificationIds;
        await this.saveSubscriptions();
      }

      return newSubscription;
    } catch (error) {
      console.error('Erro ao adicionar assinatura:', error);
      throw error;
    }
  }

  // Atualizar assinatura existente
  async updateSubscription(id, updateData) {
    try {
      const index = this.subscriptions.findIndex(sub => sub.id === id);
      if (index === -1) {
        throw new Error('Assinatura não encontrada');
      }

      const updatedSubscription = {
        ...this.subscriptions[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      this.subscriptions[index] = updatedSubscription;
      await this.saveSubscriptions();

      // Reagendar notificações se a data de pagamento mudou
      if (updateData.nextPayment) {
        await notificationService.rescheduleSubscriptionNotifications(updatedSubscription);
      }

      return updatedSubscription;
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      throw error;
    }
  }

  // Remover assinatura
  async removeSubscription(id) {
    try {
      const index = this.subscriptions.findIndex(sub => sub.id === id);
      if (index === -1) {
        throw new Error('Assinatura não encontrada');
      }

      // Cancelar notificações
      await notificationService.cancelSubscriptionNotifications(id);

      this.subscriptions.splice(index, 1);
      await this.saveSubscriptions();
      return true;
    } catch (error) {
      console.error('Erro ao remover assinatura:', error);
      throw error;
    }
  }

  // Pausar/reativar assinatura
  async toggleSubscriptionStatus(id) {
    try {
      const subscription = this.subscriptions.find(sub => sub.id === id);
      if (!subscription) {
        throw new Error('Assinatura não encontrada');
      }

      const newStatus = subscription.status === 'active' ? 'paused' : 'active';
      await this.updateSubscription(id, { status: newStatus });

      if (newStatus === 'paused') {
        await notificationService.cancelSubscriptionNotifications(id);
      } else {
        const notificationIds = await notificationService.scheduleMultipleReminders(subscription);
        await this.updateSubscription(id, { notifications: notificationIds });
      }

      return newStatus;
    } catch (error) {
      console.error('Erro ao alterar status da assinatura:', error);
      throw error;
    }
  }

  // Obter assinatura por ID
  async getSubscriptionById(id) {
    if (!this.isLoaded) {
      await this.loadSubscriptions();
    }
    return this.subscriptions.find(sub => sub.id === id);
  }

  // Obter assinaturas por categoria
  async getSubscriptionsByCategory(category) {
    if (!this.isLoaded) {
      await this.loadSubscriptions();
    }
    return this.subscriptions.filter(sub => sub.category === category);
  }

  // Obter assinaturas ativas
  async getActiveSubscriptions() {
    if (!this.isLoaded) {
      await this.loadSubscriptions();
    }
    return this.subscriptions.filter(sub => sub.status === 'active');
  }

  // Calcular total mensal
  async getMonthlyTotal() {
    const activeSubscriptions = await this.getActiveSubscriptions();
    return activeSubscriptions.reduce((total, sub) => total + sub.price, 0);
  }

  // Calcular total anual
  async getYearlyTotal() {
    const monthlyTotal = await this.getMonthlyTotal();
    return monthlyTotal * 12;
  }

  // Obter estatísticas por categoria
  async getCategoryStats() {
    const activeSubscriptions = await this.getActiveSubscriptions();
    const stats = {};

    activeSubscriptions.forEach(sub => {
      if (!stats[sub.category]) {
        stats[sub.category] = {
          count: 0,
          total: 0,
          subscriptions: [],
        };
      }
      stats[sub.category].count++;
      stats[sub.category].total += sub.price;
      stats[sub.category].subscriptions.push(sub);
    });

    return stats;
  }

  // Obter assinaturas que vencem em breve
  async getUpcomingPayments(days = 7) {
    if (!this.isLoaded) {
      await this.loadSubscriptions();
    }

    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.subscriptions.filter(sub => {
      if (sub.status !== 'active') return false;
      const paymentDate = new Date(sub.nextPayment);
      return paymentDate >= now && paymentDate <= futureDate;
    });
  }

  // Registrar pagamento
  async recordPayment(subscriptionId, amount, date = new Date()) {
    try {
      const subscription = await this.getSubscriptionById(subscriptionId);
      if (!subscription) {
        throw new Error('Assinatura não encontrada');
      }

      const payment = {
        id: Date.now().toString(),
        amount,
        date: date.toISOString(),
        status: 'completed',
      };

      subscription.paymentHistory.push(payment);

      // Calcular próxima data de pagamento (assumindo mensal)
      const nextPaymentDate = new Date(subscription.nextPayment);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      await this.updateSubscription(subscriptionId, {
        nextPayment: nextPaymentDate.toISOString().split('T')[0],
        paymentHistory: subscription.paymentHistory,
      });

      return payment;
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      throw error;
    }
  }

  // Exportar dados para CSV
  async exportToCSV() {
    try {
      const subscriptions = await this.getSubscriptions();
      let csv = 'Nome,Categoria,Preço,Próximo Pagamento,Status,Criado em\n';

      subscriptions.forEach(sub => {
        csv += `"${sub.name}","${sub.category}","R$ ${sub.price.toFixed(2)}","${sub.nextPayment}","${sub.status}","${new Date(sub.createdAt).toLocaleDateString()}"\n`;
      });

      return csv;
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      throw error;
    }
  }

  // Limpar todos os dados
  async clearAllData() {
    try {
      await notificationService.cancelAllNotifications();
      this.subscriptions = [];
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }

  // Dados mock para demonstração
  getMockData() {
    return [
      {
        id: '1',
        name: 'Netflix',
        price: 45.90,
        category: 'Streaming',
        nextPayment: '2024-02-15',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        paymentHistory: [],
        notifications: [],
      },
      {
        id: '2',
        name: 'Spotify',
        price: 21.90,
        category: 'Música',
        nextPayment: '2024-02-10',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        paymentHistory: [],
        notifications: [],
      },
      {
        id: '3',
        name: 'Adobe Creative Cloud',
        price: 89.90,
        category: 'Produtividade',
        nextPayment: '2024-02-20',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        paymentHistory: [],
        notifications: [],
      },
      {
        id: '4',
        name: 'Amazon Prime',
        price: 14.90,
        category: 'Streaming',
        nextPayment: '2024-02-25',
        status: 'paused',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        paymentHistory: [],
        notifications: [],
      },
      {
        id: '5',
        name: 'Disney+',
        price: 33.90,
        category: 'Streaming',
        nextPayment: '2024-02-12',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        paymentHistory: [],
        notifications: [],
      },
    ];
  }

  // Salvar preferências do usuário
  async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      return false;
    }
  }

  // Carregar preferências do usuário
  async loadUserPreferences() {
    try {
      const storedPreferences = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
      return {
        notifications: true,
        reminderDays: 3,
        darkMode: false,
        biometricAuth: false,
      };
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      return {};
    }
  }
}

// Exportar instância singleton
const subscriptionService = new SubscriptionService();
export default subscriptionService;