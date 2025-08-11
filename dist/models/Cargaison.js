import { EtatAvancement } from "../enums/EtatAvancement";
import { EtatGlobal } from "../enums/EtatGlobal";
import { TypeCargaison } from "../enums/TypeCargaison";
export class Cargaison {
    constructor(data) {
        this._numero = data.numero || "";
        this._poidsMax = data.poidsMax || 0;
        this._distanceKm = data.distanceKm || 0;
        // Initialisation des objets Lieu avec des valeurs par défaut si non fournies
        this._lieuDepart = data.lieuDepart || { nom: "", latitude: 0, longitude: 0, pays: "" };
        this._lieuArrivee = data.lieuArrivee || { nom: "", latitude: 0, longitude: 0, pays: "" };
        this._type = data.type || TypeCargaison.AERIEN;
        this._etatAvancement = data.etatAvancement || EtatAvancement.EN_ATTENTE;
        this._etatGlobal = data.etatGlobal || EtatGlobal.OUVERT;
        this._dateDepart = data.dateDepart || new Date();
        this._dateArrivee = data.dateArrivee || new Date();
        this._colis = data.colis || [];
    }
    get numero() {
        return this._numero;
    }
    set numero(numero) {
        this._numero = numero;
    }
    get poidsMax() {
        return this._poidsMax;
    }
    set poidsMax(poidsMax) {
        this._poidsMax = poidsMax;
    }
    get distanceKm() {
        return this._distanceKm;
    }
    set distanceKm(distanceKm) {
        this._distanceKm = distanceKm;
    }
    get lieuDepart() {
        // Type changé en Lieu
        return this._lieuDepart;
    }
    set lieuDepart(lieuDepart) {
        // Type changé en Lieu
        this._lieuDepart = lieuDepart;
    }
    get lieuArrivee() {
        // Type changé en Lieu
        return this._lieuArrivee;
    }
    set lieuArrivee(lieuArrivee) {
        // Type changé en Lieu
        this._lieuArrivee = lieuArrivee;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get etatAvancement() {
        return this._etatAvancement;
    }
    set etatAvancement(etatAvancement) {
        this._etatAvancement = etatAvancement;
    }
    get etatGlobal() {
        return this._etatGlobal;
    }
    set etatGlobal(etatGlobal) {
        this._etatGlobal = etatGlobal;
    }
    get dateDepart() {
        return this._dateDepart;
    }
    set dateDepart(dateDepart) {
        this._dateDepart = dateDepart;
    }
    get dateArrivee() {
        return this._dateArrivee;
    }
    set dateArrivee(dateArrivee) {
        this._dateArrivee = dateArrivee;
    }
    get colis() {
        return this._colis;
    }
    set colis(colis) {
        this._colis = colis;
    }
    fermer() {
        this.etatGlobal = EtatGlobal.FERME;
    }
    rouvrir() {
        if (this.etatAvancement === EtatAvancement.EN_ATTENTE) {
            this.etatGlobal = EtatGlobal.OUVERT;
        }
        else {
            throw new Error("Impossible d'ouvrir cette cargaison car son état d'avancement n'est pas EN_ATTENTE");
        }
    }
    async sauvegarder() {
        try {
            const response = await fetch("http://localhost:3000/cargaisons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.toJSON()),
            });
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const result = await response.json();
            console.log("Cargaison sauvegardée:", result);
        }
        catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            throw error;
        }
    }
    toJSON() {
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
        };
    }
}
