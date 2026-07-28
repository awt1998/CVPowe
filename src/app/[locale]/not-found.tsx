import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <Container className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-semibold text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-muted-foreground">{t('body')}</p>
      <Button asChild className="mt-2">
        <Link href="/">{t('back')}</Link>
      </Button>
    </Container>
  );
}
