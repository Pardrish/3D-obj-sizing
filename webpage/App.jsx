import React from 'react';
import ObjectDefects from './components/ObjectDefects';
import PPECompliance from './components/PPECompliance';
import UnauthorizedAccess from './components/UnauthorizedAccess';

function App() {
  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      <ObjectDefects />
      <PPECompliance />
      <UnauthorizedAccess />
    </div>
  );
}

export default App;