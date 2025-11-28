# Seller Consultation Landing Page

A modern, high-converting landing page for home seller consultations built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

- **Hero Section**: Engaging introduction with clear call-to-action
- **7-Step Roadmap**: Visual timeline from pre-market to closing
- **Elite Marketing Plan**: Professional photography, floor plans, and virtual staging comparison
- **Strategic Financials**: Educational content on buyer concessions
- **Interactive Net Sheet Calculator**: Calculate your estimated net proceeds with PDF download
- **Responsive Design**: Mobile-first approach with smooth animations
- **Modern UI**: Beautiful, professional design using Tailwind CSS
- **Smooth Animations**: Framer Motion animations for an engaging experience

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **jsPDF** - PDF generation for net sheet calculator
- **Lucide React** - Icon library

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Seller Consultation/
├── src/
│   ├── components/
│   │   └── NetSheetCalculator.jsx  # Interactive calculator component
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # Application entry point
│   └── index.css                    # Global styles with Tailwind
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── netlify.toml                     # Netlify deployment configuration
```

## Deployment

This project is configured for deployment on Netlify. Simply connect your repository to Netlify, and it will automatically build and deploy.

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:
- Primary: Gold (#c9a961)
- Navy: Dark blue (#1a202c)
- Teal: Accent color (#14b8a6)

### Content

All content is in `src/App.jsx`. Update the sections as needed:
- Hero section text
- Roadmap steps
- Marketing plan details
- Financial information
- Contact details

## License

MIT












