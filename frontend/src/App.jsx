import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5001/api';

// ========== SVG ICONS COMPONENTS ==========
const HeartbeatLogo = ({ size = 32, color = "#e74c3c" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 85 C50 85 15 60 15 40 C15 25 25 15 40 15 C48 15 50 20 50 25 C50 20 52 15 60 15 C75 15 85 25 85 40 C85 60 50 85 50 85Z" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="32,48 42,48 48,38 55,62 62,48 72,48" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="48" cy="38" r="2.5" fill={color}/>
    <circle cx="55" cy="62" r="2.5" fill={color}/>
  </svg>
);

const BloodDropIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5C12 2.5 6 9.5 6 14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14C18 9.5 12 2.5 12 2.5Z" fill="#e74c3c" stroke="#e74c3c" strokeWidth="1.5"/>
    <path d="M12 8V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DonationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L12 7M12 2L9 5M12 2L15 5" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="9" width="16" height="12" rx="2" stroke="#e74c3c" strokeWidth="2"/>
    <path d="M8 13H16" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1.5" fill="#e74c3c"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="15" rx="2" stroke="#e74c3c" strokeWidth="2"/>
    <path d="M8 3V6M16 3V6" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 10H21" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="14" r="1" fill="#e74c3c"/>
    <circle cx="16" cy="14" r="1" fill="#e74c3c"/>
    <circle cx="8" cy="14" r="1" fill="#e74c3c"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4H18V14C18 17.3137 15.3137 20 12 20C8.68629 20 6 17.3137 6 14V4Z" stroke="#e74c3c" strokeWidth="2"/>
    <path d="M6 4H4C2.89543 4 2 4.89543 2 6V8C2 9.65685 3.34315 11 5 11H6" stroke="#e74c3c" strokeWidth="2"/>
    <path d="M18 4H20C21.1046 4 22 4.89543 22 6V8C22 9.65685 20.6569 11 19 11H18" stroke="#e74c3c" strokeWidth="2"/>
    <path d="M12 20V22M8 22H16" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19C22.001 19.7919 21.7986 20.571 21.4167 21.2598C21.0348 21.9486 20.4873 22.5217 19.8282 22.9246C19.1691 23.3276 18.4213 23.546 17.656 23.559C16.881 23.571 16.109 23.426 15.39 23.132C12.748 22.057 10.283 20.552 8.091 18.678C6.217 16.486 4.712 14.021 3.637 11.379C3.342 10.66 3.197 9.888 3.21 9.113C3.222 8.347 3.44 7.599 3.843 6.94C4.246 6.281 4.819 5.734 5.507 5.352C6.196 4.971 6.975 4.768 7.767 4.77H8.78C9.144 4.767 9.504 4.851 9.828 5.014C10.152 5.177 10.43 5.414 10.638 5.704C10.954 6.145 11.203 6.633 11.377 7.151C11.555 7.699 11.674 8.265 11.73 8.84C11.784 9.365 11.744 9.896 11.613 10.409C11.49 10.902 11.282 11.37 11 11.79C10.78 12.113 10.653 12.492 10.634 12.884C10.605 13.139 10.646 13.397 10.753 13.63C11.072 14.245 11.735 15.137 12.734 16.136C13.733 17.135 14.625 17.798 15.24 18.117C15.473 18.224 15.731 18.265 15.986 18.236C16.378 18.217 16.757 18.09 17.08 17.87C17.5 17.588 17.968 17.38 18.461 17.257C18.974 17.126 19.505 17.086 20.03 17.14C20.605 17.196 21.171 17.315 21.719 17.493C22.237 17.667 22.725 17.916 23.166 18.232C23.456 18.44 23.693 18.718 23.856 19.042C24.019 19.366 24.103 19.726 24.1 20.09V21.11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 16 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 16 12 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartSmallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6V12C3 17.5 12 22 12 22C12 22 21 17.5 21 12V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ 
    name: '', email: '', password: '', bloodType: '', phone: '', address: '' 
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalDonations: 0, totalUnits: 0, lastDonation: null });
  const [notifications, setNotifications] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', address: '' });
  const [upcomingRequests, setUpcomingRequests] = useState([]);

  // Admin state
  const [pendingDonors, setPendingDonors] = useState([]);
  const [allDonors, setAllDonors] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [adminStats, setAdminStats] = useState({});
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', phone: '' });

  // Staff state
  const [myRequests, setMyRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ 
    patientName: '', patientAge: '', bloodType: '', unitsRequired: '', urgencyLevel: 'normal' 
  });
  const [availableInventory, setAvailableInventory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchBloodType, setSearchBloodType] = useState('');

  useEffect(() => {
    if (user && user.role === 'donor') {
      loadDonorProfile();
      loadDonationHistory();
      loadDonorNotifications();
    }
    if (user && user.role === 'admin') {
      loadAdminData();
    }
    if (user && user.role === 'staff') {
      loadStaffData();
    }
  }, [user]);

  useEffect(() => {
    if (donationHistory.length > 0) {
      const totalUnits = donationHistory.reduce((sum, d) => sum + (d.units || 1), 0);
      setStats({ totalDonations: donationHistory.length, totalUnits, lastDonation: donationHistory[0]?.donation_date });
    }
  }, [donationHistory]);

  useEffect(() => {
    if (donorProfile) {
      setUpcomingRequests([
        { id: 1, hospital: 'Central Hospital', bloodType: donorProfile.blood_type, urgency: 'High', date: '2024-12-01' },
        { id: 2, hospital: 'City Medical Center', bloodType: donorProfile.blood_type, urgency: 'Medium', date: '2024-12-05' },
      ]);
    }
  }, [donorProfile]);

  const loadDonorProfile = async () => {
    try {
      const res = await axios.get(`${API}/donor/profile/${user.id}`);
      setDonorProfile(res.data);
      setEditForm({ phone: res.data.phone || '', address: res.data.address || '' });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const loadDonationHistory = async () => {
    try {
      const res = await axios.get(`${API}/donor/history/${user.id}`);
      setDonationHistory(res.data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const loadDonorNotifications = async () => {
    setNotifications([
      { id: 1, title: 'Welcome to BloodLink!', message: 'Thank you for joining our community.', date: new Date(), isRead: false },
      { id: 2, title: 'Blood Drive Coming Up', message: 'A blood drive will be held next week at the hospital.', date: new Date(), isRead: false },
    ]);
  };

  const loadAdminData = async () => {
    try {
      const [pendingRes, allDonorsRes, staffRes, inventoryRes, requestsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/pending-donors`),
        axios.get(`${API}/admin/all-donors`),
        axios.get(`${API}/admin/all-staff`),
        axios.get(`${API}/admin/inventory`),
        axios.get(`${API}/admin/all-requests`),
        axios.get(`${API}/admin/stats`)
      ]);
      setPendingDonors(pendingRes.data);
      setAllDonors(allDonorsRes.data);
      setStaffList(staffRes.data);
      setInventory(inventoryRes.data);
      setBloodRequests(requestsRes.data);
      setAdminStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const loadStaffData = async () => {
    try {
      const [requestsRes, inventoryRes] = await Promise.all([
        axios.get(`${API}/staff/my-requests/${user.id}`),
        axios.get(`${API}/staff/inventory`)
      ]);
      setMyRequests(requestsRes.data);
      setAvailableInventory(inventoryRes.data);
    } catch (err) {
      console.error('Failed to load staff data:', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API}/auth/register`, form);
      if (res.data.success) {
        setMessage('Registration successful! Awaiting admin verification.');
        setForm({ name: '', email: '', password: '', bloodType: '', phone: '', address: '' });
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API}/auth/login`, { 
        email: form.email, 
        password: form.password 
      });
      
      if (res.data.success) {
        setUser(res.data.user);
        setMessage(`Welcome ${res.data.user.name}!`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (isAvailable) => {
    try {
      await axios.put(`${API}/donor/availability/${user.id}`, { isAvailable });
      setDonorProfile(prev => ({ ...prev, is_available: isAvailable ? 1 : 0 }));
      setMessage(`You are now ${isAvailable ? 'available' : 'unavailable'} for donation`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/donor/profile/${user.id}`, editForm);
      setDonorProfile(prev => ({ ...prev, ...editForm }));
      setShowEditProfile(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const verifyDonor = async (donorId) => {
    await axios.put(`${API}/admin/verify-donor/${donorId}`);
    loadAdminData();
    setMessage('Donor verified successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateInventory = async (bloodType, units) => {
    await axios.put(`${API}/admin/inventory/${bloodType}`, { units });
    loadAdminData();
    setMessage('Inventory updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  const approveRequest = async (requestId) => {
    await axios.put(`${API}/admin/approve-request/${requestId}`, { approvedBy: user.id });
    loadAdminData();
    setMessage('Request approved!');
    setTimeout(() => setMessage(''), 3000);
  };

  const createStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      setError('Name, email, and password are required');
      return;
    }
    try {
      await axios.post(`${API}/admin/create-staff`, newStaff);
      setNewStaff({ name: '', email: '', password: '', phone: '' });
      loadAdminData();
      setMessage('Staff account created!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create staff');
    }
  };

  const createBloodRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/staff/create-request`, { 
        ...newRequest, 
        requestedBy: user.id 
      });
      setNewRequest({ patientName: '', patientAge: '', bloodType: '', unitsRequired: '', urgencyLevel: 'normal' });
      loadStaffData();
      setMessage('Blood request created! Awaiting admin approval.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to create request');
    }
  };

  const searchDonors = async () => {
    if (!searchBloodType) return;
    try {
      const res = await axios.get(`${API}/staff/search-donors?bloodType=${searchBloodType}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Enhanced Donor Dashboard
  const DonorDashboard = () => (
    <div className="dashboard">
      <div className="dashboard-nav">
        <div className="logo">
          <HeartbeatLogo size={32} color="#e74c3c" />
          <span>BloodLink</span>
        </div>
        <div className="nav-links">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>My Profile</button>
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>Donation History</button>
          <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Blood Requests</button>
          <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>Notifications</button>
          <button className="logout-btn" onClick={() => setUser(null)}>Logout</button>
        </div>
      </div>
      
      <div className="dashboard-main">
        {activeTab === 'overview' && donorProfile && (
          <div>
            {/* Stats Cards Row */}
            <div className="donor-stats-grid">
              <div className="donor-stat-card">
                <div className="stat-icon"><BloodDropIcon /></div>
                <div className="stat-info">
                  <h3>Blood Type</h3>
                  <p className="stat-value-large">{donorProfile.blood_type}</p>
                </div>
              </div>
              <div className="donor-stat-card">
                <div className="stat-icon"><DonationIcon /></div>
                <div className="stat-info">
                  <h3>Total Donations</h3>
                  <p className="stat-value">{stats.totalDonations}</p>
                </div>
              </div>
              <div className="donor-stat-card">
                <div className="stat-icon"><HeartSmallIcon /></div>
                <div className="stat-info">
                  <h3>Units Donated</h3>
                  <p className="stat-value">{stats.totalUnits}</p>
                </div>
              </div>
              <div className="donor-stat-card">
                <div className="stat-icon"><CalendarIcon /></div>
                <div className="stat-info">
                  <h3>Last Donation</h3>
                  <p className="stat-value-small">{stats.lastDonation ? new Date(stats.lastDonation).toLocaleDateString() : 'Never'}</p>
                </div>
              </div>
            </div>

            {/* Welcome Banner */}
            <div className="welcome-banner">
              <div className="welcome-content">
                <div className="welcome-avatar">{donorProfile.name?.charAt(0)}</div>
                <div className="welcome-text">
                  <h2>Welcome back, {donorProfile.name}!</h2>
                  <p>Thank you for being a life-saving donor. Your generosity makes a difference.</p>
                </div>
                <div className="availability-status">
                  <button 
                    className={donorProfile.is_available ? 'status-available' : 'status-unavailable'} 
                    onClick={() => updateAvailability(!donorProfile.is_available)}
                  >
                    {donorProfile.is_available ? 'Available to Donate' : 'Currently Unavailable'}
                  </button>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="two-columns">
              {/* Left Column */}
              <div className="left-column">
                <div className="info-card">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    <button className="action-btn" onClick={() => setActiveTab('profile')}><EditIcon /> Update Profile</button>
                    <button className="action-btn" onClick={() => setActiveTab('history')}><HistoryIcon /> View History</button>
                    <button className="action-btn" onClick={() => window.location.href = 'tel:+251911'}><PhoneIcon /> Call Blood Bank</button>
                  </div>
                </div>
                
                <div className="info-card">
                  <h3>Your Impact</h3>
                  <div className="impact-stats">
                    <div className="impact-item">
                      <span className="impact-number">{stats.totalUnits * 3}</span>
                      <span className="impact-label">Lives Saved</span>
                    </div>
                    <div className="impact-item">
                      <span className="impact-number">{stats.totalDonations}</span>
                      <span className="impact-label">Donations Made</span>
                    </div>
                    <div className="impact-item">
                      <span className="impact-number">{stats.totalUnits * 450}</span>
                      <span className="impact-label">ML Donated</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Health Tips</h3>
                  <div className="health-tip">
                    <p><ShieldIcon /> Stay hydrated before donating blood</p>
                    <p><CheckIcon /> Eat iron-rich foods like spinach and beans</p>
                    <p><CalendarIcon /> Get at least 6 hours of sleep before donation</p>
                    <p><CloseIcon /> Avoid alcohol 24 hours before donating</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="right-column">
                <div className="info-card">
                  <h3>Urgent Blood Requests</h3>
                  {upcomingRequests.length > 0 ? (
                    <div className="urgent-list">
                      {upcomingRequests.map(req => (
                        <div key={req.id} className="urgent-item">
                          <div className="urgent-info">
                            <strong>{req.hospital}</strong>
                            <span>Blood Type: {req.bloodType}</span>
                            <span className={`urgency-${req.urgency.toLowerCase()}`}>{req.urgency} Priority</span>
                          </div>
                          <button className="respond-btn">Respond</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No urgent requests at this time</p>
                  )}
                </div>

                <div className="info-card">
                  <h3>Recent Activity</h3>
                  {donationHistory.slice(0, 3).map(record => (
                    <div key={record.id} className="activity-item">
                      <span className="activity-date">{new Date(record.donation_date).toLocaleDateString()}</span>
                      <span className="activity-desc">Donated {record.units || 1} unit(s) of blood</span>
                    </div>
                  ))}
                  {donationHistory.length === 0 && <p className="no-data">No recent activity</p>}
                </div>

                <div className="info-card">
                  <h3>Donor Badges</h3>
                  <div className="badges">
                    <div className="badge"><HeartSmallIcon /> First Time Donor</div>
                    {stats.totalDonations >= 3 && <div className="badge"><TrophyIcon /> Hero Donor</div>}
                    {stats.totalDonations >= 5 && <div className="badge"><TrophyIcon /> Platinum Donor</div>}
                    {donorProfile.is_available && <div className="badge"><CheckIcon /> Active Donor</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && donorProfile && (
          <div>
            <div className="welcome-card">
              <div className="avatar">{donorProfile.name?.charAt(0)}</div>
              <h2>My Profile</h2>
              <p className="email">{donorProfile.email}</p>
              <div className="status-badge">{donorProfile.is_verified ? 'Verified Donor' : 'Pending Verification'}</div>
            </div>

            <div className="info-card">
              <h3>Blood Information</h3>
              <div className="blood-type-large">{donorProfile.blood_type}</div>
              <div className="availability-toggle">
                <button 
                  className={donorProfile.is_available ? 'available' : 'unavailable'} 
                  onClick={() => updateAvailability(!donorProfile.is_available)}
                >
                  {donorProfile.is_available ? 'Available to Donate' : 'Currently Unavailable'}
                </button>
              </div>
            </div>

            <div className="info-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ marginBottom: 0, borderBottom: 'none' }}>Contact Information</h3>
                <button className="edit-btn" onClick={() => setShowEditProfile(!showEditProfile)}>
                  <EditIcon /> {showEditProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              
              {showEditProfile ? (
                <form onSubmit={updateProfile} className="edit-form">
                  <input type="text" placeholder="Phone Number" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                  <input type="text" placeholder="Address" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
                  <button type="submit" className="save-btn">Save Changes</button>
                </form>
              ) : (
                <div>
                  <p><PhoneIcon /> <strong>Phone:</strong> {donorProfile.phone || 'Not provided'}</p>
                  <p><LocationIcon /> <strong>Address:</strong> {donorProfile.address || 'Not provided'}</p>
                  <p><strong>Email:</strong> {donorProfile.email}</p>
                  <p><CalendarIcon /> <strong>Member Since:</strong> {new Date(donorProfile.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h2>My Donation Journey</h2>
            {donationHistory.length === 0 ? (
              <div className="empty-state">
                <p>No donation records yet.</p>
                <p>When you donate blood, your history will appear here.</p>
                <p>Thank you for considering to donate!</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>Blood Type</th><th>Units</th><th>Status</th><th>Certificate</th></tr>
                </thead>
                <tbody>
                  {donationHistory.map(record => (
                    <tr key={record.id}>
                      <td>{new Date(record.donation_date).toLocaleDateString()}</td>
                      <td>{record.blood_type}</td>
                      <td>{record.units || 1}</td>
                      <td><span className="status-completed">Completed</span></td>
                      <td><button className="certificate-btn">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2>Blood Donation Requests</h2>
            <div className="requests-grid">
              {upcomingRequests.length > 0 ? upcomingRequests.map(req => (
                <div key={req.id} className="request-card">
                  <div className="request-header">
                    <span className="hospital-name">{req.hospital}</span>
                    <span className={`urgency-badge ${req.urgency.toLowerCase()}`}>{req.urgency}</span>
                  </div>
                  <div className="request-body">
                    <p><strong>Blood Type Needed:</strong> {req.bloodType}</p>
                    <p><strong>Date Needed:</strong> {new Date(req.date).toLocaleDateString()}</p>
                  </div>
                  <button className="respond-request-btn">I Can Donate</button>
                </div>
              )) : (
                <div className="empty-state">No active requests at this time</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h2>Notifications</h2>
            <div className="notifications-list">
              {notifications.map(notif => (
                <div key={notif.id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                  <div className="notification-icon"><NotificationIcon /></div>
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.date).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Admin Dashboard
  const AdminDashboard = () => (
    <div className="dashboard">
      <div className="dashboard-nav">
        <div className="logo">
          <HeartbeatLogo size={32} color="#e74c3c" />
          <span>BloodLink Admin</span>
        </div>
        <div className="nav-links">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'donors' ? 'active' : ''} onClick={() => setActiveTab('donors')}>Donors</button>
          <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>Staff</button>
          <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Inventory</button>
          <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Requests</button>
          <button className="logout-btn" onClick={() => setUser(null)}>Logout</button>
        </div>
      </div>
      <div className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="stats-grid">
            <div className="stat-card"><h3>Total Donors</h3><p className="stat-number">{adminStats.totalDonors || 0}</p></div>
            <div className="stat-card"><h3>Pending Donors</h3><p className="stat-number pending">{adminStats.pendingDonors || 0}</p></div>
            <div className="stat-card"><h3>Pending Requests</h3><p className="stat-number pending">{adminStats.pendingRequests || 0}</p></div>
            <div className="stat-card"><h3>Blood Units</h3><p className="stat-number">{adminStats.totalBloodUnits || 0}</p></div>
          </div>
        )}
        {activeTab === 'donors' && (
          <div>
            <h2>Pending Verification</h2>
            {pendingDonors.map(donor => (
              <div key={donor.id} className="donor-card">
                <span>{donor.name} - {donor.blood_type} ({donor.email})</span>
                <button onClick={() => verifyDonor(donor.id)}>Verify</button>
              </div>
            ))}
            <h2>All Verified Donors</h2>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Blood Type</th><th>Phone</th><th>Status</th></tr></thead>
              <tbody>
                {allDonors.filter(d => d.is_verified).map(donor => (
                  <tr key={donor.id}>
                    <td>{donor.name}</td>
                    <td>{donor.blood_type}</td>
                    <td>{donor.phone || '-'}</td>
                    <td>{donor.is_available ? 'Available' : 'Unavailable'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'staff' && (
          <div>
            <div className="form-card">
              <h3>Create New Staff Account</h3>
              <form onSubmit={createStaff}>
                <input type="text" placeholder="Full Name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required />
                <input type="email" placeholder="Email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} required />
                <input type="password" placeholder="Password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} required />
                <input type="text" placeholder="Phone" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} />
                <button type="submit">Create Staff</button>
              </form>
            </div>
            <h2>Existing Staff</h2>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
              <tbody>
                {staffList.map(staff => (
                  <tr key={staff.id}><td>{staff.name}</td><td>{staff.email}</td><td>{staff.phone || '-'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'inventory' && (
          <div>
            <h2>Blood Inventory Management</h2>
            <div className="inventory-grid">
              {inventory.map(item => (
                <div key={item.blood_type} className={`inventory-card ${item.units < 5 ? 'low-stock' : ''}`}>
                  <h3>{item.blood_type}</h3>
                  <p>{item.units} units</p>
                  {item.units < 5 && <span className="warning">Low Stock</span>}
                  <button onClick={() => {
                    const newUnits = prompt('Enter new units:', item.units);
                    if (newUnits) updateInventory(item.blood_type, parseInt(newUnits));
                  }}>Update</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'requests' && (
          <div>
            <h2>All Blood Requests</h2>
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Blood Type</th><th>Units</th><th>Urgency</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {bloodRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.patient_name}</td>
                    <td>{req.blood_type}</td>
                    <td>{req.units_required}</td>
                    <td><span className={`urgency-${req.urgency_level}`}>{req.urgency_level}</span></td>
                    <td><span className={`status-${req.status}`}>{req.status}</span></td>
                    <td>{req.status === 'pending' && <button onClick={() => approveRequest(req.id)}>Approve</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Staff Dashboard
  const StaffDashboard = () => (
    <div className="dashboard">
      <div className="dashboard-nav">
        <div className="logo">
          <HeartbeatLogo size={32} color="#e74c3c" />
          <span>BloodLink Staff</span>
        </div>
        <div className="nav-links">
          <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>Create Request</button>
          <button className={activeTab === 'myrequests' ? 'active' : ''} onClick={() => setActiveTab('myrequests')}>My Requests</button>
          <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Inventory</button>
          <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>Find Donors</button>
          <button className="logout-btn" onClick={() => setUser(null)}>Logout</button>
        </div>
      </div>
      <div className="dashboard-main">
        {activeTab === 'create' && (
          <div className="form-card">
            <h2>Create Blood Request</h2>
            <form onSubmit={createBloodRequest}>
              <input type="text" placeholder="Patient Name" value={newRequest.patientName} onChange={e => setNewRequest({...newRequest, patientName: e.target.value})} required />
              <input type="number" placeholder="Patient Age" value={newRequest.patientAge} onChange={e => setNewRequest({...newRequest, patientAge: e.target.value})} />
              <select value={newRequest.bloodType} onChange={e => setNewRequest({...newRequest, bloodType: e.target.value})} required>
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
              <input type="number" placeholder="Units Required" value={newRequest.unitsRequired} onChange={e => setNewRequest({...newRequest, unitsRequired: e.target.value})} required />
              <select value={newRequest.urgencyLevel} onChange={e => setNewRequest({...newRequest, urgencyLevel: e.target.value})}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
              <button type="submit">Submit Request</button>
            </form>
          </div>
        )}
        {activeTab === 'myrequests' && (
          <div>
            <h2>My Blood Requests</h2>
            <table className="data-table">
              <thead><tr><th>Patient</th><th>Blood Type</th><th>Units</th><th>Urgency</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {myRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.patient_name}</td>
                    <td>{req.blood_type}</td>
                    <td>{req.units_required}</td>
                    <td><span className={`urgency-${req.urgency_level}`}>{req.urgency_level}</span></td>
                    <td><span className={`status-${req.status}`}>{req.status}</span></td>
                    <td>{new Date(req.requested_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'inventory' && (
          <div>
            <h2>Blood Inventory</h2>
            <div className="inventory-grid">
              {availableInventory.map(item => (
                <div key={item.blood_type} className={`inventory-card ${item.units < 5 ? 'low-stock' : ''}`}>
                  <h3>{item.blood_type}</h3>
                  <p>{item.units} units</p>
                  {item.units < 5 && <span className="warning">Low Stock Warning</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'search' && (
          <div>
            <h2>Find Compatible Donors</h2>
            <div className="search-box">
              <select value={searchBloodType} onChange={e => setSearchBloodType(e.target.value)}>
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
              <button onClick={searchDonors}>Search Donors</button>
            </div>
            {searchResults.length > 0 && (
              <table className="data-table">
                <thead><tr><th>Name</th><th>Blood Type</th><th>Phone</th><th>Status</th></tr></thead>
                <tbody>
                  {searchResults.map(donor => (
                    <tr key={donor.id}>
                      <td>{donor.name}</td>
                      <td>{donor.blood_type}</td>
                      <td>{donor.phone || 'Not provided'}</td>
                      <td>{donor.is_available ? 'Available' : 'Unavailable'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Auth Screen
  const AuthScreen = () => (
    <div className="container">
      <div className="form-container">
        <div className="heart-icon">
          <HeartbeatLogo size={64} color="#e74c3c" />
        </div>
        <h1>BloodLink</h1>
        <div className="toggle">
          <button className={isLogin ? 'active' : ''} onClick={() => { setIsLogin(true); setMessage(''); setError(''); }}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => { setIsLogin(false); setMessage(''); setError(''); }}>Register</button>
        </div>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} required />
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} required />
            <select value={form.bloodType} onChange={(e) => updateForm('bloodType', e.target.value)} required>
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </select>
            <input type="text" placeholder="Phone Number" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
            <input type="text" placeholder="Address" value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </form>
        )}
        <div className="demo-info">
          <p>Demo Admin: admin@bloodlink.com / admin123</p>
        </div>
      </div>
    </div>
  );

  if (user && user.role === 'donor') return <DonorDashboard />;
  if (user && user.role === 'admin') return <AdminDashboard />;
  if (user && user.role === 'staff') return <StaffDashboard />;
  return <AuthScreen />;
}

export default App;