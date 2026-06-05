import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { fonts } from '../theme/fonts';

interface ArmyDropdownProps {
  selectedArmy: string;
  onSelect: (army: string) => void;
  armies: readonly string[];
}

export default function ArmyDropdown({ selectedArmy, onSelect, armies }: ArmyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsOpen(true)}>
        <Text style={styles.dropdownText}>{selectedArmy || 'Select an army'}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="fade" transparent>
        <TouchableOpacity style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdown}>
            <ScrollView bounces={false}>
              {armies.map(army => (
                <TouchableOpacity
                  key={army}
                  style={[styles.option, selectedArmy === army && styles.optionActive]}
                  onPress={() => {
                    onSelect(army);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, selectedArmy === army && styles.optionTextActive]}>
                    {army}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#f8fafc',
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  dropdownIcon: {
    color: '#94a3b8',
    fontSize: 10,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  dropdown: {
    backgroundColor: '#111827',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    maxHeight: '60%',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  optionActive: {
    backgroundColor: '#1f2937',
  },
  optionText: {
    color: '#cbd5e1',
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  optionTextActive: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
});
