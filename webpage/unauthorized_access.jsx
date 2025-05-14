import React from 'react';

const accessLogs = [
  {
    timestamp: '2025-05-08 07:45',
    unverified: 2,
    mismatched: 1,
    unsafe: 'Yes',
    alert: 'red'
  },
  {
    timestamp: '2025-05-08 10:20',
    unverified: 0,
    mismatched: 0,
    unsafe: 'No',
    alert: 'green'
  }
];

function getAlertColor(level) {
  return {
    red: 'bg-red-200 text-red-800',
    yellow: 'bg-yellow-200 text-yellow-800',
    green: 'bg-green-200 text-green-800'
  }[level] || 'bg-gray-200';
}

function UnauthorizedAccess() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Unauthorized Access</h2>
      {accessLogs.map((log, index) => (
        <div key={index} className="mb-3 p-2 border rounded-lg">
          <p><strong>Time:</strong> {log.timestamp}</p>
          <p><strong>Unverified Persons:</strong> {log.unverified}</p>
          <p><strong>DB Mismatch:</strong> {log.mismatched}</p>
          <p><strong>Unsafe Behavior:</strong> {log.unsafe}</p>
          <p>
            <strong>Alert Level:</strong>{' '}
            <span className={`px-2 py-1 rounded ${getAlertColor(log.alert)}`}>
              {log.alert}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default UnauthorizedAccess;
