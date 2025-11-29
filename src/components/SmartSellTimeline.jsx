import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Download, 
  Printer, 
  Clock, 
  Target, 
  ArrowLeft,
  PartyPopper,
  Eye,
  FileText,
  CheckCircle,
  DollarSign,
  Wrench,
  Users,
  Home,
  Camera,
  Sparkles,
  Hammer,
  Rocket,
  Trash2,
  BarChart3
} from 'lucide-react'
import jsPDF from 'jspdf'

// Real estate standard practice timeline (in days before closing)
const timelineSteps = [
  { 
    name: 'Closing & Move-Out', 
    daysBefore: 0, 
    description: 'Final walkthrough, closing documents signed, keys handed over',
    icon: PartyPopper
  },
  { 
    name: 'Final Walkthrough', 
    daysBefore: 1, 
    description: 'Buyer conducts final inspection of the property',
    icon: Eye
  },
  { 
    name: 'Closing Preparation', 
    daysBefore: 3, 
    description: 'Review closing documents, wire transfer instructions, final HOA statements',
    icon: FileText
  },
  { 
    name: 'Under Contract - Contingencies Removed', 
    daysBefore: 21, 
    description: 'All contingencies (inspection, appraisal, financing) satisfied',
    icon: CheckCircle
  },
  { 
    name: 'Appraisal Completed', 
    daysBefore: 28, 
    description: 'Lender appraisal ordered and completed',
    icon: DollarSign
  },
  { 
    name: 'Home Inspection & Negotiations', 
    daysBefore: 35, 
    description: 'Buyer inspection completed, repair requests negotiated',
    icon: Wrench
  },
  { 
    name: 'Under Contract - Offer Accepted', 
    daysBefore: 42, 
    description: 'Offer accepted, contract signed, earnest money deposited',
    icon: Users
  },
  { 
    name: 'Active Listings & Showings', 
    daysBefore: 49, 
    description: 'Property listed on MLS, open houses, showings, offers received',
    icon: Home
  },
  { 
    name: 'Professional Photography & Marketing Launch', 
    daysBefore: 56, 
    description: 'Professional photos taken, virtual tour created, marketing materials finalized',
    icon: Camera
  },
  { 
    name: 'Staging & Final Touches', 
    daysBefore: 63, 
    description: 'Professional staging completed, final cleaning, curb appeal perfected',
    icon: Sparkles
  },
  { 
    name: 'Repairs & Improvements', 
    daysBefore: 71, 
    description: 'All repairs completed, improvements finished, contractor work done',
    icon: Hammer
  },
  { 
    name: 'MLS "Coming Soon" Status - Pre-Marketing Begins', 
    daysBefore: 70, 
    description: 'List property as "Coming Soon" on MLS for 21 days of pre-marketing before going "Active". This allows you to generate buzz, collect buyer interest, and schedule showings before the official listing date.',
    icon: Rocket
  },
  { 
    name: 'Decluttering & Deep Cleaning', 
    daysBefore: 77, 
    description: 'Personal items removed, deep cleaning completed, depersonalization done',
    icon: Trash2
  },
  { 
    name: 'Pre-Listing Consultation & Strategy', 
    daysBefore: 84, 
    description: 'Meet with realtor, pricing strategy finalized, listing plan created',
    icon: BarChart3
  }
]

