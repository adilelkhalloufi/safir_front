import { Header } from "@/components/landing/Header";
import { useState } from "react";


export default function Docs() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    return (
        <>
            <Header />
            <div className="flex flex-col md:flex-row mt-28 text-gray-900 min-h-screen">
                <div className="w-full md:w-1/4 p-4 md:sticky md:top-28 h-auto md:h-[calc(100vh-7rem)] overflow-y-auto bg-gray-50 md:border-r">
                    <h4 className="font-bold mb-4">Table of Contents</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a href="#section-1" className="block p-2 hover:bg-gray-200 rounded">Aller à optiquely.com</a></li>
                        <li><a href="#section-2" className="block p-2 hover:bg-gray-200 rounded">1. Introduction</a></li>
                        <li><a href="#section-3" className="block p-2 hover:bg-gray-200 rounded">2. Commencez Maintenant</a></li>
                        <li><a href="#section-4" className="block p-2 hover:bg-gray-200 rounded">3. Entrer Informations D'inscription</a></li>
                        <li><a href="#section-5" className="block p-2 hover:bg-gray-200 rounded">4. Créer Un Compte</a></li>
                        <li><a href="#section-6" className="block p-2 hover:bg-gray-200 rounded">5. Entrer Identifiants De Connexion</a></li>
                        <li><a href="#section-7" className="block p-2 hover:bg-gray-200 rounded">6. Login</a></li>
                        <li><a href="#section-8" className="block p-2 hover:bg-gray-200 rounded">7. Sélectionner Boutique Optique</a></li>
                        <li><a href="#section-9" className="block p-2 hover:bg-gray-200 rounded">8. Menu Produit</a></li>
                        <li><a href="#section-10" className="block p-2 hover:bg-gray-200 rounded">9. Cliquer Sur Nouveau Produit</a></li>
                        <li><a href="#section-11" className="block p-2 hover:bg-gray-200 rounded">10. Cliquer Sur Créer Produit</a></li>
                        <li><a href="#section-12" className="block p-2 hover:bg-gray-200 rounded">11. Menu Achat</a></li>
                        <li><a href="#section-13" className="block p-2 hover:bg-gray-200 rounded">12. Cliquer Sur Nouvelle Commande</a></li>
                        <li><a href="#section-14" className="block p-2 hover:bg-gray-200 rounded">13. Sélectionner Fournisseur</a></li>
                        <li><a href="#section-15" className="block p-2 hover:bg-gray-200 rounded">14. Choisir Fournisseur Spécifique</a></li>
                        <li><a href="#section-16" className="block p-2 hover:bg-gray-200 rounded">15. Sélectionner Méthode De Paiement</a></li>
                        <li><a href="#section-17" className="block p-2 hover:bg-gray-200 rounded">16. Choisir Mode De Paiement</a></li>
                        <li><a href="#section-18" className="block p-2 hover:bg-gray-200 rounded">17. Cliquer Sur Ajouter Article</a></li>
                        <li><a href="#section-19" className="block p-2 hover:bg-gray-200 rounded">18. Cliquer Sur Sélectionner Produit</a></li>
                        <li><a href="#section-20" className="block p-2 hover:bg-gray-200 rounded">19. Choisir Premier Produit</a></li>
                        <li><a href="#section-21" className="block p-2 hover:bg-gray-200 rounded">20. Cliquer Sur Ajouter Produit</a></li>
                        <li><a href="#section-22" className="block p-2 hover:bg-gray-200 rounded">21. Cliquer Sur Quantité</a></li>
                        <li><a href="#section-23" className="block p-2 hover:bg-gray-200 rounded">22. Confirmer Quantité Commandée</a></li>
                        <li><a href="#section-24" className="block p-2 hover:bg-gray-200 rounded">23. Cliquer Sur Enregistrer Commande</a></li>
                        <li><a href="#section-25" className="block p-2 hover:bg-gray-200 rounded">24. Cliquer Sur Brouillon</a></li>
                        <li><a href="#section-26" className="block p-2 hover:bg-gray-200 rounded">25. Cliquer Sur Approuver Commande</a></li>
                        <li><a href="#section-27" className="block p-2 hover:bg-gray-200 rounded">26. Cliquer Sur Confirmer Validation</a></li>
                        <li><a href="#section-28" className="block p-2 hover:bg-gray-200 rounded">27. Accéder Au Menu Point De Vente</a></li>
                        <li><a href="#section-29" className="block p-2 hover:bg-gray-200 rounded">28. Cliquer Sur Ajouter Point De Vente</a></li>
                        <li><a href="#section-30" className="block p-2 hover:bg-gray-200 rounded">29. Cliquer Sur Bouton Plus Pour ajouter quantité</a></li>
                        <li><a href="#section-31" className="block p-2 hover:bg-gray-200 rounded">30. Cliquez Pour Ajouter visite client</a></li>
                        <li><a href="#section-32" className="block p-2 hover:bg-gray-200 rounded">31. Entrer Nom Du Client</a></li>
                        <li><a href="#section-33" className="block p-2 hover:bg-gray-200 rounded">32. Entrer Numéro De Téléphone</a></li>
                        <li><a href="#section-34" className="block p-2 hover:bg-gray-200 rounded">33. Entrer Jour De Naissance</a></li>
                        <li><a href="#section-35" className="block p-2 hover:bg-gray-200 rounded">34. Cliquer Sur Bouton Suivant</a></li>
                        <li><a href="#section-36" className="block p-2 hover:bg-gray-200 rounded">35. Sélectionner Type de prospection</a></li>
                        <li><a href="#section-37" className="block p-2 hover:bg-gray-200 rounded">36. Remplissez le formulaire</a></li>
                        <li><a href="#section-38" className="block p-2 hover:bg-gray-200 rounded">37. Cliquer Sur Bouton Suivant</a></li>
                        <li><a href="#section-39" className="block p-2 hover:bg-gray-200 rounded">38. Cliquez Pour Ajouter type de verre</a></li>
                        <li><a href="#section-40" className="block p-2 hover:bg-gray-200 rounded">39. Sélectionner Type De Verre</a></li>
                        <li><a href="#section-41" className="block p-2 hover:bg-gray-200 rounded">40. Change le Prix</a></li>
                        <li><a href="#section-42" className="block p-2 hover:bg-gray-200 rounded">41. Cliquer Sur Bouton Suivant</a></li>
                        <li><a href="#section-43" className="block p-2 hover:bg-gray-200 rounded">42. Sélectionner Mutuelle</a></li>
                        <li><a href="#section-44" className="block p-2 hover:bg-gray-200 rounded">43. Cliquer Sur Champ Zéro</a></li>
                        <li><a href="#section-45" className="block p-2 hover:bg-gray-200 rounded">44. Entrer Valeur Cinquante</a></li>
                        <li><a href="#section-46" className="block p-2 hover:bg-gray-200 rounded">45. Activer Option</a></li>
                        <li><a href="#section-47" className="block p-2 hover:bg-gray-200 rounded">46. Cliquer Sur Valider</a></li>
                        <li><a href="#section-48" className="block p-2 hover:bg-gray-200 rounded">47. Acheter Maintenant</a></li>
                        <li><a href="#section-49" className="block p-2 hover:bg-gray-200 rounded">48. Accéder Au Menu Commande</a></li>
                        <li><a href="#section-50" className="block p-2 hover:bg-gray-200 rounded">49. Imprimer Reçu</a></li>
                        <li><a href="#section-51" className="block p-2 hover:bg-gray-200 rounded">50. Menu Commandes</a></li>
                        <li><a href="#section-52" className="block p-2 hover:bg-gray-200 rounded">51. Menu Paiement</a></li>
                        <li><a href="#section-53" className="block p-2 hover:bg-gray-200 rounded">52. Ajouter Paiement</a></li>
                        <li><a href="#section-54" className="block p-2 hover:bg-gray-200 rounded">53. Enregistrer Paiement</a></li>
                        <li><a href="#section-55" className="block p-2 hover:bg-gray-200 rounded">54. Entrer Montant Paiement</a></li>
                        <li><a href="#section-56" className="block p-2 hover:bg-gray-200 rounded">55. Enregistrer Paiement</a></li>
                        <li><a href="#section-57" className="block p-2 hover:bg-gray-200 rounded">56. Statut Payé</a></li>
                        <li><a href="#section-58" className="block p-2 hover:bg-gray-200 rounded">57. Menu Clients</a></li>
                        <li><a href="#section-59" className="block p-2 hover:bg-gray-200 rounded">58. Sélectionner Client</a></li>
                        <li><a href="#section-60" className="block p-2 hover:bg-gray-200 rounded">59. Information sur client</a></li>
                        <li><a href="#section-61" className="block p-2 hover:bg-gray-200 rounded">60. Menu Caisse</a></li>
                        <li><a href="#section-62" className="block p-2 hover:bg-gray-200 rounded">61. Transfert De Stock</a></li>
                        <li><a href="#section-63" className="block p-2 hover:bg-gray-200 rounded">62. Nouveau Transfert</a></li>
                        <li><a href="#section-64" className="block p-2 hover:bg-gray-200 rounded">63. Sélectionner Magasin Source</a></li>
                        <li><a href="#section-65" className="block p-2 hover:bg-gray-200 rounded">64. Sélectionner Magasin Destination</a></li>
                        <li><a href="#section-66" className="block p-2 hover:bg-gray-200 rounded">65. Cliquer Sur Ajouter Transfert</a></li>
                    </ul>
                </div>
                <div className="w-full md:w-3/4 p-6 md:pt-6 pt-20">
                    <div className="text-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-5">
                                Gérer Votre Boutique Optique Avec La Plateforme Optiquely
                            </h2>
                        </div>
                    </div>

                    <div className="relative pb-[56.25%]">

                        <div
                            className="container mx-auto px-4 py-8">
                            <iframe className="w-full h-full absolute left-0 top-0 rounded-lg"
                                src="https://www.youtube.com/embed/efwyAMC01Xw?si=3ILZRwr-xv4ci7OX" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </div>
                    </div>

                    <div className="mt-4 mb-4">
                        Ce guide vous montre comment gérer efficacement votre boutique optique en
                        utilisant la plateforme Optiquely
                    </div>
                    <h3 id="section-1" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        Aller à
                        <a href="https://optiquely.com" target="_blank">optiquely.com</a>
                    </h3>
                    <h3 id="section-2" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        1. Introduction
                    </h3>
                    <div className="mt-4 mb-4">
                        Vous apprendrez à configurer les produits, gérer les commandes, les
                        clients et le stock pour optimiser votre activité.
                    </div>
                    <img className="w-full" src="images/image_1.png" alt="Introduction" onClick={() => { setModalImage("images/image_1.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-3" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        2. Cliquer Sur Commencez Maintenant
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Commencez maintenant" pour démarrer le processus
                        d'inscription sur la plateforme Optiquely.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_2.png"
                        alt="Cliquer Sur Commencez Maintenant"
                    onClick={() => { setModalImage("images/image_2.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-4" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        3. Entrer Informations D'inscription
                    </h3>
                    <div className="mt-4 mb-4">
                        Entrez les informations requises dans le formulaire d'inscription pour
                        créer votre compte utilisateur.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_3.png"
                        alt="Entrer Informations D'inscription"
                    onClick={() => { setModalImage("images/image_3.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-5" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        4. Cliquer Sur Créer Un Compte
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Créer un compte" pour finaliser votre inscription et accéder
                        à la plateforme.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_4.png"
                        alt="Cliquer Sur Créer Un Compte"
                    onClick={() => { setModalImage("images/image_4.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-6" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        5. Entrer Identifiants De Connexion
                    </h3>
                    <div className="mt-4 mb-4">
                        Saisissez vos identifiants de connexion pour accéder à votre compte
                        Optiquely.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_5.png"
                        alt="Entrer Identifiants De Connexion"
                    onClick={() => { setModalImage("images/image_5.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-7" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        6. Cliquer Sur Bouton Login
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur le bouton "Login" pour vous connecter à votre espace
                        personnel.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_6.png"
                        alt="Cliquer Sur Bouton Login"
                    onClick={() => { setModalImage("images/image_6.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-8" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        7. Sélectionner Boutique Optique
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Nom de votre boutique" pour accéder à la gestion de cette
                        boutique.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_7.png"
                        alt="Sélectionner Boutique Optique"
                    onClick={() => { setModalImage("images/image_7.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-9" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        8. Accéder Au Menu Produit
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Produit" pour gérer les articles disponibles dans votre
                        boutique.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_8.png"
                        alt="Accéder Au Menu Produit"
                    onClick={() => { setModalImage("images/image_8.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-10" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        9. Cliquer Sur Nouveau Produit
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Nouveau" pour ajouter un nouveau produit à votre catalogue.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_9.png"
                        alt="Cliquer Sur Nouveau Produit"
                    onClick={() => { setModalImage("images/image_9.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-11" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        10. Cliquer Sur Créer Produit
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Créer" pour enregistrer les détails du nouveau produit.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_10.png"
                        alt="Cliquer Sur Créer Produit"
                    onClick={() => { setModalImage("images/image_10.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-12" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        11. Accéder Au Menu Achat
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Achat" pour gérer les commandes fournisseurs et les
                        approvisionnements.
                    </div>
                    <img className="w-full" src="images/image_11.png" alt="Accéder Au Menu Achat" onClick={() => { setModalImage("images/image_11.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-13" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        12. Cliquer Sur Nouvelle Commande
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Nouveau" pour créer une nouvelle commande d'achat.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_12.png"
                        alt="Cliquer Sur Nouvelle Commande"
                    onClick={() => { setModalImage("images/image_12.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-14" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        13. Sélectionner Fournisseur
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Fournisseur" pour choisir le fournisseur associé à la
                        commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_13.png"
                        alt="Sélectionner Fournisseur"
                    onClick={() => { setModalImage("images/image_13.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-15" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        14. Choisir Fournisseur Spécifique
                    </h3>
                    <div className="mt-4 mb-4">
                        Sélectionnez "Jaskolski-Cormier" comme fournisseur pour cette commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_14.png"
                        alt="Choisir Fournisseur Spécifique"
                    onClick={() => { setModalImage("images/image_14.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-16" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        15. Sélectionner Méthode De Paiement
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Select Méthode de paiement" pour choisir comment régler la
                        commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_15.png"
                        alt="Sélectionner Méthode De Paiement"
                    onClick={() => { setModalImage("images/image_15.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-17" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        16. Choisir Mode De Paiement
                    </h3>
                    <div className="mt-4 mb-4">
                        Sélectionnez "Virement" comme méthode de paiement pour cette transaction.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_16.png"
                        alt="Choisir Mode De Paiement"
                    onClick={() => { setModalImage("images/image_16.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-18" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        17. Cliquer Sur Ajouter Article
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Ajouter" pour inclure un produit dans la commande d'achat.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_17.png"
                        alt="Cliquer Sur Ajouter Article"
                    onClick={() => { setModalImage("images/image_17.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-19" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        18. Cliquer Sur Sélectionner Produit
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Select" pour choisir un produit à ajouter à la commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_18.png"
                        alt="Cliquer Sur Sélectionner Produit"
                    onClick={() => { setModalImage("images/image_18.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-20" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        19. Choisir Premier Produit
                    </h3>
                    <div className="mt-4 mb-4">
                        Sélectionnez le premier produit disponible pour l'ajouter à la commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_19.png"
                        alt="Choisir Premier Produit"
                    onClick={() => { setModalImage("images/image_19.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-21" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        20. Cliquer Sur Ajouter Produit
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Ajouter" pour inclure un second produit dans la commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_20.png"
                        alt="Cliquer Sur Ajouter Produit"
                    onClick={() => { setModalImage("images/image_20.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-22" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        21. Cliquer Sur Quantité
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur le champ de quantité pour définir le nombre d'articles
                        commandés.
                    </div>
                    <img className="w-full" src="images/image_21.png" alt="Cliquer Sur Quantité" onClick={() => { setModalImage("images/image_21.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-23" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        22. Confirmer Quantité Commandée
                    </h3>
                    <div className="mt-4 mb-4">
                        Confirmez la quantité de 18 unités pour le produit sélectionné.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_22.png"
                        alt="Confirmer Quantité Commandée"
                    onClick={() => { setModalImage("images/image_22.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-24" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        23. Cliquer Sur Enregistrer Commande
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Enregistrer" pour sauvegarder la commande d'achat en cours.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_23.png"
                        alt="Cliquer Sur Enregistrer Commande"
                    onClick={() => { setModalImage("images/image_23.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-25" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        24. Cliquer Sur Brouillon
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Brouillon" pour conserver la commande en mode brouillon avant
                        validation.
                    </div>
                    <img className="w-full" src="images/image_24.png" alt="Cliquer Sur Brouillon" onClick={() => { setModalImage("images/image_24.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-26" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        25. Cliquer Sur Approuver Commande
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Approuver" pour valider la commande et lancer le processus
                        d'achat.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_25.png"
                        alt="Cliquer Sur Approuver Commande"
                    onClick={() => { setModalImage("images/image_25.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-27" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        26. Cliquer Sur Confirmer Validation
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Confirmer" pour finaliser l'approbation de la commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_26.png"
                        alt="Cliquer Sur Confirmer Validation"
                    onClick={() => { setModalImage("images/image_26.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-28" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        27. Accéder Au Menu Point De Vente
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Point de vente" pour gérer les ventes en magasin.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_27.png"
                        alt="Accéder Au Menu Point De Vente"
                    onClick={() => { setModalImage("images/image_27.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-29" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        28. Cliquer Sur Ajouter Point De Vente
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Ajouter" pour créer un nouveau point de vente.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_28.png"
                        alt="Cliquer Sur Ajouter Point De Vente"
                    onClick={() => { setModalImage("images/image_28.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-30" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        29. Cliquer Sur Bouton Plus Pour ajouter quantité
                    </h3>
                    <div className="mt-4 mb-4">Cliquer Sur Bouton Plus Pour ajouter quantité</div>
                    <img
                        className="w-full"
                        src="images/image_29.png"
                        alt="Cliquer Sur Bouton Plus Pour ajouter quantité"
                    onClick={() => { setModalImage("images/image_29.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-31" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        30. Cliquez Pour Ajouter visite client
                    </h3>
                    <div className="mt-4 mb-4">Cliquez Pour Ajouter visite client</div>
                    <img
                        className="w-full"
                        src="images/image_30.png"
                        alt="Cliquez Pour Ajouter visite client"
                    onClick={() => { setModalImage("images/image_30.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-32" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        31. Entrer Nom Du Client
                    </h3>
                    <div className="mt-4 mb-4">
                        Entrez le nom du client pour enregistrer ses informations dans la base de
                        données.
                    </div>
                    <img className="w-full" src="images/image_31.png" alt="Entrer Nom Du Client" onClick={() => { setModalImage("images/image_31.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-33" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        32. Entrer Numéro De Téléphone
                    </h3>
                    <div className="mt-4 mb-4">
                        Entrez le numéro de téléphone du client pour assurer une communication
                        efficace.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_32.png"
                        alt="Entrer Numéro De Téléphone"
                    onClick={() => { setModalImage("images/image_32.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-34" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        33. Entrer Jour De Naissance
                    </h3>
                    <div className="mt-4 mb-4">
                        Entrez l'Age du client pour compléter son profil.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_33.png"
                        alt="Entrer Jour De Naissance"
                    onClick={() => { setModalImage("images/image_33.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-35" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        34. Cliquer Sur Bouton Suivant
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Suivant" pour passer à l'étape suivante de la saisie client.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_34.png"
                        alt="Cliquer Sur Bouton Suivant"
                    onClick={() => { setModalImage("images/image_34.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-36" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        35. Sélectionner Type de prospection
                    </h3>
                    <div className="mt-4 mb-4">Cliquez sur le choix du type de prospection.</div>
                    <img
                        className="w-full"
                        src="images/image_35.png"
                        alt="Sélectionner Type de prospection"
                    onClick={() => { setModalImage("images/image_35.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-37" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        36. Remplissez le formulaire
                    </h3>
                    <div className="mt-4 mb-4">Remplissez le formulaire de prospection</div>
                    <img
                        className="w-full"
                        src="images/image_36.png"
                        alt="Remplissez le formulaire"
                    onClick={() => { setModalImage("images/image_36.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-38" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        37. Cliquer Sur Bouton Suivant
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Suivant" pour continuer vers l'étape suivante du processus.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_37.png"
                        alt="Cliquer Sur Bouton Suivant"
                    onClick={() => { setModalImage("images/image_37.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-39" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        38. Cliquez Pour Ajouter type de verre
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur la zone indiquée pour sélectionner le type de verre.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_38.png"
                        alt="Cliquez Pour Ajouter type de verre"
                    onClick={() => { setModalImage("images/image_38.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-40" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        39. Sélectionner Type De Verre
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Sélectionner le type de verre" pour choisir le verre adapté.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_39.png"
                        alt="Sélectionner Type De Verre"
                    onClick={() => { setModalImage("images/image_39.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-41" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        40. Change le Prix
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur le champ Si vous voulez changer prix référence de type
                    </div>
                    <img className="w-full" src="images/image_40.png" alt="Change le Prix" onClick={() => { setModalImage("images/image_40.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-42" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        41. Cliquer Sur Bouton Suivant
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Suivant" pour passer à l'étape suivante de la commande.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_41.png"
                        alt="Cliquer Sur Bouton Suivant"
                    onClick={() => { setModalImage("images/image_41.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-43" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        42. Sélectionner Mutuelle
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Sélectionner Mutuelle" pour choisir la couverture santé du
                        client.
                    </div>
                    <img className="w-full" src="images/image_42.png" alt="Sélectionner Mutuelle" onClick={() => { setModalImage("images/image_42.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-44" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        43. Cliquer Sur Champ Zéro
                    </h3>
                    <div className="mt-4 mb-4">
                        Renseignez le champ avance si le client verse un acompte.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_43.png"
                        alt="Cliquer Sur Champ Zéro"
                    onClick={() => { setModalImage("images/image_43.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-45" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        44. Entrer Valeur Cinquante
                    </h3>
                    <div className="mt-4 mb-4">
                        et ajoutez une remise si vous souhaitez la donner au client
                    </div>
                    <img
                        className="w-full"
                        src="images/image_44.png"
                        alt="Entrer Valeur Cinquante"
                    onClick={() => { setModalImage("images/image_44.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-46" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        45. Activer Option
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur « Facture » ​​si vous souhaitez que cette vente devienne une
                        facture.
                    </div>
                    <img className="w-full" src="images/image_45.png" alt="Activer Option" onClick={() => { setModalImage("images/image_45.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-47" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        46. Cliquer Sur Valider
                    </h3>
                    <div className="mt-4 mb-4">Cliquez sur "Valide"</div>
                    <img className="w-full" src="images/image_46.png" alt="Cliquer Sur Valider" onClick={() => { setModalImage("images/image_46.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-48" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        47. Acheter Maintenant
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Acheter maintenant" pour finaliser l'achat.
                    </div>
                    <img className="w-full" src="images/image_47.png" alt="Acheter Maintenant" onClick={() => { setModalImage("images/image_47.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-49" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        48. Accéder Au Menu Commande
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Commande" pour consulter les commandes en cours.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_48.png"
                        alt="Accéder Au Menu Commande"
                    onClick={() => { setModalImage("images/image_48.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-50" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        49. Imprimer Reçu
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Imprimer le reçu" pour obtenir une copie papier de la
                        transaction.
                    </div>
                    <img className="w-full" src="images/image_49.png" alt="Imprimer Reçu" onClick={() => { setModalImage("images/image_49.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-51" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        50. Menu Commandes
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Commandes" pour gérer les commandes passées.
                    </div>
                    <img className="w-full" src="images/image_50.png" alt="Menu Commandes" onClick={() => { setModalImage("images/image_50.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-52" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        51. Menu Paiement
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Paiement" pour gérer les paiements associés aux commandes.
                    </div>
                    <img className="w-full" src="images/image_51.png" alt="Menu Paiement" onClick={() => { setModalImage("images/image_51.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-53" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        52. Ajouter Paiement
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Ajouter un paiement" pour enregistrer un nouveau paiement.
                    </div>
                    <img className="w-full" src="images/image_52.png" alt="Ajouter Paiement" onClick={() => { setModalImage("images/image_52.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-54" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        53. Enregistrer Paiement
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Enregistrer" pour sauvegarder le paiement saisi.
                    </div>
                    <img className="w-full" src="images/image_53.png" alt="Enregistrer Paiement" onClick={() => { setModalImage("images/image_53.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-55" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        54. Entrer Montant Paiement
                    </h3>
                    <div className="mt-4 mb-4">Entrez le montant pour le paiement effectué.</div>
                    <img
                        className="w-full"
                        src="images/image_54.png"
                        alt="Entrer Montant Paiement"
                    onClick={() => { setModalImage("images/image_54.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-56" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        55. Enregistrer Paiement
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Enregistrer" pour confirmer le paiement.
                    </div>
                    <img className="w-full" src="images/image_55.png" alt="Enregistrer Paiement" onClick={() => { setModalImage("images/image_55.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-57" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        56. Statut Payé
                    </h3>
                    <div className="mt-4 mb-4">
                        Le tableau indique que la commande a été intégralement payée.
                    </div>
                    <img className="w-full" src="images/image_56.png" alt="Statut Payé" onClick={() => { setModalImage("images/image_56.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-58" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        57. Menu Clients
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Clients" pour gérer les informations des clients.
                    </div>
                    <img className="w-full" src="images/image_57.png" alt="Menu Clients" onClick={() => { setModalImage("images/image_57.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-59" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        58. Sélectionner Client
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "client1" pour consulter les données du client sélectionné.
                    </div>
                    <img className="w-full" src="images/image_58.png" alt="Sélectionner Client" onClick={() => { setModalImage("images/image_58.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-60" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        59. Information sur client
                    </h3>
                    <div className="mt-4 mb-4">
                        Vous pouvez consulter toutes les informations concernant le client : son
                        historique de paiement, ses perspectives, son statut financier (débit de
                        transactions, solde de créances, etc.) et le nombre de transactions
                        effectuées.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_59.png"
                        alt="Information sur client"
                    onClick={() => { setModalImage("images/image_59.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-61" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        60. Menu Caisse
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Caisse" pour gérer les transactions financières en magasin.
                    </div>
                    <img className="w-full" src="images/image_60.png" alt="Menu Caisse" onClick={() => { setModalImage("images/image_60.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-62" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        61. Transfert De Stock
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Transfert de stock" pour déplacer des articles entre
                        magasins.
                    </div>
                    <img className="w-full" src="images/image_61.png" alt="Transfert De Stock" onClick={() => { setModalImage("images/image_61.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-63" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        62. Nouveau Transfert
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Nouveau Transfert" pour initier un transfert de stock.
                    </div>
                    <img className="w-full" src="images/image_62.png" alt="Nouveau Transfert" onClick={() => { setModalImage("images/image_62.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-64" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        63. Sélectionner Magasin Source
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Sélectionner le magasin source" pour choisir l'origine du
                        transfert.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_63.png"
                        alt="Sélectionner Magasin Source"
                    onClick={() => { setModalImage("images/image_63.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-65" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        64. Sélectionner Magasin Destination
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Sélectionner le magasin destination" pour définir la
                        destination du transfert.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_64.png"
                        alt="Sélectionner Magasin Destination"
                    onClick={() => { setModalImage("images/image_64.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <h3 id="section-66" className="text-lg font-bold my-4 w-full break-words max-w-full">
                        65. Cliquer Sur Ajouter Transfert
                    </h3>
                    <div className="mt-4 mb-4">
                        Cliquez sur "Ajouter" pour finaliser et enregistrer le transfert de stock.
                    </div>
                    <img
                        className="w-full"
                        src="images/image_65.png"
                        alt="Cliquer Sur Ajouter Transfert"
                    onClick={() => { setModalImage("images/image_65.png"); setModalOpen(true); }} style={{ cursor: "pointer" }} />
                    <div className="mt-4 mb-4">
                        Vous avez appris à gérer efficacement votre boutique optique avec
                        Optiquely, incluant la gestion des produits, commandes, clients, paiements
                        et stocks. Poursuivez avec la personnalisation avancée ou la gestion des
                        rapports pour optimiser davantage votre activité.
                    </div>

                </div>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
                    <img src={modalImage} alt="Enlarged" className="max-w-[90%] max-h-[90%] object-contain" onClick={(e) => e.stopPropagation()} />
                    <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
                </div>
            )}
        </>

    );
}




