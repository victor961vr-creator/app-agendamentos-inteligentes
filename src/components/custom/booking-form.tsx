'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, CheckCircle, Calendar, FileText, MapPin } from 'lucide-react';
import { DocumentBookingData } from '@/lib/types';

interface BookingFormProps {
  onSubmit: (data: DocumentBookingData) => void;
  loading?: boolean;
  initialData?: DocumentBookingData;
}

export function BookingForm({ onSubmit, loading, initialData }: BookingFormProps) {
  const [formData, setFormData] = useState<DocumentBookingData>(
    initialData || {
      name: '',
      birthDate: '',
      cpf: '',
      motherName: '',
      fatherName: '',
      preferredLocation: '',
      whatsapp: '',
      observations: '',
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    return value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Dados do Cliente
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Preencha todos os campos obrigatórios para solicitar o agendamento
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">
              Data de Nascimento <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="birthDate"
                placeholder="DD/MM/AAAA"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: formatDate(e.target.value) })}
                className="pl-10"
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf">
              CPF <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                className="pl-10"
                maxLength={14}
                required
              />
            </div>
          </div>

          {/* Nome da Mãe */}
          <div className="space-y-2">
            <Label htmlFor="motherName">
              Nome da Mãe <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="motherName"
                placeholder="Digite o nome completo da mãe"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Nome do Pai (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="fatherName">
              Nome do Pai <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="fatherName"
                placeholder="Digite o nome completo do pai"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* PAC Preferencial / Local */}
          <div className="space-y-2">
            <Label htmlFor="preferredLocation">
              PAC Preferencial / Local desejado para atendimento <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="preferredLocation"
                placeholder="Ex: PAC Centro, PAC Zona Norte, etc."
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp">
              WhatsApp <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="whatsapp"
                placeholder="(00) 00000-0000"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">
              Observações <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="observations"
              placeholder="Informações adicionais que possam ajudar no atendimento"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading || !formData.name || !formData.birthDate || !formData.cpf || !formData.motherName || !formData.preferredLocation || !formData.whatsapp}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {loading ? 'Enviando...' : 'Continuar para Confirmação'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
