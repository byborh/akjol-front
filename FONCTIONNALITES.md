# 🎓 AkJol - Fonctionnalités

**AkJol** (Chemin Blanc) est une plateforme de simulation de parcours étudiant permettant d'explorer et de visualiser les différentes voies d'orientation possibles dans le domaine de l'informatique et des technologies.

---

## 🎯 Objectif Principal

Aider les étudiants et personnes en reconversion à :
- **Visualiser concrètement** leur parcours d'études
- **Découvrir** les métiers et formations disponibles
- **Anticiper** les conséquences de leurs choix d'orientation
- **Comparer** différents chemins avant de s'engager

---

## ✨ Fonctionnalités Principales

### 1. 🔐 Connexion & Authentification

- **Connexion sécurisée** avec email et mot de passe
- **Comptes de test disponibles** pour découvrir la plateforme :
  - `alice@test.fr` / `password123`
  - `bob@example.com` / `password123`
  - `charlie@demo.io` / `password123`
- **Persistance de session** : restez connecté entre les visites

---

### 2. 🚀 Simulation de Parcours Étudiant (Timeline Interactive)

#### **Choisir son point de départ**
- Sélectionnez votre situation actuelle parmi :
  - **🎓 Baccalauréats** : Général (Spé Math/NSI), STI2D, Bac Pro SN (CIEL)
  - **📚 Études Supérieures** : BTS SIO (SISR/SLAM), BUT Informatique, Licence Pro, Master, Écoles d'ingénieur
  - **💼 Métiers** : Développeur, Admin Réseau, Data Scientist, DevOps Engineer, etc.

#### **Explorer les chemins possibles**
- **Vue en 3 colonnes** :
  1. **Votre parcours** : les étapes que vous avez déjà validées
  2. **Vos choix possibles** : les options disponibles à partir de votre situation actuelle
  3. **Projections lointaines** : les opportunités futures après vos prochains choix

#### **Prendre des décisions éclairées**
- **Sélectionner un établissement** pour chaque étape (lycée, école, université)
- **Voir la probabilité de succès** pour chaque option selon votre profil
  - 🟢 **Safe** : Plus de 70% de chances de réussite
  - 🟡 **Medium** : Entre 50% et 70%
  - 🔴 **Risky** : Moins de 50%
- **Jauge visuelle** indiquant votre niveau de risque pour chaque choix

#### **Événements aléatoires** 🎲
- Des événements imprévus peuvent survenir pendant votre parcours :
  - **Positifs** : Bourse d'excellence, stage en entreprise, mentorat, etc.
  - **Négatifs** : Maladie, échec partiel, problèmes financiers, etc.
  - **Neutres** : Changement de projet, opportunité inattendue, etc.
- Impact direct sur vos statistiques (motivation, compétences, argent, etc.)
- **Rareté variable** : événements communs, rares ou légendaires

---

### 3. 📊 Gestion de Sessions Multiples

#### **Créer plusieurs simulations de vie**
- Testez différents scénarios en parallèle
- Chaque simulation (appelée "Vie") est indépendante
- Nommage personnalisé : "Vie #1", "Carrière DevOps", "Plan B", etc.

#### **Gestion complète**
- ➕ **Créer** une nouvelle simulation
- ✏️ **Renommer** une simulation existante
- 🗑️ **Supprimer** une simulation
- 🔄 **Basculer** entre vos différentes simulations
- 💾 **Sauvegarde automatique** : tout est conservé localement

---

### 4. 🔍 Explorer les Formations & Établissements

Une page dédiée pour découvrir l'ensemble de l'offre éducative, accessible à tout moment via le bouton **"📚 Voir détails formation"** ou depuis le header.

#### **Mode Formations 📚**

Explorez toutes les formations disponibles :

**Filtres disponibles** :
- **Par type** :
  - 🎓 Baccalauréat
  - 📚 Études Supérieures
  - 💼 Métier
- **Par nom** : recherche en temps réel dans les titres et descriptions

**Informations affichées** :
- **Détails complets** : description, durée, prérequis, débouchés
- **Métadonnées** : salaire moyen junior, possibilité d'alternance, niveau de difficulté
- **Prérequis** : moyennes nécessaires (maths, sciences, général)
- **Liste des établissements** proposant cette formation avec :
  - Nom et localisation
  - Note / rating (sur 5 étoiles)
  - Navigation directe vers la fiche de l'établissement

#### **Mode Établissements 🏢**

Découvrez tous les lycées, écoles et universités :

**Filtres disponibles** :
- **Par ville** : Paris, Lyon, Toulouse, Bordeaux, Lille, Grenoble, Strasbourg, Nice, Nantes, Rennes, Montpellier, etc.
- **Par nom** : recherche instantanée par nom d'établissement

**Informations affichées** :
- **Coordonnées** : nom, ville
- **Notation** : étoiles et score (ex: ⭐ 4.3/5)
- **Formations proposées** : liste complète avec navigation vers les formations
- **Nombre de formations** disponibles dans cet établissement

#### **Navigation bidirectionnelle**
- Depuis une **formation** → voir ses **établissements**
- Depuis un **établissement** → voir ses **formations**
- Passage fluide d'une vue à l'autre

---

### 5. 🔗 Partage & Import de Simulations

#### **Partager votre parcours**
- **Générer un lien unique** pour partager votre simulation
- **Durées d'expiration configurables** :
  - 1 heure
  - 24 heures
  - 7 jours
  - 30 jours
- **Copie automatique** du lien dans le presse-papiers
- **Feedback visuel** : URL affichée avec date d'expiration

