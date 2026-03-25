-- ============================================================
-- MAZEN GOVTECH — Migration Supabase
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- ─── Profils utilisateurs (extension de auth.users) ──────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Le service role bypasse la RLS — lecture publique du propre profil
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ─── Secteurs d'activité ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sectors (
  id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name                            TEXT NOT NULL UNIQUE,
  description                     TEXT,
  icon                            TEXT DEFAULT '🏛️',
  is_active                       BOOLEAN NOT NULL DEFAULT true,
  alert_threshold_transactions    INT NOT NULL DEFAULT 1000,
  alert_threshold_revenue         NUMERIC(15,2) NOT NULL DEFAULT 100000,
  alert_threshold_compliance      NUMERIC(5,2) NOT NULL DEFAULT 80,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sectors" ON public.sectors FOR SELECT USING (true);
CREATE POLICY "Admin write sectors" ON public.sectors FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ─── Transactions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date                TIMESTAMPTZ NOT NULL DEFAULT now(),
  sector_id           BIGINT NOT NULL REFERENCES public.sectors(id),
  operator_name       TEXT NOT NULL,
  transaction_amount  NUMERIC(15,2) NOT NULL,
  transaction_count   INT NOT NULL DEFAULT 1,
  compliance_status   TEXT NOT NULL DEFAULT 'compliant'
                        CHECK (compliance_status IN ('compliant', 'non_compliant', 'anomaly')),
  tax_amount          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_sector ON public.transactions(sector_id);
CREATE INDEX IF NOT EXISTS idx_transactions_operator ON public.transactions(operator_name);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(compliance_status);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read transactions" ON public.transactions
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write transactions" ON public.transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ─── Alertes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.alerts (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sector_id       BIGINT REFERENCES public.sectors(id),
  transaction_id  BIGINT REFERENCES public.transactions(id),
  severity        TEXT NOT NULL DEFAULT 'medium'
                    CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description     TEXT NOT NULL,
  is_resolved     BOOLEAN NOT NULL DEFAULT false,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON public.alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_severity  ON public.alerts(severity);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read alerts" ON public.alerts
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write alerts" ON public.alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ─── Actualités ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.news (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  content             TEXT NOT NULL,
  category            TEXT NOT NULL DEFAULT 'innovation'
                        CHECK (category IN ('innovation','deployment','trends','events','testimonials')),
  featured_image_url  TEXT,
  author              TEXT NOT NULL DEFAULT 'Mazen GovTech',
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_slug     ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_pub      ON public.news(published_at DESC);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published news" ON public.news
  FOR SELECT USING (published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "Admin write news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ─── Messages de contact ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  country             TEXT NOT NULL,
  sector_of_interest  TEXT NOT NULL,
  request_type        TEXT NOT NULL DEFAULT 'information'
                        CHECK (request_type IN ('demo', 'information', 'partnership')),
  message             TEXT NOT NULL,
  is_read             BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
-- Le service role (backend) peut tout faire — aucun accès client direct
CREATE POLICY "No public access" ON public.contact_messages USING (false);

-- ─── Données de démonstration ─────────────────────────────────
INSERT INTO public.sectors (name, description, icon, is_active, alert_threshold_transactions, alert_threshold_revenue, alert_threshold_compliance) VALUES
  ('Télécommunications', 'Calcule le revenu exact généré par les opérateurs de télécommunications ainsi que le nombre total de transactions pour révéler les taxes inexploitées.', '📡', true, 5000, 500000, 80),
  ('Argent mobile', 'Traite et analyse les métadonnées des transactions d''argent mobile afin de produire des rapports détaillés sur les activités et les taxes à percevoir.', '📱', true, 10000, 1000000, 85),
  ('MPIE – Importation mobiles', 'Détecte et taxe les appareils mobiles importés illégalement.', '📦', true, 1000, 200000, 90),
  ('BiT-IT – Publicité numérique', 'Revenus provenant de la publicité numérique et des services d''abonnement.', '📢', true, 2000, 150000, 75),
  ('BiT-IT – Services d''abonnement', 'Calcule avec précision les taxes sur les revenus des services d''abonnement numériques.', '🎬', true, 3000, 250000, 78),
  ('Jeux d''argent', 'Suivi des taxes dues sur les jeux d''argent en ligne.', '🎰', true, 500, 100000, 88),
  ('Services bancaires', 'L''accès aux services bancaires et financiers dans les économies émergentes est en plein essor.', '🏦', true, 8000, 800000, 92),
  ('Télévision payante', 'Automatise le traitement des factures et la taxation pour les fournisseurs de télévision payante.', '📺', true, 2500, 200000, 82),
  ('Services publics & municipaux', 'Amélioration de la mobilisation des recettes dans les secteurs des services publics.', '🏛️', true, 4000, 350000, 80)
ON CONFLICT (name) DO NOTHING;
