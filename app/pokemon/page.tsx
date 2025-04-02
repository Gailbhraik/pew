"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuth } from "@/components/user-auth"
import { LocalTime } from "@/components/local-time"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Types de Pokémon avec leurs couleurs associées
const pokemonTypes = [
  { id: 1, name: "Normal", color: "#A8A878", description: "Type commun, faible contre Combat", weaknesses: ["Combat"], resistances: [], immunities: ["Spectre"] },
  { id: 2, name: "Feu", color: "#F08030", description: "Type offensif, fort contre Plante, Insecte, Acier et Glace", weaknesses: ["Eau", "Sol", "Roche"], resistances: ["Feu", "Plante", "Glace", "Insecte", "Acier", "Fée"], immunities: [] },
  { id: 3, name: "Eau", color: "#6890F0", description: "Type polyvalent, fort contre Feu, Sol et Roche", weaknesses: ["Électrik", "Plante"], resistances: ["Feu", "Eau", "Glace", "Acier"], immunities: [] },
  { id: 4, name: "Plante", color: "#78C850", description: "Type défensif, fort contre Eau, Sol et Roche", weaknesses: ["Feu", "Glace", "Poison", "Vol", "Insecte"], resistances: ["Eau", "Électrik", "Plante", "Sol"], immunities: [] },
  { id: 5, name: "Électrik", color: "#F8D030", description: "Type rapide, fort contre Eau et Vol", weaknesses: ["Sol"], resistances: ["Électrik", "Vol", "Acier"], immunities: [] },
  { id: 6, name: "Glace", color: "#98D8D8", description: "Type fragile mais offensif, fort contre Plante, Sol, Vol et Dragon", weaknesses: ["Feu", "Combat", "Roche", "Acier"], resistances: ["Glace"], immunities: [] },
  { id: 7, name: "Combat", color: "#C03028", description: "Type puissant, fort contre Normal, Glace, Roche, Ténèbres et Acier", weaknesses: ["Vol", "Psy", "Fée"], resistances: ["Insecte", "Roche", "Ténèbres"], immunities: [] },
  { id: 8, name: "Poison", color: "#A040A0", description: "Type technique, fort contre Plante et Fée", weaknesses: ["Sol", "Psy"], resistances: ["Plante", "Combat", "Poison", "Insecte", "Fée"], immunities: [] },
  { id: 9, name: "Sol", color: "#E0C068", description: "Type solide, fort contre Feu, Électrik, Poison, Roche et Acier", weaknesses: ["Eau", "Plante", "Glace"], resistances: ["Poison", "Roche"], immunities: ["Électrik"] },
  { id: 10, name: "Vol", color: "#A890F0", description: "Type mobile, fort contre Plante, Combat et Insecte", weaknesses: ["Électrik", "Glace", "Roche"], resistances: ["Plante", "Combat", "Insecte"], immunities: ["Sol"] },
  { id: 11, name: "Psy", color: "#F85888", description: "Type spécial, fort contre Combat et Poison", weaknesses: ["Insecte", "Spectre", "Ténèbres"], resistances: ["Combat", "Psy"], immunities: [] },
  { id: 12, name: "Insecte", color: "#A8B820", description: "Type évolutif, fort contre Plante, Psy et Ténèbres", weaknesses: ["Feu", "Vol", "Roche"], resistances: ["Plante", "Combat", "Sol"], immunities: [] },
  { id: 13, name: "Roche", color: "#B8A038", description: "Type défensif, fort contre Feu, Glace, Vol et Insecte", weaknesses: ["Eau", "Plante", "Combat", "Sol", "Acier"], resistances: ["Normal", "Feu", "Poison", "Vol"], immunities: [] },
  { id: 14, name: "Spectre", color: "#705898", description: "Type unique, fort contre Psy et Spectre", weaknesses: ["Spectre", "Ténèbres"], resistances: ["Poison", "Insecte"], immunities: ["Normal", "Combat"] },
  { id: 15, name: "Dragon", color: "#7038F8", description: "Type puissant, fort contre Dragon", weaknesses: ["Glace", "Dragon", "Fée"], resistances: ["Feu", "Eau", "Électrik", "Plante"], immunities: [] },
  { id: 16, name: "Ténèbres", color: "#705848", description: "Type stratégique, fort contre Psy et Spectre", weaknesses: ["Combat", "Insecte", "Fée"], resistances: ["Spectre", "Ténèbres"], immunities: ["Psy"] },
  { id: 17, name: "Acier", color: "#B8B8D0", description: "Type très défensif, fort contre Glace, Roche et Fée", weaknesses: ["Feu", "Combat", "Sol"], resistances: ["Normal", "Plante", "Glace", "Vol", "Psy", "Insecte", "Roche", "Dragon", "Acier", "Fée"], immunities: ["Poison"] },
  { id: 18, name: "Fée", color: "#EE99AC", description: "Type anti-dragon, fort contre Combat, Dragon et Ténèbres", weaknesses: ["Poison", "Acier"], resistances: ["Combat", "Insecte", "Ténèbres"], immunities: ["Dragon"] }
];

