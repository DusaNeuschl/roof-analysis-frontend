// src/components/ui/tabs.jsx
import { useState } from 'react';

export const Tabs = ({ children, defaultValue }) => {
  const [active, setActive] = useState(defaultValue);
  return (
    <div>
      {children.map(child =>
        child.props.value === active ? child : null
      )}
      <div>
        {children.map(child => (
          <button
            key={child.props.value}
            onClick={() => setActive(child.props.value)}
            style={{
              marginRight: '10px',
              background: child.props.value === active ? '#2563eb' : '#ccc',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
          >
            {child.props.label || child.props.value}
          </button>
        ))}
      </div>
    </div>
  );
};

export const TabsContent = ({ children }) => <div>{children}</div>;
export const TabsList = ({ children }) => <div>{children}</div>;
export const TabsTrigger = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);
