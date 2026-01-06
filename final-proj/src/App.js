import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="logo">⚙️Aegis</div>
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Live Monitor
        </button>
        <button 
          className={`nav-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          Configuration
        </button>
        <button 
          className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employee Database
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'config' && <Configuration />}
        {activeTab === 'employees' && <EmployeeUpload />}
      </main>
    </div>
  );
}

// --- Components ---

const Dashboard = () => {
  const [ppeAlerts, setPpeAlerts] = useState([]);
  const [authAlerts, setAuthAlerts] = useState([]);
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const ppeRes = await axios.get(`${API_BASE}/api/ppe_alerts`);
        setPpeAlerts(ppeRes.data["ppe alerts"] || []);

        const authRes = await axios.get(`${API_BASE}/api/unauthorized_alerts`);
        setAuthAlerts(authRes.data["unauthorized access alerts"] || []);
      } catch (err) {
        console.error("Error fetching alerts", err);
      }
    };

    const interval = setInterval(fetchAlerts, 2000);
    fetchAlerts(); // Initial call
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="header">Live Operations Center</h2>
      <div className="dashboard-grid">
        <div className="video-section">
          {/* TODO: Once you add a StreamingResponse to your FastAPI backend
             (e.g., @app.get('/video_feed')), un-comment the line below:
          */}
          {<img src={"http://127.0.0.1:8001/video_feed"} alt="Live Stream" style={{width: '100%', height: '100%'}} />}
          


          
          <div className="video-placeholder">
            <h3>Live Video Feed</h3>
            <img 
      
      alt="Live Processing" 
      style={{width: '100%', height: '100%', objectFit: 'contain'}} 
    />
            <p>Connecting to Engine...</p>
            <p style={{fontSize: '0.8rem', color: '#666'}}>(Stream endpoint waiting for connection)</p>
          </div>
        </div>

        <div className="alerts-section">
          <h3>Recent Alerts</h3>
          
          {authAlerts.map((alert, idx) => (
            <div key={`auth-${idx}`} className="alert-card unauth">
              <strong>⚠️ Unauthorized Access</strong>
              <div className="alert-time">{alert.timestamp}</div>
              {alert.snapshot_path && (
                <img 
                  src={`${API_BASE}/api/snapshots/${alert.snapshot_path.split('/').pop()}`} 
                  className="snapshot-img" 
                  alt="violation" 
                />
              )}
            </div>
          ))}

          {ppeAlerts.map((alert, idx) => (
            <div key={`ppe-${idx}`} className="alert-card">
              <strong>⚠️ PPE Violation: {alert.violation}</strong>
              <div>ID: {alert.employee_id}</div>
              <div className="alert-time">{alert.timestamp}</div>
              {alert.snapshot_path && (
                <img 
                  src={`${API_BASE}/api/snapshots/${alert.snapshot_path.split('/').pop()}`} 
                  className="snapshot-img" 
                  alt="violation" 
                />
              )}
            </div>
          ))}
          
          {ppeAlerts.length === 0 && authAlerts.length === 0 && (
             <p style={{color: '#666', textAlign: 'center', marginTop: '20px'}}>No active alerts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Configuration = () => {
  const [cameraConfig, setCameraConfig] = useState({
    name: '', username: '', password: '', ip_address: ''
  });
  
  const [ppeConfig, setPpeConfig] = useState({
    helmet: false, vest: false, gloves: false, mask: false, glasses: false
  });

  const [sourceType, setSourceType] = useState('rtsp'); // 'rtsp' or 'upload'

  const handleCameraSubmit = async (e) => {
    e.preventDefault();
    if (sourceType === 'rtsp') {
      try {
        await axios.post(`${API_BASE}/api/camera`, cameraConfig);
        alert("Camera Configured!");
      } catch (e) { alert("Error setting camera"); }
    } else {
      alert("Video file uploaded (Simulation)"); 
    }
  };

  const handlePpeSubmit = async () => {
    try {
      await axios.post(`${API_BASE}/api/setPPE`, ppeConfig);
      alert("Detection Logic Updated!");
    } catch (e) { alert("Error setting PPE"); }
  };

  return (
    <div>
      <h2 className="header">System Configuration</h2>
      <div className="config-container">
        
        {/* Camera Setup */}
        <div className="card">
          <h3>Video Source</h3>
          <div style={{marginBottom: '20px', display:'flex', gap:'10px'}}>
             <button 
                className={`nav-btn ${sourceType === 'rtsp' ? 'active' : ''}`} 
                style={{border: '1px solid #334155'}}
                onClick={() => setSourceType('rtsp')}
             >Live Stream</button>
             <button 
                className={`nav-btn ${sourceType === 'upload' ? 'active' : ''}`} 
                style={{border: '1px solid #334155'}}
                onClick={() => setSourceType('upload')}
             >Upload Video</button>
          </div>

          {sourceType === 'rtsp' ? (
            <form onSubmit={handleCameraSubmit}>
              <div className="form-group">
                <label>Camera Name</label>
                <input type="text" onChange={e => setCameraConfig({...cameraConfig, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>IP Address / URL</label>
                <input type="text" placeholder="rtsp://..." onChange={e => setCameraConfig({...cameraConfig, ip_address: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" onChange={e => setCameraConfig({...cameraConfig, username: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" onChange={e => setCameraConfig({...cameraConfig, password: e.target.value})} />
              </div>
              <button type="submit" className="primary-btn">Connect Camera</button>
            </form>
          ) : (
            <div style={{textAlign:'center', padding:'20px', border:'2px dashed #334155', borderRadius:'8px'}}>
                <p>Select a video file from local storage for analysis.</p>
                <input type="file" accept="video/*" style={{color:'white'}} />
            </div>
          )}
        </div>

        {/* PPE Config */}
        <div className="card">
          <h3>Detection Parameters</h3>
          <p style={{marginBottom: '20px', color: '#94a3b8'}}>Select required gear for compliance:</p>
          <div className="ppe-toggles">
            {Object.keys(ppeConfig).map(key => (
              <div key={key} className="toggle-row">
                <span style={{textTransform: 'capitalize'}}>{key}</span>
                <input 
                  type="checkbox" 
                  checked={ppeConfig[key]}
                  onChange={e => setPpeConfig({...ppeConfig, [key]: e.target.checked})}
                  style={{transform: 'scale(1.5)'}}
                />
              </div>
            ))}
          </div>
          <button onClick={handlePpeSubmit} className="primary-btn">Update Rules</button>
        </div>
      </div>
    </div>
  );
};

const EmployeeUpload = () => {
  const [empId, setEmpId] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/get_employee_list`);
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Could not fetch list");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('⏳ Processing Face Embedding...'); 
    
    const formData = new FormData();
    formData.append('employee_id', empId);
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE}/api/employees`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('✨ Success! Employee Registered.'); 
      setEmpId('');
      setFile(null);
      
      fetchEmployees();
      
    } catch (err) {
      setMessage('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="animate-enter">
      <h2 className="header">Employee Database</h2>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px'}}>
        
        {/* Registration Card */}
        <div className="card">
          <h3 style={{marginTop:0, color: '#667eea'}}>Register New Person</h3>
          <p style={{color:'#718096', fontSize:'0.9rem'}}>Upload a clear photo.</p>
          
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Employee ID / Name</label>
              <input 
                type="text" 
                value={empId} 
                onChange={e => setEmpId(e.target.value)} 
                placeholder=""
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Reference Photo</label>
              <input 
                type="file" 
                onChange={e => setFile(e.target.files[0])} 
                required 
              />
            </div>
            
            <button type="submit" className="primary-btn">
              Generate & Save ID
            </button>
            
            {message && (
              <div className="status-msg" style={{
                background: message.includes('Success') ? '#d1fae5' : '#fee2e2',
                color: message.includes('Success') ? '#065f46' : '#991b1b'
              }}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Employee List Table */}
        <div>
          <h3 style={{marginTop:0, color: '#4a5568'}}>Registered Personnel ({employees.length})</h3>
          <div className="employee-table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{textAlign:'center', padding:'20px'}}>No employees registered yet.</td>
                  </tr>
                ) : (
                  employees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{index + 1}</td>
                      <td style={{fontWeight:'bold', color:'#4a5568'}}>{emp.employee_id}</td>
                      <td>
                        <span style={{
                          background:'#def7ec', color:'#03543f', 
                          padding:'4px 10px', borderRadius:'15px', fontSize:'0.8rem'
                        }}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;