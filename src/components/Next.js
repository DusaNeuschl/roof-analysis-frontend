// src/api/roofApi.ts
export const fetchRoofData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/roof-data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Chyba pri načítaní dát:", error);
    throw error;
  }
};

// src/components/RoofAnalysisViewer.tsx
// ... ostatné importy zostávajú rovnaké
import { fetchRoofData } from '../api/roofApi';

const RoofAnalysisViewer = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Načítanie dát
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRoofData();
        
        const sectionsData = Object.entries(data).map(([id, data]) => ({
          id,
          ...data
        }));
        
        setSections(sectionsData);
        setSelectedSection(sectionsData[0]);
        setSectionData(sectionsData[0]);
      } catch (error) {
        console.error("Chyba pri načítaní dát:", error);
        setError("Nepodarilo sa načítať dáta. Skúste to prosím neskôr.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Zvyšok komponentu zostáva rovnaký, len pridáme zobrazenie chyby
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analýza osvetlenia strechy</h1>
        
        {isLoading ? (
          <div className="text-center py-4">Načítavam dáta...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : (
          // Zvyšok render kódu zostáva rovnaký
        )}
      </div>
    </div>
  );
};