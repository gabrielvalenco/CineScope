import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Telas de autenticação
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Telas principais
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Telas de detalhes e adição de filmes
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import AddMovieScreen from '../screens/AddMovieScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Navegador para as telas de autenticação
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Stack para a tab Home
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen 
      name="HomeScreen" 
      component={HomeScreen} 
      options={{ title: "Meus Filmes" }}
    />
    <HomeStack.Screen 
      name="MovieDetails" 
      component={MovieDetailsScreen} 
      options={{ title: "Detalhes do Filme" }}
    />
    <HomeStack.Screen 
      name="AddMovie" 
      component={AddMovieScreen} 
      options={{ title: "Adicionar Filme" }}
    />
  </HomeStack.Navigator>
);

// Stack para a tab Search
const SearchStackNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen 
      name="SearchScreen" 
      component={SearchScreen} 
      options={{ title: "Buscar Filmes" }}
    />
    <SearchStack.Screen 
      name="MovieDetails" 
      component={MovieDetailsScreen} 
      options={{ title: "Detalhes do Filme" }}
    />
    <SearchStack.Screen 
      name="AddMovie" 
      component={AddMovieScreen} 
      options={{ title: "Adicionar Filme" }}
    />
  </SearchStack.Navigator>
);

// Stack para a tab Profile
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
      name="ProfileScreen" 
      component={ProfileScreen} 
      options={{ title: "Meu Perfil" }}
    />
  </ProfileStack.Navigator>
);

// Navegador para as telas principais do app (com tabs)
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: 'gray',
      headerShown: false
    })}
  >
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Search" component={SearchStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} />
  </Tab.Navigator>
);

// Navegador principal que decide qual fluxo mostrar
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  // Enquanto verifica se o usuário está logado, pode mostrar uma tela de loading
  if (isLoading) {
    return null; // ou um componente de loading
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
