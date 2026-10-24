import { CompareView } from '@/features/locations/components/compare-view';
import { CompareSearchParamsSchema } from '@/features/locations/validations/location.validation';

type ComparePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const parsed = CompareSearchParamsSchema.safeParse(await searchParams);
  return <CompareView ids={parsed.success ? parsed.data.ids : []} />;
}
