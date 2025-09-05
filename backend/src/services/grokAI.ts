import axios from 'axios';
import { extractTextFromFile, preprocessTextForAI, validateTextForAnalysis, validateResumeContent } from '../utils/textExtraction';

// Grok API configuration
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

// Always read the API key fresh from environment
function getGrokApiKey(): string {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('GROK_API_KEY environment variable is not set');
  }
  return apiKey;
}

export interface AIAnalysisResult {
  score: number; // 1-100
  strengths: string[];
  weaknesses: string[];
  prediction: string;
  analysisDetails: string;
  success: boolean;
  error?: string;
  validation?: {
    isValid: boolean;
    issues: string[];
    confidence: number;
    matchScore: number;
  };
}

export interface ResumeAnalysisRequest {
  resumeText: string;
  candidateInfo: {
    name: string;
    specialization: string;
    college: string;
    cgpa: number;
    skills: string[];
    experience: string;
  };
}

/**
 * Create the prompt for Grok AI analysis
 */
function createAnalysisPrompt(request: ResumeAnalysisRequest): string {
  // Handle missing or insufficient resume content
  let resumeContent = request.resumeText?.trim();
  if (!resumeContent || resumeContent.length < 50) {
    resumeContent = "Resume content not available or insufficient for detailed analysis.";
  }
  
  return `You are an expert MBA recruitment consultant analyzing a candidate for an MBA internship position at YugaYatra Retail (OPC) Private Limited. Please provide a comprehensive and professional assessment.

CANDIDATE INFORMATION:
- Name: ${request.candidateInfo.name}
- Specialization: ${request.candidateInfo.specialization}
- College: ${request.candidateInfo.college}
- CGPA: ${request.candidateInfo.cgpa}/10.0
- Key Skills: ${request.candidateInfo.skills.join(', ')}
- Experience Summary: ${request.candidateInfo.experience}

RESUME CONTENT:
${resumeContent}

IMPORTANT INSTRUCTIONS:
1. Use only professional and respectful language in your analysis
2. For missing resume content, use terms like "N/A", "Not Available", or "Not Provided" - never informal or derogatory terms
3. Focus on available information when resume content is limited
4. Provide constructive feedback that helps the candidate improve
5. Base predictions on the candidate's stated specialization and qualifications

Please provide your analysis in the following JSON format (respond ONLY with valid JSON):

{
  "score": <number between 1-100>,
  "strengths": [
    "<specific professional strength 1>",
    "<specific professional strength 2>",
    "<specific professional strength 3>",
    "<specific professional strength 4>",
    "<specific professional strength 5>"
  ],
  "weaknesses": [
    "<constructive area for improvement 1>",
    "<constructive area for improvement 2>",
    "<constructive area for improvement 3>"
  ],
  "prediction": "<predicted best-fit role based on available information>",
  "analysisDetails": "<professional 2-3 sentence analysis of candidate's potential based on available information>"
}

SCORING CRITERIA (1-100):
- 90-100: Exceptional candidate, top 5% - outstanding achievements, perfect fit
- 80-89: Excellent candidate, top 15% - strong qualifications, very good fit  
- 70-79: Good candidate, top 30% - solid qualifications, good potential
- 60-69: Average candidate, meets basic requirements
- 50-59: Developing candidate with growth potential
- Below 50: Requires significant development, may not be suitable for current role

EVALUATION FOCUS:
1. Academic performance and educational background
2. Relevant experience and achievements (if resume available)
3. Skills alignment with retail/business roles
4. Leadership and project management experience
5. Communication and analytical abilities
6. Career progression potential and growth mindset

When resume content is unavailable or insufficient, focus on the candidate information provided and use professional language such as "Resume not available for detailed assessment" rather than informal terms.`;
}

/**
 * Call Grok AI API for resume analysis
 */
async function callGrokAPI(prompt: string): Promise<any> {
  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a professional MBA recruitment consultant conducting candidate evaluations. Use only professional, respectful language. For missing information, use terms like "N/A", "Not Available", or "Not Provided". Never use informal, casual, or derogatory terms. Respond only with valid JSON format as requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${getGrokApiKey()}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const content = response.data.choices[0].message.content.trim();
      
      // Try to parse the JSON response
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse Grok AI response as JSON:', content);
        throw new Error('Invalid JSON response from AI');
      }
    } else {
      throw new Error('Invalid response structure from Grok API');
    }
  } catch (error) {
    console.error('Grok API call failed:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Grok API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('No response from Grok API - network issue');
      }
    }
    
    throw error;
  }
}

