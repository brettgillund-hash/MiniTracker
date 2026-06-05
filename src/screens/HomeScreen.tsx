import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Project, ProjectStatus } from '../types';
import { loadProjects, saveProjects } from '../storage';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import TimelineModal from '../components/TimelineModal';
import { fonts } from '../theme/fonts';

const statusOptions: ProjectStatus[] = ['Backlog', 'Planning', 'Painting', 'Completed'];

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [faction, setFaction] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [filterTab, setFilterTab] = useState<ProjectStatus>('Planning');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [timelineProject, setTimelineProject] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      const saved = await loadProjects();
      setProjects(saved);
    }
    load();
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const projectCount = useMemo(() => projects.length, [projects]);
  const statusCounts = useMemo(
    () => ({
      backlog: projects.filter(project => project.status === 'Backlog').length,
      planning: projects.filter(project => project.status === 'Planning').length,
      painting: projects.filter(project => project.status === 'Painting').length,
      completed: projects.filter(project => project.status === 'Completed').length,
    }),
    [projects],
  );

  function addProject() {
    if (!name.trim()) return;

    const newProject: Project = {
      id: `${Date.now()}`,
      name: name.trim(),
      faction: faction.trim() || 'Unknown faction',
      status,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updates: [],
    };

    setProjects([newProject, ...projects]);
    setName('');
    setFaction('');
    setNotes('');
    setStatus('Planning');
  }

  function toggleProjectComplete(id: string) {
    setProjects(prev =>
      prev.map(project =>
        project.id === id
          ? {
              ...project,
              status: project.status === 'Completed' ? 'Planning' : 'Completed',
            }
          : project,
      ),
    );
  }

  function deleteProject(id: string) {
    setProjects(prev => prev.filter(project => project.id !== id));
  }

  function openProject(project: Project) {
    setSelectedProject(project);
  }

  function closeProject() {
    setSelectedProject(null);
  }

  function saveProject(updatedProject: Project) {
    setProjects(prev => prev.map(project => (project.id === updatedProject.id ? updatedProject : project)));
    setSelectedProject(null);
  }

  function openTimeline(project: Project) {
    setTimelineProject(project);
  }

  function closeTimeline() {
    setTimelineProject(null);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Text style={styles.title}>MiniTracker</Text>
        <Text style={styles.subtitle}>Track Warhammer miniature projects, armies, and painting stages.</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>High-end hobby management</Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Project name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Faction or army"
            placeholderTextColor="#94a3b8"
            value={faction}
            onChangeText={setFaction}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes or goals"
            placeholderTextColor="#94a3b8"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
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
          <TouchableOpacity style={styles.addButton} onPress={addProject}>
            <Text style={styles.addButtonText}>Add Project</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{projectCount}</Text>
            <Text style={styles.metricLabel}>Total projects</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{statusCounts.backlog}</Text>
            <Text style={styles.metricLabel}>Backlog</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{statusCounts.painting}</Text>
            <Text style={styles.metricLabel}>In progress</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{statusCounts.completed}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          {statusOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.tab, filterTab === option && styles.tabActive]}
              onPress={() => setFilterTab(option)}
            >
              <Text style={[styles.tabText, filterTab === option && styles.tabTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={projects.filter(p => p.status === filterTab)}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              onToggleComplete={toggleProjectComplete}
              onDelete={deleteProject}
              onEdit={openProject}
              onViewTimeline={openTimeline}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No projects in {filterTab}. Create one above to get started!</Text>}
        />
      </View>
      <ProjectDetailModal
        visible={Boolean(selectedProject)}
        project={selectedProject}
        onClose={closeProject}
        onSave={saveProject}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#070b16',
  },
  title: {
    color: '#f8fafc',
    fontFamily: fonts.bold,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#cbd5e1',
    fontFamily: fonts.regular,
    fontSize: 16,
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0f172a',
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 20,
    elevation: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: fonts.regular,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    minHeight: 86,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 4,
    marginRight: 8,
    backgroundColor: '#0f172a',
  },
  statusButtonActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#1d4ed8',
  },
  statusButtonText: {
    color: '#e2e8f0',
    fontFamily: fonts.medium,
    fontWeight: '700',
    fontSize: 13,
  },
  addButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontFamily: fonts.bold,
    fontWeight: '800',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  metricValue: {
    color: '#f8fafc',
    fontFamily: fonts.bold,
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#94a3b8',
    fontFamily: fonts.regular,
    marginTop: 6,
    fontSize: 12,
  },
  list: {
    paddingBottom: 40,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    color: '#c7d2fe',
    fontFamily: fonts.medium,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  empty: {
    color: '#94a3b8',
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 30,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    color: '#64748b',
    fontFamily: fonts.medium,
    fontWeight: '600',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#f8fafc',
  },
});
