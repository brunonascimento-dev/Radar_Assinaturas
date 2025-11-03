import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', name: 'Streaming', icon: 'tv-outline', color: '#E50914' },
  { id: '2', name: 'Música', icon: 'musical-notes-outline', color: '#1DB954' },
  { id: '3', name: 'Produtividade', icon: 'briefcase-outline', color: '#0078D4' },
  { id: '4', name: 'Jogos', icon: 'game-controller-outline', color: '#00C851' },
  { id: '5', name: 'Educação', icon: 'school-outline', color: '#FF6900' },
  { id: '6', name: 'Saúde', icon: 'fitness-outline', color: '#FF3B30' },
  { id: '7', name: 'Outros', icon: 'ellipsis-horizontal-outline', color: '#666' },
];

const popularServices = [
  { name: 'Netflix', category: 'Streaming', icon: 'tv-outline', color: '#E50914' },
  { name: 'Spotify', category: 'Música', icon: 'musical-notes-outline', color: '#1DB954' },
  { name: 'Amazon Prime', category: 'Streaming', icon: 'bag-outline', color: '#FF9900' },
  { name: 'Disney+', category: 'Streaming', icon: 'tv-outline', color: '#113CCF' },
  { name: 'YouTube Premium', category: 'Streaming', icon: 'logo-youtube', color: '#FF0000' },
  { name: 'Adobe Creative', category: 'Produtividade', icon: 'brush-outline', color: '#FF0000' },
  { name: 'Microsoft 365', category: 'Produtividade', icon: 'desktop-outline', color: '#0078D4' },
  { name: 'Canva Pro', category: 'Produtividade', icon: 'create-outline', color: '#00C4CC' },
];

export default function AddSubscriptionScreen({ navigation, route }) {
  const isEditing = route?.params?.subscription;
  const subscription = route?.params?.subscription;

  const [name, setName] = useState(subscription?.name || '');
  const [price, setPrice] = useState(subscription?.price?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(
    subscription ? categories.find(cat => cat.name === subscription.category) : categories[0]
  );
  const [nextPayment, setNextPayment] = useState(subscription?.nextPayment || '');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);

  const handleSave = () => {
    if (!name || !price || !nextPayment) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const priceValue = parseFloat(price.replace(',', '.'));
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    // Aqui você implementaria a lógica de salvar
    Alert.alert(
      'Sucesso',
      isEditing ? 'Assinatura atualizada com sucesso!' : 'Assinatura adicionada com sucesso!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const selectService = (service) => {
    setName(service.name);
    const category = categories.find(cat => cat.name === service.category);
    setSelectedCategory(category);
    setShowServicesModal(false);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory?.id === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => {
        setSelectedCategory(item);
        setShowCategoryModal(false);
      }}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      {selectedCategory?.id === item.id && (
        <Ionicons name="checkmark" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => selectService(item)}
    >
      <View style={[styles.serviceIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceCategory}>{item.category}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Assinatura' : 'Nova Assinatura'}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Services */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serviços Populares</Text>
            <TouchableOpacity
              style={styles.quickServicesButton}
              onPress={() => setShowServicesModal(true)}
            >
              <Ionicons name="apps-outline" size={20} color="#007AFF" />
              <Text style={styles.quickServicesText}>Escolher serviço popular</Text>
              <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Assinatura</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome do Serviço *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Netflix, Spotify..."
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Categoria *</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategoryModal(true)}
            >
              <View style={styles.selectedCategoryDisplay}>
                <View style={[styles.categoryIcon, { backgroundColor: selectedCategory?.color + '20' }]}>
                  <Ionicons name={selectedCategory?.icon} size={20} color={selectedCategory?.color} />
                </View>
                <Text style={styles.selectedCategoryText}>{selectedCategory?.name}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Valor Mensal (R$) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Próximo Pagamento *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={nextPayment}
              onChangeText={setNextPayment}
            />
            <Text style={styles.inputHint}>
              Data do próximo vencimento da assinatura
            </Text>
          </View>
        </View>

        {/* Additional Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções Adicionais</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="notifications-outline" size={20} color="#666" />
            <Text style={styles.optionText}>Configurar lembretes</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <Text style={styles.optionText}>Método de pagamento</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Categoria</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            style={styles.modalList}
          />
        </SafeAreaView>
      </Modal>

      {/* Services Modal */}
      <Modal
        visible={showServicesModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Serviços Populares</Text>
            <TouchableOpacity onPress={() => setShowServicesModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularServices}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.name}
            style={styles.modalList}
          />
        </SafeAreaView>
      </Modal>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickServicesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickServicesText: {
    flex: 1,
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  selectedCategoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCategoryText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCategoryItem: {
    backgroundColor: '#f0f8ff',
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
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
});