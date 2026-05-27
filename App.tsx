import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AppMenu, MenuAppItem } from './src/components/AppMenu';
import { FloatingBackButton } from './src/components/FloatingBackButton';
import { PlaceholderScreen } from './src/components/PlaceholderScreen';
import { ImcScreen } from './src/apps/imc';
import { PedidosScreen } from './src/apps/pedidos';
import { CurrencyConverterScreen } from './src/apps/conversor';
import { SolarSystemScreen } from './src/apps/sistema-solar';
import { AccountScreen, LoginScreen, RegisterScreen } from './src/apps/auth';
import { initDb, UserRecord, getUserById, setSessionKey, getSessionKey, clearSessionKey } from './src/storage/db';

type ScreenId =
  | 'login'
  | 'register'
  | 'account'
  | 'menu'
  | 'imc'
  | 'moedas'
  | 'sistema-solar'
  | 'pedidos';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('login');
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDb()
      .then(async () => {
        // try to restore session
        try {
          const raw = await getSessionKey('currentUserId');
          if (raw) {
            const id = Number(raw);
            if (!Number.isNaN(id)) {
              const u = await getUserById(id);
              if (u) {
                setCurrentUser(u);
                // if we restored a user while still on the login/register screen,
                // switch to the menu so the user sees the apps list
                setCurrentScreen((prev) => (prev === 'login' || prev === 'register' ? 'menu' : prev));
              }
            }
          }
        } catch (err) {
          // ignore
        }
        setDbReady(true);
      })
      .catch(() => setDbReady(true));
  }, []);

  const appItems: MenuAppItem[] = [
    {
      id: 'imc',
      title: 'Calculadora de IMC',
      description: 'Calcule o IMC com base em peso e altura.',
      status: 'ready',
      accent: '#22c55e',
    },
    {
      id: 'moedas',
      title: 'Conversor de Moedas',
      description: 'Converta valores entre moedas rapidamente.',
      status: 'ready',
      accent: '#38bdf8',
    },
    {
      id: 'sistema-solar',
      title: 'Sistema Solar',
      description: 'Explore planetas e curiosidades do nosso sistema.',
      status: 'ready',
      accent: '#f59e0b',
    },
    {
      id: 'pedidos',
      title: 'Pedidos',
      description: 'Monte seu pedido com prato e bebida.',
      status: 'ready',
      accent: '#f97316',
    },
  ];

  if (!dbReady) {
    return (
      <View style={{ flex: 1 }}>
        <PlaceholderScreen title="Carregando banco..." onBack={() => null} />
      </View>
    );
  }

  if (!currentUser) {
    if (currentScreen === 'register') {
      return (
        <RegisterScreen
          onRegister={(user) => {
              setCurrentUser(user);
              setSessionKey('currentUserId', String(user.id)).catch(() => null);
              setCurrentScreen('menu');
          }}
          onGoLogin={() => setCurrentScreen('login')}
        />
      );
    }

    return (
      <LoginScreen
        onLogin={(user) => {
          setCurrentUser(user);
          setSessionKey('currentUserId', String(user.id)).catch(() => null);
          setCurrentScreen('menu');
        }}
        onGoRegister={() => setCurrentScreen('register')}
      />
    );
  }

  if (currentScreen === 'account') {
    return (
      <AccountScreen
        user={currentUser}
        onSave={(user) => {
          setCurrentUser(user);
          setCurrentScreen('menu');
        }}
        onBack={() => setCurrentScreen('menu')}
      />
    );
  }

  if (currentScreen === 'menu') {
    return (
      <AppMenu
        items={appItems}
        onSelect={(id) => setCurrentScreen(id as ScreenId)}
        userName={currentUser?.name}
        onAccount={() => setCurrentScreen('account')}
        onLogout={() => {
          setCurrentUser(null);
          clearSessionKey('currentUserId').catch(() => null);
          setCurrentScreen('login');
        }}
      />
    );
  }

  if (currentScreen === 'pedidos') {
    return (
      <PedidosScreen
        onBack={() => setCurrentScreen('menu')}
        userId={currentUser.id}
      />
    );
  }

  if (currentScreen === 'imc') {
    return (
      <View style={{ flex: 1 }}>
        <ImcScreen userId={currentUser.id} />
        <FloatingBackButton onPress={() => setCurrentScreen('menu')} />
      </View>
    );
  }

  if (currentScreen === 'moedas') {
    return (
      <View style={{ flex: 1 }}>
        <CurrencyConverterScreen />
        <FloatingBackButton onPress={() => setCurrentScreen('menu')} />
      </View>
    );
  }

  if (currentScreen === 'sistema-solar') {
    return (
      <View style={{ flex: 1 }}>
        <SolarSystemScreen />
        <FloatingBackButton onPress={() => setCurrentScreen('menu')} />
      </View>
    );
  }

  const screenTitleMap: Record<Exclude<ScreenId, 'menu' | 'pedidos'>, string> = {
    imc: 'Calculadora de IMC',
    moedas: 'Conversor de Moedas',
    'sistema-solar': 'Sistema Solar',
  };

  return (
    <PlaceholderScreen
      title={screenTitleMap[currentScreen]}
      onBack={() => setCurrentScreen('menu')}
    />
  );
}