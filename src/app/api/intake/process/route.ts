import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import OpenAI from 'openai';

// Initialize Azure OpenAI client
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': '2024-02-15-preview' },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
});

// Rate limiting setup
let lastRequestTime = 0;
const minRequestInterval = 1250; // 1.25 seconds (to stay under 48 requests/minute)

export async function POST(req: NextRequest) {
  try {
    // Basic rate limiting
    const now = Date.now();
    if (now - lastRequestTime < minRequestInterval) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a moment.' },
        { status: 429 }
      );
    }
    lastRequestTime = now;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from document
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No text could be extracted from the document'
      }, { status: 400 });
    }

    try {
      console.log('Calling Azure OpenAI...');
      // Call Azure OpenAI with proper error handling
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: "system",
            content: `You are a precise document parser for legal intake forms. You must extract ALL fields exactly as they appear in the New Case form:

            CLIENT INFORMATION:
            - First Name (required)
            - Last Name (required)
            - Date of Birth (required, format: YYYY-MM-DD)
            - Accident Date (required, format: YYYY-MM-DD)

            CONTACT INFORMATION:
            - Address (full address including postal code)
            - Cell Phone (format: XXX-XXX-XXXX)
            - Home Phone (format: XXX-XXX-XXXX)
            - Work Phone (format: XXX-XXX-XXXX)
            - Email
            - Emergency Contact:
              * Name
              * Phone Number
              * Email

            AUTOMOBILE INSURANCE:
            - Insurance Company (exact company name)
            - Policy Holder Name
            - Claim Number (if available)
            - Policy Number (exact format as shown)
            - Adjuster Information (name and contact)

            DEFENDANT INSURANCE:
            - Insurance Company
            - Policy Holder Name
            - Policy Number
            - Vehicle Information (make, model, year)

            CASE DETAILS:
            - Type of Accident (MUST be "mva", "slip-and-fall", "dog-bite", "ltd", or "other")
            - AB Case Type (MUST be "mig", "non-mig", or "cat")
            - Driver/Passenger (MUST be "driver" or "passenger")
            - Injuries Sustained (detailed list)
            - Pre-Existing Injuries (all previous conditions)
            - Details of Accident (full description)
            - Family Doctor (name and full address)
            - Specialist (all medical specialists involved)
            - Initial Diagnosis (specific injuries)
            - Hospital Attended (name and location)
            - Clinics (all treatment facilities)

            POLICE & WITNESS INFORMATION:
            - Witness Information (names and contacts)
            - Police Report Available (true/false)
            - Officer Name
            - Police Report Number
            - Client Charged (yes/no)
            - Third Party Charged (yes/no)

            COLLATERAL BENEFITS:
            - STD/LTD Available (yes/no)
            - Carrier Name
            - Policy Number
            - Extended Health Benefits (yes/no)
            - Benefits Amount`
          },
          {
            role: "user",
            content: `Extract ALL information from this intake form and map it exactly to the New Case form fields.

            CRITICAL REQUIREMENTS:
            1. ALL phone numbers must be extracted (Cell, Home, Work)
            2. ALL insurance information must be captured exactly as written
            3. ALL police report information must be included
            4. Dropdown fields must use EXACT values:
               - Type of Accident: "mva", "slip-and-fall", "dog-bite", "ltd", or "other"
               - AB Case Type: "mig", "non-mig", or "cat"
               - Driver/Passenger: "driver" or "passenger"

            Return this exact JSON structure:
            {
              "clientInformation": {
                "name": "",        // Combine First and Last name
                "dateOfBirth": "", // YYYY-MM-DD format
                "accidentDate": "" // YYYY-MM-DD format
              },
              "contactInformation": {
                "address": "",     // Full address with postal code
                "cellPhone": "",   // Primary phone number if type unclear
                "homePhone": "",   // Home phone if specified
                "workPhone": "",   // Work phone if specified
                "email": "",       // Email address
                "emergencyContact": {
                  "name": "",      // Emergency contact full name
                  "number": "",    // Emergency contact phone
                  "email": ""      // Emergency contact email
                }
              },
              "automobileInsurance": {
                "insuranceCompany": "", // Exact company name
                "policyHolder": "",     // Policy holder's full name
                "claimNumber": "",      // Claim number if available
                "policyNumber": "",     // Exact policy number
                "adjuster": ""          // Adjuster's name/info
              },
              "defendantInsurance": {
                "insuranceCompany": "", // Other party's insurance
                "policyHolder": "",     // Other party's name
                "policyNumber": "",     // Other party's policy number
                "vehicleInfo": ""       // Other vehicle details
              },
              "caseDetails": {
                "accidentType": "",     // MUST be exact dropdown value
                "abCaseType": "",       // MUST be exact dropdown value
                "driverPassenger": "",   // MUST be exact dropdown value
                "injuries": "",         // All current injuries
                "preExistingInjuries": "", // Previous medical conditions
                "accidentDetails": "",  // Full accident description
                "familyDoctor": "",     // Doctor's name and address
                "specialist": "",       // All specialists involved
                "initialDiagnosis": "", // Initial medical assessment
                "hospitalAttended": "", // Hospital name and location
                "clinics": ""          // All treatment facilities
              },
              "policeWitnessInformation": {
                "witnessInfo": "",      // All witness details
                "policeReportAvailable": false,
                "officerName": "",      // Officer's name
                "policeReportNumber": "", // Report/incident number
                "clientCharged": "no",  // yes/no only
                "thirdPartyCharged": "no" // yes/no only
              },
              "collateralBenefits": {
                "stdLtd": "no",         // yes/no only
                "carrierName": "",      // Insurance carrier name
                "policyNumber": "",     // Benefits policy number
                "extendedHealthBenefits": "no", // yes/no only
                "benefitsAmount": ""    // Amount of benefits
              }
            }

            Document text to analyze:
            ${text}

            IMPORTANT:
            1. Extract EVERY piece of information found in the document
            2. Do not skip any fields that have information available
            3. Use exact values for dropdown fields
            4. Maintain exact formatting for dates (YYYY-MM-DD)
            5. Include ALL phone numbers found
            6. Include ALL insurance details found
            7. Include ALL police report information found`
          }
        ],
        temperature: 0,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      console.log('OpenAI Response received');

      // Validate response
      const completion = response.choices[0].message?.content;
      if (!completion) {
        throw new Error('No completion received from Azure OpenAI');
      }

      // Parse and validate JSON response
      const extractedData = JSON.parse(completion);

      // Log success (remove in production)
      console.log('Document processed successfully');

      return NextResponse.json({
        success: true,
        data: extractedData
      });

    } catch (aiError) {
      console.error('Azure OpenAI Error:', aiError);
      
      // Check for specific Azure OpenAI errors
      if (aiError instanceof Error) {
        if (aiError.message.includes('rate limit')) {
          return NextResponse.json({
            success: false,
            error: 'Rate limit exceeded. Please try again in a moment.'
          }, { status: 429 });
        }
        if (aiError.message.includes('token')) {
          return NextResponse.json({
            success: false,
            error: 'Document is too large to process.'
          }, { status: 413 });
        }
      }

      return NextResponse.json({
        success: false,
        error: 'Error processing document with AI',
        details: aiError instanceof Error ? aiError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('General Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error processing document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 