// Tipos do sistema de agendamentos

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
  active: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// Status dos pedidos
export type OrderStatus = 'awaiting' | 'in_progress' | 'completed';

export interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  // Dados do cliente
  clientName: string;
  clientBirthDate: string;
  clientCPF: string;
  clientMotherName: string;
  clientFatherName?: string;
  preferredLocation: string;
  clientWhatsApp: string;
  observations?: string;
  // Dados administrativos
  status: OrderStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  clientName: string;
  clientWhatsApp: string;
  // Novos campos para documentos públicos
  clientBirthDate: string;
  clientCPF: string;
  clientMotherName: string;
  clientFatherName?: string;
  preferredLocation: string;
  observations?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface BusinessHours {
  dayOfWeek: number; // 0-6 (domingo-sábado)
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface BlockedSlot {
  id: string;
  date: string;
  time: string;
  reason?: string;
}

// Dados do formulário de documentos públicos
export interface DocumentBookingData {
  name: string;
  birthDate: string;
  cpf: string;
  motherName: string;
  fatherName?: string;
  preferredLocation: string;
  whatsapp: string;
  observations?: string;
}
