// src/lib/services/document-parser.ts

export interface ParsedDocument {
  clientInformation: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    accidentDate: string;
    maritalStatus?: string;
    healthCardNo?: string;
    sin?: string;
    placeOfBirth?: string;
    yearImmigrated?: string;
    primaryLanguage?: string;
  };
  contactInformation: {
    address: string;
    cellPhone: string;
    homePhone?: string;
    workPhone?: string;
    email: string;
    emergencyContact?: {
      name: string;
      number: string;
      email: string;
    };
  };
  automobileInsurance: {
    insuranceCompany: string;
    policyNumber: string;
    policyHolder: string;
    vehicleInfo?: {
      make: string;
      model: string;
      year: string;
      plateNo: string;
    };
  };
  defendantInsurance: {
    insuranceCompany: string;
    policyNumber?: string;
    policyHolder?: string;
    vehicleInfo?: {
      make: string;
      model: string;
      year: string;
      plateNo: string;
    };
  };
  accidentDetails: {
    type: string;
    date: string;
    time: string;
    location: string;
    description: string;
    occupants?: number;
    wasAtWork?: boolean;
    wsibClaim?: boolean;
    policeReport?: {
      filed: boolean;
      reportNumber?: string;
      officerName?: string;
      officerBadge?: string;
      charges?: string;
    };
  };
  injuries: {
    description: string;
    ambulanceRequired: boolean;
    hospital?: string;
    familyDoctor?: {
      name: string;
      clinic: string;
      address: string;
    };
    specialists?: string[];
    physiotherapy?: {
      started: boolean;
      clinic?: string;
    };
    preExisting?: string[];
    psychological?: string[];
  };
  witnesses?: Array<{
    name: string;
    address?: string;
    phone?: string;
  }>;
  employment: {
    currentEmployer?: {
      name: string;
      position: string;
      startDate: string;
      hourlyRate?: number;
      hoursPerWeek?: number;
      address?: string;
      contact?: string;
    };
    preventedFromWorking?: boolean;
    returnToWork?: {
      date?: string;
      modified?: boolean;
    };
    weeklyIncome?: {
      last4Weeks?: number;
      last52Weeks?: number;
    };
  };
  collateralBenefits?: {
    shortTermDisability?: {
      available: boolean;
      carrier?: string;
      policyNumber?: string;
      amount?: string;
    };
    longTermDisability?: {
      available: boolean;
      carrier?: string;
      policyNumber?: string;
      amount?: string;
    };
    extendedHealth?: {
      available: boolean;
      carrier?: string;
      policyNumber?: string;
      amount?: string;
    };
  };
}

export class DocumentParser {
  private static extractDate(text: string, pattern: RegExp): string {
    const match = text.match(pattern);
    return match ? match[1] : '';
  }

  private static extractPhoneNumber(text: string, pattern: RegExp): string {
    const match = text.match(pattern);
    return match ? match[1].replace(/[^\d]/g, '') : '';
  }

  private static extractSection(text: string, startMarker: string, endMarker: string): string {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';
    
    const endIndex = text.indexOf(endMarker, startIndex);
    if (endIndex === -1) return '';
    
    return text.substring(startIndex + startMarker.length, endIndex).trim();
  }

  static async parseIntakeForm(text: string): Promise<ParsedDocument> {
    // Remove special characters and normalize whitespace
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');

    const parsed: ParsedDocument = {
      clientInformation: {
        firstName: this.extractValue(text, /Name:\s*([\w\s]+)/)?.split(' ')[0] || '',
        lastName: this.extractValue(text, /Name:\s*([\w\s]+)/)?.split(' ')[1] || '',
        dateOfBirth: this.extractDate(text, /Date of Birth:\s*(\d{4}-\d{2}-\d{2})/),
        accidentDate: this.extractDate(text, /Date of Accident or Loss:\s*(\d{4}-\d{2}-\d{2})/),
        healthCardNo: this.extractValue(text, /Health Card No\.:\s*([^\n]+)/),
        sin: this.extractValue(text, /S\.I\.N\.:\s*([^\n]+)/),
        maritalStatus: this.extractValue(text, /Marital Status:\s*([^\n]+)/)
      },
      contactInformation: {
        address: this.extractValue(text, /Address:\s*([^\n]+)/),
        cellPhone: this.extractPhoneNumber(text, /Cellular Phone No\.:\s*([^\n]+)/),
        homePhone: this.extractPhoneNumber(text, /Home Phone No\.:\s*([^\n]+)/),
        workPhone: this.extractPhoneNumber(text, /Work Phone No\.:\s*([^\n]+)/),
        email: this.extractValue(text, /Email Address:\s*([^\n]+)/)
      },
      automobileInsurance: {
        insuranceCompany: this.extractValue(text, /Insurance Company:\s*([^\n]+)/),
        policyNumber: this.extractValue(text, /Policy number:\s*([^\n]+)/),
        policyHolder: this.extractValue(text, /Policy Holders Name:\s*([^\n]+)/)
      },
      defendantInsurance: {
        insuranceCompany: this.extractValue(text, /IF MVA:[\s\S]*?Insurance Company\?\s*([^\n]+)/),
        policyNumber: this.extractValue(text, /IF MVA:[\s\S]*?Policy No:\s*([^\n]+)/)
      },
      accidentDetails: {
        type: 'MVA', // Default for this form
        date: this.extractDate(text, /Date of Accident or Loss:\s*(\d{4}-\d{2}-\d{2})/),
        time: this.extractValue(text, /TIME:\s*([^\n]+)/),
        location: this.extractValue(text, /LOCATION:\s*([^\n]+)/),
        description: this.extractSection(text, 'ACCIDENT DETAILS', 'Did the Accident Occur While At Work?'),
        wasAtWork: this.extractValue(text, /Did the Accident Occur While At Work\?\s*([^\n]+)/)?.toLowerCase() === 'yes'
      },
      injuries: {
        description: this.extractSection(text, 'INJURIES AS A RESULT OF THE ACCIDENT', 'Other:'),
        ambulanceRequired: this.extractValue(text, /Ambulance Required\?\s*([^\n]+)/)?.toLowerCase() === 'yes',
        hospital: this.extractValue(text, /Hospital:\s*([^\n]+)/),
        familyDoctor: {
          name: this.extractValue(text, /Family Physician:\s*([^\n]+)/),
          clinic: '',
          address: ''
        },
        physiotherapy: {
          started: this.extractValue(text, /Physiotherapy, have you begun treatment\?\s*([^\n]+)/)?.toLowerCase() === 'yes',
          clinic: this.extractValue(text, /Physiotherapy, have you begun treatment\?\s*Yes,\s*([^\n]+)/)
        }
      },
      employment: {
        currentEmployer: {
          name: this.extractValue(text, /Name of Employer:\s*([^\n]+)/),
          position: this.extractValue(text, /Position:\s*([^\n]+)/),
          startDate: this.extractValue(text, /Employment Start Date:\s*([^\n]+)/),
          hourlyRate: parseFloat(this.extractValue(text, /How much were you earning:\s*\$(\d+)/)) || 0,
          hoursPerWeek: parseFloat(this.extractValue(text, /How many hours a week\?\s*(\d+)/)) || 0
        }
      }
    };

    return parsed;
  }

  private static extractValue(text: string, pattern: RegExp): string {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  }
}