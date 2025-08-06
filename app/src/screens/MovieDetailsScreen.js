import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import api from '../services/api';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movieId, fromUserList = false } = route.params || {};
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL base para imagens do TMDb
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    loadMovieDetails();
  }, []);

  const loadMovieDetails = async () => {
    try {
      let response;
      
      // Se o filme for da lista do usuário, busca na API local
      if (fromUserList) {
        response = await api.get(`/movies/${movieId}`);
        setMovie(response.data.movie);
      } 
      // Se for da busca do TMDb, busca detalhes na API do TMDb
      else {
        response = await api.get(`/tmdb/movie/${movieId}`);
        setMovie(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes do filme:', err);
      setError('Não foi possível carregar os detalhes do filme.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = () => {
    if (fromUserList) {
      // Se já está na lista, navega para a tela de edição
      navigation.navigate('EditMovie', { movie });
    } else {
      // Se não está na lista, navega para a tela de adição
      navigation.navigate('AddMovie', { movieData: movie });
    }
  };

  const handleDeleteMovie = () => {
    Alert.alert(
      'Remover filme',
      'Tem certeza que deseja remover este filme da sua lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/movies/${movie.id}`);
              Alert.alert('Sucesso', 'Filme removido com sucesso');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o filme.');
            }
          }
        }
      ]
    );
  };

  // Renderização do estado de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // Renderização do estado de erro
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadMovieDetails}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderização dos detalhes do filme
  return (
    <ScrollView style={styles.container}>
      {/* Header com poster e informações básicas */}
      <View style={styles.header}>
        {movie?.poster_path ? (
          <Image 
            source={{ uri: `${imageBaseUrl}${movie.poster_path}` }} 
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.posterImage, styles.noPosterImage]}>
            <Text style={styles.noPosterText}>Sem imagem</Text>
          </View>
        )}
        
        <View style={styles.overlay}>
          <Text style={styles.title}>{movie?.title}</Text>
          
          {movie?.release_date && (
            <Text style={styles.year}>
              {new Date(movie.release_date).getFullYear()}
            </Text>
          )}
          
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {(movie?.rating || movie?.vote_average)?.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      
      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Informações específicas para filmes da lista do usuário */}
        {fromUserList && (
          <View style={styles.userSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data em que assistiu:</Text>
              <Text style={styles.infoValue}>
                {movie?.watch_date ? new Date(movie.watch_date).toLocaleDateString() : 'Não informado'}
              </Text>
            </View>
            
            {movie?.comment && (
              <View style={styles.commentSection}>
                <Text style={styles.commentLabel}>Sua opinião:</Text>
                <Text style={styles.comment}>{movie.comment}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Informações do filme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.overview}>{movie?.overview || 'Sem sinopse disponível.'}</Text>
        </View>
        
        {/* Gêneros */}
        {movie?.genres && movie.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gêneros</Text>
            <View style={styles.genresContainer}>
              {movie.genres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Tags do usuário (se estiver na lista do usuário) */}
        {fromUserList && movie?.tags && movie.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suas tags</Text>
            <View style={styles.tagsContainer}>
              {movie.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddToList}
          >
            <Text style={styles.primaryButtonText}>
              {fromUserList ? 'Editar informações' : 'Adicionar à minha lista'}
            </Text>
          </TouchableOpacity>
          
          {fromUserList && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteMovie}
            >
              <Text style={styles.deleteButtonText}>Remover da lista</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
  header: {
    position: 'relative',
    height: 250,
  },
  posterImage: {
    width: '100%',
    height: 250,
  },
  noPosterImage: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    fontSize: 18,
    color: '#888',
    fontStyle: 'italic',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  userSection: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  commentSection: {
    marginTop: 8,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  overview: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 13,
    color: '#2196F3',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F4C3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#827717',
  },
  actionButtons: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MovieDetailsScreen;
