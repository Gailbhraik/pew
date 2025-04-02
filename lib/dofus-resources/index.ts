// Données des ressources Dofus pour la carte interactive

export const resourcesData = [
  {
    id: 1,
    name: "Frêne",
    category: "Bois",
    level: { min: 1, max: 20 },
    locations: [
      { x: 35, y: 25, subArea: "Forêt d'Amakna", area: "Amakna", abundance: "Abondant" },
      { x: 42, y: 30, subArea: "Plaine des Scarafeuilles", area: "Amakna", abundance: "Commun" },
      { x: 28, y: 40, subArea: "Bord de la forêt maléfique", area: "Amakna", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/frene.png",
    description: "Le Frêne est un bois tendre et léger, idéal pour les débutants en bûcheronnage."
  },
  {
    id: 2,
    name: "Chêne",
    category: "Bois",
    level: { min: 20, max: 40 },
    locations: [
      { x: 45, y: 35, subArea: "Bois de Litneg", area: "Amakna", abundance: "Abondant" },
      { x: 50, y: 40, subArea: "Forêt des Abraknydes", area: "Bonta", abundance: "Commun" },
      { x: 55, y: 45, subArea: "Plaine de Cania", area: "Cania", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/chene.png",
    description: "Le Chêne est un bois robuste et résistant, très apprécié pour la fabrication de meubles."
  },
  {
    id: 3,
    name: "Fer",
    category: "Minerai",
    level: { min: 1, max: 20 },
    locations: [
      { x: 30, y: 50, subArea: "Mines de Astrub", area: "Astrub", abundance: "Abondant" },
      { x: 35, y: 55, subArea: "Montagne des Craqueleurs", area: "Amakna", abundance: "Commun" },
      { x: 40, y: 60, subArea: "Territoire des Bandits", area: "Sufokia", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/fer.png",
    description: "Le Fer est un minerai commun mais essentiel pour de nombreuses recettes de forgemagie."
  },
  {
    id: 4,
    name: "Cuivre",
    category: "Minerai",
    level: { min: 20, max: 40 },
    locations: [
      { x: 45, y: 65, subArea: "Mines de Sakai", area: "Sakai", abundance: "Abondant" },
      { x: 50, y: 70, subArea: "Grotte des Fungus", area: "Bonta", abundance: "Commun" },
      { x: 55, y: 75, subArea: "Cavernes des Brigandins", area: "Brakmar", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/cuivre.png",
    description: "Le Cuivre est un minerai aux reflets rougeâtres, parfait pour les alliages de niveau intermédiaire."
  },
  {
    id: 5,
    name: "Trèfle à 5 feuilles",
    category: "Plante",
    level: { min: 1, max: 20 },
    locations: [
      { x: 60, y: 25, subArea: "Plaine des Porkass", area: "Amakna", abundance: "Abondant" },
      { x: 65, y: 30, subArea: "Champs d'Astrub", area: "Astrub", abundance: "Commun" },
      { x: 70, y: 35, subArea: "Prairie de Cania", area: "Cania", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/trefle.png",
    description: "Le Trèfle à 5 feuilles est une plante rare qui porte chance aux alchimistes débutants."
  },
  {
    id: 6,
    name: "Ortie",
    category: "Plante",
    level: { min: 20, max: 40 },
    locations: [
      { x: 75, y: 40, subArea: "Forêt maléfique", area: "Amakna", abundance: "Abondant" },
      { x: 80, y: 45, subArea: "Marécages d'Amakna", area: "Amakna", abundance: "Commun" },
      { x: 85, y: 50, subArea: "Territoire des Dragodindes Sauvages", area: "Bonta", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/ortie.png",
    description: "L'Ortie est une plante urticante utilisée dans de nombreuses potions de soin."
  },
  {
    id: 7,
    name: "Blé",
    category: "Céréale",
    level: { min: 1, max: 20 },
    locations: [
      { x: 30, y: 75, subArea: "Champs d'Astrub", area: "Astrub", abundance: "Abondant" },
      { x: 35, y: 80, subArea: "Plaines de Cania", area: "Cania", abundance: "Commun" },
      { x: 40, y: 85, subArea: "Terres des Eleveurs", area: "Amakna", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/ble.png",
    description: "Le Blé est la céréale de base pour tout boulanger qui se respecte."
  },
  {
    id: 8,
    name: "Orge",
    category: "Céréale",
    level: { min: 20, max: 40 },
    locations: [
      { x: 45, y: 90, subArea: "Plaine des Scarafeuilles", area: "Amakna", abundance: "Abondant" },
      { x: 50, y: 95, subArea: "Champs de Cania", area: "Cania", abundance: "Commun" },
      { x: 55, y: 20, subArea: "Terres Fertiles", area: "Bonta", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/orge.png",
    description: "L'Orge est une céréale robuste qui pousse même dans les sols les plus ingrats."
  },
  {
    id: 9,
    name: "Goujon",
    category: "Poisson",
    level: { min: 1, max: 20 },
    locations: [
      { x: 60, y: 80, subArea: "Lac d'Amakna", area: "Amakna", abundance: "Abondant" },
      { x: 65, y: 85, subArea: "Rivière d'Astrub", area: "Astrub", abundance: "Commun" },
      { x: 70, y: 90, subArea: "Côte de Sufokia", area: "Sufokia", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/goujon.png",
    description: "Le Goujon est un petit poisson d'eau douce, parfait pour débuter en pêche."
  },
  {
    id: 10,
    name: "Truite",
    category: "Poisson",
    level: { min: 20, max: 40 },
    locations: [
      { x: 75, y: 95, subArea: "Rivière de Bonta", area: "Bonta", abundance: "Abondant" },
      { x: 80, y: 20, subArea: "Lac de Cania", area: "Cania", abundance: "Commun" },
      { x: 85, y: 25, subArea: "Côtes Sauvages", area: "Sufokia", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/truite.png",
    description: "La Truite est un poisson combatif qui nécessite une certaine expérience pour être attrapé."
  },
  {
    id: 11,
    name: "Ginseng",
    category: "Alchimie",
    level: { min: 40, max: 60 },
    locations: [
      { x: 90, y: 30, subArea: "Forêt des Abraknydes Sombres", area: "Bonta", abundance: "Abondant" },
      { x: 95, y: 35, subArea: "Jungle Profonde", area: "Otomaï", abundance: "Commun" },
      { x: 20, y: 40, subArea: "Marais des Bouftons", area: "Amakna", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/ginseng.png",
    description: "Le Ginseng est une racine aux propriétés revigorantes, très recherchée par les alchimistes."
  },
  {
    id: 12,
    name: "Mandragore",
    category: "Alchimie",
    level: { min: 60, max: 80 },
    locations: [
      { x: 25, y: 45, subArea: "Crypte de Kardorim", area: "Brakmar", abundance: "Abondant" },
      { x: 30, y: 50, subArea: "Marais Maudit", area: "Sidimote", abundance: "Commun" },
      { x: 35, y: 55, subArea: "Forêt Pétrifiée", area: "Bonta", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/mandragore.png",
    description: "La Mandragore est une plante mystique dont les racines ressemblent à des silhouettes humaines."
  },
  {
    id: 13,
    name: "Plume de Tofu",
    category: "Chasse",
    level: { min: 1, max: 20 },
    locations: [
      { x: 40, y: 60, subArea: "Plaine des Tofus", area: "Amakna", abundance: "Abondant" },
      { x: 45, y: 65, subArea: "Territoire des Bouftous", area: "Astrub", abundance: "Commun" },
      { x: 50, y: 70, subArea: "Champs des Ingalsses", area: "Cania", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/plume_tofu.png",
    description: "La Plume de Tofu est légère et colorée, parfaite pour les débutants en chasse."
  },
  {
    id: 14,
    name: "Cuir de Bouftou",
    category: "Chasse",
    level: { min: 20, max: 40 },
    locations: [
      { x: 55, y: 75, subArea: "Plaine des Bouftous", area: "Astrub", abundance: "Abondant" },
      { x: 60, y: 80, subArea: "Montagne des Craqueleurs", area: "Amakna", abundance: "Commun" },
      { x: 65, y: 85, subArea: "Territoire des Bandits", area: "Sufokia", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/cuir_bouftou.png",
    description: "Le Cuir de Bouftou est résistant et souple, très apprécié des tailleurs."
  },
  {
    id: 15,
    name: "Ebène",
    category: "Bois",
    level: { min: 40, max: 60 },
    locations: [
      { x: 70, y: 90, subArea: "Forêt des Abraknydes Sombres", area: "Bonta", abundance: "Abondant" },
      { x: 75, y: 95, subArea: "Jungle d'Otomaï", area: "Otomaï", abundance: "Commun" },
      { x: 80, y: 20, subArea: "Bois des Arak-haï", area: "Pandala", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/ebene.png",
    description: "L'Ebène est un bois noir et dense, prisé pour sa beauté et sa résistance."
  },
  {
    id: 16,
    name: "Argent",
    category: "Minerai",
    level: { min: 40, max: 60 },
    locations: [
      { x: 85, y: 25, subArea: "Mines de Sakai", area: "Sakai", abundance: "Abondant" },
      { x: 90, y: 30, subArea: "Montagne des Koalaks", area: "Sidimote", abundance: "Commun" },
      { x: 95, y: 35, subArea: "Cavernes des Fungus", area: "Bonta", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/argent.png",
    description: "L'Argent est un métal précieux à l'éclat lunaire, parfait pour les bijoux et les armes enchantées."
  },
  {
    id: 17,
    name: "Menthe Sauvage",
    category: "Plante",
    level: { min: 40, max: 60 },
    locations: [
      { x: 20, y: 40, subArea: "Plaine des Scarafeuilles", area: "Amakna", abundance: "Abondant" },
      { x: 25, y: 45, subArea: "Forêt d'Amakna", area: "Amakna", abundance: "Commun" },
      { x: 30, y: 50, subArea: "Bois de Litneg", area: "Amakna", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/menthe.png",
    description: "La Menthe Sauvage est une plante aromatique qui rafraîchit l'haleine et les potions."
  },
  {
    id: 18,
    name: "Avoine",
    category: "Céréale",
    level: { min: 40, max: 60 },
    locations: [
      { x: 35, y: 55, subArea: "Champs de Cania", area: "Cania", abundance: "Abondant" },
      { x: 40, y: 60, subArea: "Plaines de Bonta", area: "Bonta", abundance: "Commun" },
      { x: 45, y: 65, subArea: "Terres Fertiles", area: "Bonta", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/avoine.png",
    description: "L'Avoine est une céréale rustique qui pousse même dans les sols pauvres."
  },
  {
    id: 19,
    name: "Carpe",
    category: "Poisson",
    level: { min: 40, max: 60 },
    locations: [
      { x: 50, y: 70, subArea: "Lac de Cania", area: "Cania", abundance: "Abondant" },
      { x: 55, y: 75, subArea: "Rivière de Bonta", area: "Bonta", abundance: "Commun" },
      { x: 60, y: 80, subArea: "Baie de Sufokia", area: "Sufokia", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/carpe.png",
    description: "La Carpe est un poisson d'eau douce robuste, connu pour sa longévité."
  },
  {
    id: 20,
    name: "Peau de Larve Bleue",
    category: "Chasse",
    level: { min: 40, max: 60 },
    locations: [
      { x: 65, y: 85, subArea: "Territoire des Larves", area: "Amakna", abundance: "Abondant" },
      { x: 70, y: 90, subArea: "Grotte des Larves", area: "Bonta", abundance: "Commun" },
      { x: 75, y: 95, subArea: "Nid des Larves", area: "Cania", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/peau_larve.png",
    description: "La Peau de Larve Bleue est souple et résistante, idéale pour les armures légères."
  }
];

// Fonction utilitaire pour filtrer les ressources
export function filterResources(options: {
  categories?: string[],
  minLevel?: number,
  maxLevel?: number,
  searchTerm?: string,
  abundance?: ("Rare" | "Commun" | "Abondant")[]
}) {
  const { categories = [], minLevel = 1, maxLevel = 200, searchTerm = "", abundance = ["Rare", "Commun", "Abondant"] as ("Rare" | "Commun" | "Abondant")[]} = options;
  
  return resourcesData.filter(resource => {
    // Filtrer par terme de recherche
    if (searchTerm && !resource.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrer par catégorie
    if (categories.length > 0 && !categories.includes(resource.category)) {
      return false;
    }
    
    // Filtrer par niveau
    if (resource.level.min > maxLevel || resource.level.max < minLevel) {
      return false;
    }
    
    // Filtrer par abondance
    const hasValidLocation = resource.locations.some(location => 
      abundance.includes(location.abundance as "Rare" | "Commun" | "Abondant")
    );
    
    return hasValidLocation;
  });
}
