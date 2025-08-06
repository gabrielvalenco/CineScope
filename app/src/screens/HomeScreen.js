import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MovieCard = ({ movie, onPress }) => {
  // URL base para imagens do TMDb
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {movie.poster_path ? (
        <Image 
          source={{ uri: `${imageBaseUrl}${movie.poster_path}` }} 
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>Sem imagem</Text>
        </View>
      )}
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {movie.rating}/10</Text>
        </View>
        
        {movie.watch_date && (
          <Text style={styles.date}>
            Assistido em: {new Date(movie.watch_date).toLocaleDateString()}
          </Text>
        )}
        
        {movie.tags && movie.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {movie.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {movie.tags.length > 3 && (
              <Text style={styles.moreTag}>+{movie.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Função para carregar os filmes do usuário
  const loadMovies = async () => {
    setError(null);
    try {
      const response = await api.get('/movies');
      setMovies(response.data.movies || []);
    } catch (err) {
      console.error('Erro ao carregar filmes:', err);
      setError('Não foi possível carregar seus filmes. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar filmes quando a tela for montada
  useEffect(() => {
    loadMovies();
  }, []);

  // Função para atualizar a lista de filmes
  const handleRefresh = () => {
    setRefreshing(true);
    loadMovies();
  };

  // Função para navegar para detalhes do filme
  const handleMoviePress = (movie) => {
    // Futuramente navegaremos para a tela de detalhes do filme
    // navigation.navigate('MovieDetails', { movie });
    Alert.alert('Filme selecionado', `Você selecionou: ${movie.title}`);
  };

  // Função para adicionar um novo filme
  const handleAddMovie = () => {
    // Futuramente navegaremos para a tela de adicionar filme
    // navigation.navigate('AddMovie');
    Alert.alert('Adicionar filme', 'Esta funcionalidade será implementada em breve.');
  };

  // Renderizar tela de carregamento
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seu Diário de Filmes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMovie}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadMovies}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Você ainda não adicionou nenhum filme.
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAddMovie}
          >
            <Text style={styles.emptyButtonText}>Adicionar seu primeiro filme</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard 
              movie={item} 
              onPress={() => handleMoviePress(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#2196F3']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 12,
  },
  card: {
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
    width: 80,
    height: 120,
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
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#2196F3',
  },
  moreTag: {
    fontSize: 11,
    color: '#666',
    paddingVertical: 2,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
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
});

export default HomeScreen;