/**
 * Validate AI response format
 */
function validateAIResponse(response: any): AIAnalysisResult | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const { score, strengths, weaknesses, prediction, analysisDetails } = response;

  // Validate score
  if (typeof score !== 'number' || score < 1 || score > 100) {
    return null;
  }

  // Validate strengths
  if (!Array.isArray(strengths) || strengths.length === 0 || 
      strengths.some(s => typeof s !== 'string' || s.trim().length === 0)) {
    return null;
  }

  // Validate weaknesses
  if (!Array.isArray(weaknesses) || weaknesses.length === 0 ||
      weaknesses.some(w => typeof w !== 'string' || w.trim().length === 0)) {
    return null;
  }

  // Validate prediction and analysis details
  if (typeof prediction !== 'string' || prediction.trim().length === 0 ||
      typeof analysisDetails !== 'string' || analysisDetails.trim().length === 0) {
    return null;
  }

  return {
    score,
    strengths: strengths.map(s => s.trim()),
    weaknesses: weaknesses.map(w => w.trim()),
    prediction: prediction.trim(),
    analysisDetails: analysisDetails.trim(),
    success: true
  };
}

/**
 * Analyze resume using Grok AI
 */
export async function analyzeResumeWithGrok(request: ResumeAnalysisRequest): Promise<AIAnalysisResult> {
  try {
    // Validate input
    if (!request.resumeText || request.resumeText.trim().length === 0) {
      throw new Error('Resume text is required for analysis');
    }

    // Validate text quality
    const validation = validateTextForAnalysis(request.resumeText);
    if (!validation.isValid) {
      throw new Error(validation.reason || 'Resume text is not suitable for analysis');
    }

    // Preprocess text
    const cleanedText = preprocessTextForAI(request.resumeText);

    // Create analysis request
    const analysisRequest: ResumeAnalysisRequest = {
      ...request,
      resumeText: cleanedText
    };

    // Generate prompt
    const prompt = createAnalysisPrompt(analysisRequest);

    // Call Grok API
    const grokResponse = await callGrokAPI(prompt);

    // Validate and format response
    const validatedResult = validateAIResponse(grokResponse);
    
    if (!validatedResult) {
      throw new Error('Invalid response format from AI service');
    }

    return validatedResult;

  } catch (error) {
    console.error('Resume analysis failed:', error);
    
    return {
      score: 0,
      strengths: [],
      weaknesses: [],
      prediction: '',
      analysisDetails: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown analysis error'
    };
  }
}

/**
 * Analyze resume from file path
 */
