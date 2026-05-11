import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';

type Tab = 'guest' | 'photographer';

const GUEST_STEPS = [
  {
    icon: 'qr-code-scanner' as const,
    title: 'QR-Code scannen',
    body: 'Oeffne WedO und tippe auf "QR-Code scannen". Halte die Kamera auf den QR-Code, den der Fotograf aufgestellt hat.',
  },
  {
    icon: 'photo-camera' as const,
    title: 'Fotos aufnehmen',
    body: 'Die Kamera oeffnet sich automatisch. Fotografiere Momente, die dir wichtig sind – so viele du moechtest.',
  },
  {
    icon: 'cloud-upload' as const,
    title: 'Automatisch hochladen',
    body: 'Jedes Foto wird sofort lokal gespeichert und in die Galerie des Brautpaars hochgeladen. Keine weitere Aktion noetig.',
  },
  {
    icon: 'favorite' as const,
    title: 'Fertig!',
    body: 'Der Fotograf und das Brautpaar sehen deine Bilder in Echtzeit. Du musst nichts weiteres tun – danke fuers Mitmachen!',
  },
];

const PHOTOGRAPHER_STEPS = [
  {
    icon: 'login' as const,
    title: 'Anmelden oder registrieren',
    body: 'Tippe auf "Du bist der Fotograf? Hier einloggen". Erstelle ein Konto mit deiner E-Mail und einem Passwort.',
  },
  {
    icon: 'add-circle-outline' as const,
    title: 'Event anlegen',
    body: 'Im Dashboard auf "Neues Event" tippen. Trage den Namen des Brautpaars, Datum und Location ein und bestaetige mit "Event anlegen".',
  },
  {
    icon: 'qr-code' as const,
    title: 'QR-Code teilen',
    body: 'Oeffne das Event und tippe auf "Einladung teilen". Drucke den QR-Code aus oder zeige ihn auf einem Display – Gaeste scannen ihn direkt.',
  },
  {
    icon: 'photo-library' as const,
    title: 'Galerie verwalten',
    body: 'Alle Gastfotos erscheinen automatisch im Event. Tippe lange auf ein Foto zum Loeschen. Pull-to-refresh aktualisiert die Ansicht.',
  },
  {
    icon: 'share' as const,
    title: 'Einladungen verschicken',
    body: 'Im Event-Detail auf das Teilen-Symbol oben rechts tippen. Sende den Direktlink per WhatsApp, SMS oder E-Mail an einzelne Gaeste.',
  },
];

export default function InstructionsScreen() {
  const nav = useNavigation();
  const { palette, typography } = useTheme();
  const [tab, setTab] = useState<Tab>('guest');

  const steps = tab === 'guest' ? GUEST_STEPS : PHOTOGRAPHER_STEPS;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zurueck"
          hitSlop={8}
          onPress={() => nav.goBack()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={palette.primary} />
        </Pressable>
        <Text style={[styles.logo, typography.heading, { color: palette.primary }]}>WedO</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, typography.display, { color: palette.primary }]}>
          Wie funktionierts?
        </Text>
        <Text style={[styles.sub, typography.body, { color: palette.muted }]}>
          WedO verbindet Gaeste und Fotografen in einer gemeinsamen Galerie.
        </Text>

        <View style={[styles.tabRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          {(['guest', 'photographer'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t }}
              onPress={() => setTab(t)}
              style={[
                styles.tabBtn,
                tab === t && { backgroundColor: palette.accent },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: tab === t ? '#fff' : palette.muted },
                ]}
              >
                {t === 'guest' ? 'Als Gast' : 'Als Fotograf'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.steps}>
          {steps.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={[styles.stepLeft]}>
                <View style={[styles.stepNum, { backgroundColor: palette.accent }]}>
                  <Text style={styles.stepNumText}>{index + 1}</Text>
                </View>
                {index < steps.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: palette.border }]} />
                )}
              </View>
              <View style={[styles.stepCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <View style={styles.stepHeader}>
                  <MaterialIcons name={step.icon} size={20} color={palette.accent} />
                  <Text style={[styles.stepTitle, typography.subheading, { color: palette.primary }]}>
                    {step.title}
                  </Text>
                </View>
                <Text style={[styles.stepBody, typography.body, { color: palette.muted }]}>
                  {step.body}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.tipBox, { backgroundColor: palette.surfaceSoft, borderColor: palette.border }]}>
          <MaterialIcons name="lightbulb-outline" size={20} color={palette.accent} />
          <Text style={[styles.tipText, typography.body, { color: palette.muted }]}>
            {tab === 'guest'
              ? 'Tipp: Schalte WLAN ein, bevor du QR-Codes scannst – dann laden Fotos schneller hoch.'
              : 'Tipp: Drucke den QR-Code aus und stelle ihn am Eingang auf, damit alle Gaeste ihre Fotos sofort teilen koennen.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  backBtn: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  logo: {
    fontSize: 24,
    lineHeight: 30,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 38,
    lineHeight: 46,
    marginTop: 16,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 6,
  },
  tabRow: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 28,
    padding: 4,
  },
  tabBtn: {
    borderRadius: 10,
    flex: 1,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  steps: {
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stepLeft: {
    alignItems: 'center',
    width: 36,
  },
  stepNum: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  stepNumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  stepLine: {
    flex: 1,
    marginBottom: -12,
    marginTop: 4,
    width: 2,
  },
  stepCard: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    padding: 14,
  },
  stepHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  stepTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
  },
  stepBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  tipBox: {
    alignItems: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    padding: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
