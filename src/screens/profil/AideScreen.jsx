import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { CONFIG } from '../../constants/config';
import Logo from '../../components/common/Logo';

const FAQ = [
  {
    question: 'Comment publier une annonce ?',
    answer:
      'Clique sur l\'onglet "Publier" en bas de l\'écran, remplis le formulaire avec le titre, la description, la catégorie et le prix, puis appuie sur "Publier l\'annonce".',
  },
  {
    question: 'Comment contacter un vendeur ?',
    answer:
      'Ouvre le détail d\'une annonce et utilise les boutons "Appeler", "WhatsApp" ou "Message" pour contacter le vendeur directement.',
  },
  {
    question: 'Comment ajouter une annonce en favori ?',
    answer:
      'Ouvre le détail d\'une annonce et clique sur l\'icône ❤️ en haut à droite pour l\'ajouter à tes favoris.',
  },
  {
    question: 'Comment modifier mon profil ?',
    answer:
      'Va dans l\'onglet "Profil" puis clique sur "Modifier le profil" pour changer ton nom, prénom, filière et numéro de téléphone.',
  },
  {
    question: 'Comment supprimer une annonce ?',
    answer:
      'Ouvre le détail de ton annonce et clique sur l\'icône 🗑️ en haut à droite pour la supprimer.',
  },
  {
    question: 'Pourquoi mon numéro de téléphone est important ?',
    answer:
      'Ton numéro permet aux autres étudiants de te contacter directement par appel ou WhatsApp depuis tes annonces.',
  },
];

export default function AideScreen({ navigation }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Aide & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* À propos */}
      <View style={styles.section}>
        <View style={styles.aboutCard}>
          <Logo size={50} showText={false} />
          <Text style={styles.appName}>CampusDeal</Text>
          <Text style={styles.appDesc}>
            Le marché des étudiants de l'INPHB
          </Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nous contacter</Text>
        <View style={styles.contactCard}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:silueabdoulmalick402@gmail.com')}
          >
            <View style={[styles.contactIcon, { backgroundColor: COLORS.primary + '22' }]}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>silueabdoulmalick402@gmail.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.lightGray} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Linking.openURL('whatsapp://send?phone=2250703566098')}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#25D36622' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </View>
            <View>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>+225 07 03 56 60 98</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.lightGray} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        <View style={styles.faqCard}>
          {FAQ.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleFaq(index)}
              >
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Ionicons
                  name={openFaq === index ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
              {openFaq === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
              {index < FAQ.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          CampusDeal © 2025-2026 — INPHB
        </Text>
        <Text style={styles.footerSubText}>
          Projet académique — Tous droits réservés
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  aboutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  appLogo: {
    fontSize: 50,
    marginBottom: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  appDesc: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
    textAlign: 'center',
  },
  versionBadge: {
    backgroundColor: COLORS.primary + '22',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  versionText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 16,
  },
  faqCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
});