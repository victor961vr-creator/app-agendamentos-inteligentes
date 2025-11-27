'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  MessageCircle, 
  CheckCircle, 
  Clock,
  Filter,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { 
  getOrders, 
  updateOrderStatus, 
  getStatusLabel, 
  getStatusColor,
  formatWhatsAppLink,
  formatCPF,
  formatPhone,
  formatDate,
} from '@/lib/orders-storage';
import { getServices } from '@/lib/services-storage';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, filterService, filterStatus]);

  const loadData = () => {
    const loadedOrders = getOrders();
    const loadedServices = getServices();
    setOrders(loadedOrders);
    setServices(loadedServices);
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.clientName.toLowerCase().includes(term) ||
        order.clientCPF.includes(term) ||
        order.clientWhatsApp.includes(term)
      );
    }

    // Filtro de serviço
    if (filterService !== 'all') {
      filtered = filtered.filter(order => order.serviceId === filterService);
    }

    // Filtro de status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadData();
    toast.success('Status atualizado com sucesso!');
  };

  const handleWhatsAppMessage = (order: Order) => {
    const message = `Olá ${order.clientName}, estou com o seu pedido de ${order.serviceName}. Já estamos processando. Aguarde nosso retorno!`;
    const link = formatWhatsAppLink(order.clientWhatsApp, message);
    window.open(link, '_blank');
  };

  const getStatusBadge = (status: OrderStatus) => {
    const label = getStatusLabel(status);
    const color = getStatusColor(status);
    return (
      <Badge className={`${color} border`}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerencie todos os pedidos recebidos
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pedidos Recebidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Busca */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome, CPF ou telefone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro de Serviço */}
              <div className="space-y-2">
                <Label htmlFor="filterService">Filtrar por Serviço</Label>
                <Select value={filterService} onValueChange={setFilterService}>
                  <SelectTrigger id="filterService">
                    <SelectValue placeholder="Todos os serviços" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os serviços</SelectItem>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de Status */}
              <div className="space-y-2">
                <Label htmlFor="filterStatus">Filtrar por Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filterStatus">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="awaiting">Aguardando agendamento</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabela de Pedidos */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterService !== 'all' || filterStatus !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Aguardando novos pedidos'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">CPF</TableHead>
                      <TableHead className="hidden lg:table-cell">WhatsApp</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead className="hidden xl:table-cell">Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.clientName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatCPF(order.clientCPF)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <a
                            href={formatWhatsAppLink(order.clientWhatsApp, '')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {formatPhone(order.clientWhatsApp)}
                          </a>
                        </TableCell>
                        <TableCell>{order.serviceName}</TableCell>
                        <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {/* Visualizar */}
                            <Link href={`/admin/pedido/${order.id}`}>
                              <Button variant="outline" size="sm" title="Visualizar pedido">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>

                            {/* WhatsApp */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWhatsAppMessage(order)}
                              title="Enviar mensagem no WhatsApp"
                              className="text-green-600 hover:text-green-700"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>

                            {/* Marcar como concluído */}
                            {order.status !== 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                title="Marcar como concluído"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Atualizar status */}
                            {order.status === 'awaiting' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, 'in_progress')}
                                title="Marcar como em andamento"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total de Pedidos</p>
                    <p className="text-3xl font-bold">{orders.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Aguardando</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {orders.filter(o => o.status === 'awaiting').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Concluídos</p>
                    <p className="text-3xl font-bold text-green-600">
                      {orders.filter(o => o.status === 'completed').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
