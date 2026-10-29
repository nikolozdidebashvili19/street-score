'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookmarkPlus, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { useSaveLocation } from '@/features/locations/hooks/use-save-location';
import { SaveLocationFormSchema, SaveLocationFormType } from '@/features/locations/validations/location.validation';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useI18n } from '@/shared/hooks/use-i18n';
import { isPropertyType } from '@/shared/utils/places';

const NUMBER_FIELDS = [
  { name: 'rentGel', labelKey: 'rentLabel', propertyLabelKey: 'priceLabel' },
  { name: 'budgetGel', labelKey: 'budgetLabel', propertyLabelKey: 'totalBudgetLabel' },
] as const;

/** A single "Save" button until the user asks for the form. */
export const SaveLocationForm = () => {
  const { save, saving, error, saved, reset } = useSaveLocation();
  const { businessType } = useExplorerStore();
  // Real estate is bought once, so it asks for a price and total budget instead of monthly rent.
  const property = isPropertyType(businessType);
  const { t, format } = useI18n();
  const [open, setOpen] = useState(false);
  const form = useForm<SaveLocationFormType>({
    resolver: zodResolver(SaveLocationFormSchema),
    defaultValues: { label: '', rentGel: '', budgetGel: '' },
  });

  const close = () => {
    setOpen(false);
    reset();
    form.reset();
  };

  if (saved) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="flex items-center gap-2">
          <Check className="size-4 text-positive" /> {format(t.save.saved, { label: saved.label })}
        </p>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" asChild>
            <Link href="/locations">{t.save.viewSaved}</Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={close}>
            {t.save.saveAnother}
          </Button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <Button className="w-full" onClick={() => setOpen(true)}>
        <BookmarkPlus className="size-4" />
        {t.save.save}
      </Button>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(save)} className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.save.nameLabel}</FormLabel>
              <FormControl>
                <Input autoFocus placeholder={t.save.namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          {NUMBER_FIELDS.map(({ name, labelKey, propertyLabelKey }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">{t.save[property ? propertyLabelKey : labelKey]}</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" placeholder={t.save.optional} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? t.save.saving : t.save.save}
          </Button>
          <Button type="button" variant="ghost" onClick={close}>
            {t.save.cancel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
