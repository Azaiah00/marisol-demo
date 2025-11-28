import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Search, X } from 'lucide-react'

const Glossary = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Scroll to top when glossary opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  const terms = [
    {
      letter: 'A',
      items: [
        {
          term: 'As-Is Sale',
          definition: 'Selling your property in its current condition without making repairs or improvements. Buyers accept the property with all existing defects, which can save you money but may reduce the sale price.'
        },
        {
          term: 'Assessed Value',
          definition: 'The value assigned to your property by a tax assessor for calculating property taxes. This may differ from your home\'s market value and affects your property tax bill.'
        }
      ]
    },
    {
      letter: 'B',
      items: [
        {
          term: 'Backup Offer',
          definition: 'A secondary offer on your property that becomes active if the primary offer falls through. Having backup offers provides security and ensures you have other buyers ready.'
        },
        {
          term: 'Bridge Loan',
          definition: 'A short-term loan that helps you purchase a new home before selling your current one. It bridges the financial gap between transactions, allowing you to buy first and sell later.'
        },
        {
          term: 'Buyer\'s Agent',
          definition: 'The real estate agent who represents the buyer in your transaction. You typically pay a commission to the buyer\'s agent (usually 2.5-3%) as part of the total commission split.'
        },
        {
          term: 'Buyer\'s Market',
          definition: 'A market condition where there are more homes for sale than buyers. In this market, you may need to price competitively and be more flexible with negotiations.'
        }
      ]
    },
    {
      letter: 'C',
      items: [
        {
          term: 'Closing',
          definition: 'The final step where you transfer ownership to the buyer. You\'ll sign documents, receive your net proceeds, and hand over the keys. This is when you officially sell your home.'
        },
        {
          term: 'Closing Costs (Seller)',
          definition: 'Fees and expenses you pay at closing, including real estate commissions (5-6%), transfer taxes, title company fees, recording fees, prorated property taxes, and any negotiated repairs or concessions. Typically 8-10% of the sale price.'
        },
        {
          term: 'CMA (Comparative Market Analysis)',
          definition: 'A report your agent prepares comparing your home to similar properties that recently sold, are currently listed, or didn\'t sell. This helps determine the best listing price to maximize your sale.'
        },
        {
          term: 'Commission',
          definition: 'The fee you pay to real estate agents, typically 5-6% of the sale price. This is split between your listing agent (2.5-3%) and the buyer\'s agent (2.5-3%). This is your largest closing cost.'
        },
        {
          term: 'Contingency',
          definition: 'Conditions in the buyer\'s offer that must be met for the sale to proceed. Common contingencies include home inspection, appraisal, and financing. You can negotiate which contingencies to accept.'
        },
        {
          term: 'Counter Offer',
          definition: 'Your response to a buyer\'s offer proposing different terms (price, closing date, conditions). This is part of the negotiation process to reach an agreement that works for you.'
        }
      ]
    },
    {
      letter: 'D',
      items: [
        {
          term: 'Days on Market (DOM)',
          definition: 'The number of days your property has been listed for sale. A high DOM may indicate overpricing. Your agent will monitor this and may suggest price adjustments if needed.'
        },
        {
          term: 'Deed',
          definition: 'The legal document you sign that transfers ownership of your property to the buyer. It must be recorded with the local government to complete the sale.'
        },
        {
          term: 'Deposit (Earnest Money)',
          definition: 'Money the buyer puts down to show serious intent to purchase (typically 1-3% of purchase price). This is held in escrow and protects you if the buyer backs out without cause.'
        }
      ]
    },
    {
      letter: 'E',
      items: [
        {
          term: 'Equity',
          definition: 'The difference between your home\'s market value and what you owe on your mortgage. This is the amount you\'ll receive (minus closing costs) when you sell. Building equity increases your net proceeds.'
        },
        {
          term: 'Escrow',
          definition: 'A neutral third party (title company or attorney) that holds funds and documents during the transaction, ensuring all conditions are met before closing. They handle the money transfer.'
        },
        {
          term: 'Exclusive Listing',
          definition: 'A listing agreement where only one real estate agent (your listing agent) has the right to sell your property for a specified period. This is the standard type of listing agreement.'
        }
      ]
    },
    {
      letter: 'F',
      items: [
        {
          term: 'FSBO (For Sale By Owner)',
          definition: 'Selling your property without a real estate agent. While you save on commission, you handle all marketing, negotiations, paperwork, and legal requirements yourself.'
        },
        {
          term: 'Fair Market Value',
          definition: 'The price your home would sell for in an open market with a willing buyer and seller. Your agent uses a CMA to determine this value for pricing your listing.'
        }
      ]
    },
    {
      letter: 'H',
      items: [
        {
          term: 'Home Inspection',
          definition: 'A thorough examination of your property\'s condition that the buyer typically requests. They may negotiate repairs or credits based on findings. You can choose to fix issues, offer credits, or decline (risking the sale).'
        },
        {
          term: 'Home Warranty',
          definition: 'A service contract you may offer to buyers that covers repairs or replacement of major home systems and appliances (typically for one year). This can make your property more attractive and reduce post-sale liability.'
        },
        {
          term: 'HOA (Homeowners Association)',
          definition: 'An organization that manages your community or condominium complex. You must provide HOA documents to buyers and may need to pay prorated HOA fees at closing.'
        }
      ]
    },
    {
      letter: 'L',
      items: [
        {
          term: 'Listing Agent',
          definition: 'Your real estate agent who represents you and lists your property for sale. Also called the seller\'s agent. They handle marketing, negotiations, and guide you through the selling process.'
        },
        {
          term: 'Listing Price',
          definition: 'The asking price you set for your property with your agent. This is the starting point for negotiations. Pricing correctly is crucial - too high and it sits, too low and you leave money on the table.'
        },
        {
          term: 'Lockbox',
          definition: 'A secure device attached to your property that holds the key, allowing authorized agents to show your home when you\'re not present. This maximizes showing opportunities.'
        }
      ]
    },
    {
      letter: 'M',
      items: [
        {
          term: 'MLS (Multiple Listing Service)',
          definition: 'A database where your agent lists your property, making it visible to all real estate agents and major websites (Zillow, Realtor.com, etc.). This maximizes exposure to potential buyers.'
        },
        {
          term: 'Mortgage Payoff',
          definition: 'The amount you owe on your mortgage that must be paid off at closing. This is deducted from your sale proceeds along with closing costs to determine your net proceeds.'
        }
      ]
    },
    {
      letter: 'N',
      items: [
        {
          term: 'Net Proceeds',
          definition: 'The actual amount of money you receive after all closing costs, commissions, mortgage payoff, and other deductions are subtracted from the sale price. This is your "walk-away" amount.'
        },
        {
          term: 'Negotiation',
          definition: 'The process of discussing and agreeing on terms with buyers, including price, closing date, repairs, concessions, and contingencies. Your agent handles this on your behalf.'
        }
      ]
    },
    {
      letter: 'O',
      items: [
        {
          term: 'Offer',
          definition: 'A formal proposal from a buyer to purchase your property at a specific price and under certain conditions. You can accept, reject, or make a counter offer.'
        },
        {
          term: 'Open House',
          definition: 'A scheduled time when your property is open for public viewing without appointments. This generates interest and attracts potential buyers, increasing your chances of receiving offers.'
        }
      ]
    },
    {
      letter: 'P',
      items: [
        {
          term: 'Property Tax (Prorated)',
          definition: 'Property taxes you owe for the portion of the year you owned the home. These are prorated at closing, meaning you pay taxes up to the closing date, and the buyer pays from that date forward.'
        }
      ]
    },
    {
      letter: 'R',
      items: [
        {
          term: 'Recording Fee',
          definition: 'A fee paid to the local government to record the deed and other documents that transfer ownership. This is typically a small fixed fee (usually $30-50) that you pay at closing.'
        },
        {
          term: 'Repairs/Concessions',
          definition: 'Money you agree to pay for repairs or give as credits to the buyer. This can include fixing issues found during inspection or offering credits instead of making repairs. These reduce your net proceeds.'
        }
      ]
    },
    {
      letter: 'S',
      items: [
        {
          term: 'Seller\'s Agent',
          definition: 'Your real estate agent who represents your interests throughout the selling process. Also called the listing agent. They work to get you the best price and terms.'
        },
        {
          term: 'Seller\'s Market',
          definition: 'A market condition where there are more buyers than available homes. This gives you more negotiating power, often leading to higher prices, faster sales, and multiple offers.'
        },
        {
          term: 'Settlement',
          definition: 'Another term for closing - the final step where you transfer ownership, sign all documents, receive your net proceeds, and hand over the keys to the buyer.'
        },
        {
          term: 'Staging',
          definition: 'The process of preparing your home for sale by arranging furniture, decor, and removing personal items. Virtual staging (digital) is cost-effective and allows multiple design styles without moving furniture.'
        }
      ]
    },
    {
      letter: 'T',
      items: [
        {
          term: 'Title',
          definition: 'Legal ownership of your property. A clear title (free of liens, claims, or disputes) is required for sale. Your agent and title company ensure the title is clear before closing.'
        },
        {
          term: 'Title Company Fees',
          definition: 'Fees paid to the title company for handling the closing process, including closing fees, processing fees, deed preparation, and recording services. These are standard closing costs you pay as the seller.'
        },
        {
          term: 'Transfer Tax',
          definition: 'A tax you pay when transferring ownership of your property, typically based on the sale price. Rates vary by location (DC: 1.1%, VA: varies by county, MD: 0.5%). This is a significant closing cost.'
        }
      ]
    },
    {
      letter: 'U',
      items: [
        {
          term: 'Under Contract',
          definition: 'A status indicating you\'ve accepted an offer and your property is in the process of closing. The sale is pending but not yet final - contingencies must be satisfied before closing.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-navy hover:text-primary transition-colors font-semibold"
                aria-label="Back to main page"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <BookOpen className="text-primary" size={24} />
                <h1 className="text-2xl font-bold text-navy">Real Estate Glossary</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-lg text-gray-600 mb-8 text-center">
            Understanding real estate terminology is key to making informed decisions. 
            Use this glossary to educate yourself on common terms you'll encounter during your home selling journey.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for a term..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  // Scroll to top when searching
                  if (e.target.value) {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-gray-700"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Jump Navigation */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {terms
              .map((section) => ({
                ...section,
                items: section.items.filter((item) =>
                  item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.definition.toLowerCase().includes(searchTerm.toLowerCase())
                )
              }))
              .filter((section) => section.items.length > 0)
              .map((section) => (
                <a
                  key={section.letter}
                  href={`#letter-${section.letter}`}
                  className="w-10 h-10 flex items-center justify-center bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(`letter-${section.letter}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                >
                  {section.letter}
                </a>
              ))}
          </div>

          <div className="space-y-12">
            {terms
              .map((section) => ({
                ...section,
                items: section.items.filter((item) =>
                  item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.definition.toLowerCase().includes(searchTerm.toLowerCase())
                )
              }))
              .filter((section) => section.items.length > 0)
              .map((section, sectionIndex) => (
                <motion.div
                  key={section.letter}
                  id={`letter-${section.letter}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: sectionIndex * 0.05 }}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 scroll-mt-8"
                >
                  <h2 className="text-4xl font-bold text-primary mb-6 pb-4 border-b-2 border-primary/20">
                    {section.letter}
                  </h2>
                  <div className="space-y-6">
                    {section.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-l-4 border-primary/30 pl-6 py-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                      >
                        <h3 className="text-xl font-bold text-navy mb-2">{item.term}</h3>
                        <p className="text-gray-700 leading-relaxed">{item.definition}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
          
          {terms
            .map((section) => ({
              ...section,
              items: section.items.filter((item) =>
                item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.definition.toLowerCase().includes(searchTerm.toLowerCase())
              )
            }))
            .filter((section) => section.items.length > 0).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No terms found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <button
              onClick={onBack}
              className="cta-button primary"
            >
              Return to Main Page
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Glossary

