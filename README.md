# WCAG 2.1 AAA AI Agent Compliance Tool

> "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect." - Tim Berners-Lee, W3C Director and inventor of the World Wide Web

## Why We Built This

In a world where digital experiences are fundamental to daily life, true inclusion means ensuring everyone can access and use digital content, regardless of ability. The AAA Accessibility Compliance Tool was created with a simple yet powerful mission: to break down digital barriers and make the web truly accessible for all.

People with disabilities face unnecessary obstacles online every day - from blind users unable to understand images without proper descriptions, to deaf users missing critical information in uncaptioned videos, to users with cognitive disabilities struggling with overly complex text. These barriers aren't just inconveniences; they represent real exclusion from essential services, information, and opportunities.

By building this tool, we aim to empower developers, content creators, and organizations to create truly inclusive digital experiences that meet the highest accessibility standards (WCAG 2.1 AAA). We believe that accessibility isn't just about compliance—it's about human dignity, equal opportunity, and the fundamental right to access information and services in our increasingly digital world.

Together, we can build a more accessible web, one piece of content at a time.

## Overview

This application helps you scan, analyze, and remediate digital content (text, images, audio, video) to meet or closely approximate WCAG 2.1 AAA success criteria. It provides an intuitive interface for:

- Ingesting various content types (HTML text blocks, images, audio, video)
- Diagnosing accessibility issues based on WCAG 2.1 AAA criteria
- Automating fixes wherever possible (AI-generated alt text, transcripts, color-contrast adjustments, etc.)
- Allowing user review of all AI-suggested improvements
- Outputting updated content with detailed compliance reporting

## Features

### Contrast (Enhanced)
- Analyzes text and non-text contrast against WCAG 2.1 AAA requirements (7:1 for normal text, 4.5:1 for large text)
- Automatically suggests improved colors that meet AAA requirements
- Provides side-by-side previews of original and suggested colors

### Images & Non-Text Content
- Detects missing or inadequate alt text
- Generates AI-based alt text with context sensitivity
- Identifies decorative images that should have empty alt attributes
- Flags complex images that may need long descriptions

### Video & Audio
- Generates transcripts for audio content
- Creates synchronized captions for video content
- Provides placeholders for sign language interpretation
- Suggests extended audio descriptions for visual content

### Text & Readability
- Analyzes text complexity and suggests simplifications
- Identifies unusual words and provides definitions
- Detects abbreviations and suggests expansions
- Adds pronunciation guidance where needed

### Robust ARIA & HTML
- Validates markup with proper ARIA attributes
- Ensures semantic correctness for assistive technologies
- Checks for proper status messages and notifications

## Technical Architecture

The application is built with a modern tech stack:

### Backend
- Node.js with Express
- RESTful API architecture
- AI integration for content analysis and remediation
- File processing for various media types

### Frontend
- React with Material UI
- Responsive design that is itself AAA compliant
- Interactive preview and editing capabilities
- Detailed reporting dashboard

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (optional, for enhanced AI capabilities)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aaa-accessibility-app.git
cd AAA-Accessibility-App
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables (copy from `.env.example`):
```
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here  # Optional
```

4. Start the development servers:
```bash
npm run dev
```

This will start both the backend server (on port 5000) and the frontend development server (on port 3000).

## Usage

### 1. Upload Content
- Upload HTML, images, audio, or video files
- Paste HTML or text content directly

### 2. Analyze Content
- The system will scan your content for WCAG 2.1 AAA compliance issues
- View detailed analysis results by category

### 3. Review & Remediate
- Review AI-suggested fixes for each issue
- Accept suggestions or provide your own modifications
- See side-by-side comparisons of original and improved content

### 4. Generate Report
- Get a comprehensive compliance report
- Download the remediated content
- View detailed statistics on fixed and remaining issues

## Integrating with Real AI Services

The application includes stubs for AI services that can be replaced with real implementations:

### Alt Text Generation
To use OpenAI for generating alt text, set your `OPENAI_API_KEY` in the `.env` file. The system will automatically use the GPT-4 Vision model for more accurate image descriptions.

### Text Simplification
The text simplification feature can be connected to language models like GPT-4 by implementing the appropriate API calls in the `textController.js` file.

### Transcript Generation
For real transcript generation, you can integrate services like AssemblyAI, Google Speech-to-Text, or similar by modifying the `mediaController.js` file.

## WCAG 2.1 AAA Coverage

This tool addresses the following WCAG 2.1 AAA success criteria:

- 1.4.6 Contrast (Enhanced)
- 1.4.9 Images of Text (No Exception)
- 1.2.6 Sign Language (Prerecorded)
- 1.2.7 Extended Audio Description (Prerecorded)
- 1.2.8 Media Alternative (Prerecorded)
- 1.2.9 Audio-only (Live)
- 3.1.3 Unusual Words
- 3.1.4 Abbreviations
- 3.1.5 Reading Level
- 3.1.6 Pronunciation

## Project Structure

```
AAA-Accessibility-App/
├─ backend/
│  ├─ controllers/        # API controllers for each feature
│  ├─ routes/             # API route definitions
│  ├─ uploads/            # Uploaded files storage
│  ├─ index.js            # Main server entry point
│  └─ ...
├─ frontend/
│  ├─ src/
│  │  ├─ components/      # Reusable UI components
│  │  │  ├─ analysis/     # Analysis-specific components
│  │  │  ├─ layout/       # Layout components (header, footer)
│  │  │  └─ upload/       # Upload-related components
│  │  ├─ context/         # React context providers
│  │  ├─ pages/           # Page components
│  │  ├─ styles/          # Global styles and theme
│  │  ├─ utils/           # Utility functions
│  │  ├─ App.jsx          # Main application component
│  │  └─ main.jsx         # Entry point
│  ├─ index.html          # HTML template
│  └─ ...
├─ .env.example           # Example environment variables
├─ .gitignore             # Git ignore file
├─ package.json           # Project dependencies and scripts
└─ README.md              # Project documentation
```

## Limitations

- Sign language interpretation requires human translators; the tool provides placeholders and guidance
- Some complex accessibility issues may require manual review and remediation
- The tool assists with technical compliance but cannot guarantee legal compliance with accessibility laws

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- W3C Web Accessibility Initiative (WAI)
- The WCAG 2.1 Guidelines
- OpenAI for AI capabilities 
