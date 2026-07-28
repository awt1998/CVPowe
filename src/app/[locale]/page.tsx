import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ArrowRight, ShieldCheck, Gauge, FileCheck2 } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PrivacyBadge } from '@/components/brand/privacy-badge';
import { Link } from '@/i18n/navigation';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Home />;
}

function Home() {
  const t = useTranslations('home');

  const features = [
    { icon: ShieldCheck, title: t('featurePrivacyTitle'), body: t('featurePrivacyBody') },
    { icon: Gauge, title: t('featureScoreTitle'), body: t('featureScoreBody') },
    { icon: FileCheck2, title: t('featureAtsTitle'), body: t('featureAtsBody') },
  ];

  return (
    <>
      <section className="border-b bg-gradient-to-b from-muted/40 to-background">
        <Container className="flex flex-col items-center gap-6 py-24 text-center md:py-32">
          <PrivacyBadge />
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            {t('heroSubtitle')}
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/builder">
                {t('ctaPrimary')}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/analyze">{t('ctaSecondary')}</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="shadow-soft">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </Container>
      </section>
    </>
  );
}
