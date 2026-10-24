import { ExplorerView } from '@/features/explorer/components/explorer-view';
import { ExplorerSearchParamsSchema } from '@/features/explorer/validations/explorer.validation';

type ExplorerPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExplorerPage({ searchParams }: ExplorerPageProps) {
  const parsed = ExplorerSearchParamsSchema.safeParse(await searchParams);
  const params = parsed.success ? parsed.data : {};

  const initialPin = params.lng !== undefined && params.lat !== undefined ? { lng: params.lng, lat: params.lat } : null;

  return <ExplorerView initialPin={initialPin} initialBusinessType={params.type ?? null} />;
}
