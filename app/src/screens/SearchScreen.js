import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  ActivityIndicator,
  Alert
} from 'react-native';
import api from '../services/api';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // URL base para imagens do TMDb
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  // Função para buscar filmes
  const searchMovies = async () => {
    if (!query.trim()) {
      Alert.alert('Erro', 'Digite um termo para buscar');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await api.get('/tmdb/search', {
        params: { query: query.trim() }
      });
      
      setMovies(response.data.results || []);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Não foi possível buscar filmes. Tente novamente.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar filme à lista do usuário
  const addMovie = (movie) => {
    // Futuramente, implementaremos a navegação para a tela de adicionar filme
    // navigation.navigate('AddMovie', { movieData: movie });
    Alert.alert(
      'Adicionar à sua lista', 
      `Deseja adicionar "${movie.title}" à sua lista de filmes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Adicionar', 
          onPress: () => Alert.alert('Sucesso', 'Esta funcionalidade será implementada em breve.') 
        }
      ]
    );
  };

  // Renderizar item da lista
  const renderMovieItem = ({ item }) => (
    <View style={styles.movieCard}>
      {item.poster_path ? (
        <Image 
          source={{ uri: `${imageBaseUrl}${item.poster_path}` }} 
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        
        {item.release_date && (
          <Text style={styles.releaseDate}>
            {new Date(item.release_date).getFullYear()}
          </Text>
        )}
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.vote_average.toFixed(1)}</Text>
        </View>
        
        <Text style={styles.overview} numberOfLines={2}>
          {item.overview || 'Sem descrição disponível.'}
        </Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => addMovie(item)}
        >
          <Text style={styles.addButtonText}>+ Adicionar à minha lista</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filmes..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={searchMovies}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={searchMovies}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={searchMovies}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : searched && movies.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.noResultsText}>Nenhum filme encontrado para "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            searched && movies.length > 0 ? (
              <Text style={styles.resultsHeader}>
                Resultados para "{query}"
              </Text>
            ) : null
          }
        />
      )}

      {!searched && !loading && (
        <View style={styles.initialState}>
          <Text style={styles.initialText}>
            Busque por filmes para adicionar à sua coleção
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 12,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  poster: {
    width: 100,
    height: 150,
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
  movieInfo: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  overview: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen;
