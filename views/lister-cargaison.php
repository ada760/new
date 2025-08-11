<?php include __DIR__ . '/../templates/navigation.php'; ?>

       <!-- Filtres et Recherche -->
        <div class="bg-gray-800 rounded-2xl p-6 border border-cyan-500/20 mb-8 mt-12">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center space-x-4">
                    <select id="type-filter" class="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                        <option value="">Tous les types</option>
                        <option value="maritime">Maritime</option>
                        <option value="aerienne">Aérienne</option>
                        <option value="routiere">Routière</option>
                    </select>
                    <select id="status-filter" class="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none">
                        <option value="">Tous les états</option>
                        <option value="en-attente">En attente</option>
                        <option value="en-cours">En cours</option>
                        <option value="arrive">Arrivé</option>
                        <option value="recupere">Récupéré</option>
                        <option value="perdu">Perdu</option>
                        <option value="archive">Archivé</option>
                    </select>
                </div>
                <div class="flex items-center space-x-2">
                    <input type="text" id="search-input" placeholder="Rechercher par numéro, lieu..." class="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none">
                    <button onclick="searchCargo()" class="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Table des Cargaisons -->
        <div class="bg-gray-800 rounded-2xl border border-cyan-500/20 overflow-hidden px-12 py-8 ">
            <div class="p-6 border-b border-gray-700">
                <h3 class="text-xl font-bold text-white">Cargaisons Récentes</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-700">
                        <tr>
                            <th class="text-left p-4 text-cyan-400 font-semibold">Numéro</th>
                            <th class="text-left p-4 text-cyan-400 font-semibold">Type</th>
                            <th class="text-left p-4 text-cyan-400 font-semibold">Trajet</th>
                            <th class="text-left p-4 text-cyan-400 font-semibold">Poids/Max</th>
                            <th class="text-left p-4 text-cyan-400 font-semibold">État</th>
                            <th class="text-left p-4 text-cyan-400 font-semibold">Statut</th>
                            <th class="text-left p-4 text-cyan-400 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="cargo-table-body">
                        <!-- Données exemple -->
                        <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                            <td class="p-4 text-white font-mono">CARG-2024-001</td>
                            <td class="p-4">
                                <span class="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                                <span class="text-blue-400">Maritime</span>
                            </td>
                            <td class="p-4 text-gray-300">Dakar → Marseille</td>
                            <td class="p-4 text-gray-300">3,500 / 5,000 kg</td>
                            <td class="p-4">
                                <span class="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-semibold">En attente</span>
                            </td>
                            <td class="p-4">
                                <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">Ouvert</span>
                            </td>
                            <td class="p-4">
                                <div class="flex space-x-2">
                                    <button onclick="viewCargo('CARG-2024-001')" class="p-1 text-cyan-400 hover:bg-cyan-500/20 rounded">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="editCargo('CARG-2024-001')" class="p-1 text-yellow-400 hover:bg-yellow-500/20 rounded">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="toggleCargoStatus('CARG-2024-001')" class="p-1 text-red-400 hover:bg-red-500/20 rounded">
                                        <i class="fas fa-lock"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                            <td class="p-4 text-white font-mono">CARG-2024-002</td>
                            <td class="p-4">
                                <span class="inline-block w-3 h-3 bg-cyan-400 rounded-full mr-2"></span>
                                <span class="text-cyan-400">Aérienne</span>
                            </td>
                            <td class="p-4 text-gray-300">Paris → New York</td>
                            <td class="p-4 text-gray-300">1,200 / 2,000 kg</td>
                            <td class="p-4">
                                <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold">En cours</span>
                            </td>
                            <td class="p-4">
                                <span class="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold">Fermé</span>
                            </td>
                            <td class="p-4">
                                <div class="flex space-x-2">
                                    <button onclick="viewCargo('CARG-2024-002')" class="p-1 text-cyan-400 hover:bg-cyan-500/20 rounded">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="editCargo('CARG-2024-002')" class="p-1 text-yellow-400 hover:bg-yellow-500/20 rounded">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="trackCargo('CARG-2024-002')" class="p-1 text-green-400 hover:bg-green-500/20 rounded">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-gray-700">
                <div class="flex items-center justify-between">
                    <span class="text-gray-400 text-sm">Affichage de 1-10 sur 47 cargaisons</span>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">Précédent</button>
                        <button class="px-3 py-1 bg-cyan-500 rounded text-white text-sm">1</button>
                        <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">2</button>
                        <button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">Suivant</button>
                    </div>
                </div>
            </div>
        </div>