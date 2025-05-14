import React from 'react';

const ppeData = [
  {
    timestamp: '2025-05-08 08:30',
    violation: 'No helmet',
    alert: 'red'
  },
  {
    timestamp: '2025-05-08 09:00',
    violation: 'No safety gloves',
    alert: 'yellow'
  }
];

function getAlertColor(level) {
  return {
    red: 'bg-red-200 text-red-800',
    yellow: 'bg-yellow-200 text-yellow-800',
    green: 'bg-green-200 text-green-800'
  }[level] || 'bg-gray-200';
}

function PPECompliance() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">PPE Compliance</h2>
      {ppeData.map((entry, index) => (
        <div key={index} className="mb-3 p-2 border rounded-lg">
          <p><strong>Time:</strong> {entry.timestamp}</p>
          <p><strong>Violation:</strong> {entry.violation}</p>
          <p>
            <strong>Alert:</strong>{' '}
            <span className={`alert-${entry.alert}`}>
              {entry.alert}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default PPECompliance;
