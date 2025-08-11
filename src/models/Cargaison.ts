import { EtatAvancement } from "../enums/EtatAvancement"
import { EtatGlobal } from "../enums/EtatGlobal"
import { TypeCargaison } from "../enums/TypeCargaison"
import { ICargaison, Lieu } from "./Icargaison"

export class Cargaison implements ICargaison {
  private _numero: string
  private _poidsMax: number
  private _distanceKm: number
  private _lieuDepart: Lieu // Type changé en Lieu
  private _lieuArrivee: Lieu // Type changé en Lieu
  private _type: TypeCargaison
  private _etatAvancement: EtatAvancement
  private _etatGlobal: EtatGlobal
  private _dateDepart: Date
  private _dateArrivee: Date
  private _colis: any[] // Ajouté pour correspondre à l'interface et au toJSON

  constructor(data: Partial<ICargaison>) {
    this._numero = data.numero || ""
    this._poidsMax = data.poidsMax || 0
    this._distanceKm = data.distanceKm || 0
    // Initialisation des objets Lieu avec des valeurs par défaut si non fournies
    this._lieuDepart = data.lieuDepart || { nom: "", latitude: 0, longitude: 0, pays: "" }
    this._lieuArrivee = data.lieuArrivee || { nom: "", latitude: 0, longitude: 0, pays: "" }
    this._type = data.type || TypeCargaison.AERIEN
    this._etatAvancement = data.etatAvancement || EtatAvancement.EN_ATTENTE
    this._etatGlobal = data.etatGlobal || EtatGlobal.OUVERT
    this._dateDepart = data.dateDepart || new Date()
    this._dateArrivee = data.dateArrivee || new Date()
    this._colis = data.colis || []
  }

  get numero(): string {
    return this._numero
  }
  set numero(numero: string) {
    this._numero = numero
  }

  get poidsMax(): number {
    return this._poidsMax
  }
  set poidsMax(poidsMax: number) {
    this._poidsMax = poidsMax
  }

  get distanceKm(): number {
    return this._distanceKm
  }
  set distanceKm(distanceKm: number) {
    this._distanceKm = distanceKm
  }

  get lieuDepart(): Lieu {
    // Type changé en Lieu
    return this._lieuDepart
  }
  set lieuDepart(lieuDepart: Lieu) {
    // Type changé en Lieu
    this._lieuDepart = lieuDepart
  }

  get lieuArrivee(): Lieu {
    // Type changé en Lieu
    return this._lieuArrivee
  }
  set lieuArrivee(lieuArrivee: Lieu) {
    // Type changé en Lieu
    this._lieuArrivee = lieuArrivee
  }

  get type(): TypeCargaison {
    return this._type
  }
  set type(type: TypeCargaison) {
    this._type = type
  }

  get etatAvancement(): EtatAvancement {
    return this._etatAvancement
  }
  set etatAvancement(etatAvancement: EtatAvancement) {
    this._etatAvancement = etatAvancement
  }

  get etatGlobal(): EtatGlobal {
    return this._etatGlobal
  }
  set etatGlobal(etatGlobal: EtatGlobal) {
    this._etatGlobal = etatGlobal
  }

  get dateDepart(): Date {
    return this._dateDepart
  }
  set dateDepart(dateDepart: Date) {
    this._dateDepart = dateDepart
  }

  get dateArrivee(): Date {
    return this._dateArrivee
  }
  set dateArrivee(dateArrivee: Date) {
    this._dateArrivee = dateArrivee
  }

  get colis(): any[] {
    return this._colis
  }
  set colis(colis: any[]) {
    this._colis = colis
  }

  public fermer(): void {
    this.etatGlobal = EtatGlobal.FERME
  }

  public rouvrir(): void {
    if (this.etatAvancement === EtatAvancement.EN_ATTENTE) {
      this.etatGlobal = EtatGlobal.OUVERT
    } else {
      throw new Error("Impossible d'ouvrir cette cargaison car son état d'avancement n'est pas EN_ATTENTE")
    }
  }

  public async sauvegarder(): Promise<void> {
    try {
      const response = await fetch("http://localhost:3000/cargaisons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.toJSON()),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log("Cargaison sauvegardée:", result)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      throw error
    }
  }

  public toJSON(): object {
    return {
      id: this._numero,
      numero: this._numero,
      poidsMax: this._poidsMax,
      type: this._type,
      distance: this._distanceKm,
      lieuDepart: {
        nom: this._lieuDepart.nom,
        latitude: this._lieuDepart.latitude,
        longitude: this._lieuDepart.longitude,
        pays: this._lieuDepart.pays,
      },
      lieuArrivee: {
        nom: this._lieuArrivee.nom,
        latitude: this._lieuArrivee.latitude,
        longitude: this._lieuArrivee.longitude,
        pays: this._lieuArrivee.pays,
      },
      dateDepart: this._dateDepart.toISOString().split("T")[0], // Format YYYY-MM-DD
      dateArrivee: this._dateArrivee.toISOString().split("T")[0], // Format YYYY-MM-DD
      etatAvancement: this._etatAvancement,
      etatGlobal: this._etatGlobal,
      colis: this._colis,
    }
  }
}
