'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MapPin, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useGeocode } from '@/features/explorer/hooks/use-geocode';
import { GeocodeSchema, GeocodeType } from '@/features/geocoding/validations/geocoding.validation';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useI18n } from '@/shared/hooks/use-i18n';
import { type GeocodeResult } from '@/shared/lib/nominatim';

type AddressSearchProps = {
  onPick: (result: GeocodeResult) => void;
  placeholder?: string;
  hint?: string;
};

export const AddressSearch = ({ onPick, placeholder, hint }: AddressSearchProps) => {
  const { t } = useI18n();
  const { results, searching, error, search, clear } = useGeocode();
  const form = useForm<GeocodeType>({
    resolver: zodResolver(GeocodeSchema),
    defaultValues: { query: '' },
  });

  const pick = (result: GeocodeResult) => {
    onPick(result);
    clear();
  };

  return (
    <div className="flex flex-col gap-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(search)} className="flex gap-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder={placeholder ?? t.explorer.searchPlaceholder}
                    aria-label={t.explorer.searchLabel}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" aria-label={t.explorer.searchButton} disabled={searching}>
            {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </Button>
        </form>
      </Form>

      {error && <p className="text-xs text-muted-foreground">{error}</p>}

      {results.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
          {results.map((result) => (
            <li key={`${result.lng}-${result.lat}`}>
              <button
                type="button"
                onClick={() => pick(result)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-brick" />
                <span className="line-clamp-2">{result.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">{hint ?? t.explorer.orClickMap}</p>
    </div>
  );
};
