import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            // Aqui você implementaria a lógica de logout
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão perdidos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={22} color="#007AFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || (showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />)}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={40} color="#007AFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>João Silva</Text>
            <Text style={styles.profileEmail}>joao.silva@email.com</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <SectionHeader title="Notificações" />
        <View style={styles.section}>
          <SettingItem
            icon="notifications-outline"
            title="Notificações Push"
            subtitle="Receber lembretes de vencimento"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                thumbColor="#fff"
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="time-outline"
            title="Lembrar com antecedência"
            subtitle={`${reminderDays} dias antes do vencimento`}
            onPress={() => {
              Alert.alert(
                'Dias de antecedência',
                'Escolha quantos dias antes você quer ser lembrado',
                [
                  { text: '1 dia', onPress: () => setReminderDays(1) },
                  { text: '3 dias', onPress: () => setReminderDays(3) },
                  { text: '7 dias', onPress: () => setReminderDays(7) },
                  { text: 'Cancelar', style: 'cancel' }
                ]
              );
            }}
          />
        </View>

        {/* Appearance */}
        <SectionHeader title="Aparência" />
        <View style={styles.section}>
          <SettingItem
            icon="moon-outline"
            title="Modo Escuro"
            subtitle="Ativar tema escuro"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                thumbColor="#fff"
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="color-palette-outline"
            title="Tema"
            subtitle="Personalizar cores do app"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
        </View>

        {/* Security */}
        <SectionHeader title="Segurança" />
        <View style={styles.section}>
          <SettingItem
            icon="finger-print-outline"
            title="Autenticação Biométrica"
            subtitle="Usar impressão digital ou Face ID"
            rightComponent={
              <Switch
                value={biometricAuth}
                onValueChange={setBiometricAuth}
                trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                thumbColor="#fff"
              />
            }
            showArrow={false}
          />
          
          <SettingItem
            icon="lock-closed-outline"
            title="Alterar Senha"
            subtitle="Modificar sua senha de acesso"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
        </View>

        {/* Data & Storage */}
        <SectionHeader title="Dados e Armazenamento" />
        <View style={styles.section}>
          <SettingItem
            icon="cloud-outline"
            title="Backup"
            subtitle="Fazer backup dos dados"
            onPress={() => Alert.alert('Backup', 'Backup realizado com sucesso!')}
          />
          
          <SettingItem
            icon="download-outline"
            title="Exportar Dados"
            subtitle="Baixar seus dados em CSV"
            onPress={() => Alert.alert('Exportar', 'Dados exportados com sucesso!')}
          />
          
          <SettingItem
            icon="trash-outline"
            title="Limpar Cache"
            subtitle="Liberar espaço de armazenamento"
            onPress={() => Alert.alert('Cache', 'Cache limpo com sucesso!')}
          />
        </View>

        {/* Support */}
        <SectionHeader title="Suporte" />
        <View style={styles.section}>
          <SettingItem
            icon="help-circle-outline"
            title="Central de Ajuda"
            subtitle="FAQ e tutoriais"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
          
          <SettingItem
            icon="mail-outline"
            title="Contato"
            subtitle="Enviar feedback ou reportar problema"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
          
          <SettingItem
            icon="star-outline"
            title="Avaliar App"
            subtitle="Deixe sua avaliação na loja"
            onPress={() => Alert.alert('Obrigado!', 'Redirecionando para a loja...')}
          />
        </View>

        {/* About */}
        <SectionHeader title="Sobre" />
        <View style={styles.section}>
          <SettingItem
            icon="information-circle-outline"
            title="Versão do App"
            subtitle="1.0.0"
            showArrow={false}
          />
          
          <SettingItem
            icon="document-text-outline"
            title="Termos de Uso"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
          
          <SettingItem
            icon="shield-checkmark-outline"
            title="Política de Privacidade"
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
          />
        </View>

        {/* Account Actions */}
        <SectionHeader title="Conta" />
        <View style={styles.section}>
          <SettingItem
            icon="log-out-outline"
            title="Sair"
            subtitle="Fazer logout da conta"
            onPress={handleLogout}
          />
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <View style={styles.dangerIcon}>
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.dangerTitle}>Excluir Conta</Text>
              <Text style={styles.settingSubtitle}>Esta ação é irreversível</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
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
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editProfileButton: {
    padding: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dangerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
  },
  bottomSpacing: {
    height: 40,
  },
});