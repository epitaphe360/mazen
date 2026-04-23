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


// Statistiques cles de la page d accueil (source: presentation corporate MAZEN)
export const KEY_STATS = [
  { value: "$15Mrd", label: "Supervises sur les reseaux operateurs", description: "De 2009 a ce jour" },
  { value: "13Mrd", label: "Transactions analysees / jour", description: "Traitement quotidien en temps reel" },
  { value: "1986", label: "Fondee en", description: "Plus de 35 ans d expertise GovTech" },
  { value: "+60%", label: "Hausse des recettes fiscales en RDC", description: "Accises & TVA apres 1 an de fonctionnement" },
] as const;

// Les 9 secteurs couverts
export const SECTORS_DATA = [
  {
    id: 1,
    name: "Telecommunications",
    icon: "\ud83d\udce1",
    description: "Calcule le revenu exact genere par les operateurs de telecommunications ainsi que le nombre total de transactions pour reveler les taxes inexploitees.",
  },
  {
    id: 2,
    name: "Argent mobile",
    icon: "\ud83d\udcf1",
    description: "Traite et analyse les metadonnees des transactions d argent mobile afin de produire des rapports detailles sur les activites et les taxes a percevoir.",
  },
  {
    id: 3,
    name: "MPIE - Importation mobiles",
    icon: "\ud83d\udce6",
    description: "Detecte et taxe les appareils mobiles importes illegalement.",
  },
  {
    id: 4,
    name: "BiT-IT - Publicite numerique",
    icon: "\ud83d\udce2",
    description: "Revenus provenant de la publicite numerique et des services d abonnement.",
  },
  {
    id: 5,
    name: "BiT-IT - Services d abonnement",
    icon: "\ud83c\udfa6",
    description: "Calcule avec precision les taxes sur les revenus des services d abonnement numeriques tels que les plateformes de diffusion en continu.",
  },
  {
    id: 6,
    name: "Jeux d argent",
    icon: "\ud83c\udfb0",
    description: "Suivi des taxes dues sur les jeux d argent en ligne.",
  },
  {
    id: 7,
    name: "Services bancaires",
    icon: "\ud83c\udfe6",
    description: "L acces aux services bancaires et financiers dans les economies emergentes est en plein essor.",
  },
  {
    id: 8,
    name: "Television payante",
    icon: "\ud83d\udcfa",
    description: "Automatise le traitement des factures et la taxation pour les fournisseurs de television payante, ameliorant ainsi la transparence des revenus.",
  },
  {
    id: 9,
    name: "Services publics & municipaux",
    icon: "\ud83c\udfd7\ufe0f",
    description: "Amelioration de la mobilisation des recettes dans les secteurs des services publics tels que l electricite, l essence et l eau, ainsi que le ramassage des ordures, le stationnement, l assurance et les taxes municipales.",
  },
] as const;