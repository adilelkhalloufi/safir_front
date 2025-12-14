Spécification Frontend – SAFIR Moroccan Hammam & Spa (React)
1. Contexte & objectifs
Le frontend sera développé en React (SPA ou app avec routing) et consommera les APIs Laravel.
Objectifs principaux : parcours de réservation ultra simple, mobile-first, bilingue FR/EN, et interface back-office claire pour la réception et le staff.​

2. Stack & organisation du projet
React (hooks, functional components).

React Router pour la navigation (client / back-office).​

Gestion d’état : React Query / Redux Toolkit (au choix) pour gérer le cache des appels API.

UI : librairie de composants (MUI, Chakra, Tailwind + composants maison).

Internationalisation : react-i18next ou équivalent (FR/EN).

Intégration paiements : Web Payments SDK de Square (via react-square-web-payments-sdk).​

Organisation suggérée :

/modules/public : pages marketing + intégration avec le site vitrine (iframe / lien / sous-domaine).

/modules/booking : parcours de réservation client.

/modules/client-portal : compte client.

/modules/backoffice : réception, admin, staff (planning, stats, marketing).

/shared : composants communs (buttons, inputs, layouts, modals, etc.).

3. Parcours client – UI/UX à implémenter
3.1 Étapes du parcours de réservation
Le développeur doit couvrir un “wizard” clair en plusieurs étapes :

Choix langue

Écran d’entrée : FR / EN.

 

Sélection type(s) de service

Massothérapie / Coiffure / Hammam.

L’utilisateur peut ajouter plusieurs services (liste avec ordre modifiable : drag & drop simple ou boutons “monter/descendre”).

Détails services

Pour chaque service sélectionné :

Options spécifiques (ex : durée si variantes).

Possibilité de choisir un thérapeute / coiffeuse précis(e) ou “Pas de préférence”.

Pour Hammam : type d’expérience (self-service, classique, ultimate, etc. – selon données backend).

Choix date / horaires compatibles

Calendrier + liste de créneaux “compatibles” retournés par l’API multi-services.

Affichage clair des contraintes intégrées :

Durée totale, pauses, ressources, règles Hammam (genre / sessions fixes).

Gestion des cas : aucun créneau disponible ⇒ message clair + navigation simple vers autre date.

Détails client & groupe

Saisie/connexion : login / création de compte.

Possibilité de réserver pour 1 à 4 personnes (nom + email minimal pour invités si demandé).

Formulaires de santé

Si services massothérapie ou Hammam :

Proposer ou imposer le formulaire santé (redirection vers formulaire si non rempli).

Gestion en FR/EN selon langue choisie.

Indiquer clairement que le formulaire est sécurisé et n’est visible que par le staff autorisé.

Garantie carte (Square)

Intégrer le widget de saisie de carte via SDK Square, dans un écran dédié “Garantie de réservation”.​

Le frontend ne doit jamais manipuler les données carte en brut : uniquement les composants Square + token envoyé au backend.

Récapitulatif & confirmation

Détail des services, horaires, staff, politique d’annulation / no-show.

Bouton “Confirmer la réservation”.

Affichage d’un écran de succès avec résumé + mention de l’email/SMS de confirmation.

3.2 Réservation Hammam – cas spécifiques
Choix du genre (ou plusieurs personnes avec genres possibles) pour filtrer les sessions autorisées.

Affichage clair des sessions fixes (10h, 12h, 14h, 16h, 18h) selon le jour et le type (Femmes / Hommes / Mixte).

Si l’utilisateur choisit une session incompatible (par URL direct ou bug), afficher une alerte UI avec message venant de l’API.

4. Ecrans pour le compte client
À implémenter :

Dashboard client

Prochain(s) rendez-vous.

Boutons “Modifier” / “Annuler” avec les restrictions (24h).

Historique des rendez-vous

Liste des réservations passées avec filtres (par service).

Abonnements Hammam

Affichage : séances totales, consommées, restantes.

Bouton “Réserver une séance avec abonnement” qui pré-remplit le type de service.

Formulaires de santé

Voir l’état : complété / à compléter.

Accès pour remplir / modifier (si logiciel le permet).

Paramètres du compte

Profil de base : nom, email, téléphone, langue.

5. Interface réception & staff (Back-office React)
5.1 Dashboard réception
Fonctions à prévoir :

Vue calendrier unifié (jour / semaine) :

Couleurs par service (masso / coiffure / hammam).

Indications claires des ressources (salle, chaise, session hammam).

Actions rapides :

Créer une réservation pour un client (appel téléphonique, walk-in).

Modifier/annuler une réservation.

Marquer “no-show” et déclencher la pénalité (en appelant l’API).

Filtres : par staff, par service, par ressource.

5.2 Vue staff (masso / coiffure / hammam)
Chaque staff voit :

Son planning (liste ou calendrier).

Détail de chaque rendez-vous (client, service, notes).

Staff masso :

Accès aux formulaires santé pertinents (via API sécurisée).

Staff hammam :

Vue des sessions (heure, nombre de clients, type de service) sans détails médicaux.

5.3 Module statistiques (UI)
Graphiques / tableaux basés sur les endpoints statistiques :

Taux de remplissage par service.

Revenus par service / période.

Taux de no-show, heures travaillées, performance du staff.

6. Gestion de l’état & appels API
Le développeur doit :

Centraliser les appels API dans des services (/api/bookingApi.ts, /api/clientApi.ts, etc.).

Utiliser un outil comme React Query pour :

Caching des données (services, disponibilités, bookings).

Invalidation des queries après création/modification de réservation.

Gérer les états de chargement et d’erreur UX-friendly (spinners, messages d’erreur traduits).

7. Multilingue (FR / EN)
Mettre en place react-i18next (ou équivalent) :

Fichiers fr.json et en.json pour tous les textes d’interface.

Propager la langue choisie vers l’API (header) afin de recevoir les libellés corrects.

S’assurer que :

Tous les écrans publics (booking) sont intégralement traduits.

Emails/SMS eux-mêmes sont gérés côté backend, mais le frontend doit envoyer l’info de langue.

8. Paiement & garantie carte (Square)
Utiliser react-square-web-payments-sdk pour intégrer la collecte de carte dans le parcours.​

Composant dédié : PaymentGuaranteeStep avec :

Affichage des infos sur la politique no-show / annulation.

Composants carte Square.

Récupération secure du nonce/token, puis appel à l’API Laravel pour l’enregistrer.

Gestion des états : erreur de carte, carte refusée, etc.

9. Responsive & accessibilité
Mobile-first :

Tests sur petits écrans (iPhone, Android).

Navigation par “wizard” vertical facile à suivre sur mobile.

Accessibilité :

Labels, aria-attributes, contrastes, navigation clavier.

Performance :

Code splitting par route (React.lazy) pour réduire le bundle initial.