// Sistema de armazenamento de serviços no localStorage
import { Service } from './types';

const STORAGE_KEY = 'booking_services';

export function getServices(): Service[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveServices(services: Service[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  } catch (error) {
    console.error('Erro ao salvar serviços:', error);
  }
}

export function addService(service: Omit<Service, 'id'>): Service {
  const services = getServices();
  const newService: Service = {
    ...service,
    id: Date.now().toString(),
  };
  
  services.push(newService);
  saveServices(services);
  
  return newService;
}

export function updateService(id: string, updates: Partial<Service>): void {
  const services = getServices();
  const index = services.findIndex(s => s.id === id);
  
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    saveServices(services);
  }
}

export function deleteService(id: string): void {
  const services = getServices();
  const filtered = services.filter(s => s.id !== id);
  saveServices(filtered);
}
