import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Project, ProjectStatus } from '../types';
import { fonts } from '../theme/fonts';

interface ProjectDetailModalProps {
  visible: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const statusOptions: ProjectStatus[] = ['Backlog', 'Planning', 'Painting', 'Completed'];

export default function ProjectDetailModal({ visible, project, onClose, onSave }: ProjectDetailModalProps) {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (project) {
      setNotes(project.notes);
      setStatus(project.status);
      setImageUri(project.imageUri);
    }
  }, [project]);

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  function saveChanges() {
    if (!project) return;

    const updatedProject = {
      ...project,
      notes: notes.trim(),
      status,
      imageUri,
      updates: [...(project.updates || [])],
    };

    // Track note update if it changed
    if (notes.trim() && notes.trim() !== project.notes) {
      updatedProject.updates.push({
        id: `${Date.now()}-note`,
        type: 'note' as const,
        content: notes.trim(),
        timestamp: new Date().toISOString(),
      });
    }

    // Track image update if it changed
    if (imageUri && imageUri !== project.imageUri) {
      updatedProject.updates.push({
        id: `${Date.now()}-image`,
        type: 'image' as const,
        content: imageUri,
        timestamp: new Date().toISOString(),
      });
    }

    onSave(updatedProject);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>Project details</Text>
          <ScrollView>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[styles.statusButton, status === option && styles.statusButtonActive]}
                  onPress={() => setStatus(option)}
                >
                  <Text style={styles.statusButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Write goals, paint steps, or army notes"
              placeholderTextColor="#94a3b8"
            />
            <Text style={styles.label}>Photo</Text>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <Text style={styles.noImage}>No photo attached.</Text>}
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onClose}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={saveChanges}>
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </View>
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
    padding: 22,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  header: {
    color: '#f8fafc',
    fontFamily: fonts.bold,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontFamily: fonts.medium,
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#0f172a',
  },
  statusButtonActive: {
    borderColor: '#8b5cf6',
    backgroundColor: '#312e81',
  },
  statusButtonText: {
    color: '#e2e8f0',
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#111827',
    color: '#f8fafc',
    fontFamily: fonts.regular,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  image: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    marginBottom: 12,
  },
  noImage: {
    color: '#94a3b8',
    fontFamily: fonts.regular,
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 22,
  },
  photoButtonText: {
    color: '#ffffff',
    fontFamily: fonts.bold,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
  },
  actionText: {
    color: '#ffffff',
    fontFamily: fonts.medium,
    fontWeight: '700',
  },
});
