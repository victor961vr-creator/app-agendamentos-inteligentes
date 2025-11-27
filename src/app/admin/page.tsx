'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Users, FileText, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/custom/navigation';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
            Painel Administrativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seu sistema de agendamentos
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades do Painel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/admin/dashboard">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors cursor-pointer group border border-blue-200">
                    <LayoutDashboard className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold">Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Ver todos os pedidos</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>

                <Link href="/admin/services">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group">
                    <Settings className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold">Gerenciar Serviços</h3>
                      <p className="text-sm text-muted-foreground">Cadastrar e editar serviços</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg opacity-60">
                  <Calendar className="w-8 h-8 text-gray-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Horários</h3>
                    <p className="text-sm text-muted-foreground">Em breve</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg opacity-60">
                  <Users className="w-8 h-8 text-gray-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Clientes</h3>
                    <p className="text-sm text-muted-foreground">Em breve</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">✨ Novo: Dashboard Administrativo</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Gerencie todos os pedidos recebidos, filtre por serviço e status, envie mensagens automáticas no WhatsApp e muito mais!
                  </p>
                  <Link href="/admin/dashboard">
                    <Button size="sm" className="w-full sm:w-auto">
                      Acessar Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
