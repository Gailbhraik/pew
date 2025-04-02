"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, MapPin, Plus, Minus, Layers, Filter } from "lucide-react"

// Types pour les ressources Dofus
type ResourceCategory = "Bois" | "Minerai" | "Plante" | "Céréale" | "Poisson" | "Alchimie" | "Chasse"
type AbundanceType = "Rare" | "Commun" | "Abondant"

type ResourceLocation = {
  x: number
  y: number
  subArea: string
  area: string
  abundance: AbundanceType
}

type Resource = {
  id: number
  name: string
  category: ResourceCategory
  level: { min: number, max: number }
  locations: ResourceLocation[]
  imageUrl: string
  description: string
}

type MapPosition = {
  x: number
  y: number
  scale: number
}

type FilterOptions = {
  categories: ResourceCategory[]
  minLevel: number
  maxLevel: number
  searchTerm: string
  showRare: boolean
  showCommon: boolean
  showAbundant: boolean
}

// Données de ressources simplifiées pour la démo
const resourcesData: Resource[] = [
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
    imageUrl: "/dofus/resources/frene.svg",
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
    imageUrl: "/dofus/resources/chene.svg",
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
    imageUrl: "/dofus/resources/fer.svg",
    description: "Le Fer est un minerai commun mais essentiel pour de nombreuses recettes de forgemagie."
  },
  {
    id: 4,
    name: "Trèfle à 5 feuilles",
    category: "Plante",
    level: { min: 1, max: 20 },
    locations: [
      { x: 60, y: 25, subArea: "Plaine des Porkass", area: "Amakna", abundance: "Abondant" },
      { x: 65, y: 30, subArea: "Champs d'Astrub", area: "Astrub", abundance: "Commun" },
      { x: 70, y: 35, subArea: "Prairie de Cania", area: "Cania", abundance: "Rare" }
    ],
    imageUrl: "/dofus/resources/trefle.svg",
    description: "Le Trèfle à 5 feuilles est une plante rare qui porte chance aux alchimistes débutants."
  }
];

