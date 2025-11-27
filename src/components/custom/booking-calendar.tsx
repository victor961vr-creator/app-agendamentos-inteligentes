'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const isToday = (date: Date) => isSameDay(date, new Date());
  const isPast = (date: Date) => date < new Date() && !isToday(date);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Escolha a Data
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const disabled = isPast(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => !disabled && onSelectDate(date)}
                disabled={disabled}
                className={`
                  flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg transition-all
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'}
                  ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${isToday(date) && !isSelected ? 'ring-2 ring-blue-300' : ''}
                `}
              >
                <span className="text-xs font-medium uppercase">
                  {format(date, 'EEE', { locale: ptBR })}
                </span>
                <span className="text-lg sm:text-xl font-bold mt-1">
                  {format(date, 'd')}
                </span>
                <span className="text-xs mt-1">
                  {format(date, 'MMM', { locale: ptBR })}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
