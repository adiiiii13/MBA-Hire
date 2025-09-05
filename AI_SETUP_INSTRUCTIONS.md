# AI Resume Analysis Setup Instructions

## Required NPM Packages

Run the following commands in the `backend` directory to install required packages:

```bash
cd backend
npm install pdf-parse mammoth axios
npm install --save-dev @types/pdf-parse
```

## Environment Variables

Add the following to your `.env` file in the backend directory:

```env
# Grok AI Configuration
GROK_API_KEY=your_actual_grok_api_key_here

# Upload Configuration (optional, defaults provided)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## Database Migration

Run the database migration to add AI analysis columns:

```bash
cd backend
npm run migrate
```

Or manually run the migration script:

```bash
npx ts-node src/database/migrate.ts
```

## Database Schema Updates

The following columns have been added to the `applications` table:

- `ai_score` (INT) - AI prediction score from 1-100
- `ai_strengths` (TEXT) - JSON array of candidate strengths
- `ai_weaknesses` (TEXT) - JSON array of areas for improvement
- `ai_analysis_status` (ENUM) - Status of AI analysis: 'pending', 'processing', 'completed', 'failed'

## Features Added

### 1. Resume Text Extraction
- Support for PDF files using `pdf-parse`
- Support for DOCX files using `mammoth`
- DOC files not fully supported (shows error message)
- Text validation and preprocessing for AI analysis

### 2. Grok AI Integration
- AI-powered resume analysis using Grok API
- Scoring system (1-100) based on multiple criteria
- Identification of candidate strengths and weaknesses
- Role prediction based on skills and experience
- Fallback analysis when AI service is unavailable

### 3. Background Processing
- Asynchronous AI analysis queue
- Non-blocking application submission
- Automatic retry with fallback analysis on failure
- Status tracking throughout analysis process

### 4. Admin Dashboard Enhancements
- AI score column in applications table
- Visual indicators for analysis status
- Color-coded scoring (green: 80+, orange: 60-79, red: <60)
- Real-time status updates

### 5. Candidate Details Page
- Comprehensive AI analysis section
- Visual score representation with progress bar
- Detailed strengths and weaknesses display
- Predicted role recommendations
- Status indicators for ongoing analysis

## How It Works

1. **Resume Upload**: When a candidate submits an application with a resume
2. **Queue Analysis**: The system queues the resume for AI analysis
3. **Text Extraction**: Extract text from PDF/DOCX files
4. **AI Analysis**: Send resume data to Grok API for analysis
5. **Store Results**: Save AI analysis results in database
6. **Display**: Show analysis results in admin dashboard and candidate details

## Testing the Integration

1. Submit a new application with a resume upload
2. Check that the application appears in admin dashboard with "Analyzing..." status
3. Wait for background processing (check console logs)
4. Refresh admin dashboard to see AI score
5. Click on candidate details to see full analysis
6. Verify that analysis includes score, strengths, weaknesses, and role prediction

## Troubleshooting

### Common Issues:

1. **PDF extraction fails**: Ensure `pdf-parse` is installed correctly
2. **DOCX extraction fails**: Ensure `mammoth` is installed correctly
3. **AI analysis fails**: Check Grok API key and network connectivity
4. **Analysis stuck in processing**: Check backend console for errors

### Fallback Behavior:

- If AI analysis fails, a basic fallback analysis is created based on CGPA, skills count, and experience length
- Application submission never fails due to AI analysis issues
- Failed analysis is marked as 'failed' in database with fallback results

## API Endpoints Updated

- `POST /api/applications` - Now triggers AI analysis queue
- `GET /api/applications` - Returns AI analysis data
- `GET /api/applications/:id` - Returns detailed AI analysis
- `GET /api/admin/export` - Includes AI score in exports

## Security Considerations

- Grok API key should be stored securely in environment variables
- Resume files are processed locally and deleted after analysis
- AI analysis results are stored securely in database
- No sensitive data is sent to external AI service beyond resume content

## Performance Notes

- AI analysis runs asynchronously to avoid blocking application submission
- Queue processes one analysis at a time to manage API rate limits
- Failed analyses automatically fall back to basic scoring
- Database indexes added for efficient AI score queries
