import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  ArrowUp, 
  Camera, 
  Layout, 
  Calendar,
  CheckCircle,
  DollarSign,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Wrench,
  PartyPopper,
  Heart,
  Star,
  Clock,
  Target,
  TrendingUp,
  Home,
  FileText,
  BarChart3,
  MessageCircle,
  BookOpen
} from 'lucide-react'
import NetSheetCalculator from './components/NetSheetCalculator'
import ROICalculator from './components/ROICalculator'
import Glossary from './components/Glossary'
import SmartSellTimeline from './components/SmartSellTimeline'

// Virtual Staging Before/After Slider Component
const VirtualStagingSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    updateSliderPosition(e.clientX)
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    if (e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX)
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      e.preventDefault()
      updateSliderPosition(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      if (e.touches[0]) {
        updateSliderPosition(e.touches[0].clientX)
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('touchcancel', handleTouchEnd)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [isDragging])

  const handleContainerClick = (e) => {
    if (e.target.closest('.slider-handle')) return
    if (isDragging) return
    updateSliderPosition(e.clientX)
  }

  return (
    <div 
      ref={containerRef}
      className="slider-container relative w-full h-[500px] md:h-[600px] cursor-col-resize select-none"
      onClick={handleContainerClick}
      onTouchStart={(e) => {
        if (e.target.closest('.slider-handle')) return
        if (isDragging) return
        if (e.touches[0]) {
          updateSliderPosition(e.touches[0].clientX)
        }
      }}
    >
      {/* After Image (Background - Left Side) */}
      <div className="absolute inset-0">
        <img
          src="/images/public:images:virtual-staging-afte.PNG"
          alt="Room after virtual staging"
          className="w-full h-full object-cover"
          draggable={false}
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold backdrop-blur-sm">
          After
        </div>
      </div>

      {/* Before Image (Clipped - Right Side) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src="/images/public:images:virtual-staging-before.jpeg"
          alt="Empty room before virtual staging"
          className="w-full h-full object-cover"
          draggable={false}
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg font-semibold backdrop-blur-sm">
          Before
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="slider-handle absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10 cursor-col-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-primary hover:scale-110 transition-transform">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <div className="w-1 h-4 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
        ← Drag to compare →
      </div>
    </div>
  )
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    timeline: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [activeChapter, setActiveChapter] = useState(null)
  const [showGlossary, setShowGlossary] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle escape key for modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showSuccessModal) setShowSuccessModal(false)
        if (showPhotoModal) setShowPhotoModal(false)
      }
    }

    if (showSuccessModal || showPhotoModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showSuccessModal, showPhotoModal])

  // Add FAQPage Schema for SEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long does it take to sell a home?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Typically, the home selling process takes 30-90 days from listing to closing, depending on market conditions, pricing strategy, and buyer financing. On average, homes in the DMV sell in 21-30 days when priced correctly and marketed effectively."
          }
        },
        {
          "@type": "Question",
          "name": "What are your commission fees?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Commission fees are typically 5-6% of the sale price, split between the listing and buyer's agent. This is negotiable and discussed during our initial consultation. What's important is the NET amount you walk away with."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to stage my home?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Virtual staging is included with every listing and is often more effective than traditional staging. It's cost-effective, allows multiple design styles, and attracts online clicks without the hassle of moving furniture in and out."
          }
        },
        {
          "@type": "Question",
          "name": "What if my home doesn't sell?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This is rare when priced correctly and marketed effectively. However, if your home doesn't sell within the expected timeframe, we'll analyze the feedback, adjust our strategy, and potentially recommend pricing adjustments or improvements."
          }
        },
        {
          "@type": "Question",
          "name": "How do you determine the listing price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We conduct a comprehensive Comparative Market Analysis (CMA) that looks at recent sales, active listings, and market trends in your area. We also consider your home's unique features, condition, and current market conditions."
          }
        },
        {
          "@type": "Question",
          "name": "What repairs do I need to make before listing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We'll walk through your home together and identify any necessary repairs vs. cosmetic improvements. Major issues (roof, HVAC, foundation) should typically be addressed, while minor cosmetic items can often be handled during negotiations."
          }
        },
        {
          "@type": "Question",
          "name": "Can I sell my home while buying another?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! We can coordinate both transactions using strategies like post-settlement occupancy (rent-back), bridge financing, or contingency clauses. Many sellers do this successfully."
          }
        },
        {
          "@type": "Question",
          "name": "What are closing costs for sellers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Seller closing costs typically include commission fees (5-6%), transfer taxes, title insurance, prorated property taxes, and any negotiated repairs or concessions. These typically range from 8-10% of the sale price total."
          }
        },
        {
          "@type": "Question",
          "name": "How do you market my home?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Proven Marketing Plan includes professional HDR photography, floor plans, virtual staging, MLS listing, Coming Soon campaign to build buyer interest, open houses with aggressive follow-up, social media promotion, and our extensive network of buyer agents."
          }
        },
        {
          "@type": "Question",
          "name": "What happens after I accept an offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "After acceptance, we manage the entire process: inspections, appraisals, negotiations, paperwork, and coordination with title company and lenders until closing. Our average closing time is 30 days."
          }
        }
      ]
    }

    // Remove existing FAQ schema if any
    const existingSchema = document.getElementById('faq-schema')
    if (existingSchema) {
      existingSchema.remove()
    }

    // Add FAQ schema
    const script = document.createElement('script')
    script.id = 'faq-schema'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(faqSchema)
    document.head.appendChild(script)

    return () => {
      const schema = document.getElementById('faq-schema')
      if (schema) schema.remove()
    }
  }, [])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
    setActiveChapter(sectionId)
  }

  const handleOpenGlossary = () => {
    console.log('Opening glossary')
    setShowGlossary(true)
    // Scroll to top when glossary opens
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCloseGlossary = () => {
    console.log('Closing glossary')
    setShowGlossary(false)
  }

  // Load Google Maps script dynamically
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'AIzaSyBCsPHXj76xFdWuXs2OOZn3YV8-jYmoYLE'
    
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
      script.async = true
      script.defer = true
      
      // Add error handling
      script.onerror = () => {
        console.error('Failed to load Google Maps JavaScript API. Please check:')
        console.error('1. Maps JavaScript API is enabled in Google Cloud Console')
        console.error('2. Places API is enabled in Google Cloud Console')
        console.error('3. API key is valid and has proper restrictions')
      }
      
      document.head.appendChild(script)
    }
  }, [])

  // Initialize Google Places Autocomplete for property address
  useEffect(() => {
    let autocomplete = null
    const inputId = 'propertyAddress'

    const initAutocomplete = () => {
      // Wait for input to be in DOM
      const input = document.getElementById(inputId)
      if (!input) return false

      // Check if already initialized
      if (input.dataset.autocompleteInitialized === 'true') return true

      // Check if Google Maps is loaded and APIs are available
      if (window.google && window.google.maps) {
        // Check if Places API is available
        if (!window.google.maps.places) {
          console.warn('Google Maps Places API not loaded. Make sure Places API is enabled in Google Cloud Console.')
          return false
        }

        try {
          // Create autocomplete instance - this should NOT interfere with typing
          autocomplete = new window.google.maps.places.Autocomplete(input, {
            types: ['address'],
            componentRestrictions: { country: ['us'] },
            fields: ['formatted_address', 'address_components', 'geometry']
          })
          
          // Only update on place selection from dropdown, not while typing
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            if (place && place.formatted_address) {
              // Update React state when user selects from dropdown
              setFormData(prev => ({ ...prev, propertyAddress: place.formatted_address }))
              // Clear any existing error
              if (formErrors.propertyAddress) {
                setFormErrors(prev => ({ ...prev, propertyAddress: '' }))
              }
            }
          })
          
          // Mark as initialized
          input.dataset.autocompleteInitialized = 'true'
          console.log('Google Places Autocomplete initialized successfully')
          return true
        } catch (error) {
          console.error('Error initializing autocomplete:', error)
          if (error.message && error.message.includes('ApiNotActivatedMapError')) {
            console.error('Maps JavaScript API is not enabled. Please enable it in Google Cloud Console.')
          }
          return false
        }
      }
      return false
    }

    // Wait for Google Maps to load before trying to initialize
    const waitForGoogleMaps = () => {
      if (window.google && window.google.maps) {
        // Google Maps is loaded, try to initialize
        let attempts = 0
        const maxAttempts = 20
        const tryInit = () => {
          attempts++
          if (initAutocomplete() || attempts >= maxAttempts) {
            clearInterval(initInterval)
            if (attempts >= maxAttempts && !document.getElementById(inputId)?.dataset.autocompleteInitialized) {
              console.warn('Failed to initialize autocomplete after multiple attempts. Check API activation in Google Cloud Console.')
            }
          }
        }

        // Start trying immediately
        tryInit()
        
        // Also try periodically
        const initInterval = setInterval(tryInit, 500)
        return initInterval
      }
      return null
    }

    // Check immediately
    let initInterval = waitForGoogleMaps()
    
    // Also listen for when Google Maps loads
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps && !initInterval) {
        initInterval = waitForGoogleMaps()
        if (initInterval) {
          clearInterval(checkInterval)
        }
      }
    }, 1000)

    // Cleanup
    return () => {
      clearInterval(checkInterval)
      if (initInterval) {
        clearInterval(initInterval)
      }
      if (autocomplete && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(autocomplete)
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [formErrors.propertyAddress])

  // Track active chapter based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Sections in order as they appear on the page
      const sections = ['roadmap', 'marketing', 'financials', 'calculator', 'contact', 'relationship', 'faq', 'glossary']
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveChapter(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormSubmitted(false)
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required'
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }
    if (!formData.timeline) errors.timeline = 'Please select a timeline'
    if (!formData.propertyAddress.trim()) errors.propertyAddress = 'Property address is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setFormSubmitted(true)
    
    // Netlify Forms integration
    const formDataToSubmit = new FormData()
    formDataToSubmit.append('form-name', 'seller-contact')
    formDataToSubmit.append('name', formData.name)
    formDataToSubmit.append('email', formData.email)
    formDataToSubmit.append('phone', formData.phone)
    formDataToSubmit.append('propertyAddress', formData.propertyAddress)
    formDataToSubmit.append('timeline', formData.timeline)

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSubmit).toString()
      })

      if (response.ok) {
        setShowSuccessModal(true)
        setFormData({ name: '', email: '', phone: '', propertyAddress: '', timeline: '' })
        setFormErrors({})
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      // Fallback: still show success for better UX (Netlify will handle it)
      setShowSuccessModal(true)
      setFormData({ name: '', email: '', phone: '', propertyAddress: '', timeline: '' })
      setFormErrors({})
    } finally {
      setFormSubmitted(false)
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const chapters = [
    { id: 'roadmap', title: 'Process' },
    { id: 'marketing', title: 'Marketing' },
    { id: 'financials', title: 'Financials' },
    { id: 'calculator', title: 'Seller Tools' },
    { id: 'faq', title: 'FAQ' },
    { id: 'glossary', title: 'Glossary' },
    { id: 'contact', title: 'Home Value' }
  ]

  // Show glossary page if toggled
  if (showGlossary) {
    console.log('Rendering glossary, showGlossary:', showGlossary)
    return <Glossary onBack={handleCloseGlossary} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden lg:block fixed left-0 top-[140px] bottom-0 z-40 flex items-start pt-4">
        <nav className="sidebar-nav rounded-r-2xl p-4 min-w-[140px]">
          <div className="space-y-1">
            {chapters.map((chapter, index) => (
              <div key={chapter.id}>
            <button
                  onClick={() => {
                    if (chapter.id === 'glossary') {
                      handleOpenGlossary()
                    } else {
                      scrollToSection(chapter.id)
                    }
                  }}
                  className={`sidebar-button w-full text-left px-3 py-2.5 rounded-xl group ${
                    activeChapter === chapter.id ? 'active' : ''
                  }`}
                >
                  <div className={`font-semibold text-xs tracking-wide transition-all duration-300 relative z-10 ${
                    activeChapter === chapter.id 
                      ? 'text-white' 
                      : 'text-gray-200 group-hover:text-primary-light'
                  }`}>
                    {chapter.title}
                  </div>
            </button>
                {index < chapters.length - 1 && (
                  <div className={`sidebar-divider mx-2 my-1.5 ${
                    activeChapter === chapter.id || activeChapter === chapters[index + 1]?.id
                      ? 'active'
                      : ''
                  }`} />
                )}
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* STICKY NAVIGATION */}
      <nav 
        className={`sticky-nav ${isScrolled || mobileMenuOpen ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-container">
          <div className="nav-center-wrapper">
            {/* Center - Frederick Sales */}
              <button
              onClick={scrollToTop}
              className={`nav-logo ${isScrolled ? 'scrolled' : ''}`}
              aria-label="Frederick Sales - Return to top"
            >
              Frederick Sales<sup>®</sup>
              </button>

            {/* Right Side - CTA Button (Desktop) */}
            <div className="nav-cta-desktop">
              <button
                onClick={() => scrollToSection('contact')}
                className="nav-cta"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`mobile-menu-toggle ${isScrolled ? 'scrolled' : ''}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 space-y-3"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {chapters.map((chapter) => (
              <button
                  key={chapter.id}
                  onClick={() => scrollToSection(chapter.id)}
                  className={`block w-full text-left font-semibold py-2 px-2 rounded-md transition-colors ${
                    activeChapter === chapter.id
                      ? 'text-primary bg-primary/10'
                      : 'text-navy hover:text-primary'
                  }`}
                >
                  {chapter.title}
              </button>
              ))}
              <button
                onClick={() => scrollToSection('contact')}
                className="cta-button primary w-full"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-image-wrapper">
            <img 
              src="/images/fred-professional1.jpg" 
              alt="Frederick Sales - Real Estate Agent"
              className="hero-photo cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowPhotoModal(true)}
              onError={(e) => {
                // Fallback to placeholder if image doesn't exist
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hero-photo-placeholder" style={{display: 'none'}}>
              <Camera size={48} className="text-gray-400" />
              <p>Add Your Professional Photo Here</p>
            </div>
          </div>
          <div className="hero-trust-badge">
            <span className="trust-badge-icon">✓</span>
            <span>Licensed in VA, DC & MD • 7+ Years Experience</span>
          </div>
          <h1 className="hero-title">Sell Your Home with Confidence</h1>
          <p className="hero-slogan">Expert guidance for home sellers in DC, VA & MD.</p>
          <p className="hero-intro">
            Hi, I'm Frederick Sales! I grew up in Alexandria, VA and I currently live in Washington DC in the SW Waterfront neighborhood. As a native of the DMV, I have deep, local knowledge of the neighborhoods, market trends, and what buyers are looking for in Washington DC, Virginia, and Maryland. This insider perspective helps me price your home competitively, market it effectively, and connect with the right buyers faster. Selling your home in the DMV area is a huge decision, and as your realtor, I'm here to make it smarter, simpler, and way more profitable. 
            With 7+ years of experience helping home sellers in Northern Virginia, Washington DC, and Maryland, I've built a proven system to get your home sold for top dollar. Whether you're selling in Washington DC, Arlington, Alexandria, Bethesda, Fairfax, or anywhere in the DMV, I'll guide you through every step with expertise and care. <strong>Let's work together to maximize your home's value!</strong>
          </p>
          <motion.button
            onClick={() => scrollToSection('contact')}
            className="cta-button primary min-h-[48px] text-base sm:text-lg px-6 sm:px-8 focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ touchAction: 'manipulation' }}
            aria-label="Schedule your free seller consultation"
          >
            Schedule My Free Seller Consultation
          </motion.button>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section id="roadmap" className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">From Pre-Market to SOLD</h2>
            <p className="section-subtitle">
              Your step-by-step roadmap to a successful home sale in Washington DC, Virginia, and Maryland
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Step 1 */}
            <motion.div
              variants={fadeInUp}
              className="relative pl-10 sm:pl-12 border-l-4 border-primary"
            >
              <div className="absolute -left-4 sm:-left-6 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                1
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 ml-2 sm:ml-4">
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3">Strategic Consultation</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We start by reviewing your goals, timeline, and conducting a comprehensive market analysis. 
                  This foundation sets the stage for everything that follows.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>In-depth conversation about your goals and timeline</li>
                  <li>Comprehensive Market Analysis (CMA) of your property</li>
                  <li>Review of comparable sales in your area</li>
                  <li>Discussion of current market conditions</li>
                  <li>Net proceeds calculation and financial planning</li>
                </ul>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeInUp}
              className="relative pl-10 sm:pl-12 border-l-4 border-primary"
            >
              <div className="absolute -left-4 sm:-left-6 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                2
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 sm:p-6 ml-2 sm:ml-4 border border-primary/20">
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3">Property Prep & Staging</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Decluttering, repairs, and leveraging our "Virtual Staging Advantage" (more on this later). 
                  We transform your home into a buyer's dream before they even step foot inside.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Home walkthrough to identify necessary repairs vs. cosmetic improvements</li>
                  <li>Decluttering and depersonalization strategy</li>
                  <li>Virtual staging included (multiple design styles available)</li>
                  <li>Curb appeal enhancement recommendations</li>
                  <li>Minor repairs and touch-ups as needed</li>
                </ul>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeInUp}
              className="relative pl-10 sm:pl-12 border-l-4 border-primary"
            >
              <div className="absolute -left-4 sm:-left-6 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                3
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 ml-2 sm:ml-4">
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3">Pricing Strategy</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Positioning your home to attract the maximum pool of buyers. We analyze comparable sales 
                  and market conditions to price it right from day one.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Comprehensive <span className="tooltip-trigger" data-tooltip="Comparative Market Analysis (CMA): A detailed report comparing your home to similar properties that have recently sold, are currently for sale, or were listed but didn't sell. This helps determine the optimal listing price.">CMA</span> analysis using recent sales data</li>
                  <li>Strategic pricing to maximize buyer interest and final sale price</li>
                  <li>Market positioning based on current DMV real estate trends</li>
                  <li>Price adjustment strategy if market conditions change</li>
                  <li>Competitive analysis of similar homes in your neighborhood</li>
                </ul>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              variants={fadeInUp}
              className="relative pl-10 sm:pl-12 border-l-4 border-primary"
            >
              <div className="absolute -left-4 sm:-left-6 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                4
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 sm:p-6 ml-2 sm:ml-4 border border-primary/20">
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3">The "Coming Soon" Launch</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Generating buzz before we even hit the <span className="tooltip-trigger" data-tooltip="Multiple Listing Service (MLS): A database used by real estate agents to share information about properties for sale. When your home is listed on the MLS, it becomes visible to all agents and appears on major real estate websites like Zillow, Realtor.com, and Redfin.">MLS</span>. We create anticipation and build a waiting list 
                  of qualified buyers before your home officially goes live.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Exclusive preview to our network of buyer agents and qualified buyers</li>
                  <li>Social media teaser campaign to build anticipation</li>
                  <li>Email marketing to our database of active buyers</li>
                  <li>Pre-listing showings for serious buyers</li>
                  <li>Create competitive interest before official listing date</li>
                </ul>
              </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div
              variants={fadeInUp}
              className="relative pl-10 sm:pl-12 border-l-4 border-primary"
            >
              <div className="absolute -left-4 sm:-left-6 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                5
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 ml-2 sm:ml-4">
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3">Live on Market & Open Houses</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We don't just open doors; we collect critical feedback from every visitor to adjust our 
                  strategy in real-time. Every showing is an opportunity to refine and improve.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Professional open house events with strategic scheduling</li>
                  <li>Aggressive follow-up with every visitor within 24 hours</li>
                  <li>Feedback collection and analysis to adjust strategy</li>
                  <li>Private showings scheduled around your convenience</li>
                  <li>Real-time market response tracking and price adjustments if needed</li>
                </ul>
              </div>
            </motion.div>

            {/* Step 6 */}
            <motion.div
              variants={fadeInUp}
              className="relative pl-10 sm:pl-12 border-l-4 border-primary"
            >
              <div className="absolute -left-4 sm:-left-6 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                6
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 sm:p-6 ml-2 sm:ml-4 border border-primary/20">
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3">Reviewing Offers & Negotiations</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We negotiate terms, not just price. From closing dates to <span className="tooltip-trigger" data-tooltip="Contingency: A condition in the purchase offer that must be met for the sale to proceed. Common contingencies include home inspection, appraisal, financing, and home sale contingencies.">contingencies</span>, we ensure every 
                  aspect of the deal works in your favor.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Comprehensive offer analysis comparing price, terms, and buyer qualifications</li>
                  <li>Strategic negotiation to maximize your net proceeds</li>
                  <li>Counter-offer strategy to get the best possible terms</li>
                  <li>Protection of your interests through careful contract review</li>
                  <li>Coordination with buyer's agent to ensure smooth negotiations</li>
                </ul>
              </div>
            </motion.div>

            {/* Step 7 */}
            <motion.div
              variants={fadeInUp}
              className="relative pl-10 sm:pl-12 border-l-4 border-primary"
            >
              <div className="absolute -left-4 sm:-left-6 top-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                7
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 ml-2 sm:ml-4">
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3">Escrow & Closing</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Managing inspections, <span className="tooltip-trigger" data-tooltip="Appraisal: A professional assessment of your home's value by a licensed appraiser. Required by lenders to ensure the property is worth the loan amount. If the appraisal comes in lower than the sale price, we may need to renegotiate.">appraisals</span>, and paperwork until you get paid. We handle every detail 
                  so you can focus on your next chapter.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Coordination of home inspection and addressing any issues</li>
                  <li>Appraisal management and value protection strategies</li>
                  <li>Title work and <span className="tooltip-trigger" data-tooltip="Escrow: A neutral third party that holds funds and documents during the transaction. The escrow company ensures all conditions are met before funds are released and ownership is transferred.">escrow</span> coordination</li>
                  <li>Final walkthrough scheduling and completion</li>
                  <li>Closing day coordination - you just show up and sign</li>
                  <li>Post-closing support and key handoff</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ELITE MARKETING PLAN SECTION */}
      <section id="marketing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Our Proven Marketing Plan</h2>
            <p className="section-subtitle">
              Our comprehensive marketing strategy designed to maximize your home's exposure and value
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Professional Photography */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                <Camera className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Professional Photography</h3>
              <p className="text-gray-600 leading-relaxed">
                First impressions are digital. We use HDR editorial-grade photography that makes your home 
                stand out in online listings.
              </p>
            </motion.div>

            {/* Floor Plans */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                <Layout className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Floor Plans</h3>
              <p className="text-gray-600 leading-relaxed">
                Buyers need to visualize the flow. Included with every listing to help buyers understand 
                your home's layout and potential.
              </p>
            </motion.div>

            {/* Open House Strategy */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                <Calendar className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Open House Strategy</h3>
              <p className="text-gray-600 leading-relaxed">
                We use Open Houses to identify qualified buyers, convert lookers into offers, and perform 
                aggressive follow-up prospecting immediately after the event.
              </p>
            </motion.div>
          </motion.div>

          {/* Virtual vs Traditional Staging Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-center text-navy mb-8">
              Staging Showdown: Virtual vs. Traditional
            </h3>
            
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                {/* Traditional Staging */}
                <div className="p-8 bg-gray-50">
                  <h4 className="text-2xl font-bold text-navy mb-6 text-center">Traditional Staging</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <X className="text-red-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>High Cost:</strong> $$$ Thousands of dollars</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="text-red-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>Intrusive:</strong> Requires moving furniture in/out</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="text-red-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>Risk of Damage:</strong> Potential wear and tear</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="text-red-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>Limited Options:</strong> One design style</span>
                    </li>
                  </ul>
                </div>

                {/* Virtual Staging */}
                <div className="p-6 sm:p-8 bg-primary/5">
                  <h4 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 text-center">Virtual Staging (Our Method)</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>Cost-effective:</strong> Included in our service</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>Unlimited Design Styles:</strong> Try multiple looks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>Fast Turnaround:</strong> Quick and efficient</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700"><strong>Attracts Online Clicks:</strong> Modern and eye-catching</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-600 mt-6 italic">
              Our Virtual Staging is the smarter, modern choice that saves you money while maximizing your home's appeal.
            </p>
          </motion.div>

          {/* Virtual Staging Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto mt-12"
          >
            <h3 className="text-3xl font-bold text-center text-navy mb-4">
              See Virtual Staging in Action
            </h3>
            <p className="text-center text-gray-600 mb-8">
              Drag the slider to see how we transform empty spaces into inviting, buyer-ready rooms
            </p>
            
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <VirtualStagingSlider />
            </div>
            
            <p className="text-center text-gray-600 mt-6 text-sm">
              <strong>Note:</strong> These are examples of our virtual staging work. We can create multiple design styles to match your target buyer's preferences.
            </p>
          </motion.div>

          {/* MLS vs Off-Market Listing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-5xl mx-auto mt-16"
          >
            <h3 className="text-3xl font-bold text-center text-navy mb-8">
              MLS Listing vs. Off-Market: Which is Right for You?
            </h3>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 mb-8">
              <h4 className="text-2xl font-bold text-navy mb-4">Listing on the MLS: Maximum Exposure</h4>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                When you list your property on the <span className="tooltip-trigger" data-tooltip="Multiple Listing Service (MLS): A database used by real estate agents to share information about properties for sale. When your home is listed on the MLS, it becomes visible to all agents and appears on major real estate websites.">MLS</span> through me as your realtor, your home gets <strong>maximum exposure</strong> to potential buyers. Here's how it works:
              </p>
              
              <div className="bg-white rounded-lg p-6 mb-6">
                <h5 className="text-xl font-bold text-navy mb-4">How MLS Distribution Works</h5>
                <p className="text-gray-700 mb-4">
                  Once your home is listed on the MLS, it automatically appears on all major real estate websites that pull listing data from the MLS, including:
                </p>
                <ul className="grid md:grid-cols-2 gap-3 text-gray-700 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Zillow</strong> - The most visited real estate website</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Realtor.com</strong> - Official NAR website</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Trulia</strong> - Popular search platform</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Redfin</strong> - Tech-enabled brokerage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Homes.com</strong> - Comprehensive listings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Homesnap</strong> - Mobile-first platform</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Movoto</strong> - Real estate search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span><strong>Homes & Land</strong> - Property listings</span>
                  </li>
                </ul>
                <p className="text-gray-700">
                  Plus, your listing is visible to <strong>thousands of real estate agents</strong> in the DMV area who actively search the MLS for properties matching their clients' criteria. This means your home reaches buyers who are actively looking and ready to purchase. <strong>Ask me more about our comprehensive marketing strategy and how we maximize your home's exposure.</strong>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* MLS Pros */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h5 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={24} />
                  Benefits of MLS Listing
                </h5>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Maximum Exposure:</strong> Your home appears on all major real estate websites automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Access to All Buyers:</strong> Thousands of agents can see and show your property</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Competitive Bidding:</strong> More exposure often leads to multiple offers and higher sale prices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Faster Sales:</strong> More visibility typically means quicker sales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Market Data:</strong> Your listing contributes to and benefits from comprehensive market data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Professional Network:</strong> Access to the entire real estate agent network in the DMV</span>
                  </li>
                </ul>
              </div>

              {/* Off-Market Info */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h5 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <span className="text-blue-600">ℹ</span>
                  Off-Market Listing Option
                </h5>
                <p className="text-gray-700 mb-4">
                  An off-market listing (also called a "pocket listing" or "quiet listing") means your home is not listed on the MLS and is marketed privately through our network.
                </p>
                <div className="space-y-4">
                  <div>
                    <h6 className="font-bold text-navy mb-2">Pros of Off-Market:</h6>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Privacy - fewer public showings</li>
                      <li>• Less disruption if you're still living in the home</li>
                      <li>• Can test the market before going public</li>
                      <li>• Exclusivity appeal for high-end properties</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-bold text-navy mb-2">Cons of Off-Market:</h6>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Limited exposure - only our network sees it</li>
                      <li>• Longer time on market typically</li>
                      <li>• May receive lower offers due to less competition</li>
                      <li>• Miss out on buyers actively searching online</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-primary/30 rounded-xl p-8">
              <h5 className="text-xl font-bold text-navy mb-4">Factors to Consider When Deciding</h5>
              <p className="text-gray-700 mb-4">
                Every seller has different goals and circumstances. Here are key factors to discuss when deciding between MLS and off-market listing:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Timeline:</strong> How quickly do you need to sell?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Living Situation:</strong> Are you still living in the home?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Privacy Needs:</strong> Do you need maximum privacy?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Property Type:</strong> Is it a unique or high-end property?</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Market Conditions:</strong> Is it a hot market or slower market?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Price Goals:</strong> Are you prioritizing speed or maximum price?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Flexibility:</strong> Can you accommodate showings easily?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Network Access:</strong> Do you have a specific buyer in mind?</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 bg-primary/10 rounded-lg p-6 border-2 border-primary/20">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Our Recommendation:</strong> For most sellers, listing on the MLS provides the best opportunity to maximize your sale price and sell quickly. The automatic distribution to all major real estate websites means your home reaches the largest pool of qualified buyers. However, we understand every situation is unique. <strong>During our consultation, we'll discuss your specific goals and circumstances to determine the best marketing strategy for your home.</strong>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Marketing CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border-2 border-primary/20 max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                Want to see how we'll market your home? As your realtor, let's discuss our proven marketing plan and how it will help you sell for top dollar.
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="cta-button primary"
              >
                Schedule My Free Seller Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SMART-SELL REVERSE TIMELINE SECTION */}
      <section id="smart-sell-timeline" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <SmartSellTimeline />
        </div>
      </section>

      {/* STRATEGIC FINANCIALS SECTION */}
      <section id="financials" className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Strategic Financials</h2>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Buyer's Agent Compensation Section */}
            <div className="bg-gradient-to-br from-navy/5 to-navy/10 rounded-xl p-8 border-2 border-navy/20">
              <h4 className="text-2xl font-bold text-navy mb-6">Understanding Buyer's Agent Compensation</h4>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h5 className="text-xl font-bold text-navy mb-4">The NAR Lawsuit Verdict & What It Means for You</h5>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Following the recent <span className="tooltip-trigger" data-tooltip="National Association of Realtors (NAR): The largest trade association for real estate professionals in the United States. The recent lawsuit settlement changed how buyer's agent commissions are handled.">NAR</span> lawsuit settlement, sellers now have more flexibility in how they structure compensation for buyer's agents. 
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h6 className="font-bold text-navy mb-3">Understanding the Lawsuit</h6>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      The NAR lawsuit was filed by home sellers who claimed that the traditional practice of sellers paying both the listing agent and buyer's agent commission was anti-competitive and kept commission rates artificially high. The lawsuit alleged that the requirement to offer buyer's agent compensation (which was previously mandatory in many MLS systems) limited sellers' ability to negotiate commission structures.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      As part of the settlement, the NAR agreed to change its rules, making it clear that <strong>sellers are no longer required to offer compensation to buyer's agents</strong>. This gives sellers more flexibility, but it's important to understand the implications of this change.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    However, <strong>offering compensation to the buyer's agent remains the industry standard</strong> and is highly recommended for several strategic reasons.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Important:</strong> You are NOT required to compensate the buyer's agent, but doing so significantly increases your chances of selling quickly and for top dollar. Here's why:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                    <h5 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={24} />
                      Pros of Compensating Buyer's Agent
                    </h5>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Maximum Exposure:</strong> More buyer agents will show your home when they know they'll be compensated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Faster Sales:</strong> Your home gets shown more often, leading to quicker offers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Higher Sale Prices:</strong> More competition among buyers typically results in better offers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Industry Standard:</strong> Most buyers expect their agent to be compensated, making your home more attractive</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Better Qualified Buyers:</strong> Buyer's agents typically work with pre-approved, serious buyers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Professional Representation:</strong> Buyer's agents help ensure smooth transactions and fewer issues</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                    <h5 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
                      <span className="text-yellow-600">⚠</span>
                      Cons of NOT Compensating Buyer's Agent
                    </h5>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">✗</span>
                        <span><strong>Limited Showings:</strong> Many buyer's agents may skip showing your home if they won't be compensated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">✗</span>
                        <span><strong>Longer Time on Market:</strong> Fewer showings mean fewer offers and longer wait times</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">✗</span>
                        <span><strong>Lower Offers:</strong> Less competition can result in lower sale prices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">✗</span>
                        <span><strong>Buyer Pays Commission:</strong> Buyers may need to pay their agent out of pocket, reducing their offer amount</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">✗</span>
                        <span><strong>Fewer Qualified Buyers:</strong> Some buyers may not be able to afford both the home and their agent's commission</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">✗</span>
                        <span><strong>Market Disadvantage:</strong> Your home competes against others that DO offer buyer's agent compensation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-6 border-2 border-primary/30">
                  <h5 className="text-xl font-bold text-navy mb-3">Our Recommendation</h5>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>We strongly recommend offering buyer's agent compensation (typically 2.5-3% of the sale price)</strong> because:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>It's the industry standard in the DMV market and what most buyers and their agents expect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>The cost is typically offset by receiving higher offers and selling faster</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>It maximizes your home's exposure to the largest pool of qualified buyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>It makes your home more competitive against other listings</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    <strong>Remember:</strong> The goal is to maximize your NET proceeds. While compensating the buyer's agent is an expense, it typically results in a higher sale price and faster sale, which benefits you overall. We'll discuss the best compensation structure for your specific situation during our consultation. <strong>Ask me more about buyer's agent compensation and how it affects your sale.</strong>
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-center text-navy mb-6 mt-12">
              Understanding Buyer Concessions: What to Expect in Your Offer
            </h3>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <DollarSign className="text-primary mt-1 flex-shrink-0" size={32} />
                <div>
                  <h4 className="text-2xl font-bold text-navy mb-4">What Are Buyer Concessions?</h4>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Buyer concessions are credits or financial contributions that a buyer may request from you, the seller, 
                    as part of their offer. These concessions help buyers cover closing costs, prepaid expenses, or other 
                    transaction-related fees. It's important to understand that buyers may request concessions in their offer, 
                    and this is a common practice in real estate transactions.
                  </p>
                </div>
          </div>
        </div>

            <div className="bg-white border-2 border-primary/20 rounded-xl p-8 mb-6">
              <h4 className="text-2xl font-bold text-navy mb-4">Why Buyers Request Concessions</h4>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Buyers may request concessions for several reasons:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span><strong>Limited Cash Reserves:</strong> Many buyers, especially first-time homebuyers, may have enough for a down payment but need help covering closing costs, which can range from 2-5% of the purchase price.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span><strong>Rate Buydowns:</strong> Buyers may request concessions to buy down their mortgage interest rate, making their monthly payments more affordable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span><strong>Prepaid Expenses:</strong> Buyers often need to prepay property taxes, homeowners insurance, and HOA fees at closing, which can add up to thousands of dollars.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span><strong>Repairs or Improvements:</strong> After a home inspection, buyers may request concessions to cover necessary repairs or desired improvements rather than asking you to complete the work.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span><strong>Competitive Market Strategy:</strong> In competitive markets, buyers may use concessions as a way to make their offer more attractive while still getting financial assistance.</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
              <h4 className="text-2xl font-bold text-navy mb-4">What This Means for You as a Seller</h4>
              <p className="text-gray-700 text-lg leading-relaxed">
                When a buyer requests concessions, it's typically negotiated as part of the offer. The concession amount 
                is usually deducted from your net proceeds at closing. It's important to evaluate each offer holistically - 
                sometimes an offer with concessions may still result in a better net outcome than an offer without them, 
                especially if the purchase price is higher. We'll help you analyze each offer to determine what works best 
                for your situation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NET SHEET CALCULATOR */}
      <NetSheetCalculator />

      {/* ROI CALCULATOR */}
      <ROICalculator />

      {/* Glossary Promotion After Calculators */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-primary/20 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full mb-5 font-semibold">
                  <FileText size={20} />
                  <span>Seller Education</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                  Confused by Terms Like "Net Proceeds" or "Transfer Tax"?
                </h3>
                <p className="text-lg text-gray-700 mb-3 leading-relaxed max-w-2xl mx-auto">
                  You just used our calculator, but do you know what all those line items mean? Our <strong>Seller's Real Estate Glossary</strong> breaks down every term you need to understand.
                </p>
                <p className="text-gray-600 mb-6">
                  Learn the language of real estate so you can make informed decisions and ask the right questions.
                </p>
                <button
                  type="button"
                  onClick={handleOpenGlossary}
                  className="cta-button primary text-base px-6 py-3 inline-flex items-center gap-2"
                  style={{ cursor: 'pointer' }}
                >
                  <FileText size={18} />
                  View Seller's Glossary
                </button>
                      </div>
            </div>
              </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20 bg-gradient-to-br from-navy to-navy-dark text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Ready to Find Out Your Home's Value?</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-4">
              "All we ask from you is your loyalty. In return, you get our 100% commitment and expertise."
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Let's work together! Set up a 30-minute, no-obligation seller consultation with me, your realtor. 
              No pressure, just a great conversation about your goals and how we can maximize your home's value.
            </p>
          </motion.div>

          {/* What's Included Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">What's Included in Your Free Seller Consultation:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <Target size={24} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200"><strong>Comprehensive Market Analysis</strong> - Get an accurate estimate of your home's value with a detailed CMA</span>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign size={24} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200"><strong>Net Proceeds Calculation</strong> - Understand exactly how much you'll walk away with after closing</span>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 size={24} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200"><strong>DMV Market Insights</strong> - Learn current market conditions and pricing strategies</span>
                </div>
                <div className="flex items-start gap-3">
                  <Home size={24} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200"><strong>Home Preparation Plan</strong> - Get recommendations on repairs, staging, and improvements</span>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp size={24} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200"><strong>Marketing Strategy Review</strong> - See how we'll market your home to get top dollar</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={24} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200"><strong>Timeline Planning</strong> - Understand the selling process and realistic timelines</span>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MessageCircle size={24} className="text-primary-light flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200"><strong>All Your Questions Answered</strong> - Get expert answers about selling, the DMV market, commissions, staging, and the entire process</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-12">
              <form
                name="seller-contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="seller-contact" />
                <p style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-navy text-base min-h-[48px] ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Smith"
                      style={{ fontSize: '16px' }}
                    />
                    {formErrors.name && <span className="text-red-500 text-sm mt-1 block">{formErrors.name}</span>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-navy text-base min-h-[48px] ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                      style={{ fontSize: '16px' }}
                    />
                    {formErrors.email && <span className="text-red-500 text-sm mt-1 block">{formErrors.email}</span>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-2">
                      Your Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-navy text-base min-h-[48px] ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(703) 555-1234"
                      style={{ fontSize: '16px' }}
                    />
                    {formErrors.phone && <span className="text-red-500 text-sm mt-1 block">{formErrors.phone}</span>}
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-semibold text-navy mb-2">
                      When are you thinking of selling? *
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-navy text-base min-h-[48px] ${
                        formErrors.timeline ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ fontSize: '16px' }}
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-3">1-3 Months</option>
                      <option value="3-6">3-6 Months</option>
                      <option value="6-12">6-12 Months</option>
                      <option value="exploring">Just Exploring</option>
                    </select>
                    {formErrors.timeline && <span className="text-red-500 text-sm mt-1 block">{formErrors.timeline}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="propertyAddress" className="block text-sm font-semibold text-navy mb-2">
                    Property Address <span className="text-red-500">*</span>
                  </label>
                    <input
                      type="text"
                      id="propertyAddress"
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-navy text-base min-h-[48px] ${
                        formErrors.propertyAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main St, City, State"
                      style={{ fontSize: '16px' }}
                      required
                    />
                    {formErrors.propertyAddress && <span className="text-red-500 text-sm mt-1 block">{formErrors.propertyAddress}</span>}
                </div>

                <button
                  type="submit"
                  className={`w-full cta-button primary text-lg py-4 min-h-[48px] focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 ${
                    formSubmitted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={formSubmitted}
                  style={{ touchAction: 'manipulation' }}
                  aria-label="Submit seller consultation form"
                >
                  {formSubmitted ? 'Submitting...' : 'Schedule My Free Seller Consultation'}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>

              {/* Alternative Contact */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-center text-gray-600 mb-4">Or contact us directly:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a href="mailto:fred@kerishullteam.com" className="flex items-center gap-2 text-navy hover:text-primary transition-colors">
                    <Mail size={20} />
                    <span>fred@kerishullteam.com</span>
                  </a>
                  <a href="tel:7033994394" className="flex items-center gap-2 text-navy hover:text-primary transition-colors">
                    <Phone size={20} />
                    <span>(703) 399-4394</span>
                  </a>
                </div>
                
                <div className="pt-6 border-t border-gray-200 mt-6">
                  <p className="text-center text-gray-600 mb-4">Connect with us</p>
                  <div className="flex justify-center gap-4">
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                      <Instagram size={24} />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                      <Facebook size={24} />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                      <Linkedin size={24} />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                      <Youtube size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Success Modal */}
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={closeSuccessModal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="success-modal-title"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center mb-4" aria-hidden="true">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
                <h3 id="success-modal-title" className="text-2xl font-bold text-navy mb-4">Thank You!</h3>
                <p className="text-gray-700 mb-6">
                  We've received your information and will be in touch soon to schedule your seller consultation.
                </p>
                <button
                  onClick={closeSuccessModal}
                  className="cta-button primary w-full focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2"
                  aria-label="Close success message"
                >
                  Got It!
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* WELCOME TO THE FAMILY SECTION */}
      <section id="relationship" className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Our Relationship Doesn't End at Closing</h2>
            <p className="section-subtitle">
              When you work with us, you become part of our real estate family.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary/20">
              <div className="flex justify-center mb-4" aria-hidden="true">
                <Wrench size={48} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Your Vendor Source</h3>
              <p className="text-gray-700 leading-relaxed">
                Need a great plumber, painter, or contractor? Our trusted vendor list is now your list. 
                We've vetted the best service providers in the DMV area.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary/20">
              <div className="flex justify-center mb-4" aria-hidden="true">
                <PartyPopper size={48} className="text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy mb-3">Fun Client Events</h3>
              <p className="text-gray-700 leading-relaxed">
                You're invited! Get exclusive invitations to our annual Nats game, fall family fun day, 
                brunch with Santa, and more. Build lasting relationships with other homeowners.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary/20">
              <div className="flex justify-center mb-4" aria-hidden="true">
                <Heart size={48} className="text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy mb-3">We Give Back Together</h3>
              <p className="text-gray-700 leading-relaxed">
                We love the DMV. For every referral we receive, we donate $250 to charities like Habitat 
                for Humanity, St. Jude's, and Meals on Wheels.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* COMPREHENSIVE FAQ SECTION */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about selling your home in the DMV
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                q: "How long does it take to sell a home?",
                a: "Typically, the home selling process takes 30-90 days from listing to closing, depending on market conditions, pricing strategy, and buyer financing. On average, homes in the DMV sell in 21-30 days when priced correctly and marketed effectively. As your realtor, I'll provide you with a realistic timeline based on your specific property and current market conditions."
              },
              {
                q: "What are your commission fees?",
                a: "Commission fees are typically 5-6% of the sale price, split between the listing and buyer's agent. This is negotiable and discussed during our initial consultation. What's important is the NET amount you walk away with - and our marketing strategy and negotiation expertise often result in higher sale prices that more than offset the commission. Ask me more about how we structure our fees and the value we provide."
              },
              {
                q: "Do I need to stage my home?",
                a: "Virtual staging is included with every listing and is often more effective than traditional staging. It's cost-effective, allows multiple design styles, and attracts online clicks without the hassle of moving furniture in and out. We'll discuss whether your home needs staging during our consultation - sometimes decluttering and minor repairs are enough. Ask me more about our virtual staging advantage."
              },
              {
                q: "What if my home doesn't sell?",
                a: "This is rare when priced correctly and marketed effectively. However, if your home doesn't sell within the expected timeframe, we'll analyze the feedback, adjust our strategy, and potentially recommend pricing adjustments or improvements. Our aggressive marketing and network of buyers help ensure your home gets maximum exposure. Let's work together to ensure a successful sale."
              },
              {
                q: "How do you determine the listing price?",
                a: "We conduct a comprehensive Comparative Market Analysis (CMA) that looks at recent sales, active listings, and market trends in your area. We also consider your home's unique features, condition, and current market conditions. Our goal is to price it competitively to attract the maximum pool of buyers while maximizing your net proceeds. Ask me more about our pricing strategy."
              },
              {
                q: "What repairs do I need to make before listing?",
                a: "We'll walk through your home together and identify any necessary repairs vs. cosmetic improvements. Major issues (roof, HVAC, foundation) should typically be addressed, while minor cosmetic items can often be handled during negotiations. Sometimes, it's better to price accordingly rather than invest in improvements. We'll discuss this during our consultation."
              },
              {
                q: "Can I sell my home while buying another?",
                a: "Absolutely! We can coordinate both transactions using strategies like post-settlement occupancy (rent-back), bridge financing, or contingency clauses. Many sellers do this successfully. We'll discuss the best approach for your situation during our consultation. Let's work together to make both transactions smooth."
              },
              {
                q: "What are closing costs for sellers?",
                a: "Seller closing costs typically include commission fees (5-6%), transfer taxes, title insurance, prorated property taxes, and any negotiated repairs or concessions. These typically range from 8-10% of the sale price total. Use our Net Sheet Calculator to estimate your net proceeds - we'll walk through every line item so there are no surprises."
              },
              {
                q: "How do you market my home?",
                a: "Our Proven Marketing Plan includes professional HDR photography, floor plans, virtual staging, MLS listing, Coming Soon campaign to build buyer interest, open houses with aggressive follow-up, social media promotion, and our extensive network of buyer agents. We don't just list it - we create buzz and demand. Ask me more about our comprehensive marketing strategy."
              },
              {
                q: "What happens after I accept an offer?",
                a: "After acceptance, we manage the entire process: inspections, appraisals, negotiations, paperwork, and coordination with title company and lenders until closing. We'll keep you informed every step of the way and handle any issues that arise. Our average closing time is 30 days. You can focus on your next chapter while we handle the details."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-gray-100 focus-within:ring-2 focus-within:ring-primary/50"
                onClick={() => toggleFAQ(index + 1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleFAQ(index + 1)
                  }
                }}
                aria-expanded={activeFAQ === index + 1}
                aria-controls={`faq-answer-${index + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-navy text-lg pr-8">{faq.q}</h5>
                  <motion.div
                    animate={{ rotate: activeFAQ === index + 1 ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUp size={20} className="text-primary flex-shrink-0" />
                  </motion.div>
                </div>
                {activeFAQ === index + 1 && (
                  <motion.p
                    id={`faq-answer-${index + 1}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-gray-700 mt-4 leading-relaxed"
                    role="region"
                    aria-live="polite"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Glossary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-xl p-8 md:p-10 border-2 border-primary/30 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-4 font-semibold text-sm">
                  <BookOpen size={18} />
                  <span>Knowledge is Power</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                  Want to Learn the Terms Every Seller Needs to Know?
                </h3>
                <p className="text-lg text-gray-700 mb-2 leading-relaxed max-w-2xl mx-auto">
                  Don't let confusing real estate jargon catch you off guard. Our comprehensive <strong>Seller's Glossary</strong> explains every term you'll encounter during your home sale.
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                  From "net proceeds" to "transfer taxes" - understand exactly what you're signing and what you're paying for.
                </p>
                <button
                  type="button"
                  onClick={handleOpenGlossary}
                  className="cta-button primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  style={{ cursor: 'pointer' }}
                >
                  <BookOpen size={20} className="inline mr-2" />
                  Explore Seller's Real Estate Glossary
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Free • No sign-up required • Seller-focused terms only
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* KS TEAM ADVANTAGE / TRUST SECTION - MOVED TO END */}
      <section id="trust" className="py-20 bg-navy text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-white">Why Work With Me & The KS Team?</h2>
            <p className="section-subtitle text-gray-300 mb-12">
              When you work with me as your realtor, you're not just hiring Frederick Sales; you're hiring the entire KS Team.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-all duration-300 border border-white/20">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">5,275+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-semibold">Families Helped</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-all duration-300 border border-white/20">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">$5 BILLION+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-semibold">In Team Sales</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-all duration-300 border border-white/20">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2">TOP TEAM</div>
              <div className="text-xs sm:text-sm text-gray-300 font-semibold">In the DMV Since 2008</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 text-center hover:bg-white/15 transition-all duration-300 border border-white/20">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2">7+ YEARS</div>
              <div className="text-xs sm:text-sm text-gray-300 font-semibold">Experience</div>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-center text-base sm:text-lg text-gray-200 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We have the track record, the resources, and the market intel to ensure you get the best possible outcome for your home sale. 
            <strong> Let's work together to maximize your home's value!</strong>
          </motion.p>
        </div>
      </section>

      {/* Photo Modal */}
      {showPhotoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPhotoModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-modal-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src="/images/fred-professional1.jpg" 
              alt="Frederick Sales - Real Estate Agent"
              className="w-full h-auto rounded-lg shadow-2xl"
              loading="lazy"
            />
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Close photo"
            >
              <X size={24} className="text-navy" />
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* FOOTER */}
      <footer className="bg-navy-dark text-white py-12">
        <div className="container">
          <div className="text-center space-y-4">
            <p className="text-xl font-bold">Frederick Sales | Realtor®</p>
            <p className="text-gray-400">Licensed in VA, DC, & MD</p>
            <p className="text-sm text-gray-500">Equal Housing Opportunity</p>
          </div>
        </div>
      </footer>

      {/* FLOATING CTA BUTTON */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => scrollToSection('contact')}
          className="floating-cta"
          aria-label="Get Your Free Consultation"
        >
          <span>Get Your Free Consultation</span>
        </motion.button>
      )}

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-transparent border-none shadow-lg flex items-center justify-center text-primary hover:text-primary-light transition-colors z-50 focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 p-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={48} strokeWidth={2.5} />
        </motion.button>
      )}
    </div>
  )
}

export default App

