import type { Service } from "../../../types/domain";

/**
 * Seed data for the mock API. Kept entirely separate from React components
 * per the assignment's separation-of-concerns requirement - components
 * never import from here directly, only src/api/mock does.
 */
export const mockServices: Service[] = [
  {
    id: "svc-001",
    name: "Deep Home Cleaning",
    description:
      "A thorough top-to-bottom clean covering kitchens, bathrooms, living areas and bedrooms. Includes appliance exteriors and baseboards.",
    category: "cleaning",
    provider: { id: "prv-001", name: "Clara Nguyen", rating: 4.8, reviewCount: 212 },
    price: 89,
    currency: "USD",
    durationMinutes: 120,
    rating: 4.8,
    isAvailable: true,
    imageId: "cleaning-1",
  },
  {
    id: "svc-002",
    name: "Emergency Pipe Repair",
    description:
      "Fast-response plumbing repair for leaks, burst pipes and blockages. Fully licensed and insured, parts billed separately.",
    category: "plumbing",
    provider: { id: "prv-002", name: "Marcus Webb", rating: 4.6, reviewCount: 98 },
    price: 120,
    currency: "USD",
    durationMinutes: 60,
    rating: 4.6,
    isAvailable: true,
    imageId: "plumbing-1",
  },
  {
    id: "svc-003",
    name: "Home Electrical Safety Check",
    description:
      "Full inspection of wiring, outlets and breaker panel with a written safety report and recommendations.",
    category: "electrical",
    provider: { id: "prv-003", name: "Priya Shah", rating: 4.9, reviewCount: 156 },
    price: 95,
    currency: "USD",
    durationMinutes: 90,
    rating: 4.9,
    isAvailable: true,
    imageId: "electrical-1",
  },
  {
    id: "svc-004",
    name: "GCSE Maths Tutoring",
    description:
      "One-on-one tutoring session tailored to exam board syllabus, with practice papers and progress tracking.",
    category: "tutoring",
    provider: { id: "prv-004", name: "Daniel Okafor", rating: 4.7, reviewCount: 64 },
    price: 45,
    currency: "GBP",
    durationMinutes: 60,
    rating: 4.7,
    isAvailable: true,
    imageId: "tutoring-1",
  },
  {
    id: "svc-005",
    name: "Deep Tissue Massage",
    description:
      "60-minute therapeutic massage targeting muscle tension and chronic pain areas. Mobile setup, towels provided.",
    category: "wellness",
    provider: { id: "prv-005", name: "Elena Ruiz", rating: 4.9, reviewCount: 301 },
    price: 75,
    currency: "USD",
    durationMinutes: 60,
    rating: 4.9,
    isAvailable: true,
    imageId: "wellness-1",
  },
  {
    id: "svc-006",
    name: "Portrait Photography Session",
    description:
      "Outdoor or studio portrait session including 20 edited digital images delivered within 5 business days.",
    category: "photography",
    provider: { id: "prv-006", name: "Tomas Berg", rating: 4.5, reviewCount: 47 },
    price: 150,
    currency: "EUR",
    durationMinutes: 90,
    rating: 4.5,
    isAvailable: false,
    imageId: "photography-1",
  },
  {
    id: "svc-007",
    name: "Standard Apartment Cleaning",
    description:
      "Routine cleaning for 1-2 bedroom apartments covering all living spaces, kitchen and bathroom.",
    category: "cleaning",
    provider: { id: "prv-001", name: "Clara Nguyen", rating: 4.8, reviewCount: 212 },
    price: 55,
    currency: "USD",
    durationMinutes: 90,
    rating: 4.7,
    isAvailable: true,
    imageId: "cleaning-2",
  },
  {
    id: "svc-008",
    name: "Spanish Conversation Practice",
    description:
      "Conversational Spanish session for intermediate learners focused on fluency and everyday vocabulary.",
    category: "tutoring",
    provider: { id: "prv-007", name: "Lucia Fernandez", rating: 4.8, reviewCount: 89 },
    price: 30,
    currency: "EUR",
    durationMinutes: 45,
    rating: 4.8,
    isAvailable: true,
    imageId: "tutoring-2",
  },
];
