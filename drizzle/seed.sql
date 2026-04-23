-- ============================================================
-- MAZEN GOVTECH — Seed de démonstration
-- À exécuter après supabase_migration.sql dans Supabase SQL Editor
-- ============================================================

-- ─── News articles ────────────────────────────────────────────
INSERT INTO public.news (title, slug, content, category, featured_image_url, author, published_at) VALUES
(
  'MAZEN deploys next-generation tax supervision in DRC',
  'mazen-deploy-drc-2025',
  'MAZEN GovTech Group has successfully completed the expansion of its flagship ETL-Certification® platform across three new provinces in the Democratic Republic of Congo. The deployment covers mobile money, telecommunications, and digital advertising sectors, adding an estimated $240M in previously uncaptured tax revenues annually. The system now processes over 4.2 billion daily transactions in real time, feeding directly into the Office Congolais des Recettes (OCC) reporting infrastructure.',
  'deployment',
  '/hero-bg.jpg',
  'Mazen GovTech Editorial',
  now() - interval '2 days'
),
(
  'ISO 27001 recertification confirms MAZEN security posture',
  'iso-27001-recertification-2025',
  'MAZEN GovTech Group has successfully completed its annual ISO 27001:2022 audit, reaffirming its commitment to information security at the highest international standard. The certification covers all sovereign data pipelines, including the Secure Inspec VPN tunnel architecture used for government-grade data transmission. Independent auditors praised the zero-downtime track record and the layered key management system deployed across all active country installations.',
  'innovation',
  '/etl-certify.png',
  'Security & Compliance Team',
  now() - interval '7 days'
),
(
  'Mazen GovTech Group expands to Sierra Leone — full deployment complete',
  'sierra-leone-deployment-complete',
  'After an intensive 18-month programme, MAZEN has completed full-scale deployment of its Revenue Identification Platform (RIP) in Sierra Leone. Working closely with the National Revenue Authority (NRA), the platform now supervises telecoms, mobile money, and gambling operators in real time. Early data shows a 47% increase in assessed tax obligations compared to the pre-deployment baseline, with compliance rates rising to 91% within the first quarter.',
  'deployment',
  '/case-sierra-leone.jpg',
  'Country Operations Team',
  now() - interval '14 days'
),
(
  'Digital taxation trends 2025: Africa leads the way',
  'digital-taxation-trends-2025',
  'A new wave of digital tax enforcement is reshaping public finance across Sub-Saharan Africa. Governments from Dakar to Nairobi are deploying AI-assisted compliance tools to track mobile money, streaming platforms, and e-commerce. MAZEN GovTech''s experience across four deployments — DRC, Mali, Burundi, Sierra Leone — offers a blueprint: invest in data ingestion first, then build compliance logic on top. The results speak for themselves: a cumulative $15bn in supervised flows since 2009.',
  'trends',
  '/digital-economy.png',
  'Research & Policy Team',
  now() - interval '21 days'
),
(
  'MAZEN technical teams present at GovTech Summit Brussels',
  'govtech-summit-brussels-2025',
  'MAZEN GovTech Group participated as a featured speaker at the GovTech Summit Brussels, presenting findings from its four active country deployments. The presentation focused on the ETL-Certification® architecture — covering XDR data collection, real-time transformation pipelines, and the compliance scoring engine. Representatives from seven African finance ministries attended dedicated side sessions to discuss potential deployments.',
  'events',
  '/etl-extract.png',
  'Executive Office',
  now() - interval '30 days'
)
ON CONFLICT (slug) DO NOTHING;

-- ─── Transactions (90 derniers jours, réparties sur 9 secteurs) ──────────────
DO $$
DECLARE
  operators TEXT[] := ARRAY[
    'Orange Telecom', 'Airtel Networks', 'MTN Group',
    'M-Pesa Ltd', 'Wave Mobile', 'Moov Africa',
    'Betway Africa', 'SportPesa', 'Meridian Bet',
    'Canal+ Africa', 'StarTimes', 'DSTv',
    'Equity Bank', 'Access Bank', 'Ecobank',
    'Amazon Ads', 'Google Africa', 'Meta Platforms',
    'Netflix SARL', 'Spotify Africa', 'Apple Media',
    'SNEL Energie', 'REGIDESO', 'Office Douanes'
  ];
  sector_ids BIGINT[];
  sid BIGINT;
  op TEXT;
  amount NUMERIC;
  txn_count INT;
  status TEXT;
  statuses TEXT[] := ARRAY['compliant','compliant','compliant','non_compliant','anomaly'];
  d TIMESTAMPTZ;
BEGIN
  SELECT ARRAY_AGG(id ORDER BY id) INTO sector_ids FROM public.sectors;
  IF array_length(sector_ids, 1) IS NULL THEN
    RAISE NOTICE 'No sectors found — insert sectors first';
    RETURN;
  END IF;

  FOR i IN 1..500 LOOP
    sid     := sector_ids[1 + (floor(random() * array_length(sector_ids, 1)))::INT % array_length(sector_ids, 1)];
    op      := operators[1 + (floor(random() * array_length(operators, 1)))::INT % array_length(operators, 1)];
    amount  := round((10000 + random() * 990000)::NUMERIC, 2);
    txn_count := (100 + floor(random() * 9900))::INT;
    status  := statuses[1 + (floor(random() * 5))::INT % 5];
    d       := now() - (floor(random() * 90) || ' days')::INTERVAL - (floor(random() * 86400) || ' seconds')::INTERVAL;

    INSERT INTO public.transactions
      (date, sector_id, operator_name, transaction_amount, transaction_count, compliance_status, tax_amount)
    VALUES
      (d, sid, op, amount, txn_count, status, round(amount * 0.18, 2));
  END LOOP;
END $$;

-- ─── Alertes ─────────────────────────────────────────────────
DO $$
DECLARE
  sector_ids BIGINT[];
  sid BIGINT;
  sevs TEXT[] := ARRAY['critical','high','medium','medium','low'];
  descs TEXT[] := ARRAY[
    'Unusual spike in transaction volume — 340% above monthly average',
    'Compliance rate dropped below alert threshold (68%)',
    'Operator missing daily reporting batch — 48h gap detected',
    'Revenue variance exceeds 15% vs. prior period baseline',
    'New operator detected with no registered profile',
    'Duplicate transaction IDs flagged in reconciliation batch',
    'Tax amount discrepancy detected — expected vs. declared gap: $42k',
    'XDR feed interrupted — last heartbeat 6h ago',
    'Anomaly score above 0.85 on mobile money flow cluster',
    'Non-compliant status persisting for 5 consecutive days'
  ];
  idx INT;
BEGIN
  SELECT ARRAY_AGG(id ORDER BY id) INTO sector_ids FROM public.sectors;
  IF array_length(sector_ids, 1) IS NULL THEN RETURN; END IF;

  FOR i IN 1..20 LOOP
    sid := sector_ids[1 + (floor(random() * array_length(sector_ids, 1)))::INT % array_length(sector_ids, 1)];
    idx := 1 + (floor(random() * array_length(descs, 1)))::INT % array_length(descs, 1);
    INSERT INTO public.alerts (sector_id, severity, description, is_resolved, resolved_at, created_at)
    VALUES (
      sid,
      sevs[1 + (floor(random() * 5))::INT % 5],
      descs[idx],
      (random() > 0.6),
      CASE WHEN random() > 0.6 THEN now() - (floor(random() * 10) || ' days')::INTERVAL ELSE NULL END,
      now() - (floor(random() * 30) || ' days')::INTERVAL
    );
  END LOOP;
END $$;
