/**
 * ⚡ GUIDE ULTRA-RAPIDE (5 minutes)
 * 
 * Version résumée pour les gens pressés
 */

/*
CRÉÉ POUR VOUS : 3 fichiers de service
═══════════════════════════════════════

src/services/apiService.ts ........... Fetch des 2 APIs ONISEP
src/services/dataMapper.ts ........... Conversion en Node/School
src/services/dataService.ts .......... Orchestration + cache

+ Documentation:
  src/services/README_DONNEES.md
  src/services/INTEGRATION_GUIDE.md
  src/services/TESTS.md
  

VOUS DEVEZ FAIRE : 2 modifications dans votre code
═══════════════════════════════════════════════════

⏱️ Modification 1 (2 minutes): useAkJolApp.ts
─────────────────────────────────────────────

// ❌ AVANT
import { NODES, SCHOOLS, EDGES } from '../data/mockData';

export function useAkJolApp() {
  const [nodes, setNodes] = useState<Node[]>(NODES);
  const [schools, setSchools] = useState<School[]>(SCHOOLS);
  const [edges, setEdges] = useState<Edge[]>(EDGES);
  // ...
}


// ✅ APRÈS
import { loadDataFromAPIs, generateEdgesFromNodes } from '../services/dataService';

export function useAkJolApp() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { nodes: apiNodes, schools: apiSchools } = await loadDataFromAPIs();
        setNodes(apiNodes);
        setSchools(apiSchools);
        setEdges(generateEdgesFromNodes(apiNodes));
      } catch (err) {
        // Fallback automatique mockData
        const { NODES, SCHOOLS, EDGES } = await import('../data/mockData');
        setNodes(NODES);
        setSchools(SCHOOLS);
        setEdges(EDGES);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  return { nodes, schools, edges, isLoading, error, /* ... autres */ };
}


⏱️ Modification 2 (1 minute): App.tsx
──────────────────────────────────────

// ❌ AVANT
function App() {
  const { nodes, schools, edges } = useAkJolApp();
  return <ExploreTimeline nodes={nodes} schools={schools} edges={edges} />;
}


// ✅ APRÈS
function App() {
  const { nodes, schools, edges, isLoading, error } = useAkJolApp();

  if (isLoading) return <div className="...">Chargement...</div>;
  if (error) return <div className="...">Erreur: {error.message}</div>;

  return <ExploreTimeline nodes={nodes} schools={schools} edges={edges} />;
}


RÉSULTAT
════════

Au démarrage:
  ✅ App affiche "Chargement..."
  ✅ APIs ONISEP sont appelées (2-3 sec)
  ✅ Formations = VRAIES données (700k+ disponibles)
  ✅ Fallback mockData s'active en cas d'erreur

Console:
  📡 Démarrage du chargement des données ONISEP...
  ✅ 100 formations chargées
  ✅ 300 établissements chargés


VÉRIFICATION RAPIDE
════════════════════

1. npm run dev
2. Ouvrir console (F12)
3. Chercher les logs "✅"
4. Si vous les voyez → C'est bon!
5. Sinon → Chercher "❌" dans la console


BESOIN D'AIDE?
══════════════

Lisez dans cet ordre:
  1. Ce fichier (vous êtes ici)
  2. README_DONNEES.md (contexte complet)
  3. useAkJolApp_EXAMPLE.ts (exemple clé-en-main)
  4. TESTS.md (vérifier que tout marche)

*/

export {};
