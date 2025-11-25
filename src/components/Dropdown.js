import React, {useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP} from '../utils/helpers';

const Dropdown = ({label, options, selectedValue, onValueChange}) => {
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const inputRef = useRef(null);

  const handleSelect = value => {
    onValueChange(value);
    setVisible(false);
  };

  const toggleDropdown = () => {
    if (visible) {
      setVisible(false);
      return;
    }

    inputRef.current?.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
      setVisible(true);
    });
  };

  return (
    <View style={{marginBottom: heightPercentageToDP('2%')}}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        ref={inputRef}
        style={styles.input}
        onPress={toggleDropdown}>
        <Text>{selectedValue || 'Select'}</Text>
      </TouchableOpacity>

      {visible && (
        <View style={[styles.dropdown, {maxHeight: 200}]}>
          <ScrollView>
            {options.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.optionItem}
                onPress={() => handleSelect(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: heightPercentageToDP('1%'),
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  dropdown: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
});

export default Dropdown;
