/**
 * Mock Property Data
 * Sample properties for ConciergeAI MVP testing
 */

import type { Property } from "../types";

export const mockProperties: Property[] = [
  {
    id: "prop-001",
    title: "Cobertura Duplex Frente Mar - Vista Panorâmica 360°",
    description: "Cobertura de luxo com vista mar de tirar o fôlego",
    price: 4_500_000,
    pricePerSqm: 15_000,
    location: "Avenida Atlântica, 3850",
    bedrooms: 4,
    bathrooms: 5,
    suites: 4,
    parkingSpots: 4,
    totalArea: 300,
    floor: 28,
    view: "ocean",
    furnished: true,
    amenities: [
      "piscina privativa",
      "churrasqueira gourmet",
      "sauna",
      "academia",
      "salão de festas",
    ],
  },
  {
    id: "prop-002",
    title: "Apartamento 3 Suítes - Centro",
    description: "Apartamento moderno no coração de Balneário Camboriú",
    price: 1_200_000,
    pricePerSqm: 10_000,
    location: "Rua 3000, Centro",
    bedrooms: 3,
    bathrooms: 3,
    suites: 3,
    parkingSpots: 2,
    totalArea: 120,
    floor: 15,
    view: "city",
    furnished: false,
    amenities: ["piscina", "academia", "churrasqueira"],
  },
  {
    id: "prop-003",
    title: "Apartamento 2 Quartos - Vista Mar",
    description: "Excelente apartamento com vista mar parcial",
    price: 800_000,
    pricePerSqm: 11_429,
    location: "Avenida Central, 2500",
    bedrooms: 2,
    bathrooms: 2,
    suites: 1,
    parkingSpots: 1,
    totalArea: 70,
    floor: 12,
    view: "ocean",
    furnished: false,
    amenities: ["piscina", "salão de festas"],
  },
];

