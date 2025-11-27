// Dados mock para desenvolvimento - substituir por banco de dados real
import { Service, BusinessHours, Booking, BlockedSlot } from './types';

// Serviços começam vazios - gerenciados pelo painel admin
export const mockServices: Service[] = [];

export const mockBusinessHours: BusinessHours[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', active: true }, // Segunda
  { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', active: true }, // Terça
  { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', active: true }, // Quarta
  { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', active: true }, // Quinta
  { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', active: true }, // Sexta
  { dayOfWeek: 6, startTime: '09:00', endTime: '14:00', active: true }, // Sábado
  { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', active: false }, // Domingo
];

export const mockBookings: Booking[] = [];
export const mockBlockedSlots: BlockedSlot[] = [];

// Funções auxiliares
export function generateTimeSlots(
  date: Date,
  serviceDuration: number,
  businessHours: BusinessHours[],
  bookings: Booking[],
  blockedSlots: BlockedSlot[]
) {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split('T')[0];
  
  const hours = businessHours.find(h => h.dayOfWeek === dayOfWeek);
  if (!hours || !hours.active) return [];

  const slots = [];
  const [startHour, startMin] = hours.startTime.split(':').map(Number);
  const [endHour, endMin] = hours.endTime.split(':').map(Number);
  
  let currentTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  while (currentTime + serviceDuration <= endTime) {
    const hour = Math.floor(currentTime / 60);
    const min = currentTime % 60;
    const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    
    // Verificar se está ocupado
    const isBooked = bookings.some(
      b => b.date === dateStr && b.time === timeStr && b.status !== 'cancelled'
    );
    const isBlocked = blockedSlots.some(
      b => b.date === dateStr && b.time === timeStr
    );

    slots.push({
      time: timeStr,
      available: !isBooked && !isBlocked,
    });

    currentTime += 30; // Intervalos de 30 minutos
  }

  return slots;
}
