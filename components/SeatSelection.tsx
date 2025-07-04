import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SeatProps {
  id: string;
  status: 'available' | 'reserved' | 'selected';
}

interface SeatSelectionProps {
  seats: Array<{
    id: string;
    status: 'available' | 'reserved' | 'selected';
    fila: number;
    columna: number;
  }>;
}

const Seat: React.FC<SeatProps> = ({ id, status }) => {
  const getColor = () => {
    switch (status) {
      case 'available':
        return '#F8FAFC';
      case 'reserved':
        return '#FEE2E2';
      case 'selected':
        return '#7B61FF';
      default:
        return '#F8FAFC';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'available':
        return '#E2E8F0';
      case 'reserved':
        return '#FCA5A5';
      case 'selected':
        return '#7B61FF';
      default:
        return '#E2E8F0';
    }
  };

  return (
    <View
      style={[
        styles.seat,
        {
          backgroundColor: getColor(),
          borderColor: getBorderColor(),
        }
      ]}
    >
      <MaterialCommunityIcons 
        name="seat"
        size={35}
        color={status === 'selected' ? '#FFFFFF' : status === 'reserved' ? '#EF4444' : '#64748B'}
      />
      <Text style={[
        styles.seatNumber,
        { color: status === 'selected' ? '#FFFFFF' : '#64748B' }
      ]}>{id}</Text>
    </View>
  );
};

const SeatSelection: React.FC<SeatSelectionProps> = ({ seats }) => {
  // Organizar los asientos en filas de 4 (2 a cada lado del pasillo)
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]} />
          <Text style={styles.legendText}>Disponibles</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]} />
          <Text style={styles.legendText}>No embarcados</Text>
        </View>
      </View>
      <View style={styles.legendRowSingle}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#7B61FF', borderColor: '#7B61FF' }]} />
          <Text style={styles.legendText}>Embarcados</Text>
        </View>
      </View>
      <View style={styles.busLayout}>
        <View style={styles.busFront}>
          <MaterialCommunityIcons name="steering" size={24} color="#64748B" />
          <Text style={styles.frontText}>Frente</Text>
        </View>
        <View style={styles.seatsContainer}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {/* Asientos izquierdos */}
              <View style={styles.sideSeats}>
                {row.slice(0, 2).map((seat) => (
                  <Seat
                    key={seat.id}
                    id={seat.id}
                    status={seat.status}
                  />
                ))}
              </View>
              {/* Pasillo */}
              <View style={styles.aisle} />
              {/* Asientos derechos */}
              <View style={styles.sideSeats}>
                {row.slice(2, 4).map((seat) => (
                  <Seat
                    key={seat.id}
                    id={seat.id}
                    status={seat.status}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'center',
  },
  legendRowSingle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#64748B',
  },
  busLayout: {
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: height * 0.5,
    width: 320,
  },
  busFront: {
    alignItems: 'center',
    marginBottom: 20,
  },
  frontText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  seatsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 18,
    width: '100%',
    justifyContent: 'center',
  },
  sideSeats: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'space-between',
  },
  aisle: {
    width: 64,
  },
  seat: {
    width: 50,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  seatNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default SeatSelection; 