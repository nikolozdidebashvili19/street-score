import { redirect } from 'next/navigation';

import { APP_HOME_ROUTE } from '@/shared/const/routes.const';

export default function DashboardPage() {
  redirect(APP_HOME_ROUTE);
}
