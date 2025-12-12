import { Plus, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';

const Calendar = ({
  currentMonth,
  monthNames,
  weekDays,
  getDaysInMonth,
  getEventsForDate,
  navigateMonth,
  onAddDemand,
  onEventClick,
  onShowEvents,
  demands,
  clients
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <h2 className="text-xl font-semibold text-gray-900 font-poppins">Calendário</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header do Calendário */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={() => navigateMonth(0)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-poppins"
          >
            Hoje
          </button>
        </div>

        {/* Grid do Calendário */}
        <div className="p-6">
          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider font-poppins">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((dayObj, index) => {
              const events = getEventsForDate(dayObj.date);
              const isToday = dayObj.date.toDateString() === new Date().toDateString();
              const dateStr = dayObj.date.toISOString().split('T')[0];
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] border border-gray-200 p-2 relative group ${
                    dayObj.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-gray-400' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`text-sm font-medium font-poppins ${
                      dayObj.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${isToday ? 'text-gray-900 font-semibold' : ''}`}>
                      {dayObj.date.getDate()}
                    </div>
                    {dayObj.isCurrentMonth && (
                      <button
                        onClick={() => onAddDemand(dateStr)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                        title="Adicionar demanda nesta data"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        onClick={() => onEventClick(event)}
                        className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity font-poppins ${
                          event.type === 'demand'
                            ? event.priority === 'high'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : event.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : event.status === 'paid'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                        title={`${event.title} - ${event.client} (Clique para ver detalhes)`}
                      >
                        {event.type === 'payment' && event.status === 'pending' && '💰 '}
                        {event.type === 'demand' && '📋 '}
                        {event.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div 
                        onClick={() => onShowEvents(events)}
                        className="text-xs text-gray-500 font-poppins px-1.5 cursor-pointer hover:text-gray-700"
                      >
                        +{events.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 font-poppins">Legenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
            <span className="text-xs text-gray-600 font-poppins">Demanda Alta Prioridade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
            <span className="text-xs text-gray-600 font-poppins">Demanda Média Prioridade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
            <span className="text-xs text-gray-600 font-poppins">Demanda Baixa Prioridade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200"></div>
            <span className="text-xs text-gray-600 font-poppins">Pagamento Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
            <span className="text-xs text-gray-600 font-poppins">Pagamento Pago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

