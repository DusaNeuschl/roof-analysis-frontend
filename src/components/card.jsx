// src/components/ui/card.jsx
export const Card = ({ children }) => (
    <div className="border rounded shadow p-4 bg-white">{children}</div>
  );
  
  export const CardContent = ({ children }) => (
    <div className="p-2">{children}</div>
  );
  
  export const CardHeader = ({ children }) => (
    <div className="border-b pb-2 mb-2">{children}</div>
  );
  
  export const CardTitle = ({ children }) => (
    <h3 className="text-lg font-bold">{children}</h3>
  );
  