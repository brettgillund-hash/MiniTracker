import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Project, ProjectUpdate } from '../types';
import { fonts } from '../theme/fonts';

interface TimelineModalProps {
  visible: boolean;
  project: Project | null;
  onClose: () => void;
}

export default function TimelineModal({ visible, project, onClose }: TimelineModalProps) {
  if (!project) return null;

  const sortedUpdates = [...project.updates].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Updates • {project.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.timeline}>
            {sortedUpdates.length === 0 ? (
              <Text style={styles.emptyText}>No updates yet. Add notes or photos to track progress.</Text>
            ) : (
              sortedUpdates.map((update, index) => (
                <View key={update.id} style={styles.updateItem}>
                  <View style={styles.timelineMarker}>
                    <View style={styles.dot} />
                    {index < sortedUpdates.length - 1 && <View style={styles.line} />}
                  </View>
                  <View style={styles.updateContent}>
                    <View style={styles.updateHeader}>
                      <View style={[styles.badge, update.type === 'image' ? styles.badgeImage : styles.badgeNote]}>
                        <Text style={styles.badgeText}>{update.type === 'image' ? '🖼️ Photo' : '📝 Note'}</Text>
                      </View>
                      <Text style={styles.timestamp}>{formatDate(update.timestamp)}</Text>
                    </View>
                    {update.type === 'image' ? (
                      <Image source={{ uri: update.content }} style={styles.updateImage} />
                    ) : (
                      <Text style={styles.updateText}>{update.content}</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.92)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderRadius: 26,
    padding: 0,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  headerText: {
    color: '#f8fafc',
    fontFamily: fonts.bold,
    fontSize: 20,
    fontWeight: '800',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeline: {
    padding: 22,
  },
  emptyText: {
    color: '#94a3b8',
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  updateItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8b5cf6',
    marginTop: 2,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#334155',
    marginTop: 8,
  },
  updateContent: {
    flex: 1,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeNote: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  badgeImage: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  badgeText: {
    color: '#dbeafe',
    fontFamily: fonts.medium,
    fontWeight: '600',
    fontSize: 11,
  },
  timestamp: {
    color: '#64748b',
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  updateImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  updateText: {
    color: '#cbd5e1',
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
