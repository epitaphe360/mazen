// Types partagés entre client et serveur

export type UserRole = "admin" | "user" | "public";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export type ComplianceStatus = "compliant" | "non_compliant" | "anomaly";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type NewsCategory =
  | "innovation"
  | "deployment"
  | "trends"
  | "events"
  | "testimonials";
export type ContactRequestType = "demo" | "information" | "partnership";

export interface Sector {
  id: number;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
  alert_threshold_transactions: number;
  alert_threshold_revenue: number;
  alert_threshold_compliance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  date: string;
  sector_id: number;
  sector_name?: string;
  operator_name: string;
  transaction_amount: number;
  transaction_count: number;
  compliance_status: ComplianceStatus;
  tax_amount: number;
  created_at: string;
}

export interface Alert {
  id: number;
  sector_id: number;
  sector_name?: string;
  transaction_id?: number;
  severity: AlertSeverity;
  description: string;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: NewsCategory;
  featured_image_url?: string;
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  country: string;
  sector_of_interest: string;
  request_type: ContactRequestType;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_transactions: number;
  compliance_rate: number;
  active_alerts: number;
  revenue_change_percent: number;
  transactions_change_percent: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface SectorChartData {
  name: string;
  revenue: number;
  transactions: number;
  compliance: number;
}

// Statistiques clés de la page d'accueil
export const KEY_STATS = [
  { value: "552%", label: "Augmentation max des recettes", description: "Hausse maximale constatée chez nos clients" },
  { value: "10+", label: "Années d'expertise", description: "Collaboration avec des États émergents et établis" },
  { value: "9", label: "Secteurs couverts", description: "Intervention dans neuf grands domaines" },
  { value: "100%", label: "Visibilité des transactions", description: "Sans aucun travail manuel" },
] as const;

// Les 9 secteurs couverts
export const SECTORS_DATA = [
  {
    id: 1,
    name: "Télécommunications",
    icon: "📡",
    description:
      "Calcule le revenu exact généré par les opérateurs de télécommunications ainsi que le nombre total de transactions pour révéler les taxes inexploitées.",
  },
  {
    id: 2,
    name: "Argent mobile",
    icon: "📱",
    description:
      "Traite et analyse les métadonnées des transactions d'argent mobile afin de produire des rapports détaillés sur les activités et les taxes à percevoir.",
  },
  {
    id: 3,
    name: "MPIE – Importation mobiles",
    icon: "📦",
    description: "Détecte et taxe les appareils mobiles importés illégalement.",
  },
  {
    id: 4,
    name: "BiT-IT – Publicité numérique",
    icon: "📢",
    description:
      "Revenus provenant de la publicité numérique et des services d'abonnement.",
  },
  {
    id: 5,
    name: "BiT-IT – Services d'abonnement",
    icon: "🎬",
    description:
      "Calcule avec précision les taxes sur les revenus des services d'abonnement numériques tels que les plateformes de diffusion en continu.",
  },
  {
    id: 6,
    name: "Jeux d'argent",
    icon: "🎰",
    description: "Suivi des taxes dues sur les jeux d'argent en ligne.",
  },
  {
    id: 7,
    name: "Services bancaires",
    icon: "🏦",
    description:
      "L'accès aux services bancaires et financiers dans les économies émergentes est en plein essor.",
  },
  {
    id: 8,
    name: "Télévision payante",
    icon: "📺",
    description:
      "Automatise le traitement des factures et la taxation pour les fournisseurs de télévision payante, améliorant ainsi la transparence des revenus.",
  },
  {
    id: 9,
    name: "Services publics & municipaux",
    icon: "🏛️",
    description:
      "Amélioration de la mobilisation des recettes dans les secteurs des services publics tels que l'électricité, l'essence et l'eau, ainsi que le ramassage des ordures, le stationnement, l'assurance et les taxes municipales.",
  },
] as const;
