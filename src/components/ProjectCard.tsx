import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Project } from '../types';
import { fonts } from '../theme/fonts';

interface ProjectCardProps {
  project: Project;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
  onViewTimeline: (project: Project) => void;
}

export default function ProjectCard({ project, onToggleComplete, onDelete, onEdit, onViewTimeline }: ProjectCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.subtitle}>{project.faction}</Text>
        </View>
        <View style={[styles.statusBadge, project.status === 'Completed' ? styles.statusCompleted : project.status === 'Painting' ? styles.statusPainting : project.status === 'Planning' ? styles.statusPlanning : styles.statusBacklog]}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>
      {project.imageUri ? <Image source={{ uri: project.imageUri }} style={styles.image} /> : null}
      <Text style={styles.notes}>{project.notes || 'No notes yet.'}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.lightButton} onPress={() => onEdit(project)}>
          <Text style={styles.lightButtonText}>Add Note/Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onToggleComplete(project.id)}>
          <Text style={styles.buttonText}>{project.status === 'Completed' ? 'Reopen' : 'Complete'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.lightButton, styles.delete]} onPress={() => onDelete(project.id)}>
          <Text style={styles.lightButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.updateBar} onPress={() => onViewTimeline(project)}>
        <Text style={styles.updateBarText}>📋 {project.updates?.length || 0} update{project.updates?.length !== 1 ? 's' : ''}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: '#f8fafc',
    fontFamily: fonts.bold,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94a3b8',
    fontFamily: fonts.regular,
    fontSize: 13,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: '#f8fafc',
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 11,
  },
  statusCompleted: {
    backgroundColor: '#16a34a',
  },
  statusPainting: {
    backgroundColor: '#7c3aed',
  },
  statusPlanning: {
    backgroundColor: '#2563eb',
  },
  statusBacklog: {
    backgroundColor: '#475569',
  },
  image: {
    width: '100%',
    height: 170,
    borderRadius: 18,
    marginBottom: 14,
  },
  notes: {
    color: '#dbeafe',
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  lightButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  delete: {
    backgroundColor: '#1f2937',
    borderColor: '#7f1d1d',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: fonts.medium,
    fontWeight: '700',
  },
  lightButtonText: {
    color: '#cbd5e1',
    fontFamily: fonts.medium,
    fontWeight: '700',
  },
  updateBar: {
    marginHorizontal: -18,
    marginBottom: -18,
    marginTop: 12,
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  updateBarText: {
    color: '#94a3b8',
    fontFamily: fonts.regular,
    fontSize: 12,
    fontWeight: '600',
  },
});
