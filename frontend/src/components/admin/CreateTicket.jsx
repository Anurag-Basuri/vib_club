import { useState } from 'react';
import { User, Mail, Smartphone, BookOpen, GraduationCap, Ticket, X } from 'lucide-react';
import { useCreateTicket } from '../../hooks/useTickets.js';
import ErrorMessage from './ErrorMessage.jsx';
import StatusBadge from './StatusBadge.jsx';

const CreateTicket = ({ token, events, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    lpuId: '',
    gender: 'male',
    hosteler: 'no',
    hostel: '',
    course: '',
    club: '',
    eventId: events[0]?._id || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { createTicket, loading } = useCreateTicket();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName || !formData.email || !formData.eventId) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      await createTicket(formData, token);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        lpuId: '',
        gender: 'male',
        hosteler: 'no',
        hostel: '',
        course: '',
        club: '',
        eventId: events[0]?._id || '',
      });
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to create ticket');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Ticket className="h-6 w-6 text-blue-400" />
          Create New Ticket
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {success ? (
        <div className="text-center py-8">
          <div className="mx-auto bg-green-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <Ticket className="h-8 w-8 text-green-400" />
          </div>
          <h4 className="text-lg font-semibold text-white">Ticket Created Successfully!</h4>
          <p className="text-gray-400 mt-2">The ticket has been added to the system</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Personal Information
              </h4>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">LPU ID</label>
                <input
                  type="text"
                  name="lpuId"
                  value={formData.lpuId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345678"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Hosteler</label>
                  <select
                    name="hosteler"
                    value={formData.hosteler}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              
              {formData.hosteler === 'yes' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Hostel</label>
                  <input
                    type="text"
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hostel Name"
                  />
                </div>
              )}
            </div>
            
            {/* Academic Info */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-400" />
                Academic Information
              </h4>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="B.Tech CSE"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Club</label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DSC, IEEE, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Select Event *</label>
                <select
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {events.map(event => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-8 p-4 bg-gray-750 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Ticket Status</p>
                    <StatusBadge status="approved" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ticket ID</p>
                    <p className="text-white font-mono">TKT-{Math.floor(1000 + Math.random() * 9000)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {error && <ErrorMessage error={error} />}
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white ${
                loading ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {loading ? 'Creating Ticket...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateTicket;