import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Komponenta pre jeden objekt merania
const MeasurementCard = ({ measurement }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">
        {new Date(measurement.datetime).toLocaleTimeString()}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm text-gray-500">Priemerný jas</dt>
          <dd className="text-lg font-semibold">{measurement.average_brightness.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Variácia jasu</dt>
          <dd className="text-lg font-semibold">{measurement.brightness_variation.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Podiel tieňov</dt>
          <dd className="text-lg font-semibold">{measurement.shadow_percentage.toFixed(2)}%</dd>
        </div>
      </dl>
    </CardContent>
  </Card>
);

// Komponenta pre detailný pohľad jedného dňa
const DayDetailView = ({ measurements }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Priebeh osvetlenia počas dňa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={measurements.map(m => ({
              time: new Date(m.datetime).toLocaleTimeString(),
              brightness: m.average_brightness,
              shadows: m.shadow_percentage
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="brightness" />
              <YAxis yAxisId="shadows" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="brightness"
                type="monotone"
                dataKey="brightness"
                stroke="#2563eb"
                name="Priemerný jas"
              />
              <Line
                yAxisId="shadows"
                type="monotone"
                dataKey="shadows"
                stroke="#dc2626"
                name="Podiel tieňov (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {measurements.map((measurement, index) => (
        <MeasurementCard key={index} measurement={measurement} />
      ))}
    </div>
  </div>
);

// Komponenta pre súhrnný pohľad jednej strany
const SectionSummaryView = ({ sectionData }) => {
  const allMeasurements = Object.entries(sectionData.dates).flatMap(([date, measurements]) =>
    measurements.map(m => ({ ...m, date }))
  );

  const stats = {
    avgBrightness: allMeasurements.reduce((acc, m) => acc + m.average_brightness, 0) / allMeasurements.length,
    avgShadows: allMeasurements.reduce((acc, m) => acc + m.shadow_percentage, 0) / allMeasurements.length,
    totalMeasurements: allMeasurements.length,
    uniqueDates: Object.keys(sectionData.dates).length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Súhrnné štatistiky pre {sectionData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Priemerný jas</dt>
              <dd className="text-lg font-semibold">{stats.avgBrightness.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Priemerný podiel tieňov</dt>
              <dd className="text-lg font-semibold">{stats.avgShadows.toFixed(2)}%</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Počet meraní</dt>
              <dd className="text-lg font-semibold">{stats.totalMeasurements}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Počet dní</dt>
              <dd className="text-lg font-semibold">{stats.uniqueDates}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Všetky merania</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={allMeasurements.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="datetime" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Legend />
                <Line type="monotone" dataKey="average_brightness" name="Jas" stroke="#2563eb" dot={false} />
                <Line type="monotone" dataKey="shadow_percentage" name="Tiene" stroke="#dc2626" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Denné priemery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(sectionData.dates).map(([date, measurements]) => ({
                date,
                avgBrightness: measurements.reduce((acc, m) => acc + m.average_brightness, 0) / measurements.length,
                avgShadows: measurements.reduce((acc, m) => acc + m.shadow_percentage, 0) / measurements.length
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgBrightness" name="Priemerný jas" fill="#2563eb" />
                <Bar dataKey="avgShadows" name="Priemerný podiel tieňov" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hlavná komponenta
const RoofAnalysisViewer = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionData, setSectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Načítanie dát
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const mockData = {
          "Východo-juhovýchodná strana (109°)": {
            name: "Východo-juhovýchodná strana (109°)",
            dates: {
              "2025-02-05": [
                {
                  datetime: "2025-02-05T09:40:00",
                  average_brightness: 125.45,
                  brightness_variation: 45.67,
                  shadow_percentage: 35.89
                },
                {
                  datetime: "2025-02-05T12:40:00",
                  average_brightness: 145.45,
                  brightness_variation: 35.67,
                  shadow_percentage: 25.89
                }
              ],
              "2025-02-16": [
                {
                  datetime: "2025-02-16T10:15:00",
                  average_brightness: 130.12,
                  brightness_variation: 42.33,
                  shadow_percentage: 32.45
                }
              ]
            }
          },
          "Západo-severozápadná strana (291°)": {
            name: "Západo-severozápadná strana (291°)",
            dates: {
              "2025-02-05": [
                {
                  datetime: "2025-02-05T09:40:00",
                  average_brightness: 115.45,
                  brightness_variation: 55.67,
                  shadow_percentage: 45.89
                }
              ]
            }
          }
        };
        
        const sectionsData = Object.entries(mockData).map(([id, data]) => ({
          id,
          ...data
        }));
        
        setSections(sectionsData);
        setSelectedSection(sectionsData[0]);
        setSectionData(sectionsData[0]);
      } catch (error) {
        console.error("Chyba pri načítaní dát:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Handler pre zmenu sekcie
  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setSectionData(section);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analýza osvetlenia strechy</h1>
        
        {isLoading ? (
          <div className="text-center py-4">Načítavam dáta...</div>
        ) : (
          <div className="space-y-6">
            {/* Výber strany strechy */}
            <div className="flex flex-wrap gap-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section)}
                  className={`px-4 py-2 rounded ${
                    selectedSection?.id === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>

            {/* Zobrazenie dát vybranej strany */}
            {selectedSection && (
              <Tabs defaultValue="detail">
                <TabsList>
                  <TabsTrigger value="detail">Detailný pohľad</TabsTrigger>
                  <TabsTrigger value="summary">Súhrnné dáta</TabsTrigger>
                </TabsList>

                <TabsContent value="detail">
                  <Tabs defaultValue={Object.keys(selectedSection.dates)[0]}>
                    <TabsList>
                      {Object.keys(selectedSection.dates).map(date => (
                        <TabsTrigger key={date} value={date}>{date}</TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(selectedSection.dates).map(([date, measurements]) => (
                      <TabsContent key={date} value={date}>
                        <DayDetailView measurements={measurements} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>

                <TabsContent value="summary">
                  <SectionSummaryView sectionData={selectedSection} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoofAnalysisViewer;