<?php include __DIR__ . '/../templates/navigation.php'; ?>

<!-- Section: Enregistrement de Colis Client -->
<section id="enregistrement-colis" class="py-32">
<div class="container mx-auto px-4 h-screen overflow-hidden">
    <div class="text-center mb-6">
        <div class="inline-block p-3 bg-cyan-400/10 rounded-xl border border-cyan-400/30 mb-4"><i class="fas fa-user-plus text-3xl text-cyan-400"></i></div>
        <h2 class="text-3xl font-bold mb-3 text-white">Enregistrer un <span class="text-cyan-400">Nouveau Colis Client</span></h2>
        <p class="text-gray-400 text-base">Enregistrez les informations du client et de ses colis pour un envoi</p>
    </div>
    <div class="w-full bg-gray-800 rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400 transition-colors duration-300 max-h-[calc(100vh-200px)] overflow-y-auto">
        <form id="register-package-form" class="space-y-6">
            <!-- Informations Client -->
            <div>
                <h3 class="text-lg font-bold text-cyan-400 mb-3"><i class="fas fa-user mr-2"></i> Informations du Client</h3>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label for="client-nom" class="block text-gray-300 font-semibold mb-1 text-sm">Nom</label>
                        <input type="text" id="client-nom" name="client-nom" placeholder="Nom du client" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                    <div>
                        <label for="client-prenom" class="block text-gray-300 font-semibold mb-1 text-sm">Prénom</label>
                        <input type="text" id="client-prenom" name="client-prenom" placeholder="Prénom du client" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                    <div>
                        <label for="client-phone" class="block text-gray-300 font-semibold mb-1 text-sm">Téléphone</label>
                        <input type="tel" id="client-phone" name="client-phone" placeholder="Ex: +33 6 12 34 56 78" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                    <div>
                        <label for="client-email" class="block text-gray-300 font-semibold mb-1 text-sm">Email (Facultatif)</label>
                        <input type="email" id="client-email" name="client-email" placeholder="email@example.com" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                    <div class="col-span-2 lg:col-span-4">
                        <label for="client-address" class="block text-gray-300 font-semibold mb-1 text-sm">Adresse</label>
                        <input type="text" id="client-address" name="client-address" placeholder="Adresse complète" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                </div>
            </div>
            
            <!-- Informations Colis -->
            <div>
                <h3 class="text-lg font-bold text-cyan-400 mb-3"><i class="fas fa-box-open mr-2"></i> Informations du Colis</h3>
                <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label for="package-count" class="block text-gray-300 font-semibold mb-1 text-sm">Nombre de Colis</label>
                        <input type="number" id="package-count" name="package-count" placeholder="Ex: 1" min="1" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                    <div>
                        <label for="package-weight" class="block text-gray-300 font-semibold mb-1 text-sm">Poids Total (kg)</label>
                        <input type="number" id="package-weight" name="package-weight" placeholder="Ex: 15" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                    <div>
                        <label for="package-product-type" class="block text-gray-300 font-semibold mb-1 text-sm">Type de Produit</label>
                        <select id="package-product-type" name="package-product-type" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none text-sm">
                            <option value="">Sélectionnez un type</option>
                            <option value="alimentaire">Alimentaire</option>
                            <option value="chimique">Chimique</option>
                            <option value="materiel-fragile">Matériel Fragile</option>
                            <option value="materiel-incassable">Matériel Incassable</option>
                        </select>
                    </div>
                    <div>
                        <label for="package-cargo-type" class="block text-gray-300 font-semibold mb-1 text-sm">Type de Cargaison Souhaitée</label>
                        <select id="package-cargo-type" name="package-cargo-type" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none text-sm">
                            <option value="">Sélectionnez un type</option>
                            <option value="maritime">Maritime</option>
                            <option value="aerienne">Aérienne</option>
                            <option value="routiere">Routière</option>
                        </select>
                    </div>
                    <div>
                        <label for="recipient-email-sms" class="block text-gray-300 font-semibold mb-1 text-sm">Email/SMS Destinataire</label>
                        <input type="text" id="recipient-email-sms" name="recipient-email-sms" placeholder="Email ou numéro destinataire" class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm">
                    </div>
                </div>
                <div class="mt-4 p-3 bg-cyan-900/30 rounded-lg border border-cyan-400/30">
                    <p class="text-cyan-300 font-semibold text-xs"><i class="fas fa-info-circle mr-2"></i> Le prix minimum pour chaque colis est de 10.000 F. Si le montant calculé est inférieur, il sera arrondi à 10.000 F.</p>
                </div>
            </div>
            
            <button type="submit" class="w-full py-3 bg-cyan-400 hover:bg-cyan-500 rounded-xl text-gray-900 font-semibold transition-colors duration-300 shadow-lg shadow-cyan-400/25"><i class="fas fa-paper-plane mr-2"></i> Enregistrer Colis & Générer Reçu</button>
        </form>
    </div>
</div>
</section>