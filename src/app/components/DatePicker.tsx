import { useState } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  allowFuture?: boolean;
  label?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  allowFuture = true,
  label,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'year' | 'month' | 'day'>('year');
  const [selectedYear, setSelectedYear] = useState<number>(value?.getFullYear() || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(value?.getMonth() || new Date().getMonth());

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate();
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsOpen(false);
      setStep('year');
    }
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setStep('month');
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setStep('day');
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('year');
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const disabledDays = allowFuture
    ? undefined
    : { after: today };

  return (
    <div className="relative">
      {label && (
        <label className="text-slate-300 text-sm font-medium block mb-2">{label}</label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-slate-500'}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarIcon className="w-5 h-5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Calendar Modal */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600/50 shadow-2xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                {step === 'year' && 'Seleccionar año'}
                {step === 'month' && `Seleccionar mes - ${selectedYear}`}
                {step === 'day' && `${months[selectedMonth]} ${selectedYear}`}
              </h3>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Year Selection */}
            {step === 'year' && (
              <div className="grid grid-cols-3 gap-2.5 max-h-96 overflow-y-auto p-2">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`py-3 px-4 rounded-xl text-white font-medium transition-all ${
                      year === selectedYear
                        ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            {/* Month Selection */}
            {step === 'month' && (
              <div className="grid grid-cols-3 gap-2.5">
                {months.map((month, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleMonthSelect(index)}
                    className={`py-3 px-4 rounded-xl text-white font-medium transition-all ${
                      index === selectedMonth
                        ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {/* Day Selection */}
            {step === 'day' && (
              <>
                <DayPicker
                  mode="single"
                  selected={value || undefined}
                  onSelect={handleSelect}
                  disabled={disabledDays}
                  month={new Date(selectedYear, selectedMonth)}
                  className="date-picker-dark"
                  classNames={{
                    months: 'flex flex-col space-y-4',
                    month: 'space-y-4',
                    caption: 'flex justify-center pt-1 relative items-center text-white',
                    caption_label: 'text-sm font-semibold',
                    nav: 'space-x-1 flex items-center',
                    nav_button: 'h-8 w-8 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all border border-slate-600/50',
                    nav_button_previous: 'absolute left-1',
                    nav_button_next: 'absolute right-1',
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell: 'text-slate-400 rounded-md w-10 font-medium text-xs',
                    row: 'flex w-full mt-2',
                    cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-700/30 first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20',
                    day: 'h-10 w-10 p-0 font-medium text-white hover:bg-slate-700/50 rounded-lg transition-all',
                    day_selected: 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30',
                    day_today: 'bg-slate-700/50 text-white border border-slate-600/50',
                    day_outside: 'text-slate-600',
                    day_disabled: 'text-slate-600 opacity-50 cursor-not-allowed',
                    day_hidden: 'invisible',
                  }}
                />

                <div className="mt-4 pt-4 border-t border-slate-600/50 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep('year')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-700/50 text-white hover:bg-slate-700 transition-all text-sm font-medium border border-slate-600/50"
                  >
                    Volver
                  </button>
                  {value && (
                    <button
                      type="button"
                      onClick={() => {
                        onChange(null);
                        handleClose();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm font-medium border border-red-500/30"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