// Combinaisons de types populaires
const popularCombinations = [
  { types: ["Eau", "Vol"], examples: ["Artikodin", "Léviator"] },
  { types: ["Plante", "Poison"], examples: ["Bulbizarre", "Florizarre"] },
  { types: ["Feu", "Combat"], examples: ["Braségali", "Simiabraz"] },
  { types: ["Électrik", "Acier"], examples: ["Magnéton", "Magnézone"] },
  { types: ["Psy", "Fée"], examples: ["M. Mime", "Gardevoir"] },
  { types: ["Eau", "Sol"], examples: ["Quagsire", "Laggron"] },
  { types: ["Dragon", "Vol"], examples: ["Dracolosse", "Salamèche"] },
  { types: ["Ténèbres", "Spectre"], examples: ["Spiritomb", "Lunala"] },
  { types: ["Acier", "Fée"], examples: ["Magearna", "Ninianne"] },
  { types: ["Roche", "Sol"], examples: ["Rhinocorne", "Onix"] }
];

export default function PokemonTypesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filtrer les types en fonction de la recherche
  const filteredTypes = pokemonTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour
          </Link>
          <h1 className="text-2xl font-bold">Types de Pokémon</h1>
        </div>
        <div className="flex items-center space-x-2">
          <LocalTime />
          <ThemeToggle />
          <UserAuth />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guide des Types Pokémon</CardTitle>
            <CardDescription>
              Explorez les 18 types de Pokémon, leurs forces, faiblesses et relations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher un type..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="all">Tous les Types</TabsTrigger>
                  <TabsTrigger value="combinations">Combinaisons</TabsTrigger>
                  <TabsTrigger value="effectiveness">Table d'Efficacité</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTypes.map(type => (
                      <Card key={type.id} className="overflow-hidden border-t-4" style={{ borderTopColor: type.color }}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-xl">
                              <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: type.color }}></span>
                              {type.name}
                            </CardTitle>
                            <Badge style={{ backgroundColor: type.color, color: getBrightness(type.color) < 128 ? 'white' : 'black' }}>
                              Type {type.id}
                            </Badge>
                          </div>
                          <CardDescription>{type.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="font-semibold mb-1">Faiblesses</p>
                              <div className="flex flex-wrap gap-1">
                                {type.weaknesses.map(weakness => (
                                  <Badge key={weakness} variant="outline" className="text-xs">
                                    {weakness}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold mb-1">Résistances</p>
                              <div className="flex flex-wrap gap-1">
                                {type.resistances.map(resistance => (
                                  <Badge key={resistance} variant="outline" className="text-xs">
                                    {resistance}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold mb-1">Immunités</p>
                              <div className="flex flex-wrap gap-1">
                                {type.immunities.length > 0 ? (
                                  type.immunities.map(immunity => (
                                    <Badge key={immunity} variant="outline" className="text-xs">
                                      {immunity}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground text-xs">Aucune</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="combinations" className="mt-4">
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Combinaisons populaires</AlertTitle>
                    <AlertDescription>
                      Les combinaisons de types peuvent créer des Pokémon avec des forces et faiblesses uniques.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularCombinations.map((combo, index) => {
                      const type1 = pokemonTypes.find(t => t.name === combo.types[0]);
                      const type2 = pokemonTypes.find(t => t.name === combo.types[1]);
                      
                      return (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">
                                <div className="flex items-center">
                                  <span className="inline-block w-4 h-4 rounded-full mr-1" style={{ backgroundColor: type1?.color }}></span>
                                  <span>{combo.types[0]}</span>
                                  <span className="mx-1">+</span>
                                  <span className="inline-block w-4 h-4 rounded-full mr-1" style={{ backgroundColor: type2?.color }}></span>
                                  <span>{combo.types[1]}</span>
                                </div>
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm mb-2">
                              <span className="font-semibold">Exemples: </span>
                              {combo.examples.join(", ")}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="effectiveness" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="sticky left-0 bg-background z-10">Type</TableHead>
                          {pokemonTypes.map(type => (
                            <TableHead key={type.id} className="text-center">
                              <div className="flex flex-col items-center">
                                <span className="inline-block w-4 h-4 rounded-full mb-1" style={{ backgroundColor: type.color }}></span>
                                <span className="text-xs">{type.name}</span>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pokemonTypes.map(attacker => (
                          <TableRow key={attacker.id}>
                            <TableCell className="sticky left-0 bg-background font-medium">
                              <div className="flex items-center">
                                <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: attacker.color }}></span>
                                {attacker.name}
                              </div>
                            </TableCell>
                            {pokemonTypes.map(defender => {
                              // Logique pour déterminer l'efficacité (simplifiée pour l'exemple)
                              let effectiveness = "1×";
                              let bgClass = "";
                              
                              if (defender.weaknesses.includes(attacker.name)) {
                                effectiveness = "2×";
                                bgClass = "bg-red-100 dark:bg-red-900/30";
                              } else if (defender.resistances.includes(attacker.name)) {
                                effectiveness = "½×";
                                bgClass = "bg-green-100 dark:bg-green-900/30";
                              } else if (defender.immunities.includes(attacker.name)) {
                                effectiveness = "0×";
                                bgClass = "bg-gray-100 dark:bg-gray-800";
                              }
                              
                              return (
                                <TableCell key={defender.id} className={`text-center ${bgClass}`}>
                                  {effectiveness}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Fonction pour calculer la luminosité d'une couleur
function getBrightness(hexColor: string): number {
  // Convertir la couleur hex en RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Formule de luminosité perçue
  return (r * 299 + g * 587 + b * 114) / 1000;
}
