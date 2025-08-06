import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProfileScreen = () => {
  const { user, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  // Estado para opções de notificações
  const [notifications, setNotifications] = useState({
    newFeatures: true,
    movieRecommendations: true,
    appUpdates: true
  });

  // Função para salvar alterações do perfil
  const handleSaveProfile = async () => {
    // Validação básica
    if (!formData.username.trim()) {
      Alert.alert('Erro', 'Nome de usuário é obrigatório');
      return;
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    
    try {
      // Preparar dados para atualização
      const updateData = {
        username: formData.username,
      };
      
      // Adicionar senha apenas se foi preenchida
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      const result = await updateProfile(updateData);
      
      if (result.success) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
        setIsEditing(false);
        // Limpar senhas após atualização
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } else {
        Alert.alert('Erro', result.message || 'Não foi possível atualizar o perfil');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  // Função para mostrar estatísticas do usuário
  const fetchUserStats = async () => {
    try {
      // Esta funcionalidade será implementada posteriormente
      Alert.alert('Estatísticas', 'Esta funcionalidade será implementada em breve.');
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.username?.substring(0, 1).toUpperCase() || 'U'}
          </Text>
        </View>
        
        <Text style={styles.username}>{user?.username || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>
        
        {!isEditing && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Editar Informações</Text>
          
          <Text style={styles.label}>Nome de Usuário</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => setFormData({...formData, username: text})}
            placeholder="Nome de usuário"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { color: '#888' }]}
            value={formData.email}
            editable={false}
            placeholder="Email"
          />
          
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
          
          <Text style={styles.label}>Senha Atual</Text>
          <TextInput
            style={styles.input}
            value={formData.currentPassword}
            onChangeText={(text) => setFormData({...formData, currentPassword: text})}
            placeholder="Senha atual"
            secureTextEntry
          />
          
          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            value={formData.newPassword}
            onChangeText={(text) => setFormData({...formData, newPassword: text})}
            placeholder="Nova senha"
            secureTextEntry
          />
          
          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmNewPassword}
            onChangeText={(text) => setFormData({...formData, confirmNewPassword: text})}
            placeholder="Confirmar nova senha"
            secureTextEntry
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                // Reset form data to original user data
                setFormData({
                  username: user?.username || '',
                  email: user?.email || '',
                  currentPassword: '',
                  newPassword: '',
                  confirmNewPassword: ''
                });
              }}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Filmes</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Tags</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0.0</Text>
                <Text style={styles.statLabel}>Média</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.statsButton}
              onPress={fetchUserStats}
            >
              <Text style={styles.statsButtonText}>Ver estatísticas detalhadas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Notificações de novidades</Text>
              <Switch
                value={notifications.newFeatures}
                onValueChange={(value) => 
                  setNotifications({...notifications, newFeatures: value})
                }
                trackColor={{ false: '#d1d1d1', true: '#90CAF9' }}
                thumbColor={notifications.newFeatures ? '#2196F3' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Recomendações de filmes</Text>
              <Switch
                value={notifications.movieRecommendations}
                onValueChange={(value) => 
                  setNotifications({...notifications, movieRecommendations: value})
                }
                trackColor={{ false: '#d1d1d1', true: '#90CAF9' }}
                thumbColor={notifications.movieRecommendations ? '#2196F3' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Atualizações do app</Text>
              <Switch
                value={notifications.appUpdates}
                onValueChange={(value) => 
                  setNotifications({...notifications, appUpdates: value})
                }
                trackColor={{ false: '#d1d1d1', true: '#90CAF9' }}
                thumbColor={notifications.appUpdates ? '#2196F3' : '#f4f3f4'}
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => {
              Alert.alert(
                'Sair da conta',
                'Tem certeza que deseja sair?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Sair', onPress: signOut }
                ]
              );
            }}
          >
            <Text style={styles.signOutButtonText}>Sair da conta</Text>
          </TouchableOpacity>
        </>
      )}
      
      <View style={styles.version}>
        <Text style={styles.versionText}>CineScope v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  editButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'center',
  },
  statsButtonText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#f44336',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  version: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
