import { EtatAvancement } from "../enums/EtatAvancement"
import { EtatGlobal } from "../enums/EtatGlobal"
import { TypeCargaison } from "../enums/TypeCargaison"


export interface Lieu {
  nom: string
  latitude: number
  longitude: number
  pays: string
}

export interface Icargaison {
  numero: string
  poidsMax: number
  distanceKm: number
  lieuDepart: Lieu // Maintenant un objet Lieu
  lieuArrivee: Lieu // Maintenant un objet Lieu
  type: TypeCargaison
  etatAvancement: EtatAvancement
  etatGlobal: EtatGlobal
  dateDepart: Date
  dateArrivee: Date
  colis?: any[] // Optionnel, si vous gérez les colis
}
