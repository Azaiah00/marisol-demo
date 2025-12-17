import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Printer, Info } from 'lucide-react'
import jsPDF from 'jspdf'

// Title company fees (DFW average)
const titleCompanyFees = {
  closingFee: 475,
  ronESigningFee: 150,
  processingFee: 495,
  releaseServiceFee: 110,
  deedPreparation: 195,
  total: 1425
}

// Calculate transfer and recording taxes based on location
// Note: Texas does not have transfer taxes, only recording fees that vary by county
const calculateTransferAndRecordingTaxes = (listingPrice, location) => {
  const price = parseFloat(listingPrice.toString().replace(/,/g, '')) || 0
  let transferTax = 0
  let recordingTax = 0

  // Texas does not have transfer taxes
  transferTax = 0

  // Recording fees vary by county in Texas DFW area
  // Typical range is $50-150 depending on county
  if (location === 'Dallas') {
    recordingTax = 75 // Dallas County recording fee
  } else if (location === 'Collin') {
    recordingTax = 85 // Collin County (Frisco, Plano, McKinney, Allen)
  } else if (location === 'Denton') {
    recordingTax = 80 // Denton County
  } else if (location === 'Tarrant') {
    recordingTax = 75 // Tarrant County (Fort Worth area)
  } else if (location === 'Rockwall') {
    recordingTax = 70 // Rockwall County
  } else {
    // Default for other DFW counties
    recordingTax = 75 // Average DFW recording fee
  }

  return { transferTax: Math.round(transferTax), recordingTax }
}

