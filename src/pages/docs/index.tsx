 import { useState } from "react";

export default function Docs() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    
    return (
        <>
              <div className="w-1/4 p-4 bg-red-50 md:border-r fixed top-0 max-h-screen overflow-y-auto">
                    <h4 className="font-bold mb-4 md:pt-4">Table of Contents</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a href="#section-0" className="block p-2 hover:bg-gray-200 rounded">Aller à demo.safirhammam.com</a></li>
                        <li><a href="#section-1" className="block p-2 hover:bg-gray-200 rounded">1. Introduction</a></li>
                        <li><a href="#section-2" className="block p-2 hover:bg-gray-200 rounded">2. Login</a></li>
                        <li><a href="#section-3" className="block p-2 hover:bg-gray-200 rounded">3. Paramètres</a></li>
                        <li><a href="#section-4" className="block p-2 hover:bg-gray-200 rounded">4. Type Services</a></li>
                        <li><a href="#section-5" className="block p-2 hover:bg-gray-200 rounded">5. Gérer Catégories De Services</a></li>
                        <li><a href="#section-6" className="block p-2 hover:bg-gray-200 rounded">6. Types De Ressources</a></li>
                        <li><a href="#section-7" className="block p-2 hover:bg-gray-200 rounded">7. Gérer Catégories De Ressources</a></li>
                        <li><a href="#section-8" className="block p-2 hover:bg-gray-200 rounded">8. Ouvrir Paramètres Généraux</a></li>
                        <li><a href="#section-9" className="block p-2 hover:bg-gray-200 rounded">9. Configurer Paramètres Système</a></li>
                        <li><a href="#section-10" className="block p-2 hover:bg-gray-200 rounded">10. Services</a></li>
                        <li><a href="#section-11" className="block p-2 hover:bg-gray-200 rounded">11. Gérer Les Services</a></li>
                        <li><a href="#section-12" className="block p-2 hover:bg-gray-200 rounded">12. Sélectionner Service</a></li>
                        <li><a href="#section-13" className="block p-2 hover:bg-gray-200 rounded">13. Détail de service</a></li>
                        <li><a href="#section-14" className="block p-2 hover:bg-gray-200 rounded">14. Membres Du Personnel De Service</a></li>
                        <li><a href="#section-15" className="block p-2 hover:bg-gray-200 rounded">15. Créneaux De Service</a></li>
                        <li><a href="#section-16" className="block p-2 hover:bg-gray-200 rounded">16. Questions De Santé De Service</a></li>
                        <li><a href="#section-17" className="block p-2 hover:bg-gray-200 rounded">17. Ajouter Un Nouveau Service</a></li>
                        <li><a href="#section-18" className="block p-2 hover:bg-gray-200 rounded">18. Activer Formule de sante</a></li>
                        <li><a href="#section-19" className="block p-2 hover:bg-gray-200 rounded">19. Activer des sessions</a></li>
                        <li><a href="#section-20" className="block p-2 hover:bg-gray-200 rounded">20. Remplir Informations De Base</a></li>
                        <li><a href="#section-21" className="block p-2 hover:bg-gray-200 rounded">21. Compléter Formulaire Service</a></li>
                        <li><a href="#section-22" className="block p-2 hover:bg-gray-200 rounded">22. Personnel</a></li>
                        <li><a href="#section-23" className="block p-2 hover:bg-gray-200 rounded">23. Sélectionner Membre Du Personnel</a></li>
                        <li><a href="#section-24" className="block p-2 hover:bg-gray-200 rounded">24. Gérer Membre De L'Équipe</a></li>
                        <li><a href="#section-25" className="block p-2 hover:bg-gray-200 rounded">25. Ouvrir Calendrier Hebdomadaire</a></li>
                        <li><a href="#section-26" className="block p-2 hover:bg-gray-200 rounded">26. Consulter Disponibilité Hebdomadaire</a></li>
                        <li><a href="#section-27" className="block p-2 hover:bg-gray-200 rounded">27. Sélectionner Horaire Personnel</a></li>
                        <li><a href="#section-28" className="block p-2 hover:bg-gray-200 rounded">28. Voir Détails Personnel</a></li>
                        <li><a href="#section-29" className="block p-2 hover:bg-gray-200 rounded">29. Accéder Au Lundi Horaire</a></li>
                        <li><a href="#section-30" className="block p-2 hover:bg-gray-200 rounded">30. Clients</a></li>
                        <li><a href="#section-31" className="block p-2 hover:bg-gray-200 rounded">31. Voir Détails Client</a></li>
                        <li><a href="#section-32" className="block p-2 hover:bg-gray-200 rounded">32. Consulter Informations Personnelles</a></li>
                        <li><a href="#section-33" className="block p-2 hover:bg-gray-200 rounded">33. Avis Du Personnel</a></li>
                        <li><a href="#section-34" className="block p-2 hover:bg-gray-200 rounded">34. Réservations</a></li>
                        <li><a href="#section-35" className="block p-2 hover:bg-gray-200 rounded">35. Sélectionner Réservation Spécifique</a></li>
                        <li><a href="#section-36" className="block p-2 hover:bg-gray-200 rounded">36. Détail Réservation</a></li>
                        <li><a href="#section-37" className="block p-2 hover:bg-gray-200 rounded">37. Services Réservés</a></li>
                        <li><a href="#section-38" className="block p-2 hover:bg-gray-200 rounded">38. Formule de santé du client réservant ce service</a></li>
                        <li><a href="#section-39" className="block p-2 hover:bg-gray-200 rounded">39. Consulter les réponses du client aux questions posées lors de la réservation</a></li>
                        <li><a href="#section-40" className="block p-2 hover:bg-gray-200 rounded">40. Afficher Toutes Les Réservations En Vue Calendrier</a></li>
                        <li><a href="#section-41" className="block p-2 hover:bg-gray-200 rounded">41. Afficher Vue Hebdomadaire</a></li>
                        <li><a href="#section-42" className="block p-2 hover:bg-gray-200 rounded">42. Ouvrir Agenda</a></li>
                        <li><a href="#section-43" className="block p-2 hover:bg-gray-200 rounded">43. Retourner Au Tableau De Bord</a></li>
                        <li><a href="#section-44" className="block p-2 hover:bg-gray-200 rounded">44. Afficher Vue Générale Du Système</a></li>
                        <li><a href="#section-45" className="block p-2 hover:bg-gray-200 rounded">45. Analyser Réservations Par Statut</a></li>
                        <li><a href="#section-46" className="block p-2 hover:bg-gray-200 rounded">46. Mon Profil (Staff view)</a></li>

                        <li><a href="#section-47" className="block p-2 hover:bg-gray-200 rounded">47. Cliquer Sur Modifier</a></li>
                        <li><a href="#section-48" className="block p-2 hover:bg-gray-200 rounded">48. Ouvrir Mon Calendrier</a></li>
                        <li><a href="#section-49" className="block p-2 hover:bg-gray-200 rounded">49. Afficher Vue Table</a></li>
                        <li><a href="#section-50" className="block p-2 hover:bg-gray-200 rounded">50. Afficher Vue Calendrier</a></li>
                        <li><a href="#section-51" className="block p-2 hover:bg-gray-200 rounded">51. Ouvrir Vue Agenda</a></li>
                        <li><a href="#section-52" className="block p-2 hover:bg-gray-200 rounded">52. Écrire Un Avis</a></li>
                        <li><a href="#section-53" className="block p-2 hover:bg-gray-200 rounded">53. Partager Votre Expérience</a></li>
                        <li><a href="#section-54" className="block p-2 hover:bg-gray-200 rounded">54. Remplir Champ Avis</a></li>
                        <li><a href="#section-55" className="block p-2 hover:bg-gray-200 rounded">55. Sélectionner Note</a></li>
                        <li><a href="#section-56" className="block p-2 hover:bg-gray-200 rounded">56. Soumettre L'Avis</a></li>
                     </ul>
                </div>
            <div className="flex ml-[35%] flex-col md:flex-row text-gray-900  md:items-start">
              {/* Table content */}
              
                {/* Main content */}
                <div className="w-3/4 p-6 md:pt-6 pt-20">
                    <div className="text-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-5">
                                Gérer Le Système De Réservation Sur La Plateforme Hammam
                            </h2>
                        </div>
                    </div>

                 

                    <div className="mt-4 mb-4">
                        Ce guide vous montre comment gérer efficacement le système de réservation dans le backoffice de la plateforme Hammam spa
                    </div>
                    
                    <h3 id="section-0" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        Aller à <a href="https://demo.safirhammam.com" target="_blank" rel="noreferrer">demo.safirhammam.com</a>
                    </h3>
                    
                    <h3 id="section-1" className="text-lg font-bold my-4 w-full break-words max-w-full">1. Introduction</h3>
                    <div className="mt-4 mb-4">
                        Vous apprendrez à configurer les services, gérer le personnel et suivre les réservations pour optimiser votre gestion.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_1.png" 
                        alt="Introduction" 
                        onClick={() => { setModalImage("/images/hammam_1.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-2" className="text-lg font-bold my-4 w-full break-words max-w-full">2. Cliquer Sur Login</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur le bouton Login pour accéder à votre compte dans le backoffice de la plateforme.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_2.png" 
                        alt="Cliquer Sur Login" 
                        onClick={() => { setModalImage("/images/hammam_2.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-3" className="text-lg font-bold my-4 w-full break-words max-w-full">3.  Paramètres</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur le menu Settings pour ouvrir les paramètres du système et commencer la configuration.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_3.png" 
                        alt=" Paramètres" 
                        onClick={() => { setModalImage("/images/hammam_3.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-4" className="text-lg font-bold my-4 w-full break-words max-w-full">4. Ouvrir Type Services</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur l'option Type Services pour gérer les catégories de services proposés dans le spa.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_4.png" 
                        alt="Ouvrir Type Services" 
                        onClick={() => { setModalImage("/images/hammam_4.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-5" className="text-lg font-bold my-4 w-full break-words max-w-full">5. Gérer Catégories De Services</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Service Types Management pour gérer les catégories de types de services et ajouter de nouveaux types.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_5.png" 
                        alt="Gérer Catégories De Services" 
                        onClick={() => { setModalImage("/images/hammam_5.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-6" className="text-lg font-bold my-4 w-full break-words max-w-full">6.  Types De Ressources</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Type Resources pour accéder à la gestion des catégories de ressources utilisées dans les services.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_6.png" 
                        alt=" Types De Ressources" 
                        onClick={() => { setModalImage("/images/hammam_6.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-7" className="text-lg font-bold my-4 w-full break-words max-w-full">7. Gérer Catégories De Ressources</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Resource Types Management pour gérer les catégories de types de ressources et ajouter de nouveaux types.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_7.png" 
                        alt="Gérer Catégories De Ressources" 
                        onClick={() => { setModalImage("/images/hammam_7.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-8" className="text-lg font-bold my-4 w-full break-words max-w-full">8. Ouvrir Paramètres Généraux</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur General Settings pour  paramètres généraux du système.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_8.png" 
                        alt="Ouvrir Paramètres Généraux" 
                        onClick={() => { setModalImage("/images/hammam_8.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-9" className="text-lg font-bold my-4 w-full break-words max-w-full">9. Configurer Paramètres Système</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Settings pour configurer les paramètres système, notamment le blocage du calendrier pour les réservations au-delà d'une certaine date et le délai minimum avant réservation.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_9.png" 
                        alt="Configurer Paramètres Système" 
                        onClick={() => { setModalImage("/images/hammam_9.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-10" className="text-lg font-bold my-4 w-full break-words max-w-full">10.  Services</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Services pour gérer les différents services proposés dans la plateforme.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_10.png" 
                        alt=" Services" 
                        onClick={() => { setModalImage("/images/hammam_10.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-11" className="text-lg font-bold my-4 w-full break-words max-w-full">11. Gérer Les Services</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Gestion des services pour voir et gérer tous les services de massage, hammam et salon de coiffure disponibles.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_11.png" 
                        alt="Gérer Les Services" 
                        onClick={() => { setModalImage("/images/hammam_11.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-12" className="text-lg font-bold my-4 w-full break-words max-w-full">12. Sélectionner Accès Hammam</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Accès Hammam pour  détails spécifiques de ce service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_12.png" 
                        alt="Sélectionner Accès Hammam" 
                        onClick={() => { setModalImage("/images/hammam_12.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-13" className="text-lg font-bold my-4 w-full break-words max-w-full">13. Revenir Sur Accès Hammam</h3>
                    <div className="mt-4 mb-4">
                        Cliquez de nouveau sur Accès Hammam pour confirmer la sélection ou modifier les paramètres.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_13.png" 
                        alt="Revenir Sur Accès Hammam" 
                        onClick={() => { setModalImage("/images/hammam_13.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-14" className="text-lg font-bold my-4 w-full break-words max-w-full">14. Ouvrir Membres Du Personnel</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Staff Members pour gérer les membres de l'équipe et leurs informations.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_14.png" 
                        alt="Ouvrir Membres Du Personnel" 
                        onClick={() => { setModalImage("/images/hammam_14.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-15" className="text-lg font-bold my-4 w-full break-words max-w-full">15.  Créneaux De Service</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Créneaux de service pour consulter et gérer les plages horaires disponibles pour chaque service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_15.png" 
                        alt=" Créneaux De Service" 
                        onClick={() => { setModalImage("/images/hammam_15.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-16" className="text-lg font-bold my-4 w-full break-words max-w-full">16. Gérer Questions De Santé</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Questions de santé pour configurer les questions liées à la santé des clients avant réservation.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_16.png" 
                        alt="Gérer Questions De Santé" 
                        onClick={() => { setModalImage("/images/hammam_16.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-17" className="text-lg font-bold my-4 w-full break-words max-w-full">17. Ajouter Un Nouveau Service</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Ajouter un service pour commencer la création d'un nouveau service dans la plateforme.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_17.png" 
                        alt="Ajouter Un Nouveau Service" 
                        onClick={() => { setModalImage("/images/hammam_17.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-18" className="text-lg font-bold my-4 w-full break-words max-w-full">18. Activer Option</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur on pour activer une option ou un paramètre lié au nouveau service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_18.png" 
                        alt="Activer Option" 
                        onClick={() => { setModalImage("/images/hammam_18.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-19" className="text-lg font-bold my-4 w-full break-words max-w-full">19. Activer Deuxième Option</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur on pour activer une autre option nécessaire à la configuration du service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_19.png" 
                        alt="Activer Deuxième Option" 
                        onClick={() => { setModalImage("/images/hammam_19.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-20" className="text-lg font-bold my-4 w-full break-words max-w-full">20. Remplir Informations De Base</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur le formulaire Informations de base pour saisir le nom du service en français et en anglais, sélectionner le type de service, définir la durée, le tampon en minutes, le prix et ajouter une description.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_20.png" 
                        alt="Remplir Informations De Base" 
                        onClick={() => { setModalImage("/images/hammam_20.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-21" className="text-lg font-bold my-4 w-full break-words max-w-full">21. Compléter Formulaire Service</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur le formulaire pour continuer à remplir les détails essentiels du service à ajouter.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_21.png" 
                        alt="Compléter Formulaire Service" 
                        onClick={() => { setModalImage("/images/hammam_21.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-22" className="text-lg font-bold my-4 w-full break-words max-w-full">22. Accéder À L'onglet Personnel</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Staff pour assigner les membres du personnel responsables du nouveau service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_22.png" 
                        alt="Accéder À L'onglet Personnel" 
                        onClick={() => { setModalImage("/images/hammam_22.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-23" className="text-lg font-bold my-4 w-full break-words max-w-full">23. Sélectionner Membre Du Personnel</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur sanae pour choisir ce membre du personnel pour le service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_23.png" 
                        alt="Sélectionner Membre Du Personnel" 
                        onClick={() => { setModalImage("/images/hammam_23.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-24" className="text-lg font-bold my-4 w-full break-words max-w-full">24. Gérer Membre De L'Équipe</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur l'adresse email de sanae pour modifier les informations et les horaires de ce membre de l'équipe.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_24.png" 
                        alt="Gérer Membre De L'Équipe" 
                        onClick={() => { setModalImage("/images/hammam_24.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-25" className="text-lg font-bold my-4 w-full break-words max-w-full">25. Ouvrir Calendrier Hebdomadaire</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Calendrier hebdomadaire pour visualiser la disponibilité du personnel sur la semaine.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_25.png" 
                        alt="Ouvrir Calendrier Hebdomadaire" 
                        onClick={() => { setModalImage("/images/hammam_25.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-26" className="text-lg font-bold my-4 w-full break-words max-w-full">26. Consulter Disponibilité Hebdomadaire</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Calendrier hebdomadaire du personnel pour voir la disponibilité complète de l'équipe sur la semaine.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_26.png" 
                        alt="Consulter Disponibilité Hebdomadaire" 
                        onClick={() => { setModalImage("/images/hammam_26.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-27" className="text-lg font-bold my-4 w-full break-words max-w-full">27. Sélectionner Horaire Personnel</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur les horaires affichés pour FatimZahra, Sanae, Hiba et autres membres pour gérer leurs disponibilités.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_27.png" 
                        alt="Sélectionner Horaire Personnel" 
                        onClick={() => { setModalImage("/images/hammam_27.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-28" className="text-lg font-bold my-4 w-full break-words max-w-full">28. Voir Détails Personnel</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur les informations détaillées du personnel, incluant email, téléphone et services attribués.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_28.png" 
                        alt="Voir Détails Personnel" 
                        onClick={() => { setModalImage("/images/hammam_28.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-29" className="text-lg font-bold my-4 w-full break-words max-w-full">29. Accéder Au Lundi Horaire</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Lundi Horaire pour consulter les plannings du personnel pour ce jour précis.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_29.png" 
                        alt="Accéder Au Lundi Horaire" 
                        onClick={() => { setModalImage("/images/hammam_29.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-30" className="text-lg font-bold my-4 w-full break-words max-w-full">30. Ouvrir Section Clients</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Clients pour accéder à la gestion des clients enregistrés dans la plateforme.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_30.png" 
                        alt="Ouvrir Section Clients" 
                        onClick={() => { setModalImage("/images/hammam_30.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-31" className="text-lg font-bold my-4 w-full break-words max-w-full">31. Voir Détails Client</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur View Details pour consulter les informations détaillées d'un client spécifique.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_31.png" 
                        alt="Voir Détails Client" 
                        onClick={() => { setModalImage("/images/hammam_31.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-32" className="text-lg font-bold my-4 w-full break-words max-w-full">32. Consulter Informations Personnelles</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Personal Information pour voir les données personnelles du client sélectionné.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_32.png" 
                        alt="Consulter Informations Personnelles" 
                        onClick={() => { setModalImage("/images/hammam_32.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-33" className="text-lg font-bold my-4 w-full break-words max-w-full">33.  Avis Du Personnel</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Staff Reviews pour lire les avis laissés par le personnel concernant ce client.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_33.png" 
                        alt=" Avis Du Personnel" 
                        onClick={() => { setModalImage("/images/hammam_33.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-34" className="text-lg font-bold my-4 w-full break-words max-w-full">34. Voir Réservations Client</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Bookings pour consulter l'historique des réservations effectuées par ce client.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_34.png" 
                        alt="Voir Réservations Client" 
                        onClick={() => { setModalImage("/images/hammam_34.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-35" className="text-lg font-bold my-4 w-full break-words max-w-full">35. Sélectionner Réservation Spécifique</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur l'identifiant unique de la réservation pour  détails complets.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_35.png" 
                        alt="Sélectionner Réservation Spécifique" 
                        onClick={() => { setModalImage("/images/hammam_35.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-36" className="text-lg font-bold my-4 w-full break-words max-w-full">36. Modifier Statut Réservation</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Status pour changer le statut de la réservation selon son avancement.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_36.png" 
                        alt="Modifier Statut Réservation" 
                        onClick={() => { setModalImage("/images/hammam_36.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-37" className="text-lg font-bold my-4 w-full break-words max-w-full">37.  Services Réservés</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Services pour voir les services inclus dans la réservation sélectionnée.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_37.png" 
                        alt=" Services Réservés" 
                        onClick={() => { setModalImage("/images/hammam_37.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-38" className="text-lg font-bold my-4 w-full break-words max-w-full">38. Formule de santé du client réservant ce service</h3>
                    <div className="mt-4 mb-4">
                        Cliquez ici pour accéder à la formule de santé remplie par le client lors de la réservation de ce service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_38.png" 
                        alt="Cliquer Sur Lien Spécifique" 
                        onClick={() => { setModalImage("/images/hammam_38.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-39" className="text-lg font-bold my-4 w-full break-words max-w-full">39. Voir Coordonnées Client</h3>
                    <div className="mt-4 mb-4">
                        Cliquez ici pour consulter les réponses du client aux questions posées lors de la réservation, incluant ses coordonnées et informations personnelles.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_39.png" 
                        alt="Voir Coordonnées Client" 
                        onClick={() => { setModalImage("/images/hammam_39.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-40" className="text-lg font-bold my-4 w-full break-words max-w-full">40. Afficher Toutes Les Réservations En Vue Calendrier</h3>
                    <div className="mt-4 mb-4">
                        Cliquez ici pour afficher toutes les réservations dans une vue calendrier complète, permettant de visualiser l'ensemble des rendez-vous et disponibilités.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_40.png" 
                        alt="Afficher Vue Journalière" 
                        onClick={() => { setModalImage("/images/hammam_40.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-41" className="text-lg font-bold my-4 w-full break-words max-w-full">41. Afficher Vue Hebdomadaire</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Week pour consulter les réservations et plannings sur la semaine.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_41.png" 
                        alt="Afficher Vue Hebdomadaire" 
                        onClick={() => { setModalImage("/images/hammam_41.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-42" className="text-lg font-bold my-4 w-full break-words max-w-full">42. Ouvrir Agenda</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Agenda pour visualiser l'ensemble des réservations et disponibilités dans un calendrier.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_42.png" 
                        alt="Ouvrir Agenda" 
                        onClick={() => { setModalImage("/images/hammam_42.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-43" className="text-lg font-bold my-4 w-full break-words max-w-full">43. Retourner Au Tableau De Bord</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Dashboard pour revenir à la page principale de gestion des réservations.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_43.png" 
                        alt="Retourner Au Tableau De Bord" 
                        onClick={() => { setModalImage("/images/hammam_43.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-44" className="text-lg font-bold my-4 w-full break-words max-w-full">44. Afficher Vue Générale Du Système</h3>
                    <div className="mt-4 mb-4">
                        Cliquez ici pour accéder à la vue générale du système de réservation, offrant un aperçu complet de toutes les réservations et fonctionnalités disponibles.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_44.png" 
                        alt="Afficher Vue Générale Du Système" 
                        onClick={() => { setModalImage("/images/hammam_44.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-45" className="text-lg font-bold my-4 w-full break-words max-w-full">45. Analyser Réservations Par Statut</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Réservations par statut pour filtrer et analyser les réservations confirmées, terminées, annulées ou absentes.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_45.png" 
                        alt="Analyser Réservations Par Statut" 
                        onClick={() => { setModalImage("/images/hammam_45.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-46" className="text-lg font-bold my-4 w-full break-words max-w-full">46. Accéder À Mon Profil</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur My Profile pour modifier vos informations personnelles et préférences.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_46.png" 
                        alt="Accéder À Mon Profil" 
                        onClick={() => { setModalImage("/images/hammam_46.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-47" className="text-lg font-bold my-4 w-full break-words max-w-full">47. Cliquer Sur Modifier</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Modifier pour éditer les informations ou paramètres du profil sélectionné.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_50.png" 
                        alt="Cliquer Sur Modifier" 
                        onClick={() => { setModalImage("/images/hammam_50.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-48" className="text-lg font-bold my-4 w-full break-words max-w-full">48. Ouvrir Mon Calendrier</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur My Calendar pour consulter votre planning personnel et vos disponibilités.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_52.png" 
                        alt="Ouvrir Mon Calendrier" 
                        onClick={() => { setModalImage("/images/hammam_52.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-49" className="text-lg font-bold my-4 w-full break-words max-w-full">49. Afficher Vue Table</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Table pour visualiser les données sous forme de tableau.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_53.png" 
                        alt="Afficher Vue Table" 
                        onClick={() => { setModalImage("/images/hammam_53.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-50" className="text-lg font-bold my-4 w-full break-words max-w-full">50. Afficher Vue Calendrier</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Calendar pour voir les événements et réservations dans un calendrier.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_54.png" 
                        alt="Afficher Vue Calendrier" 
                        onClick={() => { setModalImage("/images/hammam_54.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-51" className="text-lg font-bold my-4 w-full break-words max-w-full">51. Ouvrir Vue Agenda</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Agenda pour accéder à la vue détaillée des rendez-vous et disponibilités.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_55.png" 
                        alt="Ouvrir Vue Agenda" 
                        onClick={() => { setModalImage("/images/hammam_55.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-52" className="text-lg font-bold my-4 w-full break-words max-w-full">52. Écrire Un Avis</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Write Review pour rédiger un avis concernant un membre du personnel ou un service.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_56.png" 
                        alt="Écrire Un Avis" 
                        onClick={() => { setModalImage("/images/hammam_56.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-53" className="text-lg font-bold my-4 w-full break-words max-w-full">53. Partager Votre Expérience</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Share your experience... pour commencer à écrire votre retour d'expérience.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_57.png" 
                        alt="Partager Votre Expérience" 
                        onClick={() => { setModalImage("/images/hammam_57.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-54" className="text-lg font-bold my-4 w-full break-words max-w-full">54. Remplir Champ Avis</h3>
                    <div className="mt-4 mb-4">
                        Entrez votre texte d'avis, par exemple "test reviw", pour partager votre opinion.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_58.png" 
                        alt="Remplir Champ Avis" 
                        onClick={() => { setModalImage("/images/hammam_58.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-55" className="text-lg font-bold my-4 w-full break-words max-w-full">55. Sélectionner Note</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Rating* pour attribuer une note à l'avis que vous rédigez.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_59.png" 
                        alt="Sélectionner Note" 
                        onClick={() => { setModalImage("/images/hammam_59.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />
                    <h3 id="section-56" className="text-lg font-bold my-4 w-full break-words max-w-full">56. Soumettre L'Avis</h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur Submit Review pour envoyer votre avis et le rendre visible dans le système.
                    </div>
                    <img 
                        className="w-full" 
                        src="/images/hammam_60.png" 
                        alt="Soumettre L'Avis" 
                        onClick={() => { setModalImage("/images/hammam_60.png"); setModalOpen(true); }} 
                        style={{ cursor: "pointer" }} 
                    />

                    <div className="mt-4 mb-4">
                        Vous avez appris à gérer le système de réservation du backoffice Hammam spa, incluant la configuration des services, la gestion du personnel et le suivi des réservations. Vous pouvez désormais optimiser la gestion quotidienne et améliorer l'expérience client grâce à ces fonctionnalités.
                    </div>

                    <div className="mr-0.5">
                        <a href="https://www.guidde.com" rel="noreferrer" target="_blank" className="no-underline text-black">
                            Powered by <strong className="text-[#CB0000]">guidde</strong>
                        </a>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
                    onClick={() => setModalOpen(false)}
                >
                    <div className="relative max-w-4xl max-h-full p-4">
                        <img src={modalImage} alt="Enlarged view" className="max-w-full max-h-screen" />
                        <button 
                            className="absolute top-2 right-2 text-white text-4xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                            onClick={() => setModalOpen(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}