const SmartSellTimeline = () => {
  const [targetDate, setTargetDate] = useState('')
  const [calculatedTimeline, setCalculatedTimeline] = useState(null)
  const [error, setError] = useState('')

  const calculateTimeline = () => {
    if (!targetDate) {
      setError('Please select a target closing date')
      return
    }

    const closingDate = new Date(targetDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    closingDate.setHours(0, 0, 0, 0)

    if (closingDate <= today) {
      setError('Target closing date must be in the future')
      return
    }

    const daysUntilClosing = Math.ceil((closingDate - today) / (1000 * 60 * 60 * 24))
    
    // Check if there's enough time (minimum 84 days recommended)
    if (daysUntilClosing < 84) {
      setError(`Warning: Only ${daysUntilClosing} days until closing. Recommended minimum is 84 days (12 weeks) for optimal preparation.`)
    } else {
      setError('')
    }

    // Calculate each step's date
    const timeline = timelineSteps.map(step => {
      const stepDate = new Date(closingDate)
      stepDate.setDate(stepDate.getDate() - step.daysBefore)
      
      const daysFromToday = Math.ceil((stepDate - today) / (1000 * 60 * 60 * 24))
      const isToday = daysFromToday === 0
      const isThisWeek = daysFromToday >= 0 && daysFromToday <= 7
      
      return {
        ...step,
        date: stepDate,
        daysFromToday,
        isToday,
        isThisWeek,
        formattedDate: stepDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      }
    })

    setCalculatedTimeline(timeline)
    setError('')
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const exportToPDF = () => {
    if (!calculatedTimeline) return

    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Add branding header (matching Net Sheet Calculator style)
    pdf.setFontSize(20)
    pdf.setTextColor(26, 32, 44) // navy
    pdf.text('Smart-Sell Reverse Timeline', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 8

    pdf.setFontSize(12)
    pdf.setTextColor(232, 180, 184) // rose gold
    pdf.text('Marisol Gallegos | Realtor®', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 4

    pdf.setDrawColor(232, 180, 184)
    pdf.setLineWidth(0.5)
    pdf.line(20, yPosition, pageWidth - 20, yPosition)
    yPosition += 8

    // Add date and target closing date (matching Net Sheet style)
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 6

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Target Closing Date: ${formatDate(new Date(targetDate))}`, 20, yPosition)
    yPosition += 12

    // Timeline steps with better formatting (similar to Net Sheet structure)
    calculatedTimeline.forEach((step, index) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = 20
        // Re-add branding on new pages
        pdf.setFontSize(12)
        pdf.setTextColor(232, 180, 184)
        pdf.text('Marisol Gallegos | Realtor®', pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 4
        pdf.setDrawColor(232, 180, 184)
        pdf.setLineWidth(0.5)
        pdf.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 12
      }

      // Step number and name (bold, navy)
      pdf.setFontSize(12)
      pdf.setTextColor(26, 32, 44) // navy
      pdf.setFont(undefined, 'bold')
      const stepNumber = calculatedTimeline.length - index
      pdf.text(`${stepNumber}. ${step.name}`, 20, yPosition)
      yPosition += 8

      // Date (left aligned, gray)
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.setFont(undefined, 'normal')
      const daysText = step.daysFromToday < 0 
        ? `${Math.abs(step.daysFromToday)} days ago`
        : step.isToday 
        ? 'Today'
        : `${step.daysFromToday} days`
      pdf.text(`Date: ${step.formattedDate}`, 20, yPosition)
      yPosition += 6

      // Days away (right aligned, like Net Sheet values)
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(daysText, pageWidth - 20, yPosition, { align: 'right' })
      yPosition += 6

      // Description
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      const descriptionLines = pdf.splitTextToSize(`Description: ${step.description}`, pageWidth - 40)
      pdf.text(descriptionLines, 20, yPosition)
      yPosition += descriptionLines.length * 5 + 5

      // Add separator line before next step (except for last item)
      if (index < calculatedTimeline.length - 1) {
        pdf.setDrawColor(220, 220, 220)
        pdf.setLineWidth(0.3)
        pdf.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 8
      }
    })

    // Add final separator line (matching Net Sheet style)
    yPosition += 5
    pdf.setDrawColor(201, 169, 97)
    pdf.setLineWidth(1)
    pdf.line(20, yPosition, pageWidth - 20, yPosition)
    yPosition += 10

    // Add tagline
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.setFont(undefined, 'italic')
    pdf.text('Your personalized roadmap from "Thinking about it" to "Sold."', pageWidth / 2, yPosition, { align: 'center' })

    pdf.save(`smart-sell-timeline-${targetDate}.pdf`)
  }

  const printTimeline = () => {
    window.print()
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border-2 border-primary/20"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-navy mb-2">
            Smart-Sell Reverse Timeline
          </h3>
          <p className="text-lg text-gray-700 mb-1">
            Your personalized roadmap from "Thinking about it" to "Sold."
          </p>
          <p className="text-sm text-gray-600">
            Enter your target closing date, and we'll work backward to create your step-by-step checklist
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <label htmlFor="targetDate" className="block text-sm font-semibold text-gray-700 mb-2">
            When do you want to close/move? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                id="targetDate"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value)
                  setError('')
                  setCalculatedTimeline(null)
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <button
              onClick={calculateTimeline}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Calculate Timeline
            </button>
          </div>
          {error && (
            <p className={`mt-2 text-sm ${error.includes('Warning') ? 'text-orange-600' : 'text-red-600'}`}>
              {error}
            </p>
          )}
        </div>

        {calculatedTimeline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 border-2 border-gray-200"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h4 className="text-xl font-bold text-navy mb-1">
                  Your Personalized Timeline
                </h4>
                <p className="text-sm text-gray-600">
                  Target Closing: <span className="font-semibold text-primary">{formatDate(new Date(targetDate))}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors text-sm font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={printTimeline}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {calculatedTimeline.map((step, index) => {
                // Unhighlight Home Inspection and Appraisal cards
                const isUnhighlighted = step.name.includes('Home Inspection') || step.name.includes('Appraisal')
                const statusClass = isUnhighlighted
                  ? 'bg-gray-50 border-gray-200'
                  : step.isToday 
                  ? 'bg-primary/10 border-primary' 
                  : step.isThisWeek 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'

                // Format days display
                const daysDisplay = step.daysFromToday < 0 
                  ? `${Math.abs(step.daysFromToday)} days ago`
                  : step.isToday 
                  ? 'Today'
                  : step.isThisWeek 
                  ? `${step.daysFromToday} days` 
                  : `${step.daysFromToday} days`

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-2 rounded-lg p-4 ${statusClass} transition-all`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {step.icon && (() => {
                          const IconComponent = step.icon
                          return <IconComponent className="w-6 h-6 text-primary" />
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h5 className="text-lg font-bold text-navy">
                            {step.name}
                          </h5>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className={`font-semibold ${
                              step.isToday ? 'text-primary' : 
                              step.isThisWeek ? 'text-yellow-700' : 
                              'text-gray-700'
                            }`}>
                              {daysDisplay}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          <span className="font-semibold">{step.formattedDate}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-200 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4">
              <p className="text-sm text-gray-700 text-center">
                <strong>💡 Pro Tip:</strong> Print this timeline and hang it on your fridge! It keeps your goals visible and helps you stay on track. 
                Every day you'll see your progress from "Thinking about it" to "Sold."
              </p>
            </div>
          </motion.div>
        )}

        {!calculatedTimeline && (
          <div className="bg-white/50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <ArrowLeft className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Enter your target closing date above to see your personalized timeline
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default SmartSellTimeline