export async function analyzeResumeFromFile(filePath: string, candidateInfo: ResumeAnalysisRequest['candidateInfo']): Promise<AIAnalysisResult> {
  try {
    // Extract text from file
    const extractionResult = await extractTextFromFile(filePath);
    
    if (!extractionResult.success || !extractionResult.text) {
      console.log(`❌ Text extraction failed for ${candidateInfo.name}: ${extractionResult.error}`);
      
      // Check if it's a file not found vs extraction issue
      const isFileNotFound = extractionResult.error?.includes('File not found') || 
                             extractionResult.error?.includes('not found') ||
                             extractionResult.error?.includes('ENOENT');
      
      if (isFileNotFound) {
        // Use no-resume analysis for missing files
        console.log(`📄 No resume file available for ${candidateInfo.name}, using no-resume analysis`);
        const noResumeAnalysis = createNoResumeAnalysis(candidateInfo);
        return {
          ...noResumeAnalysis,
          validation: {
            isValid: false,
            issues: ['Resume file not available'],
            confidence: 0,
            matchScore: 0
          },
          error: 'Resume not provided - analysis based on application form data only'
        };
      } else {
        // Use fallback analysis for extraction failures
        const fallback = createFallbackAnalysis(candidateInfo);
        return {
          ...fallback,
          validation: {
            isValid: false,
            issues: ['Resume text extraction failed'],
            confidence: 10,
            matchScore: 0
          },
          error: extractionResult.error || 'Failed to extract text from resume file'
        };
      }
    }

    // Validate resume content against candidate info
    const validation = validateResumeContent(
      extractionResult.text,
      candidateInfo.name,
      candidateInfo.specialization
    );
    
    console.log(`🔍 Validation for ${candidateInfo.name}: Valid=${validation.isValid}, Confidence=${validation.confidence}%, Match=${validation.matchScore}%`);
    if (validation.issues.length > 0) {
      console.log(`⚠️ Issues found: ${validation.issues.join(', ')}`);
    }

    // Always try AI analysis first, but have fallback ready
    let aiResult: AIAnalysisResult;
    
    try {
      // Proceed with AI analysis
      aiResult = await analyzeResumeWithGrok({
        resumeText: extractionResult.text,
        candidateInfo
      });
      
      // If AI succeeds, adjust score based on validation confidence
      if (aiResult.success && validation.confidence < 70) {
        const adjustedScore = Math.round(aiResult.score * (validation.confidence / 100));
        console.log(`📉 Adjusted AI score from ${aiResult.score} to ${adjustedScore} based on validation confidence`);
        aiResult.score = adjustedScore;
      }
      
    } catch (error) {
      console.log(`🔄 AI analysis failed, using fallback analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
      aiResult = createFallbackAnalysis(candidateInfo);
    }
    
    // If AI failed or validation confidence is very low, ensure we use fallback
    if (!aiResult.success || validation.confidence < 30) {
      console.log(`⚠️ Using fallback analysis due to ${!aiResult.success ? 'AI failure' : `low confidence (${validation.confidence}%)`}`);
      const fallback = createFallbackAnalysis(candidateInfo);
      return {
        ...fallback,
        validation,
        analysisDetails: `Fallback analysis used due to: ${!aiResult.success ? 'AI processing issues' : 'resume content issues'}. ${validation.issues.join(', ')}. ${fallback.analysisDetails}`
      };
    }
    
    return {
      ...aiResult,
      validation
    };

  } catch (error) {
    console.error('File-based resume analysis failed:', error);
    
    const fallback = createFallbackAnalysis(candidateInfo);
    return {
      ...fallback,
      validation: {
        isValid: false,
        issues: ['Analysis process failed'],
        confidence: 10,
        matchScore: 0
      },
      error: error instanceof Error ? error.message : 'Unknown file analysis error'
    };
  }
}

/**
 * Create a fallback analysis when AI service fails
 */
export function createFallbackAnalysis(candidateInfo: ResumeAnalysisRequest['candidateInfo']): AIAnalysisResult {
  // Professional scoring based on available candidate information
  let score = 55; // Base score - slightly above average
  
  // Adjust based on CGPA (academic performance)
  if (candidateInfo.cgpa >= 8.5) {
    score += 20;
  } else if (candidateInfo.cgpa >= 7.5) {
    score += 15;
  } else if (candidateInfo.cgpa >= 6.5) {
    score += 10;
  } else if (candidateInfo.cgpa >= 6.0) {
    score += 5;
  }
  
  // Adjust based on skills diversity
  if (candidateInfo.skills.length >= 8) {
    score += 10;
  } else if (candidateInfo.skills.length >= 5) {
    score += 7;
  } else if (candidateInfo.skills.length >= 3) {
    score += 3;
  }
  
  // Adjust based on experience detail
  if (candidateInfo.experience.length > 200) {
    score += 8;
  } else if (candidateInfo.experience.length > 100) {
    score += 5;
  } else if (candidateInfo.experience.length > 50) {
    score += 2;
  }
  
  // Ensure score is within professional bounds
  score = Math.min(Math.max(score, 30), 85); // Cap at 85 for fallback analysis
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Generate professional strengths based on available data
  if (candidateInfo.cgpa >= 8.0) {
    strengths.push('Excellent academic performance demonstrating strong analytical capabilities');
  } else if (candidateInfo.cgpa >= 7.0) {
    strengths.push('Good academic foundation with solid performance record');
  } else if (candidateInfo.cgpa >= 6.0) {
    strengths.push('Adequate academic background meeting program requirements');
  }
  
  if (candidateInfo.skills.length >= 6) {
    strengths.push('Well-rounded skill portfolio applicable to business environments');
  } else if (candidateInfo.skills.length >= 3) {
    strengths.push('Focused skill set relevant to chosen specialization');
  }
  
  strengths.push(`Specialized knowledge in ${candidateInfo.specialization} field`);
  
  if (candidateInfo.experience.length > 150) {
    strengths.push('Comprehensive experience summary indicating professional engagement');
  }
  
  if (candidateInfo.college && candidateInfo.college.trim().length > 0) {
    strengths.push(`Educational background from ${candidateInfo.college}`);
  }
  
  // Ensure we have at least 3 strengths
  if (strengths.length < 3) {
    strengths.push('Demonstrates interest in professional development through program application');
  }
  
  // Generate constructive areas for improvement
  if (candidateInfo.cgpa < 7.0 && candidateInfo.cgpa > 0) {
    weaknesses.push('Academic performance indicates opportunity for stronger analytical development');
  }
  
  if (candidateInfo.skills.length < 4) {
    weaknesses.push('Limited skill portfolio mentioned - expanding technical and soft skills would be beneficial');
  }
  
  if (candidateInfo.experience.length < 100) {
    weaknesses.push('Experience summary could be more detailed to better showcase professional background');
  }
  
  // Professional limitation note
  weaknesses.push('Detailed resume analysis not available - comprehensive evaluation requires additional documentation');
  
  // Ensure we have exactly 3 weaknesses for consistency
  while (weaknesses.length < 3) {
    weaknesses.push('Portfolio development recommended to strengthen application profile');
  }
  
  return {
    score,
    strengths: strengths.slice(0, 5), // Limit to 5 strengths
    weaknesses: weaknesses.slice(0, 3), // Limit to 3 weaknesses
    prediction: `${candidateInfo.specialization} Associate/Analyst role based on educational specialization`,
    analysisDetails: `Candidate demonstrates academic foundation in ${candidateInfo.specialization} with CGPA of ${candidateInfo.cgpa}/10.0. Assessment based on available application information. Comprehensive evaluation would benefit from detailed resume review and additional documentation.`,
    success: true
  };
}

/**
 * Create analysis for applications with no resume uploaded
 */
export function createNoResumeAnalysis(candidateInfo: ResumeAnalysisRequest['candidateInfo']): AIAnalysisResult {
  // Conservative scoring based only on application form data
  let score = 45; // Lower base score when no resume provided
  
  // Adjust based on CGPA
  if (candidateInfo.cgpa >= 8.5) {
    score += 15;
  } else if (candidateInfo.cgpa >= 7.5) {
    score += 12;
  } else if (candidateInfo.cgpa >= 6.5) {
    score += 8;
  } else if (candidateInfo.cgpa >= 6.0) {
    score += 4;
  }
  
  // Modest adjustment for skills (since no resume to verify)
  if (candidateInfo.skills.length >= 6) {
    score += 5;
  } else if (candidateInfo.skills.length >= 3) {
    score += 3;
  }
  
  // Small adjustment for experience detail
  if (candidateInfo.experience.length > 150) {
    score += 3;
  } else if (candidateInfo.experience.length > 75) {
    score += 2;
  }
  
  // Cap score appropriately for no-resume cases
  score = Math.min(Math.max(score, 25), 70);
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Generate strengths based on available information only
  if (candidateInfo.cgpa >= 7.5) {
    strengths.push('Strong academic performance as indicated in application');
  } else if (candidateInfo.cgpa >= 6.5) {
    strengths.push('Satisfactory academic performance meeting program requirements');
  }
  
  if (candidateInfo.skills.length >= 4) {
    strengths.push('Multiple skills listed showing diverse interests');
  }
  
  strengths.push(`Educational focus in ${candidateInfo.specialization} aligns with program objectives`);
  
  if (candidateInfo.experience.length > 100) {
    strengths.push('Provided experience summary in application form');
  }
  
  strengths.push('Completed application process demonstrating program interest');
  
  // Areas for improvement - professional and constructive
  weaknesses.push('Resume not provided - detailed evaluation of professional background not available');
  weaknesses.push('Assessment limited to application form information only');
  weaknesses.push('Professional experience and achievements require documentation for comprehensive review');
  
  return {
    score,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 3),
    prediction: `Entry-level ${candidateInfo.specialization} role based on academic specialization`,
    analysisDetails: `Assessment based solely on application form data as resume not provided. Candidate shows interest in ${candidateInfo.specialization} field with CGPA of ${candidateInfo.cgpa}/10.0. Complete evaluation requires resume submission and additional documentation.`,
    success: true
  };
}
