import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import VendorScreen from './screens/vendor/VendorScreen';
import LoginScreen from './screens/inspector/LoginScreen';
import RatingScreen from './screens/inspector/RatingScreen';
import QRScreen from './screens/inspector/QRScreen';
import VendorRegistrationScreen from './screens/inspector/VendorRegistrationScreen';

export default function App() {
  const [inspectorLoggedIn, setInspectorLoggedIn] = useState(false);
  const [mode, setMode] = useState('vendor');
  const [activeTab, setActiveTab] = useState('rating');

  if (mode === 'vendor') {
    return (
      <View style={{ flex: 1 }}>
        <VendorScreen vendorId="vendor001" />
        <TouchableOpacity style={styles.inspectorBtn} onPress={() => setMode('inspector')}>
          <Text style={styles.inspectorBtnText}>Inspector Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!inspectorLoggedIn) {
    return <LoginScreen onLoginSuccess={() => setInspectorLoggedIn(true)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'rating' && styles.activeTab]} onPress={() => setActiveTab('rating')}>
          <Text style={[styles.tabText, activeTab === 'rating' && styles.activeTabText]}>Audit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'register' && styles.activeTab]} onPress={() => setActiveTab('register')}>
          <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'qr' && styles.activeTab]} onPress={() => setActiveTab('qr')}>
          <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>QR Code</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'rating' && <RatingScreen onLogout={() => { setInspectorLoggedIn(false); setMode('vendor'); }} />}
      {activeTab === 'register' && <VendorRegistrationScreen />}
      {activeTab === 'qr' && <QRScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: '#1A56A0', paddingTop: 48, paddingHorizontal: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#fff' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: '#fff' },
  inspectorBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#1A56A0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  inspectorBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});