import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

// For DOC/DOCX files, we'll use mammoth for DOCX and textract for DOC
import mammoth from 'mammoth';

export interface ExtractedText {
  text: string;
  success: boolean;
  error?: string;
  wordCount?: number;
}

/**
 * Extract text from PDF files with multiple fallback methods
 */
async function extractFromPDF(filePath: string): Promise<ExtractedText> {
  let extractedText = '';
  let lastError: string = '';
  
  // Method 1: Try pdf-parse (current method)
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer, {
      // Add options for better extraction
      max: 0 // No page limit
    });
    
    extractedText = data.text?.trim() || '';
    
    if (extractedText.length > 50) {
      console.log(`✅ PDF extraction successful with pdf-parse: ${extractedText.length} characters`);
      return {
        text: extractedText,
        success: true,
        wordCount: extractedText.split(/\s+/).length
      };
    }
    lastError = `pdf-parse extracted only ${extractedText.length} characters`;
  } catch (error) {
    lastError = `pdf-parse failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.log('❌ pdf-parse failed:', lastError);
  }
  
  // Method 2: Try raw text extraction from PDF structure
  try {
    const fileContent = fs.readFileSync(filePath, 'binary');
    
    // Extract text between common PDF text markers
    const textPatterns = [
      /\(([^)]+)\)\s*Tj/g,  // Text showing operators
      /\[([^\]]+)\]\s*TJ/g,  // Text array showing operators
      /BT\s*([\s\S]*?)\s*ET/g, // Text objects
    ];
    
    let rawText = '';
    for (const pattern of textPatterns) {
      const matches = fileContent.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Clean up the extracted text
          const cleaned = match
            .replace(/\([^)]*\)|\[[^\]]*\]|BT|ET|Tj|TJ/g, '')
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          if (cleaned.length > 3) {
            rawText += cleaned + ' ';
          }
        });
      }
    }
    
    if (rawText.length > 50) {
      console.log(`✅ PDF extraction successful with raw text method: ${rawText.length} characters`);
      return {
        text: rawText.trim(),
        success: true,
        wordCount: rawText.trim().split(/\s+/).length
      };
    }
    lastError += ` | Raw extraction: ${rawText.length} characters`;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    lastError += ` | Raw extraction failed: ${errorMsg}`;
    console.log('❌ Raw text extraction failed:', errorMsg);
  }
  
  // Method 3: Return file info as fallback
  try {
    const stats = fs.statSync(filePath);
    const filename = path.basename(filePath);
    const fallbackText = `[PDF EXTRACTION FAILED] Resume file: ${filename}, Size: ${(stats.size / 1024).toFixed(1)}KB. Manual review required - text extraction unsuccessful.`;
    
    console.log('⚠️ All PDF extraction methods failed, returning fallback info');
    return {
      text: fallbackText,
      success: false,
      error: lastError,
      wordCount: fallbackText.split(/\s+/).length
    };
  } catch (error) {
    return {
      text: '',
      success: false,
      error: `Complete PDF extraction failure: ${lastError}`,
      wordCount: 0
    };
  }
}

/**
 * Extract text from DOCX files
 */
async function extractFromDOCX(filePath: string): Promise<ExtractedText> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value.trim();
    
    return {
      text,
      success: true,
      wordCount: text.split(/\s+/).length
    };
  } catch (error) {
    console.error('Error extracting DOCX text:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown DOCX extraction error'
    };
  }
}

/**
 * Extract text from DOC files (legacy format)
 * For DOC files, we'll try a simple approach first
 */
async function extractFromDOC(filePath: string): Promise<ExtractedText> {
  try {
    // For DOC files, we'll need to use a more complex approach
    // For now, let's return an error and suggest DOCX conversion
    return {
      text: '',
      success: false,
      error: 'DOC files are not fully supported. Please convert to DOCX or PDF format.'
    };
  } catch (error) {
    console.error('Error extracting DOC text:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown DOC extraction error'
    };
  }
}

/**
 * Main function to extract text from various file formats
 */
export async function extractTextFromFile(filePath: string): Promise<ExtractedText> {
  if (!fs.existsSync(filePath)) {
    return {
      text: '',
      success: false,
      error: 'File not found'
    };
  }

  const fileExtension = path.extname(filePath).toLowerCase();
  
  switch (fileExtension) {
    case '.pdf':
      return await extractFromPDF(filePath);
    case '.docx':
      return await extractFromDOCX(filePath);
    case '.doc':
      return await extractFromDOC(filePath);
    default:
      return {
        text: '',
        success: false,
        error: `Unsupported file format: ${fileExtension}`
      };
  }
}

/**
 * Clean and prepare text for AI analysis
 */
export function preprocessTextForAI(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .replace(/[^\w\s\n.,;:()!?-]/g, '') // Remove special characters but keep basic punctuation
    .trim();
}

/**
 * Validate if extracted text is sufficient for analysis
 */
export function validateTextForAnalysis(text: string): { isValid: boolean; reason?: string } {
  const minWordCount = 50; // Minimum words required for meaningful analysis
  const wordCount = text.trim().split(/\s+/).length;
  
  if (wordCount < minWordCount) {
    return {
      isValid: false,
      reason: `Resume text too short (${wordCount} words). Minimum ${minWordCount} words required for analysis.`
    };
  }
  
  // Check for basic resume content indicators
  const resumeKeywords = [
    'experience', 'education', 'skills', 'work', 'job', 'position',
    'university', 'degree', 'bachelor', 'master', 'project', 'internship'
  ];
  
  const lowerText = text.toLowerCase();
  const foundKeywords = resumeKeywords.filter(keyword => lowerText.includes(keyword));
  
  if (foundKeywords.length < 3) {
    return {
      isValid: false,
      reason: 'Text does not appear to be a resume. Please ensure you uploaded the correct file.'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate resume content against applicant information
 */
export function validateResumeContent(extractedText: string, applicantName: string, specialization: string): {
  isValid: boolean;
  issues: string[];
  confidence: number;
  matchScore: number;
} {
  const issues: string[] = [];
  let confidence = 100;
  let matchScore = 100;
  
  // Check if text is too short or extraction failed
  if (extractedText.includes('[PDF EXTRACTION FAILED]')) {
    issues.push('PDF text extraction failed - manual review required');
    confidence = 10;
    matchScore = 0;
  } else if (extractedText.length < 100) {
    issues.push('Resume text is too short (possible extraction failure)');
    confidence -= 40;
    matchScore -= 30;
  }
  
  // Check if applicant name appears in resume
  const nameParts = applicantName.toLowerCase().split(' ').filter(part => part.length > 2);
  const textLower = extractedText.toLowerCase();
  const nameMatches = nameParts.filter(part => textLower.includes(part)).length;
  
  if (nameParts.length > 0 && nameMatches === 0 && extractedText.length > 100) {
    issues.push(`Applicant name "${applicantName}" not found in resume content`);
    confidence -= 30;
    matchScore -= 40;
  } else if (nameMatches > 0) {
    matchScore += 10; // Bonus for name match
  }
  
  // Check for relevant keywords based on specialization
  const specializationKeywords: { [key: string]: string[] } = {
    'data analytics': ['data', 'analytics', 'analysis', 'python', 'sql', 'statistics', 'tableau', 'excel', 'machine learning', 'visualization'],
    'international business': ['business', 'international', 'global', 'trade', 'export', 'import', 'market', 'commerce', 'cross-border'],
    'marketing': ['marketing', 'brand', 'campaign', 'advertising', 'promotion', 'digital', 'social media', 'content', 'seo'],
    'finance': ['finance', 'financial', 'accounting', 'investment', 'banking', 'budget', 'audit', 'portfolio', 'risk'],
    'operations': ['operations', 'supply', 'logistics', 'process', 'management', 'efficiency', 'optimization', 'lean'],
    'human resources': ['human', 'resources', 'hr', 'recruitment', 'talent', 'employee', 'personnel', 'payroll', 'training'],
    'hr': ['human', 'resources', 'hr', 'recruitment', 'talent', 'employee', 'personnel', 'payroll', 'training'],
    'consulting': ['consulting', 'consultant', 'advisory', 'strategy', 'analysis', 'project', 'client', 'solution'],
    'it': ['technology', 'software', 'programming', 'development', 'computer', 'system', 'network', 'database'],
    'general management': ['management', 'leadership', 'strategy', 'planning', 'coordination', 'team', 'project']
  };
  
  const keywords = specializationKeywords[specialization.toLowerCase()] || 
                   specializationKeywords['general management'];
  const keywordMatches = keywords.filter(keyword => textLower.includes(keyword));
  
  if (keywords.length > 0) {
    const keywordMatchRatio = keywordMatches.length / keywords.length;
    if (keywordMatchRatio === 0) {
      issues.push(`No relevant keywords found for ${specialization}`);
      confidence -= 25;
      matchScore -= 30;
    } else if (keywordMatchRatio < 0.2) {
      issues.push(`Few relevant keywords found for ${specialization} (${keywordMatches.length}/${keywords.length})`);
      confidence -= 15;
      matchScore -= 20;
    } else {
      // Bonus for good keyword match
      matchScore += Math.round(keywordMatchRatio * 20);
    }
  }
  
  // Check for basic resume structure
  const structureKeywords = ['education', 'experience', 'skills', 'contact', 'email', 'phone'];
  const structureMatches = structureKeywords.filter(keyword => textLower.includes(keyword));
  
  if (structureMatches.length < 3) {
    issues.push('Resume appears to be missing standard sections (education, experience, skills)');
    confidence -= 10;
    matchScore -= 10;
  }
  
  return {
    isValid: issues.length === 0 && confidence > 50,
    issues,
    confidence: Math.max(0, confidence),
    matchScore: Math.max(0, Math.min(100, matchScore))
  };
}