export function DofusMap() {
  // État pour la position et le zoom de la carte
  const [position, setPosition] = useState<MapPosition>({ x: 0, y: 0, scale: 1 })
  
  // État pour les filtres
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    minLevel: 1,
    maxLevel: 200,
    searchTerm: "",
    showRare: true,
    showCommon: true,
    showAbundant: true
  })
  
  // État pour les ressources filtrées
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resourcesData)
  
  // État pour la ressource sélectionnée
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  
  // Référence à l'élément de carte pour la manipulation
  const mapRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPosition = useRef({ x: 0, y: 0 })
  
  // Appliquer les filtres aux ressources
  useEffect(() => {
    const filtered = resourcesData.filter((resource: Resource) => {
      // Filtrer par terme de recherche
      if (filters.searchTerm && !resource.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false
      }
      
      // Filtrer par catégorie
      if (filters.categories.length > 0 && !filters.categories.includes(resource.category)) {
        return false
      }
      
      // Filtrer par niveau
      if (resource.level.min > filters.maxLevel || resource.level.max < filters.minLevel) {
        return false
      }
      
      // Filtrer par abondance
      const hasValidLocation = resource.locations.some((location: ResourceLocation) => {
        if (location.abundance === "Rare" && !filters.showRare) return false
        if (location.abundance === "Commun" && !filters.showCommon) return false
        if (location.abundance === "Abondant" && !filters.showAbundant) return false
        return true
      })
      
      return hasValidLocation
    })
    
    setFilteredResources(filtered)
  }, [filters])
  
  // Gestionnaires d'événements pour la carte interactive
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mapRef.current) {
      isDragging.current = true
      lastPosition.current = { x: e.clientX, y: e.clientY }
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current && mapRef.current) {
      const deltaX = e.clientX - lastPosition.current.x
      const deltaY = e.clientY - lastPosition.current.y
      
      setPosition(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      
      lastPosition.current = { x: e.clientX, y: e.clientY }
    }
  }
  
  const handleMouseUp = () => {
    isDragging.current = false
  }
  
  const handleZoom = (zoomIn: boolean) => {
    setPosition(prev => ({
      ...prev,
      scale: zoomIn 
        ? Math.min(prev.scale + 0.1, 2) 
        : Math.max(prev.scale - 0.1, 0.5)
    }))
  }
  
  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
  }
  
  const handleCategoryChange = (category: ResourceCategory) => {
    setFilters(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        }
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        }
      }
    })
  }
  
  const handleLevelChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      minLevel: value[0],
      maxLevel: value[1]
    }))
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }))
  }
  
  const handleAbundanceToggle = (type: "rare" | "common" | "abundant", checked: boolean) => {
    setFilters(prev => {
      if (type === "rare") {
        return { ...prev, showRare: checked }
      } else if (type === "common") {
        return { ...prev, showCommon: checked }
      } else {
        return { ...prev, showAbundant: checked }
      }
    })
  }
  
  const resetFilters = () => {
    setFilters({
      categories: [],
      minLevel: 1,
      maxLevel: 200,
      searchTerm: "",
      showRare: true,
      showCommon: true,
      showAbundant: true
    })
  }
  
  const resetPosition = () => {
    setPosition({ x: 0, y: 0, scale: 1 })
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Panneau de filtres */}
      <Card className="lg:col-span-1 gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5 text-primary" />
            Filtres
          </CardTitle>
          <CardDescription>Filtrez les ressources par catégorie, niveau et plus</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-resources">Rechercher une ressource</Label>
            <div className="flex space-x-2">
              <Input 
                id="search-resources" 
                placeholder="Nom de la ressource..." 
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="shimmer"
              />
              <Button variant="outline" className="shrink-0 glow-effect">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Catégories</Label>
            <div className="flex flex-wrap gap-2">
              {(["Bois", "Minerai", "Plante", "Céréale", "Poisson", "Alchimie", "Chasse"] as ResourceCategory[]).map(category => (
                <Badge 
                  key={category}
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Niveau</Label>
              <span className="text-sm text-muted-foreground">
                {filters.minLevel} - {filters.maxLevel}
              </span>
            </div>
            <Slider 
              defaultValue={[filters.minLevel, filters.maxLevel]} 
              max={200} 
              step={1} 
              onValueChange={handleLevelChange}
              className="py-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Abondance</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-rare" className="cursor-pointer">Rare</Label>
                <Switch 
                  id="show-rare" 
                  checked={filters.showRare}
                  onCheckedChange={(checked) => handleAbundanceToggle("rare", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-common" className="cursor-pointer">Commun</Label>
                <Switch 
                  id="show-common" 
                  checked={filters.showCommon}
                  onCheckedChange={(checked) => handleAbundanceToggle("common", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-abundant" className="cursor-pointer">Abondant</Label>
                <Switch 
                  id="show-abundant" 
                  checked={filters.showAbundant}
                  onCheckedChange={(checked) => handleAbundanceToggle("abundant", checked)}
                />
              </div>
            </div>
          </div>
          
          <Button onClick={resetFilters} variant="outline" className="w-full glow-effect">
            Réinitialiser les filtres
          </Button>
        </CardContent>
      </Card>
      
      {/* Carte interactive */}
      <div className="lg:col-span-3 space-y-4">
        <Card className="gradient-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Carte du Monde des Douze
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleZoom(true)}
                  className="glow-effect"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleZoom(false)}
                  className="glow-effect"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={resetPosition}
                  className="glow-effect"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="relative w-full h-[600px] overflow-hidden border rounded-md bg-muted/20"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              ref={mapRef}
            >
              <div 
                className="absolute transition-transform duration-100 cursor-move"
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
                  transformOrigin: 'center',
                  width: '2000px',
                  height: '2000px'
                }}
              >
                {/* Carte de base */}
                <div className="absolute inset-0 bg-[url('/dofus-map.svg')] bg-no-repeat bg-contain bg-center" />
                
                {/* Points des ressources */}
                {filteredResources.map(resource => (
                  resource.locations.map((location, locIndex) => (
                    <div 
                      key={`${resource.id}-${locIndex}`}
                      className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 ${
                        location.abundance === "Rare" ? "bg-red-500" : 
                        location.abundance === "Commun" ? "bg-yellow-500" : 
                        "bg-green-500"
                      }`}
                      style={{ 
                        left: `${(location.x / 100) * 2000}px`, 
                        top: `${(location.y / 100) * 2000}px`,
                        opacity: selectedResource && selectedResource.id !== resource.id ? 0.3 : 0.8,
                        zIndex: selectedResource && selectedResource.id === resource.id ? 10 : 1
                      }}
                      onClick={() => handleResourceClick(resource)}
                      title={`${resource.name} (${location.subArea})`}
                    >
                      <img 
                        src={resource.imageUrl} 
                        alt={resource.name} 
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                  ))
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Détails de la ressource sélectionnée */}
        {selectedResource && (
          <Card className="gradient-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <img 
                    src={selectedResource.imageUrl} 
                    alt={selectedResource.name} 
                    className="w-6 h-6 mr-2"
                  />
                  {selectedResource.name}
                </CardTitle>
                <Badge>{selectedResource.category}</Badge>
              </div>
              <CardDescription>
                Niveau {selectedResource.level.min} - {selectedResource.level.max}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>{selectedResource.description}</p>
                
                <div>
                  <h4 className="font-medium mb-2 text-primary">Emplacements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {selectedResource.locations.map((location, index) => (
                      <div key={index} className="p-2 border rounded-md hover:bg-muted/50 transition-colors">
                        <div className="font-medium">{location.subArea}</div>
                        <div className="text-sm text-muted-foreground">{location.area}</div>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 ${
                            location.abundance === "Rare" ? "bg-red-500/10 text-red-500" : 
                            location.abundance === "Commun" ? "bg-yellow-500/10 text-yellow-500" : 
                            "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {location.abundance}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Liste des ressources filtrées */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>Ressources ({filteredResources.length})</CardTitle>
            <CardDescription>
              Liste des ressources correspondant à vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <div 
                    key={resource.id} 
                    className={`p-2 border rounded-md cursor-pointer transition-colors ${
                      selectedResource?.id === resource.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleResourceClick(resource)}
                  >
                    <div className="flex items-center">
                      <img 
                        src={resource.imageUrl} 
                        alt={resource.name} 
                        className="w-5 h-5 mr-2"
                      />
                      <div>
                        <div className="font-medium">{resource.name}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Niv. {resource.level.min}-{resource.level.max}</span>
                          <Badge variant="outline" className="ml-2 text-xs">{resource.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Aucune ressource ne correspond à vos critères de recherche.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