const NetSheetCalculator = () => {
  const [formData, setFormData] = useState({
    listingPrice: '',
    mortgagePayoff: '',
    propertyTaxes: '',
    closingDate: '',
    commissionFees: 6, // Default 6% total commission
    propertyLocation: 'Dallas', // DFW area counties
    transferTax: '',
    recordingTax: '',
    hoaFees: '',
    homeWarranty: '',
    repairsConcessions: '',
    miscClosingCosts: '',
    useAutoCalculateTaxes: true // Auto-calculate transfer/recording taxes
  })
  const [showDetailedCosts, setShowDetailedCosts] = useState(false)

  const [netProceeds, setNetProceeds] = useState(0)
  const [breakdown, setBreakdown] = useState({
    listingPrice: 0,
    mortgagePayoff: 0,
    proratedTaxes: 0,
    commission: 0,
    transferTax: 0,
    recordingTax: 0,
    titleFees: 0,
    hoaFees: 0,
    homeWarranty: 0,
    repairsConcessions: 0,
    miscClosingCosts: 0,
    totalClosingCosts: 0,
    netAmount: 0
  })


  // Calculate prorated taxes based on closing date
  const calculateProratedTaxes = (yearlyTaxes, closingDate) => {
    if (!closingDate || !yearlyTaxes) return 0

    const closing = new Date(closingDate)
    const year = closing.getFullYear()
    const startOfYear = new Date(year, 0, 1)
    const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365
    const daysElapsed = Math.floor((closing - startOfYear) / (1000 * 60 * 60 * 24))
    
    return (yearlyTaxes / daysInYear) * daysElapsed
  }

  // Calculate net proceeds
  useEffect(() => {
    const listingPrice = parseFloat(formData.listingPrice.toString().replace(/,/g, '')) || 0
    const mortgagePayoff = parseFloat(formData.mortgagePayoff.toString().replace(/,/g, '')) || 0
    const yearlyTaxes = parseFloat(formData.propertyTaxes.toString().replace(/,/g, '')) || 0
    const commissionPercent = parseFloat(formData.commissionFees) || 0
    
    // Calculate transfer and recording taxes
    let transferTax = 0
    let recordingTax = 0
    if (formData.useAutoCalculateTaxes && listingPrice > 0) {
      const calculated = calculateTransferAndRecordingTaxes(listingPrice, formData.propertyLocation)
      transferTax = calculated.transferTax
      recordingTax = calculated.recordingTax
    } else {
      transferTax = parseFloat(formData.transferTax.toString().replace(/,/g, '')) || 0
      recordingTax = parseFloat(formData.recordingTax.toString().replace(/,/g, '')) || 0
    }

    // Title company fees (always included)
    const titleFees = titleCompanyFees.total
    
    const hoaFees = parseFloat(formData.hoaFees.toString().replace(/,/g, '')) || 0
    const homeWarranty = parseFloat(formData.homeWarranty.toString().replace(/,/g, '')) || 0
    const repairsConcessions = parseFloat(formData.repairsConcessions.toString().replace(/,/g, '')) || 0
    const miscCosts = parseFloat(formData.miscClosingCosts.toString().replace(/,/g, '')) || 0

    const proratedTaxes = calculateProratedTaxes(yearlyTaxes, formData.closingDate)
    const commission = (listingPrice * commissionPercent) / 100
    
    // Calculate taxes on closing costs (some jurisdictions tax certain fees)
    // For Texas DFW area, typically no additional taxes on closing costs, but included for completeness
    const totalClosingCosts = transferTax + recordingTax + titleFees + hoaFees + homeWarranty + repairsConcessions + miscCosts

    const netAmount = listingPrice - mortgagePayoff - proratedTaxes - commission - totalClosingCosts

    setBreakdown({
      listingPrice,
      mortgagePayoff,
      proratedTaxes,
      commission,
      transferTax,
      recordingTax,
      titleFees,
      hoaFees,
      homeWarranty,
      repairsConcessions,
      miscClosingCosts: miscCosts,
      totalClosingCosts,
      netAmount: Math.max(0, netAmount)
    })

    setNetProceeds(Math.max(0, netAmount))
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'listingPrice' || name === 'mortgagePayoff' || name === 'propertyTaxes' || 
        name === 'transferTax' || name === 'recordingTax' || 
        name === 'hoaFees' || name === 'homeWarranty' || name === 'repairsConcessions' || 
        name === 'miscClosingCosts') {
      // Format with commas for display
      const numericValue = value.replace(/,/g, '')
      if (numericValue === '' || /^\d+$/.test(numericValue)) {
        const formattedValue = numericValue === '' ? '' : parseInt(numericValue).toLocaleString('en-US')
        setFormData(prev => ({ ...prev, [name]: formattedValue }))
      }
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
    
    // Add branding
    doc.setFontSize(20)
    doc.setTextColor(26, 32, 44) // navy
    doc.text('Seller Net Sheet Report', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(232, 180, 184) // rose gold
    doc.text('Marisol Gallegos | Realtor®', 105, 28, { align: 'center' })
    
    doc.setDrawColor(232, 180, 184)
    doc.setLineWidth(0.5)
    doc.line(20, 32, 190, 32)
    
    // Add date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40)
    
    // Add calculations
    doc.setFontSize(12)
    doc.setTextColor(26, 32, 44)
    let yPos = 55
    
    doc.setFont(undefined, 'bold')
    doc.text('Listing Price:', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(formatCurrency(breakdown.listingPrice), 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Mortgage Payoff', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.mortgagePayoff)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Prorated Taxes', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.proratedTaxes)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Commission (' + formData.commissionFees + '%)', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.commission)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Transfer Tax', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.transferTax)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Recording Tax', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.recordingTax)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Title Company Fees', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.titleFees)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: HOA Fees', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.hoaFees)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Home Warranty', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.homeWarranty)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Repairs/Concessions', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.repairsConcessions)}`, 150, yPos, { align: 'right' })
    
    yPos += 10
    doc.setFont(undefined, 'bold')
    doc.text('Less: Other Closing Costs', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.text(`-${formatCurrency(breakdown.miscClosingCosts)}`, 150, yPos, { align: 'right' })
    
    yPos += 15
    doc.setDrawColor(201, 169, 97)
    doc.setLineWidth(1)
    doc.line(20, yPos, 190, yPos)
    
    yPos += 10
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(26, 32, 44)
    doc.text('Estimated Net Proceeds:', 20, yPos)
    doc.setFontSize(18)
    doc.setTextColor(201, 169, 97)
    doc.text(formatCurrency(netProceeds), 150, yPos, { align: 'right' })
    
    // Add disclaimer
    yPos += 30
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('* This is an estimate only. Actual proceeds may vary based on final closing costs,', 20, yPos, { maxWidth: 170 })
    yPos += 5
    doc.text('prorations, and adjustments. Consult with your real estate agent for accurate figures.', 20, yPos, { maxWidth: 170 })
    
    // Save PDF
    doc.save(`Seller-Net-Sheet-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <motion.section
      id="calculator"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
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
          <h2 className="section-title">Free Seller Net Sheet Calculator</h2>
          <p className="section-subtitle">
            Calculate your net proceeds when selling your home in Dallas, Frisco, or the DFW Metroplex. Get an accurate estimate of how much you'll walk away with after closing costs, commissions, and mortgage payoff. Fill in your details below to use our free seller net sheet calculator.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="card-bento p-6 sm:p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="listingPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                    Listing Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      id="listingPrice"
                      name="listingPrice"
                      value={formData.listingPrice}
                      onChange={handleInputChange}
                      placeholder="500,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mortgagePayoff" className="block text-sm font-semibold text-gray-700 mb-2">
                    Existing Mortgage Payoff ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      id="mortgagePayoff"
                      name="mortgagePayoff"
                      value={formData.mortgagePayoff}
                      onChange={handleInputChange}
                      placeholder="300,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="propertyTaxes" className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Taxes (Yearly $)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      id="propertyTaxes"
                      name="propertyTaxes"
                      value={formData.propertyTaxes}
                      onChange={handleInputChange}
                      placeholder="6,000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="closingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Closing Date
                  </label>
                  <input
                    type="date"
                    id="closingDate"
                    name="closingDate"
                    value={formData.closingDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label htmlFor="propertyLocation" className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Location
                  </label>
                  <select
                    id="propertyLocation"
                    name="propertyLocation"
                    value={formData.propertyLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    style={{ fontSize: '16px' }}
                  >
                    <option value="Dallas">Dallas County</option>
                    <option value="Collin">Collin County (Frisco, Plano, McKinney, Allen)</option>
                    <option value="Denton">Denton County</option>
                    <option value="Tarrant">Tarrant County (Fort Worth area)</option>
                    <option value="Rockwall">Rockwall County</option>
                    <option value="Other">Other DFW County</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="commissionFees" className="block text-sm font-semibold text-gray-700 mb-2">
                    Commission Fees (Total %)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="commissionFees"
                      name="commissionFees"
                      value={formData.commissionFees}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      style={{ fontSize: '16px' }}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowDetailedCosts(!showDetailedCosts)}
                    className="flex items-center justify-between w-full text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    <span>{showDetailedCosts ? 'Hide' : 'Show'} Detailed Closing Costs</span>
                    <span className="text-lg">{showDetailedCosts ? '−' : '+'}</span>
                  </button>
                </div>

                {showDetailedCosts && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.useAutoCalculateTaxes}
                          onChange={(e) => setFormData(prev => ({ ...prev, useAutoCalculateTaxes: e.target.checked }))}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Auto-calculate Transfer & Recording Taxes (based on location)
                        </span>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="transferTax" className="block text-sm font-semibold text-gray-700 mb-2">
                        Transfer Tax ($) {formData.useAutoCalculateTaxes && <span className="text-xs text-gray-500">(Auto-calculated)</span>}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          id="transferTax"
                          name="transferTax"
                          value={formData.transferTax}
                          onChange={handleInputChange}
                          placeholder="2,000"
                          disabled={formData.useAutoCalculateTaxes}
                          className={`w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base ${
                            formData.useAutoCalculateTaxes ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="recordingTax" className="block text-sm font-semibold text-gray-700 mb-2">
                        Recording Tax ($) {formData.useAutoCalculateTaxes && <span className="text-xs text-gray-500">(Auto-calculated)</span>}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          id="recordingTax"
                          name="recordingTax"
                          value={formData.recordingTax}
                          onChange={handleInputChange}
                          placeholder="50"
                          disabled={formData.useAutoCalculateTaxes}
                          className={`w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base ${
                            formData.useAutoCalculateTaxes ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title Company Fees (DFW Average)
                      </label>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Closing Fee:</span>
                          <span className="font-semibold">{formatCurrency(titleCompanyFees.closingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RON e-Signing Fee:</span>
                          <span className="font-semibold">{formatCurrency(titleCompanyFees.ronESigningFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Fee:</span>
                          <span className="font-semibold">{formatCurrency(titleCompanyFees.processingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Release Service Fee:</span>
                          <span className="font-semibold">{formatCurrency(titleCompanyFees.releaseServiceFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deed Preparation:</span>
                          <span className="font-semibold">{formatCurrency(titleCompanyFees.deedPreparation)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-300 font-semibold text-gray-800">
                          <span>Total Title Fees:</span>
                          <span>{formatCurrency(titleCompanyFees.total)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="hoaFees" className="block text-sm font-semibold text-gray-700 mb-2">
                        HOA Fees (Prorated) ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          id="hoaFees"
                          name="hoaFees"
                          value={formData.hoaFees}
                          onChange={handleInputChange}
                          placeholder="300"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="homeWarranty" className="block text-sm font-semibold text-gray-700 mb-2">
                        Home Warranty ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          id="homeWarranty"
                          name="homeWarranty"
                          value={formData.homeWarranty}
                          onChange={handleInputChange}
                          placeholder="600"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                          style={{ fontSize: '16px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="repairsConcessions" className="block text-sm font-semibold text-gray-700 mb-2">
                        Repairs/Concessions ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          id="repairsConcessions"
                          name="repairsConcessions"
                          value={formData.repairsConcessions}
                          onChange={handleInputChange}
                          placeholder="2,000"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                          style={{ fontSize: '16px' }}
                        />
                  </div>
                </div>

                <div>
                  <label htmlFor="miscClosingCosts" className="block text-sm font-semibold text-gray-700 mb-2">
                        Other Closing Costs ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      id="miscClosingCosts"
                      name="miscClosingCosts"
                      value={formData.miscClosingCosts}
                      onChange={handleInputChange}
                          placeholder="500"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-6 sm:p-8 text-white">
                  <div className="text-xs sm:text-sm font-semibold mb-2">ESTIMATED NET PROCEEDS</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 break-words">
                    {formatCurrency(netProceeds)}
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">
                    This is your estimated cash at closing
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Breakdown:</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-start text-sm">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-gray-600">Listing Price:</span>
                          <div className="group relative">
                            <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                              The sale price of your home - the amount the buyer agrees to pay.
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-800">{formatCurrency(breakdown.listingPrice)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-start text-sm">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-gray-600">- Mortgage Payoff:</span>
                          <div className="group relative">
                            <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                              The remaining balance on your mortgage that must be paid off at closing. This is deducted from your sale proceeds.
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-red-600">-{formatCurrency(breakdown.mortgagePayoff)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-start text-sm">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-gray-600">- Prorated Taxes:</span>
                          <div className="group relative">
                            <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                              Property taxes you owe for the portion of the year you owned the home. Calculated based on your closing date.
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-red-600">-{formatCurrency(breakdown.proratedTaxes)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-start text-sm">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-gray-600">- Commission ({formData.commissionFees}%):</span>
                          <div className="group relative">
                            <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                              The fee paid to real estate agents (typically 5-6% total). Split between your listing agent and the buyer's agent. This is your largest closing cost.
                            </div>
                          </div>
                        </div>
                        <span className="font-semibold text-red-600">-{formatCurrency(breakdown.commission)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <div>
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-600">- Transfer Tax:</span>
                            <div className="group relative">
                              <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                                A tax paid when transferring property ownership, based on the sale price. Texas does not have transfer taxes, so this will typically be $0 for DFW area properties.
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-red-600">-{formatCurrency(breakdown.transferTax)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-600">- Recording Tax:</span>
                            <div className="group relative">
                              <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                                A fee paid to the local government to record the deed and transfer documents. Typically a small fixed fee ($30-50).
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-red-600">-{formatCurrency(breakdown.recordingTax)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-600">- Title Company Fees:</span>
                            <div className="group relative">
                              <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                                Fees paid to the title company for handling the closing, including closing fees, processing fees, deed preparation, and recording services. DFW average: $1,425.
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-red-600">-{formatCurrency(breakdown.titleFees)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-600">- HOA Fees:</span>
                            <div className="group relative">
                              <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                                Prorated homeowners association fees you owe up to the closing date. Only applies if your property is in an HOA.
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-red-600">-{formatCurrency(breakdown.hoaFees)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-600">- Home Warranty:</span>
                            <div className="group relative">
                              <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                                Optional service contract you may offer to buyers covering repairs to major systems and appliances (typically for one year). This can make your property more attractive.
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-red-600">-{formatCurrency(breakdown.homeWarranty)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-600">- Repairs/Concessions:</span>
                            <div className="group relative">
                              <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                                Money you agree to pay for repairs found during inspection or credits you give to the buyer. This can include fixing issues or offering credits instead of making repairs.
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-red-600">-{formatCurrency(breakdown.repairsConcessions)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-600">- Other Costs:</span>
                            <div className="group relative">
                              <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                                Any additional closing costs not covered in other categories, such as attorney fees, survey fees, or other miscellaneous expenses.
                              </div>
                            </div>
                          </div>
                          <span className="font-semibold text-red-600">-{formatCurrency(breakdown.miscClosingCosts)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-300">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">Total Closing Costs:</span>
                          <div className="group relative">
                            <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                              The sum of all closing costs deducted from your sale proceeds. This includes taxes, fees, commissions, and any negotiated repairs or concessions.
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-red-600">-{formatCurrency(breakdown.totalClosingCosts)}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-4 mt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">Net Proceeds:</span>
                          <div className="group relative">
                            <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-navy text-white text-xs rounded-lg shadow-xl z-50">
                              Your final "walk-away" amount - the actual cash you'll receive after all deductions. This is what goes into your bank account.
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-primary text-lg">{formatCurrency(netProceeds)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={downloadPDF}
                    className="w-full cta-button primary flex items-center justify-center gap-2 min-h-[48px] text-base focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ touchAction: 'manipulation' }}
                    aria-label="Download net sheet calculator results as PDF"
                  >
                    <Download size={20} />
                    Download PDF
                  </motion.button>
                  <motion.button
                    onClick={handlePrint}
                    className="w-full cta-button secondary flex items-center justify-center gap-2 min-h-[48px] text-base focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 border-2 border-primary text-primary hover:bg-primary hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ touchAction: 'manipulation' }}
                    aria-label="Print net sheet calculator results"
                  >
                    <Printer size={20} />
                    Print
                  </motion.button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  * This is an estimate only. Actual proceeds may vary based on final closing costs, prorations, and adjustments.
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
                Want a personalized estimate for your home? As your realtor, I'll help you understand every line item and calculate your exact net proceeds. <strong>Ask me more about closing costs and how we can maximize your net proceeds.</strong>
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="cta-button primary inline-block"
              >
                Get Your Personalized Estimate
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default NetSheetCalculator
