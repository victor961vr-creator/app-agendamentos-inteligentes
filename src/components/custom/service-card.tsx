'use client';

import { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: () => void;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        selected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{service.duration} min</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-green-600">
            <DollarSign className="w-4 h-4" />
            <span>R$ {service.price.toFixed(2)}</span>
          </div>
        </div>
        <Button 
          className="w-full" 
          variant={selected ? 'default' : 'outline'}
        >
          {selected ? 'Selecionado' : 'Selecionar'}
        </Button>
      </CardContent>
    </Card>
  );
}