#### **Importer une simulation partagée**
- **Coller un lien** reçu par un ami ou un conseiller
- **Prévisualisation** avant import :
  - Nom de la simulation
  - Nombre d'étapes
  - Date de partage
  - Date d'expiration
- **Validation** : accepter ou refuser l'import
- **Nommage automatique** : évite les doublons ("Vie #1", "Vie #2", etc.)

---

### 6. 🎨 Personnalisation de l'Interface

#### **Thème Clair / Sombre**
- Basculer entre les modes **Clair ☀️** et **Sombre 🌙**
- Bouton de toggle dans le header
- **Design professionnel** suivant la règle des proportions 60-30-10 :
  - **Mode Clair** : Blanc Albâtre, Gris Nuage, Violet Électrique
  - **Mode Sombre** : Noir Mat, Gris Anthracite, Violet Électrique
- **Persistance** : votre choix est sauvegardé entre les sessions
- **Accessibilité** : contrastes respectant les normes WCAG

---

## 📈 Informations Disponibles

### Pour chaque Formation :
- **📝 Descriptif complet** : objectifs, contenu, débouchés
- **⏱️ Durée** : nombre d'années d'études
- **💰 Salaire moyen** : estimation du salaire junior en début de carrière
- **📊 Prérequis** : moyennes nécessaires (mathématiques, sciences, général)
- **🎯 Niveau de difficulté** : Easy, Medium, Hard
- **🔄 Alternance** : possibilité d'effectuer la formation en alternance
- **💼 Métiers associés** : liste des professions accessibles après cette formation
- **🏢 Établissements** : où suivre cette formation (avec notes)

### Pour chaque Établissement :
- **🏫 Nom officiel** de l'établissement
- **📍 Localisation** : ville
- **⭐ Note / Rating** : évaluation sur 5 étoiles
- **📚 Formations proposées** : liste exhaustive des cursus disponibles
- **📊 Statistiques** : nombre total de formations

### Pour chaque Choix de Parcours :
- **🎲 Probabilité de succès** : calcul personnalisé selon votre profil
- **🎨 Indicateur visuel** : jauge colorée (vert/orange/rouge)
- **📊 Niveau de risque** : Safe / Medium / Risky
- **🏢 Obligation d'établissement** : certains cursus nécessitent la sélection d'une école

---

## 🎮 Expérience Utilisateur

### **Navigation Intuitive**
- Design **minimaliste et moderne**
- Animations **fluides** (Framer Motion)
- Transitions **douces** entre les vues
- **Responsive** : fonctionne sur mobile, tablette et desktop

### **Feedback Immédiat**
- États de **hover** et de **focus** clairs
- Messages de **confirmation** pour les actions importantes
- **Notifications visuelles** pour les partages et imports
- **Compteur d'étapes** dans votre parcours

### **Performance**
- ⚡ **Build optimisé** : ~394 KB JS (122 KB gzippé)
- 💾 **Sauvegarde locale** : pas besoin de serveur pour les sessions
- 🔄 **Chargement instantané** : données mockées pour une UX fluide

---

## 🎯 Cas d'Usage Concrets

### **Cas 1 : Léa, lycéenne en Terminale**
> Léa hésite entre un BTS SIO et un BUT Informatique. Elle utilise AkJol pour :
> - Comparer les deux parcours côte à côte (créer 2 simulations)
> - Explorer les débouchés après chaque formation
> - Vérifier ses probabilités de succès selon ses notes
> - Identifier les établissements dans sa région

### **Cas 2 : Thomas, étudiant en BTS SIO**
> Thomas termine son BTS et se demande quoi faire après. Avec AkJol, il :
> - Démarre depuis "BTS SIO - SLAM"
> - Découvre toutes les poursuites d'études possibles (Licence Pro, Bachelor, École 42...)
> - Compare les établissements par ville et par notation
> - Simule plusieurs scénarios (Master, Entrée sur le marché du travail, Formation complémentaire)

### **Cas 3 : Sarah, en reconversion professionnelle**
> Sarah vient du commerce et veut se reconvertir dans la Tech. Elle utilise AkJol pour :
> - Explorer les formations accessibles sans Bac scientifique
> - Identifier les parcours les plus courts (formations pro, certifications)
> - Voir les salaires estimés pour valider son projet de reconversion
> - Partager son plan de carrière avec un conseiller Pôle Emploi via le lien de partage

---

## 🌟 Points Forts

✅ **Visualisation concrète** du futur plutôt qu'un simple catalogue  
✅ **Données réalistes** : salaires, durées, prérequis, taux de réussite  
✅ **Multiples scénarios** : comparez vos options en parallèle  
✅ **Événements imprévus** : ajoutent du réalisme à la simulation  
✅ **Filtres avancés** : trouvez rapidement ce qui vous correspond  
✅ **Partage collaboratif** : travaillez avec un conseiller ou ami  
✅ **Gratuit et accessible** : aucun compte premium, pas de publicité  
✅ **Interface moderne** : design épuré et accessible (WCAG)  

---

## 🔮 Vision Future

AkJol vise à devenir **l'outil de référence** pour l'orientation dans le numérique, en :
- Intégrant plus de secteurs (Design, Marketing Digital, Cybersécurité approfondie)
- Ajoutant des **témoignages vidéo** d'anciens étudiants
- Proposant un **matching intelligent** basé sur les compétences et intérêts
- Connectant avec **Parcoursup** pour une intégration directe
- Incluant des **données réelles** issues des établissements partenaires

---

**Développé avec ❤️ pour faciliter les choix d'orientation des futures générations.**
