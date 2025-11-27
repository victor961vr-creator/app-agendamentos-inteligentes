'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Copy, 
  MessageCircle, 
  CheckCircle,
  User,
  FileText,
  Calendar,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { 
  getOrderById, 
  updateOrderStatus,
  updateOrderNotes,
  getStatusLabel, 
  getStatusColor,
  formatWhatsAppLink,
  formatCPF,
  formatPhone,
  formatDate,
} from '@/lib/orders-storage';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('awaiting');

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = () => {
    const id = params.id as string;
    const loadedOrder = getOrderById(id);
    if (loadedOrder) {
      setOrder(loadedOrder);
      setAdminNotes(loadedOrder.adminNotes || '');
      setSelectedStatus(loadedOrder.status);
    }
  };

  const handleSaveNotes = () => {
    if (!order) return;
    updateOrderNotes(order.id, adminNotes);
    loadOrder();
    toast.success('Observações salvas com sucesso!');
  };

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    if (!order) return;
    updateOrderStatus(order.id, newStatus);
    setSelectedStatus(newStatus);
    loadOrder();
    toast.success('Status atualizado com sucesso!');
  };

  const handleCopyData = () => {
    if (!order) return;
    
    const data = `
DADOS DO PEDIDO #${order.id}

Serviço: ${order.serviceName}
Status: ${getStatusLabel(order.status)}
Data do pedido: ${formatDate(order.createdAt)}

DADOS DO CLIENTE:
Nome: ${order.clientName}
Data de Nascimento: ${order.clientBirthDate}
CPF: ${formatCPF(order.clientCPF)}
Nome da Mãe: ${order.clientMotherName}
${order.clientFatherName ? `Nome do Pai: ${order.clientFatherName}` : ''}
PAC/Local: ${order.preferredLocation}
WhatsApp: ${formatPhone(order.clientWhatsApp)}
${order.observations ? `\nObservações do cliente:\n${order.observations}` : ''}
${order.adminNotes ? `\nObservações internas:\n${order.adminNotes}` : ''}
    `.trim();

    navigator.clipboard.writeText(data);
    toast.success('Dados copiados para a área de transferência!');
  };

  const handleWhatsAppMessage = () => {
    if (!order) return;
    const message = `Olá ${order.clientName}, estou com o seu pedido de ${order.serviceName}. Já estamos processando. Aguarde nosso retorno!`;
    const link = formatWhatsAppLink(order.clientWhatsApp, message);
    window.open(link, '_blank');
  };

  const handleMarkAsCompleted = () => {
    if (!order) return;
    handleStatusUpdate('completed');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pedido não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O pedido que você está procurando não existe ou foi removido.
            </p>
            <Link href="/admin/dashboard">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    const label = getStatusLabel(status);
    const color = getStatusColor(status);
    return (
      <Badge className={`${color} border text-base px-3 py-1`}>
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
                Detalhes do Pedido #{order.id}
              </h1>
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie os dados do pedido
              </p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Ações Rápidas */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleCopyData} className="flex-1 sm:flex-none">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Dados
                </Button>
                <Button 
                  onClick={handleWhatsAppMessage} 
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar WhatsApp
                </Button>
                {order.status !== 'completed' && (
                  <Button 
                    onClick={handleMarkAsCompleted} 
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Concluído
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informações do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Serviço Solicitado</Label>
                  <p className="text-lg font-semibold">{order.serviceName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status Atual</Label>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data do Pedido</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Última Atualização</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Atualizar Status */}
              <div className="pt-4 border-t">
                <Label htmlFor="status">Atualizar Status</Label>
                <div className="flex gap-2 mt-2">
                  <Select value={selectedStatus} onValueChange={(value) => handleStatusUpdate(value as OrderStatus)}>
                    <SelectTrigger id="status" className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="awaiting">Aguardando agendamento</SelectItem>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome Completo</Label>
                  <p className="text-lg font-semibold">{order.clientName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Nascimento</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {order.clientBirthDate}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {formatCPF(order.clientCPF)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">WhatsApp</Label>
                  <a
                    href={formatWhatsAppLink(order.clientWhatsApp, '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {formatPhone(order.clientWhatsApp)}
                  </a>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nome da Mãe</Label>
                  <p className="text-lg font-semibold">{order.clientMotherName}</p>
                </div>
                {order.clientFatherName && (
                  <div>
                    <Label className="text-muted-foreground">Nome do Pai</Label>
                    <p className="text-lg font-semibold">{order.clientFatherName}</p>
                  </div>
                )}
                <div className={order.clientFatherName ? 'md:col-span-2' : ''}>
                  <Label className="text-muted-foreground">PAC/Local Preferencial</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {order.preferredLocation}
                  </p>
                </div>
              </div>

              {order.observations && (
                <div className="pt-4 border-t">
                  <Label className="text-muted-foreground">Observações do Cliente</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{order.observations}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações Internas */}
          <Card>
            <CardHeader>
              <CardTitle>Observações Internas (Admin)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminNotes">
                  Adicione observações internas sobre este pedido
                </Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Anotações internas, lembretes, informações adicionais..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={6}
                />
              </div>
              <Button onClick={handleSaveNotes} className="w-full sm:w-auto">
                Salvar Observações
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
