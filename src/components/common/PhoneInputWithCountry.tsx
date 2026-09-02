import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export interface CountryItem {
  name: string;
  code: string;
  dialCode: string;
  placeholder: string;
}

export const COUNTRIES: CountryItem[] = [
  { name: 'Paraguay', code: 'PY', dialCode: '+595', placeholder: '981 123 456' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', placeholder: '9 11 1234 5678' },
  { name: 'Brasil', code: 'BR', dialCode: '+55', placeholder: '11 91234 5678' },
  { name: 'España', code: 'ES', dialCode: '+34', placeholder: '612 34 56 78' },
  { name: 'Estados Unidos', code: 'US', dialCode: '+1', placeholder: '202 555 0123' },
  { name: 'Bolivia', code: 'BO', dialCode: '+591', placeholder: '7123 4567' },
  { name: 'Chile', code: 'CL', dialCode: '+56', placeholder: '9 1234 5678' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', placeholder: '300 123 4567' },
  { name: 'México', code: 'MX', dialCode: '+52', placeholder: '55 1234 5678' },
  { name: 'Perú', code: 'PE', dialCode: '+51', placeholder: '912 345 678' },
  { name: 'Uruguay', code: 'UY', dialCode: '+598', placeholder: '99 123 456' },
  { name: 'Venezuela', code: 'VE', dialCode: '+58', placeholder: '412 123 4567' },
  { name: 'Ecuador', code: 'EC', dialCode: '+593', placeholder: '99 123 4567' },
  { name: 'Alemania', code: 'DE', dialCode: '+49', placeholder: '151 12345678' },
  { name: 'Francia', code: 'FR', dialCode: '+33', placeholder: '6 12 34 56 78' },
  { name: 'Italia', code: 'IT', dialCode: '+39', placeholder: '312 345 6789' },
  { name: 'Reino Unido', code: 'GB', dialCode: '+44', placeholder: '7911 123456' },
  { name: 'Canadá', code: 'CA', dialCode: '+1', placeholder: '416 555 0123' },
  { name: 'Suiza', code: 'CH', dialCode: '+41', placeholder: '78 123 45 67' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', placeholder: '912 345 678' },
  { name: 'Otro / Internacional', code: 'INT', dialCode: '+', placeholder: 'Código y número' },
];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (fullPhoneNumber: string) => void;
  disabled?: boolean;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(COUNTRIES[0]); // Default to Paraguay (+595)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse incoming value if pre-filled
  useEffect(() => {
    if (!value) {
      setPhoneNumber('');
      return;
    }

    const trimmed = value.trim();
    const matched = COUNTRIES.find((c) => c.dialCode !== '+' && trimmed.startsWith(c.dialCode));
    if (matched) {
      setSelectedCountry(matched);
      setPhoneNumber(trimmed.slice(matched.dialCode.length).trim());
    } else {
      setPhoneNumber(trimmed);
    }
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleCountrySelect = (country: CountryItem) => {
    sound.playClick();
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');

    // Emit combined phone number
    const cleanNumber = phoneNumber.trim();
    if (cleanNumber) {
      onChange(`${country.dialCode} ${cleanNumber}`);
    } else {
      onChange(country.dialCode);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    // Allow digits, spaces, hyphens
    const sanitized = inputVal.replace(/[^\d\s-]/g, '');
    setPhoneNumber(sanitized);

    const cleanNumber = sanitized.trim();
    if (cleanNumber) {
      onChange(`${selectedCountry.dialCode} ${cleanNumber}`);
    } else {
      onChange('');
    }
  };

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dialCode.includes(q)
    );
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Group: Country Trigger + Phone Number Field */}
      <div className="flex items-center rounded-xl bg-white/5 border border-white/20 focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-400/30 transition-all overflow-hidden">
        {/* Country Selector Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-1.5 px-3.5 py-3.5 bg-black/40 hover:bg-black/60 border-r border-white/10 text-white font-sans text-sm cursor-pointer transition-colors shrink-0 select-none active:bg-black/80"
          title="Seleccionar país y código de llamada"
        >
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[11px] font-bold tracking-wider text-gold-300">
            {selectedCountry.code}
          </span>
          <span className="font-semibold text-white/90 text-xs">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-gold-400' : ''
            }`}
          />
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          disabled={disabled}
          value={phoneNumber}
          onChange={handleNumberChange}
          placeholder={selectedCountry.placeholder}
          className="w-full px-4 py-3.5 bg-transparent border-0 focus:outline-none font-serif text-white placeholder:text-white/30 text-base tracking-wide"
        />
      </div>

      {/* Country Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-80 max-h-72 bg-[#171412] border border-gold-400/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.15)] backdrop-blur-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-white/10 bg-black/50">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar país o código (+595, España...)"
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/15 focus:outline-none focus:border-gold-400 text-xs text-white placeholder:text-white/30 font-sans"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="overflow-y-auto divide-y divide-white/5 p-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = selectedCountry.code === country.code;
                return (
                  <button
                    key={`${country.code}-${country.dialCode}`}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-sans transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-gold-500/20 text-gold-200 font-semibold'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 text-center px-1 py-0.5 rounded bg-white/10 text-[10px] font-bold text-gold-300">
                        {country.code}
                      </span>
                      <span className="truncate">{country.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-[11px] font-mono">
                        {country.dialCode}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-white/40 font-sans flex flex-col items-center gap-1.5">
                <Globe className="w-5 h-5 text-white/20" />
                <span>No se encontró ningún país coincidente</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInputWithCountry;
