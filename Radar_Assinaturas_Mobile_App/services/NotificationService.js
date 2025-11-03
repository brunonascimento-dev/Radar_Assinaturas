import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar como as notificações devem ser tratadas quando recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.isInitialized = false;
  }

  // Inicializar o serviço de notificações
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão para notificações negada');
        return false;
      }

      // Configurar canal de notificação para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('subscription-reminders', {
          name: 'Lembretes de Assinatura',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#007AFF',
          sound: 'default',
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
      return false;
    }
  }

  // Agendar notificação para vencimento de assinatura
  async scheduleSubscriptionReminder(subscription, daysBeforeExpiry = 3) {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return null;
      }

      // Calcular data da notificação
      const expiryDate = new Date(subscription.nextPayment);
      const notificationDate = new Date(expiryDate);
      notificationDate.setDate(notificationDate.getDate() - daysBeforeExpiry);

      // Verificar se a data é no futuro
      if (notificationDate <= new Date()) {
        console.log('Data de notificação já passou');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💳 Assinatura vencendo!',
          body: `Sua assinatura do ${subscription.name} vence em ${daysBeforeExpiry} dias (R$ ${subscription.price.toFixed(2)})`,
          data: {
            subscriptionId: subscription.id,
            type: 'subscription_reminder',
            subscription: subscription,
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: notificationDate,
        },
      });

      console.log(`Notificação agendada para ${subscription.name}: ${notificationId}`);
      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }

  // Agendar múltiplas notificações para uma assinatura
  async scheduleMultipleReminders(subscription, daysBefore = [7, 3, 1]) {
    const notificationIds = [];

    for (const days of daysBefore) {
      const id = await this.scheduleSubscriptionReminder(subscription, days);
      if (id) {
        notificationIds.push({ days, id });
      }
    }

    return notificationIds;
  }

  // Cancelar notificação específica
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Notificação cancelada: ${notificationId}`);
      return true;
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
      return false;
    }
  }

  // Cancelar todas as notificações de uma assinatura
  async cancelSubscriptionNotifications(subscriptionId) {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      const subscriptionNotifications = scheduledNotifications.filter(
        notification => notification.content.data?.subscriptionId === subscriptionId
      );

      for (const notification of subscriptionNotifications) {
        await this.cancelNotification(notification.identifier);
      }

      console.log(`Canceladas ${subscriptionNotifications.length} notificações para assinatura ${subscriptionId}`);
      return true;
    } catch (error) {
      console.error('Erro ao cancelar notificações da assinatura:', error);
      return false;
    }
  }

  // Cancelar todas as notificações
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Todas as notificações foram canceladas');
      return true;
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
      return false;
    }
  }

  // Obter todas as notificações agendadas
  async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }

  // Enviar notificação imediata (para testes)
  async sendImmediateNotification(title, body, data = {}) {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Enviar imediatamente
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao enviar notificação imediata:', error);
      return null;
    }
  }

  // Reagendar notificações para uma assinatura atualizada
  async rescheduleSubscriptionNotifications(subscription, daysBeforeArray = [7, 3, 1]) {
    try {
      // Cancelar notificações existentes
      await this.cancelSubscriptionNotifications(subscription.id);
      
      // Agendar novas notificações
      const newNotifications = await this.scheduleMultipleReminders(subscription, daysBeforeArray);
      
      return newNotifications;
    } catch (error) {
      console.error('Erro ao reagendar notificações:', error);
      return [];
    }
  }

  // Verificar status das permissões
  async checkPermissions() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return false;
    }
  }

  // Obter token de push notification (para notificações remotas)
  async getPushToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    } catch (error) {
      console.error('Erro ao obter push token:', error);
      return null;
    }
  }

  // Configurar listener para notificações recebidas
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Configurar listener para quando o usuário toca na notificação
  addNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Remover listeners
  removeNotificationSubscription(subscription) {
    if (subscription) {
      subscription.remove();
    }
  }

  // Agendar notificação de resumo mensal
  async scheduleMonthlySummary() {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return null;
      }

      // Agendar para o primeiro dia de cada mês às 9h
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📊 Resumo Mensal - Radar Assinaturas',
          body: 'Confira seu relatório mensal de gastos com assinaturas',
          data: {
            type: 'monthly_summary',
          },
        },
        trigger: {
          date: nextMonth,
          repeats: true,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar resumo mensal:', error);
      return null;
    }
  }
}

// Exportar instância singleton
const notificationService = new NotificationService();
export default notificationService;