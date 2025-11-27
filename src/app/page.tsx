'use client';

import { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/custom/service-card';
import { BookingForm } from '@/components/custom/booking-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getServices } from '@/lib/services-storage';
import { addOrder } from '@/lib/orders-storage';
import { Service, DocumentBookingData } from '@/lib/types';
import { FileText, CheckCircle2, ArrowLeft, AlertCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Navigation } from '@/components/custom/navigation';

export default function Home() {
  const [step, setStep] = useState<'service' | 'form' | 'confirmation' | 'success' | 'simple-summary'>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<DocumentBookingData | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    const loaded = getServices();
    setServices(loaded);
  };

  // Verifica se o serviço é o especial que precisa de formulário completo
  const isDocumentService = (service: Service) => {
    return service.name.toLowerCase().includes('agendamento de documentos') ||
           service.name.toLowerCase().includes('rg') ||
           service.name.toLowerCase().includes('ipva') ||
           service.name.toLowerCase().includes('certidões');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    
    // Se for o serviço especial, vai para o formulário
    if (isDocumentService(service)) {
      setStep('form');
    } else {
      // Serviços normais vão direto para resumo simples
      setStep('simple-summary');
    }
  };

  // Solicitar serviço simples (sem formulário)
  const handleSimpleServiceRequest = () => {
    if (!selectedService) return;

    // Salvar pedido simples
    const order = addOrder({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      clientName: 'Cliente',
      clientBirthDate: '',
      clientCPF: '',
      clientMotherName: '',
      preferredLocation: '',
      clientWhatsApp: '',
      observations: '',
    });
    
    console.log('Pedido simples criado:', order);
    toast.success('Serviço solicitado com sucesso!');
    setStep('success');
  };

  const handleFormSubmit = (data: DocumentBookingData) => {
    setFormData(data);
    setStep('confirmation');
  };

  const handleConfirmBooking = () => {
    if (!selectedService || !formData) return;

    // Salvar pedido completo
    const order = addOrder({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      clientName: formData.name,
      clientBirthDate: formData.birthDate,
      clientCPF: formData.cpf,
      clientMotherName: formData.motherName,
      clientFatherName: formData.fatherName,
      preferredLocation: formData.preferredLocation,
      clientWhatsApp: formData.whatsapp,
      observations: formData.observations,
    });
    
    console.log('Pedido criado:', order);
    toast.success('Agendamento confirmado com sucesso!');
    setStep('success');
  };

  const handleEditData = () => {
    setStep('form');
  };

  const handleReset = () => {
    setStep('service');
    setSelectedService(null);
    setFormData(null);
  };

  const activeServices = services.filter(s => s.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Agendamento de Documentos
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  RG, Certidões, IPVA, MEI e mais
                </p>
              </div>
            </div>
            {step !== 'service' && step !== 'success' && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Progress Steps - Apenas para serviço especial */}
        {step !== 'success' && step !== 'simple-summary' && selectedService && isDocumentService(selectedService) && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {['service', 'form', 'confirmation'].map((s, i) => {
                const stepIndex = ['service', 'form', 'confirmation'].indexOf(step);
                const isActive = s === step;
                const isCompleted = i < stepIndex;
                
                return (
                  <div key={s} className="flex items-center">
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                      ${isActive ? 'bg-blue-500 text-white' : 
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    {i < 2 && (
                      <div className={`w-12 sm:w-24 h-1 mx-1 sm:mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-4 sm:gap-16 mt-3">
              <span className={`text-xs sm:text-sm font-medium ${step === 'service' ? 'text-blue-600' : 'text-gray-500'}`}>
                Escolher Serviço
              </span>
              <span className={`text-xs sm:text-sm font-medium ${step === 'form' ? 'text-blue-600' : 'text-gray-500'}`}>
                Dados do Cliente
              </span>
              <span className={`text-xs sm:text-sm font-medium ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-500'}`}>
                Confirmação
              </span>
            </div>
          </div>
        )}

        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
              Escolha o Serviço
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Selecione o serviço que você precisa
            </p>
            
            {activeServices.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum serviço disponível</h3>
                  <p className="text-muted-foreground mb-6">
                    Os serviços ainda não foram cadastrados pelo administrador.
                  </p>
                  <Link href="/admin/services">
                    <Button>
                      Acessar Painel Administrativo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedService?.id === service.id}
                    onSelect={() => handleServiceSelect(service)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resumo Simples - Para serviços normais */}
        {step === 'simple-summary' && selectedService && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Resumo do Serviço
                  </h2>
                  <p className="text-muted-foreground">
                    Confirme os detalhes do serviço selecionado
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 mb-6">
                  <h3 className="font-bold mb-4 text-blue-900 text-lg">Serviço Selecionado</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground font-medium">Nome:</span>
                      <span className="font-bold text-right max-w-[60%]">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground font-medium">Descrição:</span>
                      <span className="font-semibold text-right max-w-[60%] text-sm">{selectedService.description}</span>
                    </div>
                    {selectedService.price > 0 && (
                      <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                        <span className="text-muted-foreground font-medium">Valor:</span>
                        <span className="font-bold text-green-600 text-xl">
                          R$ {selectedService.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {selectedService.duration > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Duração estimada:</span>
                        <span className="font-semibold">
                          {selectedService.duration} minutos
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> Após solicitar o serviço, nossa equipe entrará em contato pelo WhatsApp para coletar as informações necessárias e dar continuidade ao atendimento.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={handleSimpleServiceRequest}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Solicitar Serviço
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Form - Apenas para serviço especial */}
        {step === 'form' && selectedService && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-3">Documento Selecionado:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serviço:</span>
                    <span className="font-semibold">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descrição:</span>
                    <span className="font-semibold text-right max-w-[60%]">{selectedService.description}</span>
                  </div>
                  {selectedService.price > 0 && (
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-bold text-green-600 text-lg">
                        R$ {selectedService.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <BookingForm onSubmit={handleFormSubmit} initialData={formData || undefined} />
          </div>
        )}

        {/* Step 3: Confirmation - Apenas para serviço especial */}
        {step === 'confirmation' && selectedService && formData && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    Confirmar Dados do Agendamento
                  </h2>
                  <p className="text-muted-foreground">
                    Revise seus dados antes de confirmar
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Serviço Selecionado */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-bold mb-3 text-blue-900">Serviço Selecionado</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nome:</span>
                        <span className="font-semibold">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Descrição:</span>
                        <span className="font-semibold text-right max-w-[60%]">{selectedService.description}</span>
                      </div>
                      {selectedService.price > 0 && (
                        <div className="flex justify-between pt-2 border-t border-blue-200">
                          <span className="text-muted-foreground">Valor:</span>
                          <span className="font-bold text-green-600">
                            R$ {selectedService.price.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dados do Cliente */}
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="font-bold mb-3">Dados do Cliente</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Nome Completo:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Data de Nascimento:</span>
                        <span className="font-semibold">{formData.birthDate}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">CPF:</span>
                        <span className="font-semibold">{formData.cpf}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Nome da Mãe:</span>
                        <span className="font-semibold">{formData.motherName}</span>
                      </div>
                      {formData.fatherName && (
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-muted-foreground">Nome do Pai:</span>
                          <span className="font-semibold">{formData.fatherName}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">PAC Preferencial:</span>
                        <span className="font-semibold">{formData.preferredLocation}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">WhatsApp:</span>
                        <span className="font-semibold">{formData.whatsapp}</span>
                      </div>
                      {formData.observations && (
                        <div className="pt-2">
                          <span className="text-muted-foreground block mb-1">Observações:</span>
                          <p className="font-semibold text-gray-700 bg-white p-3 rounded border">
                            {formData.observations}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleEditData}
                      className="flex-1"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Editar Dados
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleConfirmBooking}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Confirmar Agendamento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && selectedService && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-green-600">
                {formData ? 'Dados Enviados com Sucesso!' : 'Serviço Solicitado com Sucesso!'}
              </h2>
              
              {formData ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <p className="text-base text-gray-700 leading-relaxed">
                      Seus dados foram enviados com sucesso. O agendamento será realizado conforme a disponibilidade do sistema oficial.
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed mt-4 font-semibold">
                      Você receberá o comprovante e as informações pelo WhatsApp informado.
                    </p>
                  </div>
                  
                  {/* Resumo do Pedido Completo */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-bold mb-4 text-center text-lg">Resumo do Pedido</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Serviço:</span>
                        <span className="font-semibold">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Nome:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">CPF:</span>
                        <span className="font-semibold">{formData.cpf}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">WhatsApp:</span>
                        <span className="font-semibold">{formData.whatsapp}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs">
                          Aguardando agendamento
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <p className="text-base text-gray-700 leading-relaxed">
                      Sua solicitação foi registrada com sucesso!
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed mt-4 font-semibold">
                      Nossa equipe entrará em contato pelo WhatsApp para coletar as informações necessárias e dar continuidade ao atendimento.
                    </p>
                  </div>
                  
                  {/* Resumo do Pedido Simples */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-bold mb-4 text-center text-lg">Resumo da Solicitação</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Serviço:</span>
                        <span className="font-semibold">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Descrição:</span>
                        <span className="font-semibold text-right max-w-[60%]">{selectedService.description}</span>
                      </div>
                      {selectedService.price > 0 && (
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-muted-foreground">Valor:</span>
                          <span className="font-bold text-green-600">R$ {selectedService.price.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs">
                          Aguardando contato
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Button size="lg" onClick={handleReset} className="w-full sm:w-auto">
                Solicitar Outro Serviço
              </Button>
            </div>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
