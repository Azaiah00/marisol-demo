import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Printer, 
  CheckCircle, 
  XCircle, 
  Info,
  Home,
  Wrench,
  Paintbrush,
  Leaf,
  Square,
  RectangleHorizontal,
  Box,
  Layers,
  Building2,
  Utensils,
  Droplets,
  Hammer,
  Wind
} from 'lucide-react'
import jsPDF from 'jspdf'

const ROICalculator = () => {
  const [formData, setFormData] = useState({
    improvementType: '',
    improvementCost: '',
    currentHomeValue: '',
    expectedROI: 0
  })

  const [results, setResults] = useState({
    improvementCost: 0,
    currentHomeValue: 0,
    expectedROI: 0,
    valueIncrease: 0,
    netGain: 0,
    isWorthIt: false,
    recommendation: '',
    percentOfHomeValue: 0,
    breakEvenAnalysis: ''
  })

  // ROI percentages based on improvement type (industry averages)
  const improvementROIs = {
    'kitchen-remodel': { 
      roi: 60, 
      name: 'Kitchen Remodel',
      icon: Utensils,
      description: 'Complete kitchen renovation including cabinets, countertops, appliances, and fixtures. One of the most impactful improvements for home value.',
      costRange: { min: 15000, max: 75000 }
    },
    'bathroom-remodel': { 
      roi: 58, 
      name: 'Bathroom Remodel',
      icon: Droplets,
      description: 'Full bathroom renovation with new fixtures, tile, vanity, and lighting. Essential for modernizing older homes.',
      costRange: { min: 10000, max: 35000 }
    },
    'paint-interior': { 
      roi: 107, 
      name: 'Interior Paint',
      icon: Paintbrush,
      description: 'Fresh interior paint throughout the home. One of the highest ROI improvements - low cost with significant visual impact.',
      costRange: { min: 2000, max: 8000 }
    },
    'paint-exterior': { 
      roi: 55, 
      name: 'Exterior Paint',
      icon: Paintbrush,
      description: 'Exterior painting to refresh curb appeal. Important for first impressions and protecting your home\'s exterior.',
      costRange: { min: 3000, max: 12000 }
    },
    'flooring': { 
      roi: 70, 
      name: 'New Flooring',
      icon: Square,
      description: 'Replace old carpet, hardwood refinishing, or install new flooring. High impact on buyer perception and home value.',
      costRange: { min: 5000, max: 25000 }
    },
    'roof-replacement': { 
      roi: 60, 
      name: 'Roof Replacement',
      icon: Building2,
      description: 'Complete roof replacement. Often necessary for sale and provides peace of mind to buyers. Essential maintenance item.',
      costRange: { min: 8000, max: 30000 }
    },
    'windows': { 
      roi: 68, 
      name: 'Window Replacement',
      icon: RectangleHorizontal,
      description: 'Energy-efficient window replacement. Improves energy efficiency, reduces utility costs, and enhances curb appeal.',
      costRange: { min: 8000, max: 25000 }
    },
    'deck-addition': { 
      roi: 65, 
      name: 'Deck Addition',
      icon: Box,
      description: 'Add or replace outdoor deck/patio. Expands living space and creates outdoor entertainment area highly valued by buyers.',
      costRange: { min: 5000, max: 20000 }
    },
    'landscaping': { 
      roi: 100, 
      name: 'Landscaping',
      icon: Leaf,
      description: 'Professional landscaping and curb appeal improvements. Highest ROI improvement - dramatically improves first impressions.',
      costRange: { min: 2000, max: 15000 }
    },
    'basement-finish': { 
      roi: 70, 
      name: 'Basement Finishing',
      icon: Layers,
      description: 'Finish unfinished basement to add livable square footage. Significantly increases home value and appeal.',
      costRange: { min: 20000, max: 50000 }
    },
    'attic-conversion': { 
      roi: 56, 
      name: 'Attic Conversion',
      icon: Layers,
      description: 'Convert attic space into livable area. Adds square footage but requires proper permits and structural considerations.',
      costRange: { min: 30000, max: 80000 }
    },
    'siding': { 
      roi: 75, 
      name: 'Siding Replacement',
      icon: Home,
      description: 'Replace old or damaged siding. Improves curb appeal, energy efficiency, and reduces maintenance needs.',
      costRange: { min: 10000, max: 30000 }
    },
    'hvac': { 
      roi: 35, 
      name: 'HVAC Replacement',
      icon: Wind,
      description: 'Replace heating and cooling system. Lower ROI but often necessary for sale and provides comfort to buyers.',
      costRange: { min: 5000, max: 15000 }
    },
    'custom': { 
      roi: 0, 
      name: 'Custom Improvement',
      icon: Wrench,
      description: 'Custom improvement not listed above. Enter your own ROI percentage based on your research.',
      costRange: null
    }
  }

  // Calculate ROI
  useEffect(() => {
    const improvementCost = parseFloat(formData.improvementCost.toString().replace(/,/g, '')) || 0
    const currentHomeValue = parseFloat(formData.currentHomeValue.toString().replace(/,/g, '')) || 0
    let roiPercent = parseFloat(formData.expectedROI) || 0

    // Get ROI from improvement type if not custom
    if (formData.improvementType && formData.improvementType !== 'custom' && roiPercent === 0) {
      roiPercent = improvementROIs[formData.improvementType]?.roi || 0
    }

    const valueIncrease = (improvementCost * roiPercent) / 100
    const netGain = valueIncrease - improvementCost
    const isWorthIt = netGain > 0 || (roiPercent >= 70 && netGain > -improvementCost * 0.3)
    
    // Calculate percentage of home value
    const percentOfHomeValue = currentHomeValue > 0 
      ? (improvementCost / currentHomeValue) * 100 
      : 0

    // Break-even analysis
    const formatCurrencyLocal = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
    
    let breakEvenAnalysis = ''
    if (roiPercent > 0 && improvementCost > 0) {
      if (netGain >= 0) {
        breakEvenAnalysis = `This improvement pays for itself and adds ${formatCurrencyLocal(Math.abs(netGain))} in value.`
      } else {
        const lossPercent = (Math.abs(netGain) / improvementCost) * 100
        breakEvenAnalysis = `You'll recoup ${(100 - lossPercent).toFixed(0)}% of your investment, with a net cost of ${formatCurrencyLocal(Math.abs(netGain))}.`
      }
    }

    let recommendation = ''
    if (roiPercent >= 80) {
      recommendation = 'Excellent investment! This improvement typically provides strong returns and can significantly increase your home\'s value and appeal to buyers. This is one of the best improvements you can make before selling.'
    } else if (roiPercent >= 60) {
      recommendation = 'Good investment. This improvement provides solid returns and can help your home sell faster and for a better price. Consider this a smart pre-sale investment.'
    } else if (roiPercent >= 40) {
      recommendation = 'Moderate investment. Consider if the improvement is necessary for sale or if it significantly improves your quality of life. May be worth it if it helps your home sell faster.'
    } else {
      recommendation = 'Lower ROI. Consider if this improvement is essential for the sale or if you\'ll enjoy it regardless of ROI. Focus on improvements with higher returns first.'
    }

    // Add context about home value percentage
    if (percentOfHomeValue > 0) {
      if (percentOfHomeValue > 15) {
        recommendation += ' Note: This improvement represents a significant portion of your home\'s value. Ensure it\'s necessary for sale.'
      } else if (percentOfHomeValue > 10) {
        recommendation += ' This is a substantial investment relative to your home\'s value.'
      }
    }

    setResults({
      improvementCost,
      currentHomeValue,
      expectedROI: roiPercent,
      valueIncrease,
      netGain,
      isWorthIt,
      recommendation,
      percentOfHomeValue,
      breakEvenAnalysis
    })
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'improvementCost' || name === 'currentHomeValue') {
      const numericValue = value.replace(/,/g, '')
      if (numericValue === '' || /^\d+$/.test(numericValue)) {
        const formattedValue = numericValue === '' ? '' : parseInt(numericValue).toLocaleString('en-US')
        setFormData(prev => ({ ...prev, [name]: formattedValue }))
      }
    } else if (name === 'improvementType') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        expectedROI: value === 'custom' ? prev.expectedROI : improvementROIs[value]?.roi || 0
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handlePrint = () => {
    window.print()
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    
    // Add branding - matching Net Sheet Calculator style
    doc.setFontSize(22)
    doc.setTextColor(26, 32, 44)
    doc.setFont(undefined, 'bold')
    doc.text('Home Improvement ROI Report', 105, 25, { align: 'center' })
    
    doc.setFontSize(11)
    doc.setTextColor(201, 169, 97)
    doc.setFont(undefined, 'normal')
    doc.text('Marisol Gallegos | Realtor®', 105, 32, { align: 'center' })
    
    doc.setDrawColor(201, 169, 97)
    doc.setLineWidth(0.5)
    doc.line(20, 36, 190, 36)
    
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 20, 44)
    
    // Add calculations
    doc.setFontSize(11)
    doc.setTextColor(26, 32, 44)
    let yPos = 55
    
    const improvementName = formData.improvementType && formData.improvementType !== 'custom' 
      ? improvementROIs[formData.improvementType]?.name 
      : 'Custom Improvement'
    
    // Improvement Type
    doc.setFont(undefined, 'bold')
    doc.text('Improvement Type:', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(improvementName, 75, yPos)
    
    yPos += 8
    doc.setFont(undefined, 'bold')
    doc.text('Improvement Cost:', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(formatCurrency(results.improvementCost), 150, yPos, { align: 'right' })
    
    if (results.currentHomeValue > 0) {
      yPos += 8
      doc.setFont(undefined, 'bold')
      doc.text('Current Home Value:', 20, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(formatCurrency(results.currentHomeValue), 150, yPos, { align: 'right' })
      
      yPos += 8
      doc.setFont(undefined, 'bold')
      doc.text('% of Home Value:', 20, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(`${results.percentOfHomeValue.toFixed(1)}%`, 150, yPos, { align: 'right' })
    }
    
    yPos += 8
    doc.setFont(undefined, 'bold')
    doc.text('Expected ROI:', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`${results.expectedROI.toFixed(1)}%`, 150, yPos, { align: 'right' })
    
    yPos += 8
    doc.setFont(undefined, 'bold')
    doc.text('Value Increase:', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(formatCurrency(results.valueIncrease), 150, yPos, { align: 'right' })
    
    yPos += 12
    doc.setDrawColor(201, 169, 97)
    doc.setLineWidth(1)
    doc.line(20, yPos, 190, yPos)
    
    yPos += 10
    doc.setFontSize(13)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...(results.netGain >= 0 ? [34, 197, 94] : [239, 68, 68]))
    doc.text('Net Gain/Loss:', 20, yPos)
    doc.setFontSize(15)
    doc.text(formatCurrency(results.netGain), 150, yPos, { align: 'right' })
    
    if (results.breakEvenAnalysis) {
      yPos += 12
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.setFont(undefined, 'italic')
      doc.text(results.breakEvenAnalysis, 20, yPos, { maxWidth: 170 })
      yPos += 10
    }
    
    yPos += 10
    doc.setDrawColor(201, 169, 97)
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    
    yPos += 8
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.setFont(undefined, 'normal')
    doc.text('* ROI percentages are industry averages. Actual returns may vary based on', 20, yPos, { maxWidth: 170 })
    yPos += 4
    doc.text('market conditions, quality of work, and buyer preferences in your area.', 20, yPos, { maxWidth: 170 })
    
    doc.save(`Home-Improvement-ROI-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <motion.section
      id="roi"
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Home Improvement ROI Calculator</h2>
          <p className="section-subtitle">
            Wondering if that renovation is worth it? Calculate the return on investment (ROI) for home improvements before you sell. See how much value different improvements add to your home and whether they're worth the cost.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="improvementType" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Improvement Type
                    {formData.improvementType && formData.improvementType !== 'custom' && improvementROIs[formData.improvementType]?.description && (
                      <div className="group relative">
                        <Info size={16} className="text-gray-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl">
                          {improvementROIs[formData.improvementType]?.description}
                          {improvementROIs[formData.improvementType]?.costRange && (
                            <div className="mt-2 pt-2 border-t border-gray-600">
                              <strong>Typical Cost Range:</strong> {formatCurrency(improvementROIs[formData.improvementType].costRange.min)} - {formatCurrency(improvementROIs[formData.improvementType].costRange.max)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </label>
                  <div className="relative">
                    {formData.improvementType && formData.improvementType !== 'custom' && improvementROIs[formData.improvementType]?.icon && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary z-10">
                        {(() => {
                          const IconComponent = improvementROIs[formData.improvementType].icon
                          return <IconComponent size={20} />
                        })()}
                      </div>
                    )}
                    <select
                      id="improvementType"
                      name="improvementType"
                      value={formData.improvementType}
                      onChange={handleInputChange}
                      className={`w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base ${
                        formData.improvementType && formData.improvementType !== 'custom' && improvementROIs[formData.improvementType]?.icon
                          ? 'pl-12 pr-4 py-3'
                          : 'px-4 py-3'
                      }`}
                      style={{ fontSize: '16px' }}
                    >
                      <option value="">Select improvement type</option>
                      <option value="paint-interior">Interior Paint</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="paint-exterior">Exterior Paint</option>
                      <option value="flooring">New Flooring</option>
                      <option value="siding">Siding Replacement</option>
                      <option value="windows">Window Replacement</option>
                      <option value="deck-addition">Deck Addition</option>
                      <option value="basement-finish">Basement Finishing</option>
                      <option value="roof-replacement">Roof Replacement</option>
                      <option value="kitchen-remodel">Kitchen Remodel</option>
                      <option value="bathroom-remodel">Bathroom Remodel</option>
                      <option value="attic-conversion">Attic Conversion</option>
                      <option value="hvac">HVAC Replacement</option>
                      <option value="custom">Custom Improvement</option>
                    </select>
                  </div>
                  {formData.improvementType && formData.improvementType !== 'custom' && improvementROIs[formData.improvementType]?.costRange && (
                    <p className="text-xs text-gray-500 mt-1">
                      Typical cost range: {formatCurrency(improvementROIs[formData.improvementType].costRange.min)} - {formatCurrency(improvementROIs[formData.improvementType].costRange.max)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="improvementCost" className="block text-sm font-semibold text-gray-700 mb-2">
                    Improvement Cost ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      id="improvementCost"
                      name="improvementCost"
                      value={formData.improvementCost}
                      onChange={handleInputChange}
                      placeholder="25,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="currentHomeValue" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Home Value ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      id="currentHomeValue"
                      name="currentHomeValue"
                      value={formData.currentHomeValue}
                      onChange={handleInputChange}
                      placeholder="500,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Optional - helps provide context</p>
                </div>

                {formData.improvementType === 'custom' && (
                  <div>
                    <label htmlFor="expectedROI" className="block text-sm font-semibold text-gray-700 mb-2">
                      Expected ROI (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="expectedROI"
                        name="expectedROI"
                        value={formData.expectedROI}
                        onChange={handleInputChange}
                        min="0"
                        max="150"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                        style={{ fontSize: '16px' }}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter your expected ROI percentage</p>
                  </div>
                )}

                {formData.improvementType && formData.improvementType !== 'custom' && (
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      {improvementROIs[formData.improvementType]?.icon && (() => {
                        const IconComponent = improvementROIs[formData.improvementType].icon
                        return <IconComponent size={20} className="text-primary" />
                      })()}
                      <p className="text-sm text-gray-700">
                        <strong>Industry Average ROI:</strong> {improvementROIs[formData.improvementType]?.roi}%
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Based on national averages. Actual ROI may vary by market and quality of work.
                    </p>
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className={`rounded-xl p-6 sm:p-8 text-white ${
                  results.isWorthIt 
                    ? 'bg-gradient-to-br from-green-500 to-green-600' 
                    : 'bg-gradient-to-br from-orange-500 to-orange-600'
                }`}>
                  <div className="text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
                    {results.isWorthIt ? (
                      <>
                        <CheckCircle size={16} />
                        RECOMMENDED
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        CONSIDER CAREFULLY
                      </>
                    )}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    {results.expectedROI > 0 ? `${results.expectedROI.toFixed(1)}% ROI` : 'Enter Details'}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">
                    Expected return on investment
                  </div>
                </div>

                {results.improvementCost > 0 && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-gray-800 mb-4">ROI Breakdown:</h3>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Improvement Cost:</span>
                        <span className="font-semibold text-gray-800">{formatCurrency(results.improvementCost)}</span>
                      </div>

                      {results.currentHomeValue > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Current Home Value:</span>
                            <span className="font-semibold text-gray-800">{formatCurrency(results.currentHomeValue)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">% of Home Value:</span>
                            <span className="font-semibold text-primary">{results.percentOfHomeValue.toFixed(1)}%</span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Expected ROI:</span>
                        <span className="font-semibold text-primary">{results.expectedROI.toFixed(1)}%</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Value Increase:</span>
                        <span className="font-semibold text-green-600">+{formatCurrency(results.valueIncrease)}</span>
                      </div>

                      <div className="border-t border-gray-300 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800">Net Gain/Loss:</span>
                          <span className={`font-bold text-lg ${
                            results.netGain >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {results.netGain >= 0 ? '+' : ''}{formatCurrency(results.netGain)}
                          </span>
                        </div>
                        {results.breakEvenAnalysis && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            {results.breakEvenAnalysis}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={handlePrint}
                        className="cta-button secondary flex items-center justify-center gap-2 min-h-[48px] text-base focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Print ROI calculator results"
                      >
                        <Printer size={20} />
                        Print
                      </motion.button>
                      <motion.button
                        onClick={downloadPDF}
                        className="cta-button primary flex items-center justify-center gap-2 min-h-[48px] text-base focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Download ROI calculator results as PDF"
                      >
                        <Download size={20} />
                        Download PDF
                      </motion.button>
                    </div>
                  </>
                )}

                <p className="text-xs text-gray-500 text-center">
                  * ROI percentages are industry averages. Actual returns may vary based on market conditions, quality of work, and buyer preferences in your area.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border-2 border-primary/20 max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                Not sure which improvements make sense for your home? As your realtor, I'll help you prioritize improvements that maximize your return. <strong>Ask me more about which home improvements will help you sell for top dollar.</strong>
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="cta-button primary inline-block"
              >
                Schedule My Free Seller Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default ROICalculator

