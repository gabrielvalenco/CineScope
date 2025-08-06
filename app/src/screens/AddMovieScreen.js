import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../services/api';

const AddMovieScreen = ({ route, navigation }) => {
  // Recupera dados do filme da tela anterior, se disponíveis
  const { movieData } = route.params || {};
  
  // Estados para formulário
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: movieData?.title || '',
    tmdb_id: movieData?.id || null,
    rating: '',
    comment: '',
    watch_date: new Date(),
    poster_path: movieData?.poster_path || null,
    tags: [],
  });
  
  // Estado para nova tag sendo digitada
  const [newTag, setNewTag] = useState('');
  
  // Estado para controle do datepicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // URL base para imagens do TMDb
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  // Função para lidar com mudança de data
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.watch_date;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, watch_date: currentDate });
  };

  // Função para adicionar tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Função para remover tag
  const removeTag = (index) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData({ ...formData, tags: updatedTags });
  };

  // Função para salvar o filme
  const handleSaveMovie = async () => {
    // Validação básica
    if (!formData.title) {
      Alert.alert('Erro', 'O título do filme é obrigatório');
      return;
    }

    if (!formData.rating || isNaN(formData.rating) || 
        Number(formData.rating) < 0 || Number(formData.rating) > 10) {
      Alert.alert('Erro', 'Informe uma nota válida entre 0 e 10');
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio
      const movieToSave = {
        ...formData,
        rating: Number(formData.rating),
        // Garantir que a data seja enviada no formato ISO
        watch_date: formData.watch_date.toISOString().split('T')[0],
      };

      // Enviar para a API
      const response = await api.post('/movies', movieToSave);

      Alert.alert(
        'Sucesso', 
        'Filme adicionado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
      Alert.alert(
        'Erro', 
        'Não foi possível adicionar o filme. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adicionar Filme</Text>
      </View>

      <View style={styles.form}>
        {/* Poster do filme */}
        {formData.poster_path ? (
          <Image 
            source={{ uri: `${imageBaseUrl}${formData.poster_path}` }} 
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.poster, styles.noPoster]}>
            <Text style={styles.noPosterText}>Sem imagem</Text>
          </View>
        )}

        {/* Título do filme */}
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholder="Título do filme"
        />

        {/* Nota */}
        <Text style={styles.label}>Nota (0-10)</Text>
        <TextInput
          style={styles.input}
          value={formData.rating}
          onChangeText={(text) => setFormData({ ...formData, rating: text })}
          placeholder="Sua nota de 0 a 10"
          keyboardType="numeric"
          maxLength={4} // Para permitir notas com casas decimais, como "8.5"
        />

        {/* Data em que assistiu */}
        <Text style={styles.label}>Data em que assistiu</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>
            {formData.watch_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.watch_date}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()} // Não permitir datas futuras
          />
        )}

        {/* Comentário */}
        <Text style={styles.label}>Comentário (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.comment}
          onChangeText={(text) => setFormData({ ...formData, comment: text })}
          placeholder="Seu comentário sobre o filme"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Tags */}
        <Text style={styles.label}>Tags (opcional)</Text>
        <View style={styles.tagInputContainer}>
          <TextInput
            style={styles.tagInput}
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Adicionar tag"
          />
          <TouchableOpacity 
            style={styles.addTagButton}
            onPress={addTag}
          >
            <Text style={styles.addTagButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de tags adicionadas */}
        {formData.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity 
                  style={styles.removeTagButton}
                  onPress={() => removeTag(index)}
                >
                  <Text style={styles.removeTagButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveMovie}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  poster: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  noPoster: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: '#888',
    fontStyle: 'italic',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
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
  dateInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  addTagButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4C3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#827717',
    marginRight: 4,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#827717',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTagButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddMovieScreen;
