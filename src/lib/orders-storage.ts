// Sistema de armazenamento de pedidos (localStorage)
import { Order, OrderStatus } from './types';

const STORAGE_KEY = 'orders';

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find(order => order.id === id) || null;
}

export function addOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    status: 'awaiting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

export function updateOrderNotes(id: string, adminNotes: string): void {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    orders[index].adminNotes = adminNotes;
    orders[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

export function deleteOrder(id: string): void {
  const orders = getOrders();
  const filtered = orders.filter(order => order.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Funções auxiliares
export function getStatusLabel(status: OrderStatus): string {
  const labels = {
    awaiting: 'Aguardando agendamento',
    in_progress: 'Em andamento',
    completed: 'Concluído',
  };
  return labels[status];
}

export function getStatusColor(status: OrderStatus): string {
  const colors = {
    awaiting: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-300',
    completed: 'bg-green-100 text-green-700 border-green-300',
  };
  return colors[status];
}

export function formatWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
