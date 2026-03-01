import React from 'react'; 
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { Provider as PaperProvider } from 'react-native-paper'; 
import { AuthProvider } from './src/context/AuthContext'; 
import { AppNavigator } from './src/navigation';
 
export default function App() { 
  return ( 
    <SafeAreaProvider> 
      <PaperProvider> 
        <AuthProvider> 
          <AppNavigator /> 
        </AuthProvider> 
      </PaperProvider> 
    </SafeAreaProvider> 
  ); 
} 
