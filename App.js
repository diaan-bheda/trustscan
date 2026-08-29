import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import VendorScreen from './screens/vendor/VendorScreen';
import LoginScreen from './screens/inspector/LoginScreen';
import RatingScreen from './screens/inspector/RatingScreen';
import QRScreen from './screens/inspector/QRScreen';

export default function App() {
  const [inspectorLoggedIn, setInspectorLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('rating');
  const [mode] = useState('inspector');

  if (mode === 'inspector') {
    if (!inspectorLoggedIn) {
      return <LoginScreen onLoginSuccess={() => setInspectorLoggedIn(true)} />;
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rating' && styles.activeTab]}
            onPress={() => setActiveTab('rating')}
          >
            <Text style={[styles.tabText, activeTab === 'rating' && styles.activeTabText]}>
              Audit Form
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'qr' && styles.activeTab]}
            onPress={() => setActiveTab('qr')}
          >
            <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>
              QR Generator
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'rating'
          ? <RatingScreen onLogout={() => setInspectorLoggedIn(false)} />
          : <QRScreen />
        }
      </View>
    );
  }

  return <VendorScreen vendorId="vendor001" />;
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1A56A0',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  tab: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderBottomWidth: 3, borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: '#fff' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: '#fff' },
});