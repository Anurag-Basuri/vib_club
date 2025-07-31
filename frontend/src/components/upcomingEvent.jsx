import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicClient } from "../services/api.js";
import ENV from '../config/env.js';

const HorrorRaveYardPage = () => {
  const [spotsLeft, setSpotsLeft] = useState(0);
  const [totalSpots, setTotalSpots] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eyesBlinking, setEyesBlinking] = useState(false);
  const [ghostAppears, setGhostAppears] = useState(false);
  const [bloodDrips, setBloodDrips] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '300', // Fixed amount
    lpuId: ''
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await publicClient.get('api/events/upcoming-event');
        const event = response.data?.data || response.data;
        setEventData(event);
        // Debug log (commented for production)
        // console.log(response.data)
        if (event) {
          setTotalSpots(event.totalSpots || 0);
          const registrations = Array.isArray(event.registrations) ? event.registrations.length : 0;
          setSpotsLeft((event.totalSpots || 0) - registrations);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
  }, []);

  useEffect(() => {
    if (!eventData?.date) return;
    const targetDate = new Date(eventData.date).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEyesBlinking(true);
      setTimeout(() => setEyesBlinking(false), 150 + Math.random() * 200);
    }, 1500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGhostAppears(true);
      setTimeout(() => setGhostAppears(false), 2000);
    }, 6000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bloodDrips.length < 20) {
        const newDrip = {
          id: Date.now(),
          x: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 3 + Math.random() * 5
        };
        setBloodDrips(prev => [...prev, newDrip]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [bloodDrips]);

  // Payment handler functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate form data
      const { name, email, phone, amount, lpuId } = formData;
      
      if (!name || !email || !phone || !lpuId) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Validate amount from backend
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        setError('Invalid ticket amount from server');
        setLoading(false);
        return;
      }

      // Check email availability before proceeding with payment
      try {
        await publicClient.post('/tickets/check-email', {
          email: email.trim(),
          eventId: eventData?._id || 'event_raveyard_2025',
          lpuId: lpuId.trim()
        });
      } catch (emailCheckError) {
        if (emailCheckError.response?.status === 409) {
          setError(emailCheckError.response.data.message || 'Email or LPU ID already registered for this event');
        } else {
          setError('Failed to validate registration details. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Create order with backend
      const response = await publicClient.post('/cashfree/order', {
        name,
        email,
        phone,
        amount: parseFloat(amount), // Use amount from backend
        lpuId,
        eventId: eventData?._id || 'event_raveyard_2025',
        eventName: eventData?.title || 'RaveYard 2025'
      });
      
      // Debug logs (commented for production)
      // console.log("Full backend response:", response);
      // console.log("Response data:", response.data);
      // console.log("Response data.data:", response.data.data);
      
      const orderData = response.data.data;
      const sessionId = orderData.payment_session_id;
      const orderId = orderData.order_id;
      
      // Debug logs (commented for production)
      // console.log("Extracted sessionId:", sessionId);
      // console.log("Extracted orderId:", orderId);

      // Initialize Cashfree payment
      if (window.Cashfree) {
        try {
          // Create Cashfree instance with environment-based configuration
          const cashfree = new window.Cashfree({
            mode: ENV.CASHFREE_MODE
          });

          // Debug logging (only in development)
          if (ENV.DEBUG) {
            // Commented for production deployment
            // console.log("Cashfree mode:", ENV.CASHFREE_MODE);
            // console.log("Environment:", ENV.NODE_ENV);
            // console.log("Cashfree instance:", cashfree);
            // console.log("Instance methods:", Object.getOwnPropertyNames(cashfree));
          }

          // Use checkout method on the instance
          const returnUrl = `${ENV.FRONTEND_URL}/payment-success?order_id=${orderId}&event_id=${eventData?._id}&event_name=${encodeURIComponent(eventData?.title || 'RaveYard 2025')}`;
          
          cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: "_self",
            returnUrl: returnUrl,
            theme: {
              color: '#dc2626', // Red theme to match your brand
              backgroundColor: '#1a0630',
              primaryColor: '#dc2626',
              secondaryColor: '#1a0630'
            },
            components: {
              style: {
                backgroundColor: '#1a0630',
                color: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                primaryColor: '#dc2626'
              }
            },
            // Enhanced business branding
            merchantName: "Vibranta Student Organization",
            description: "RaveYard 2025 - Official Student Organization - LPU",
            // Additional branding metadata
            metadata: {
              businessName: "Vibranta Student Organization",
              eventName: "RaveYard 2025",
              organization: "LPU Student Organization"
            }
          }).then(function(result) {
            // Debug logs (commented for production)
            // console.log("Checkout initiated:", result);
            // Close the payment form since user will be redirected
            setShowPaymentForm(false);
          }).catch(function(error) {
            console.error("Payment error:", error);
            setError('Payment failed. Please try again.');
          });

        } catch (paymentError) {
          console.error("Payment initialization error:", paymentError);
          setError('Failed to initialize payment. Please try again.');
        }
      } else {
        setError('Payment gateway not available. Please try again.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const openPaymentForm = () => {
    setShowPaymentForm(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      amount: eventData?.ticketPrice || '300', // Fetch from backend but show as read-only
      upiId: '',
      lpuId: ''
    });
  };

  const BloodDrips = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
      {bloodDrips.map((drip) => (
        <motion.div
          key={drip.id}
          className="absolute top-0 w-2 h-8 bg-red-600 rounded-b-full"
          style={{ left: `${drip.x}%` }}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: ['0px', '50px', '50px', '100px'],
            opacity: [0, 1, 1, 0],
            y: [0, window.innerHeight * 0.8]
          }}
          transition={{
            duration: drip.duration,
            delay: drip.delay,
            times: [0, 0.3, 0.7, 1]
          }}
          onAnimationComplete={() => {
            setBloodDrips(prev => prev.filter(d => d.id !== drip.id));
          }}
        >
          <motion.div
            className="absolute bottom-0 w-4 h-4 bg-red-700 rounded-full"
            animate={{
              scale: [0, 1.5, 1],
              y: [0, 10, 20]
            }}
            transition={{
              duration: drip.duration * 0.3,
              delay: drip.duration * 0.7
            }}
          />
        </motion.div>
      ))}
    </div>
  );

  // Event highlights based on your prompt
  const eventHighlights = [
    {
      title: "Headlining Performance by DJ Gracy",
      description: "Nationally renowned DJ bringing an exclusive high-energy haunted set. Remix segments: Bollywood x EOH Desi Bass, with dark glitchy FX. Interactive crowd drops, live horror-themed AV sync.",
      icon: "🎧"
    },
    {
      title: "Curated Freshers Experience",
      description: "First event to welcome the incoming batch — from the other side! Mixes horror, fun, and chaos for an unforgettable freshman night. Sets a ghostly tone for campus culture and Gen Z celebration.",
      icon: "👻"
    },
    {
      title: "Haunted Glow Setup",
      description: "Lasers, fog, UV-reactive horror decor, props, and more. Insta-worthy ghost installations, skull photo booths, and gaming. Tattoo mask transformation booth at entry.",
      icon: "💀"
    },
    {
      title: "Limited Access Entry",
      description: "Entry via branded wristbands. VIP zones for contest winners, influencers, faculty guests. Exclusive access to haunted chill lounge and scream zone.",
      icon: "🎟️"
    },
    {
      title: "Emergency Preparedness",
      description: "Security with crowd flow control. Emergency medical setup & trained volunteers. Gender-sensitive, inclusive crowd care policy enforced at checkpoints.",
      icon: "🚨"
    },
    {
      title: "Social Media Amplification",
      description: "Hashtag: #RaveYard2025 — Join the undead online! Scream countdowns, ghost transformation content. Influencer strategy & branded social booth for sponsors.",
      icon: "📱"
    },
    {
      title: "Refreshment Zone @ RaveYard",
      description: "Dedicated food & beverage stalls near the venue. Chillers: Mojitos, mocktails, soda blends, lemonade, cold coffee. Warmers: Coffee, chai. Snacks: Momos, rolls, nachos, popcorn, samosa. Quick eats: Sandwiches, Maggi, fries. Sweet treats: Cupcakes, brownies, chocolate dipped waffles.",
      icon: "🍔"
    }
  ];

  return (
    <div
      className="min-h-screen bg-black text-white font-sans relative"
      style={{
        overflow: "hidden" // Prevent double scrollbars
      }}
    >
      <BloodDrips />

      {/* Rust particles floating */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl text-red-800 opacity-50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -10, 0],
            x: [0, (Math.random() > 0.5 ? 1 : -1) * 5, 0],
            rotate: [0, Math.random() * 360]
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          •
        </motion.div>
      ))}

      {/* Hero Section - Attraction Only */}
      <section className="relative min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 40%, #2d1b69 0%, #1a0630 40%, #0a0015 70%, #000000 100%)'
        }}
      >
        {/* Rust overlays */}
        <div className="relative z-10 text-center max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-7xl md:text-9xl font-black mb-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                RaveYard 2025
              </span>
              <span className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-full"></span>
            </motion.h1>
            <motion.h2
              className="text-4xl md:text-6xl text-red-400 mb-8 font-bold relative pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              The Haunted Resurrection
              <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-6 mx-1 bg-gradient-to-b from-red-500 to-transparent"
                    animate={{
                      y: [0, 20, 40, 60],
                      opacity: [1, 1, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            </motion.h2>
            <motion.div
              className="flex flex-wrap justify-center gap-8 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-2">🎧</span>
                <span className="text-lg font-bold text-red-300">DJ Gracy Live</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-2">👻</span>
                <span className="text-lg font-bold text-red-300">Glow Horror Setup</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-2">🍔</span>
                <span className="text-lg font-bold text-red-300">Refreshment Zone</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-6xl mb-2">🎟️</span>
                <span className="text-lg font-bold text-red-300">VIP Wristbands</span>
              </div>
            </motion.div>
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(220, 38, 38, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={openPaymentForm}
                className="px-10 py-6 relative rounded-xl font-bold text-xl shadow-lg overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, #8B4513, #5D2919)`,
                  boxShadow: `0 4px 0 #3a180d, inset 0 2px 4px rgba(255, 100, 100, 0.4)`,
                  border: '1px solid #5D2919'
                }}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <span>ENTER THE CRYPT</span>
                  <span>💀</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-6 mx-2 bg-gradient-to-b from-red-600 to-transparent"
                      animate={{
                        y: [0, 10, 20],
                        opacity: [1, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-8 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-red-400 mb-3 text-sm font-medium">DESCEND INTO DARKNESS</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-10 h-16 rounded-full border-2 border-red-900 flex justify-center p-2"
            style={{
              background: `linear-gradient(145deg, #2a0f06, #1a0904)`,
              boxShadow: 'inset 0 0 5px rgba(139, 0, 0, 0.5)'
            }}
          >
            <motion.div
              className="w-2 h-3 bg-gradient-to-b from-red-500 to-red-700 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Countdown timer */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {Object.entries(countdown).map(([unit, value], index) => (
              <motion.div
                key={unit}
                className="relative bg-gradient-to-b from-gray-900 to-black border-b-4 border-red-900 rounded-xl p-4 overflow-hidden"
                style={{
                  boxShadow: 'inset 0 0 10px rgba(139, 0, 0, 0.5)'
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-900 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-red-900 rounded-full opacity-70"></div>
                <div className="text-3xl md:text-4xl font-black text-red-400 mb-1 relative z-10">
                  {String(value).padStart(2, '0')}
                </div>
                <div className="text-sm text-red-300 uppercase font-medium relative z-10">
                  {unit}
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="flex justify-center gap-8 mb-4">
            <span className="text-red-400 font-bold">{spotsLeft} SOULS LEFT</span>
            <span className="text-red-400 font-bold">{totalSpots} TOTAL</span>
          </div>
          <div className="w-full bg-gray-900/50 h-3 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-800"
              style={{
                width: totalSpots > 0 ? `${(spotsLeft / totalSpots) * 100}%` : "0%"
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-6">
              EVENT HIGHLIGHTS
            </h2>
            <p className="text-xl text-red-300 max-w-3xl mx-auto">
              Discover what makes RaveYard 2025 unforgettable
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventHighlights.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-red-900 to-black backdrop-blur-sm border border-red-600/50 rounded-xl p-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ y: -10 }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-red-200">{item.description}</p>
                <motion.div
                  className="absolute top-4 right-4 w-6 h-6 bg-red-600 rounded-full"
                  animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-red-400 mb-8">
                EVENT DETAILS
              </h2>
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span>📅</span>
                  </div>
                  <div>
                    <div className="text-sm text-red-300 font-medium">DATE & TIME</div>
                    <div className="text-white text-xl font-medium">
                      {eventData?.date ? new Date(eventData.date).toLocaleDateString() : "--"} • {eventData?.time || "--"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span>📍</span>
                  </div>
                  <div>
                    <div className="text-sm text-red-300 font-medium">LOCATION</div>
                    <div className="text-white text-xl font-medium">{eventData?.venue || "--"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-red-600/30">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span>🎟️</span>
                  </div>
                  <div>
                    <div className="text-sm text-red-300 font-medium">TICKET PRICE</div>
                    <div className="text-white text-xl font-medium">
                      {eventData?.ticketPrice ? `₹${eventData.ticketPrice}` : "₹300"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-red-400 font-bold">{spotsLeft} SOULS LEFT</span>
                  <span className="text-red-400 font-bold">{totalSpots} TOTAL</span>
                </div>
                <div className="w-full bg-gray-900/50 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-800"
                    style={{
                      width: totalSpots > 0 ? `${(spotsLeft / totalSpots) * 100}%` : "0%"
                    }}
                  ></div>
                </div>
              </div>
              {eventData?.tags && eventData.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {eventData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-sm bg-red-900/50 text-red-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-900/40 to-black/70 backdrop-blur-sm border border-red-600/50 rounded-xl overflow-hidden aspect-square">
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-8xl mb-6">👻</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Portal Opening</h3>
                  <p className="text-red-200">Experience the dimensional rift between worlds</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ticket CTA */}
      <section className="py-32 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8">
              CLAIM YOUR SOUL PASS
            </h2>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(220, 38, 38, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={openPaymentForm}
              className="px-16 py-10 bg-gradient-to-r from-red-600 to-red-800 rounded-xl font-bold text-2xl shadow-xl relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-4">
                <span>🎟️</span>
                <span>SECURE YOUR PLACE</span>
                <span>🔥</span>
              </div>
            </motion.button>
            <div className="mt-12 space-y-4">
              <p className="text-xl text-red-300 max-w-2xl mx-auto">
                ⚠️ Limited to {totalSpots} souls - Once sold out, entry is sealed forever ⚠️
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-t from-red-900/20 to-black border-t border-red-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              RaveYard 2025
            </div>
            <div className="flex justify-center gap-8 text-red-300">
              { [
                { icon: "📱", text: "#RaveYard2025" },
                { icon: "👻", text: "@raveyard_official" },
                { icon: "💀", text: "Join the Undead" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-red-800/30 pt-8 space-y-2">
              <p className="text-red-300">© 2025 RaveYard. All rights reserved to the underworld.</p>
              <p className="text-red-400 text-sm opacity-80">
                A ghostly rite of passage for the undead students of tomorrow
              </p>
            </div>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {eyesBlinking && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-5xl"
                style={{
                  left: `${5 + i * 12}%`,
                  top: `${15 + (i % 3) * 25}%`,
                }}
                animate={{ scaleY: [1, 0.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                👁️
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {ghostAppears && (
          <div className="fixed inset-0 pointer-events-none z-20">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-6xl"
                style={{
                  left: `${i * 30}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0.7, 0],
                  scale: [0, 1.5, 1.2, 0],
                  y: [0, -50, -30, -100]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 2 }}
              >
                👻
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Payment Form Modal */}
      <AnimatePresence>
        {showPaymentForm && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentForm(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-red-900/90 to-black/90 backdrop-blur-sm border border-red-600/50 rounded-xl max-w-md w-full max-h-[90vh] relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="p-6 pb-4 border-b border-red-600/30">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-red-400 mb-1">Enter the Crypt</h3>
                  <p className="text-red-300 text-sm">Complete your soul pass purchase</p>
                </div>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 pt-4">
                {error && (
                  <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 mb-4">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-red-300 text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-red-300 text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-red-300 text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-red-300 text-sm font-medium mb-1">
                      LPU Registration Number
                    </label>
                    <input
                      type="text"
                      name="lpuId"
                      value={formData.lpuId}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-red-600/50 rounded-lg px-3 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="Enter your LPU registration number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-red-300 text-sm font-medium mb-1">
                      Amount (₹) - Set by Event
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="amount"
                        value={`₹${formData.amount}`}
                        readOnly
                        disabled
                        className="w-full bg-gray-800/50 border border-red-600/30 rounded-lg px-3 py-2 text-gray-300 text-sm cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-red-400 text-xs">� Info</span>
                      </div>
                    </div>
                    <p className="text-red-400/70 text-xs mt-1">Ticket price set by event organizers</p>
                  </div>

                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 pt-4 border-t border-red-600/30">
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white transition-colors text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      'Pay Now 🔥'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HorrorRaveYardPage;