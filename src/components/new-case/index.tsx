'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Phone, 
  Car, 
  Shield, 
  Scale, 
  Briefcase, 
  FileText, 
  AlertCircle,
  Calendar,
  Mail,
  MapPin,
  Building,
  AlertTriangle,
  Stethoscope,
  Hospital,
  DollarSign,
  Upload,
  UserCircle,
  PhoneCall,
  Home,
  Briefcase as BriefcaseIcon,
  Car as CarIcon,
  ShieldAlert,
  GraduationCap,
  Users,
  BadgeHelp,
  File,
  Trash2
} from "lucide-react"
import { DocumentUpload } from "../document-upload"

type EmploymentHistoryItem = {
  id: number;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
};

type FormData = {
  clientInformation: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    accidentDate: string;
  };
  contactInformation: {
    address: string;
    cellPhone: string;
    homePhone: string;
    workPhone: string;
    email: string;
    emergencyContact: {
      name: string;
      number: string;
      email: string;
    };
  };
  automobileInsurance: {
    insuranceCompany: string;
    policyHolder: string;
    claimNumber: string;
    policyNumber: string;
    adjuster: string;
  };
  defendantInsurance: {
    insuranceCompany: string;
    policyHolder: string;
    policyNumber: string;
    vehicleInfo: string;
  };
  caseDetails: {
    accidentType: string;
    abCaseType: string;
    driverPassenger: string;
    injuries: string;
    preExistingInjuries: string;
    accidentDetails: string;
    familyDoctor: string;
    specialist: string;
    initialDiagnosis: string;
    hospitalAttended: string;
    clinics: string;
  };
  legalCaseManagementInformation: {
    assignedLawyer: string;
    assignedParalegal: string;
    keyDeadlines: string;
    claimStatus: string;
    priorityNotes: string;
  };
  employmentInformation: EmploymentHistoryItem[];
  policeWitnessInformation: {
    witnessInfo: string;
    policeReportAvailable: boolean;
    officerName: string;
    policeReportNumber: string;
    clientCharged: string;
    thirdPartyCharged: string;
  };
  collateralBenefits: {
    stdLtd: string;
    carrierName: string;
    policyNumber: string;
    extendedHealthBenefits: string;
    benefitsAmount: string;
  };
};

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  type: string;
  size: string;
}

export function NewCase() {
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryItem[]>([{
    id: 1,
    employer: '',
    position: '',
    startDate: '',
    endDate: ''
  }]);
  const [policeReportAvailable, setPoliceReportAvailable] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    clientInformation: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      accidentDate: '',
    },
    contactInformation: {
      address: '',
      cellPhone: '',
      homePhone: '',
      workPhone: '',
      email: '',
      emergencyContact: {
        name: '',
        number: '',
        email: ''
      }
    },
    automobileInsurance: {
      insuranceCompany: '',
      policyHolder: '',
      claimNumber: '',
      policyNumber: '',
      adjuster: ''
    },
    defendantInsurance: {
      insuranceCompany: '',
      policyHolder: '',
      policyNumber: '',
      vehicleInfo: ''
    },
    caseDetails: {
      accidentType: '',
      abCaseType: '',
      driverPassenger: '',
      injuries: '',
      preExistingInjuries: '',
      accidentDetails: '',
      familyDoctor: '',
      specialist: '',
      initialDiagnosis: '',
      hospitalAttended: '',
      clinics: ''
    },
    legalCaseManagementInformation: {
      assignedLawyer: '',
      assignedParalegal: '',
      keyDeadlines: '',
      claimStatus: '',
      priorityNotes: ''
    },
    employmentInformation: [],
    policeWitnessInformation: {
      witnessInfo: '',
      policeReportAvailable: false,
      officerName: '',
      policeReportNumber: '',
      clientCharged: '',
      thirdPartyCharged: ''
    },
    collateralBenefits: {
      stdLtd: '',
      carrierName: '',
      policyNumber: '',
      extendedHealthBenefits: '',
      benefitsAmount: ''
    }
  })
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleFileProcessed = async (extractedData: any) => {
    try {
      console.log('Processing file:', extractedData);

      // Add document to the documents list
      const newDocument = {
        id: Date.now().toString(),
        name: extractedData.fileName || 'Document',
        uploadDate: new Date().toLocaleDateString(),
        type: extractedData.fileType || 'Document',
        size: extractedData.fileSize || '0 KB'
      };
      setDocuments(prev => [...prev, newDocument]);

      // Update form data with extracted information
      setFormData(prevData => {
        const [firstName, ...lastNameParts] = (extractedData.clientInformation?.name || '').split(' ');
        const lastName = lastNameParts.join(' ');

        return {
          ...prevData,
          clientInformation: {
            ...prevData.clientInformation,
            firstName: firstName || '',
            lastName: lastName || '',
            dateOfBirth: extractedData.clientInformation?.dateOfBirth || '',
            accidentDate: extractedData.clientInformation?.accidentDate || '',
          },
          contactInformation: {
            ...prevData.contactInformation,
            address: extractedData.contactInformation?.address || '',
            cellPhone: extractedData.contactInformation?.phone || '',
            email: extractedData.contactInformation?.email || '',
            homePhone: extractedData.contactInformation?.homePhone || '',
            workPhone: extractedData.contactInformation?.workPhone || '',
            emergencyContact: {
              name: extractedData.contactInformation?.emergencyContact?.name || '',
              number: extractedData.contactInformation?.emergencyContact?.number || '',
              email: extractedData.contactInformation?.emergencyContact?.email || ''
            }
          },
          automobileInsurance: {
            ...prevData.automobileInsurance,
            insuranceCompany: extractedData.insuranceInformation?.company || '',
            policyNumber: extractedData.insuranceInformation?.policyNumber || '',
            policyHolder: extractedData.insuranceInformation?.policyHolder || '',
            claimNumber: extractedData.insuranceInformation?.claimNumber || '',
            adjuster: extractedData.insuranceInformation?.adjuster || ''
          },
          defendantInsurance: {
            ...prevData.defendantInsurance,
            insuranceCompany: extractedData.defendantInsurance?.company || '',
            policyHolder: extractedData.defendantInsurance?.policyHolder || '',
            policyNumber: extractedData.defendantInsurance?.policyNumber || '',
            vehicleInfo: extractedData.defendantInsurance?.vehicleInfo || ''
          },
          caseDetails: {
            ...prevData.caseDetails,
            accidentType: extractedData.caseDetails?.accidentType || '',
            injuries: extractedData.caseDetails?.injuries || '',
            preExistingInjuries: extractedData.caseDetails?.preExistingInjuries || '',
            accidentDetails: extractedData.caseDetails?.accidentDetails || '',
            familyDoctor: extractedData.caseDetails?.familyDoctor || '',
            specialist: extractedData.caseDetails?.specialist || '',
            hospitalAttended: extractedData.caseDetails?.hospitalAttended || '',
            clinics: extractedData.caseDetails?.clinics || '',
            abCaseType: '',
            driverPassenger: '',
            initialDiagnosis: ''
          },
          employmentInformation: extractedData.employmentInformation || [],
          policeWitnessInformation: {
            ...prevData.policeWitnessInformation,
            witnessInfo: extractedData.policeWitnessInformation?.witnessInfo || '',
            policeReportAvailable: extractedData.policeWitnessInformation?.policeReportAvailable || false,
            officerName: extractedData.policeWitnessInformation?.officerName || '',
            policeReportNumber: extractedData.policeWitnessInformation?.policeReportNumber || '',
            clientCharged: extractedData.policeWitnessInformation?.clientCharged || '',
            thirdPartyCharged: extractedData.policeWitnessInformation?.thirdPartyCharged || ''
          },
          collateralBenefits: {
            ...prevData.collateralBenefits,
            stdLtd: extractedData.collateralBenefits?.stdLtd || '',
            carrierName: extractedData.collateralBenefits?.carrierName || '',
            policyNumber: extractedData.collateralBenefits?.policyNumber || '',
            extendedHealthBenefits: extractedData.collateralBenefits?.extendedHealthBenefits || '',
            benefitsAmount: extractedData.collateralBenefits?.benefitsAmount || ''
          }
        };
      });
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } },
    field: string
  ) => {
    const fieldPath = field.split('.')
    setFormData((prevData: FormData) => {
      const newData = { ...prevData }
      let current: any = newData
      
      for (let i = 0; i < fieldPath.length - 1; i++) {
        current = current[fieldPath[i]] as any
      }
      
      current[fieldPath[fieldPath.length - 1]] = e.target.value
      return newData
    })
  }

  const addEmploymentHistory = () => {
    setEmploymentHistory([...employmentHistory, {
      id: employmentHistory.length + 1,
      employer: '',
      position: '',
      startDate: '',
      endDate: ''
    }]);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.clientInformation.firstName || 
          !formData.clientInformation.lastName || 
          !formData.clientInformation.dateOfBirth || 
          !formData.clientInformation.accidentDate) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await fetch('/api/cases/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create case');
      }

      const newCase = await response.json();
      console.log('Case created:', newCase);
      
      // Reset form
      setFormData({
        clientInformation: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          accidentDate: '',
        },
        contactInformation: {
          address: '',
          cellPhone: '',
          homePhone: '',
          workPhone: '',
          email: '',
          emergencyContact: {
            name: '',
            number: '',
            email: ''
          }
        },
        automobileInsurance: {
          insuranceCompany: '',
          policyHolder: '',
          claimNumber: '',
          policyNumber: '',
          adjuster: ''
        },
        defendantInsurance: {
          insuranceCompany: '',
          policyHolder: '',
          policyNumber: '',
          vehicleInfo: ''
        },
        caseDetails: {
          accidentType: '',
          abCaseType: '',
          driverPassenger: '',
          injuries: '',
          preExistingInjuries: '',
          accidentDetails: '',
          familyDoctor: '',
          specialist: '',
          initialDiagnosis: '',
          hospitalAttended: '',
          clinics: ''
        },
        legalCaseManagementInformation: {
          assignedLawyer: '',
          assignedParalegal: '',
          keyDeadlines: '',
          claimStatus: '',
          priorityNotes: ''
        },
        employmentInformation: [],
        policeWitnessInformation: {
          witnessInfo: '',
          policeReportAvailable: false,
          officerName: '',
          policeReportNumber: '',
          clientCharged: '',
          thirdPartyCharged: ''
        },
        collateralBenefits: {
          stdLtd: '',
          carrierName: '',
          policyNumber: '',
          extendedHealthBenefits: '',
          benefitsAmount: ''
        }
      });
      setEmploymentHistory([{
        id: 1,
        employer: '',
        position: '',
        startDate: '',
        endDate: ''
      }]);
      setPoliceReportAvailable(false);

      // Show success message
      alert('Case created successfully!');
      
      // Redirect to all cases view
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case. Please try again.');
    }
  };

  return (
    <div className="p-2">
      {/* Document Upload section */}
      <DocumentUpload onFileProcessed={handleFileProcessed} />

      {/* Main Form */}
      <div className="grid grid-cols-3 grid-rows-[auto_auto_auto] gap-4">
        {/* Client Information Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <UserCircle className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-xs font-medium text-gray-500">First Name *</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input 
                  id="firstName" 
                  required 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.clientInformation.firstName}
                  onChange={(e) => handleChange(e, 'clientInformation.firstName')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-xs font-medium text-gray-500">Last Name *</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input 
                  id="lastName" 
                  required 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.clientInformation.lastName}
                  onChange={(e) => handleChange(e, 'clientInformation.lastName')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="dob" className="text-xs font-medium text-gray-500">Date of Birth *</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Input 
                  type="date" 
                  id="dob" 
                  required 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.clientInformation.dateOfBirth}
                  onChange={(e) => handleChange(e, 'clientInformation.dateOfBirth')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="accidentDate" className="text-xs font-medium text-gray-500">Accident Date *</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Input 
                  type="date" 
                  id="accidentDate" 
                  required 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.clientInformation.accidentDate}
                  onChange={(e) => handleChange(e, 'clientInformation.accidentDate')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <PhoneCall className="w-5 h-5 text-green-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Address</Label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.contactInformation.address}
                  onChange={(e) => handleChange(e, 'contactInformation.address')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Cell Phone</Label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <Input 
                  type="tel"
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.contactInformation.cellPhone}
                  onChange={(e) => handleChange(e, 'contactInformation.cellPhone')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Home Phone</Label>
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-gray-400" />
                <Input 
                  type="tel"
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.contactInformation.homePhone}
                  onChange={(e) => handleChange(e, 'contactInformation.homePhone')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <Input 
                  type="email"
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.contactInformation.email}
                  onChange={(e) => handleChange(e, 'contactInformation.email')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Card - Moved here for better visibility */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-violet-500/10 to-violet-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <File className="w-5 h-5 text-violet-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Documents</CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-4">
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <File className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setDocuments(documents.filter(d => d.id !== doc.id));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Details Section */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden row-span-2">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <BriefcaseIcon className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Case Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Type of Accident</Label>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <Select onValueChange={(value) => handleChange({ target: { value } }, 'caseDetails.accidentType')}>
                  <SelectTrigger className="text-sm bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select accident type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="mva" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Motor Vehicle Accident
                    </SelectItem>
                    <SelectItem value="slip-and-fall" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Slip and Fall
                    </SelectItem>
                    <SelectItem value="dog-bite" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Dog Bite
                    </SelectItem>
                    <SelectItem value="ltd" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      LTD
                    </SelectItem>
                    <SelectItem value="other" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">AB Case Type</Label>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <Select onValueChange={(value) => handleChange({ target: { value } }, 'caseDetails.abCaseType')}>
                  <SelectTrigger className="text-sm bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select AB case type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="mig" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      MIG
                    </SelectItem>
                    <SelectItem value="non-mig" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Non-MIG
                    </SelectItem>
                    <SelectItem value="cat" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      CAT
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Driver/Passenger</Label>
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-gray-400" />
                <Select onValueChange={(value) => handleChange({ target: { value } }, 'caseDetails.driverPassenger')}>
                  <SelectTrigger className="text-sm bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="driver" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Driver
                    </SelectItem>
                    <SelectItem value="passenger" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Passenger
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Injuries Sustained</Label>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  value={formData.caseDetails.injuries}
                  onChange={(e) => handleChange(e, 'caseDetails.injuries')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Pre-Existing Injuries</Label>
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  value={formData.caseDetails.preExistingInjuries}
                  onChange={(e) => handleChange(e, 'caseDetails.preExistingInjuries')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Details of Accident</Label>
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  value={formData.caseDetails.accidentDetails}
                  onChange={(e) => handleChange(e, 'caseDetails.accidentDetails')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Family Doctor</Label>
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.caseDetails.familyDoctor}
                  onChange={(e) => handleChange(e, 'caseDetails.familyDoctor')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Specialist</Label>
              <div className="flex items-start space-x-2">
                <User className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  placeholder="List doctors and specialists involved"
                  value={formData.caseDetails.specialist}
                  onChange={(e) => handleChange(e, 'caseDetails.specialist')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Initial Diagnosis</Label>
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  placeholder="Specific injuries (e.g., fractures, concussions)"
                  value={formData.caseDetails.initialDiagnosis}
                  onChange={(e) => handleChange(e, 'caseDetails.initialDiagnosis')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Hospital Attended</Label>
              <div className="flex items-center space-x-2">
                <Hospital className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.caseDetails.hospitalAttended}
                  onChange={(e) => handleChange(e, 'caseDetails.hospitalAttended')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Clinics</Label>
              <div className="flex items-start space-x-2">
                <Building className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  placeholder="Names of medical facilities"
                  value={formData.caseDetails.clinics}
                  onChange={(e) => handleChange(e, 'caseDetails.clinics')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automobile Insurance Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <CarIcon className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Automobile Insurance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Insurance Company</Label>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.automobileInsurance.insuranceCompany}
                  onChange={(e) => handleChange(e, 'automobileInsurance.insuranceCompany')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Policy Holder Name</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.automobileInsurance.policyHolder}
                  onChange={(e) => handleChange(e, 'automobileInsurance.policyHolder')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Claim Number</Label>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.automobileInsurance.claimNumber}
                  onChange={(e) => handleChange(e, 'automobileInsurance.claimNumber')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Policy Number</Label>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.automobileInsurance.policyNumber}
                  onChange={(e) => handleChange(e, 'automobileInsurance.policyNumber')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Adjuster Information</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.automobileInsurance.adjuster}
                  onChange={(e) => handleChange(e, 'automobileInsurance.adjuster')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Defendant Insurance Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-500/10 to-red-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Defendant Insurance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Insurance Company</Label>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.defendantInsurance.insuranceCompany}
                  onChange={(e) => handleChange(e, 'defendantInsurance.insuranceCompany')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Policy Holder Name</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.defendantInsurance.policyHolder}
                  onChange={(e) => handleChange(e, 'defendantInsurance.policyHolder')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Policy Number</Label>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.defendantInsurance.policyNumber}
                  onChange={(e) => handleChange(e, 'defendantInsurance.policyNumber')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Vehicle Information</Label>
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.defendantInsurance.vehicleInfo}
                  onChange={(e) => handleChange(e, 'defendantInsurance.vehicleInfo')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal/Case Management Information */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Legal/Case Management</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Assigned Lawyer</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.legalCaseManagementInformation.assignedLawyer}
                  onChange={(e) => handleChange(e, 'legalCaseManagementInformation.assignedLawyer')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Assigned Paralegal</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.legalCaseManagementInformation.assignedParalegal}
                  onChange={(e) => handleChange(e, 'legalCaseManagementInformation.assignedParalegal')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Key Deadlines</Label>
              <div className="flex items-start space-x-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  placeholder="Limitation periods, important dates"
                  value={formData.legalCaseManagementInformation.keyDeadlines}
                  onChange={(e) => handleChange(e, 'legalCaseManagementInformation.keyDeadlines')}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Claim Status</Label>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <Select onValueChange={(value) => handleChange({ target: { value } }, 'legalCaseManagementInformation.claimStatus')}>
                  <SelectTrigger className="text-sm bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="ongoing" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Ongoing
                    </SelectItem>
                    <SelectItem value="settled" className="text-gray-900 data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                      Settled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Priority Notes/Instructions</Label>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  value={formData.legalCaseManagementInformation.priorityNotes}
                  onChange={(e) => handleChange(e, 'legalCaseManagementInformation.priorityNotes')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-yellow-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            {employmentHistory.map((employment, index) => (
              <div key={employment.id} className="space-y-3 pb-3 border-b border-gray-200 last:border-0">
                {index > 0 && <div className="text-xs font-medium text-gray-500">Previous Employer {index}</div>}
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500">Employer Name</Label>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <Input 
                      className="text-sm bg-white text-gray-900 border-gray-300"
                      value={employment.employer}
                      onChange={(e) => {
                        const newHistory = [...employmentHistory];
                        newHistory[index].employer = e.target.value;
                        setEmploymentHistory(newHistory);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500">Position</Label>
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                    <Input 
                      className="text-sm bg-white text-gray-900 border-gray-300"
                      value={employment.position}
                      onChange={(e) => {
                        const newHistory = [...employmentHistory];
                        newHistory[index].position = e.target.value;
                        setEmploymentHistory(newHistory);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-500">Start Date</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <Input 
                        type="date"
                        className="text-sm bg-white text-gray-900 border-gray-300"
                        value={employment.startDate}
                        onChange={(e) => {
                          const newHistory = [...employmentHistory];
                          newHistory[index].startDate = e.target.value;
                          setEmploymentHistory(newHistory);
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-500">End Date</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <Input 
                        type="date"
                        className="text-sm bg-white text-gray-900 border-gray-300"
                        value={employment.endDate}
                        onChange={(e) => {
                          const newHistory = [...employmentHistory];
                          newHistory[index].endDate = e.target.value;
                          setEmploymentHistory(newHistory);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button 
              type="button"
              variant="outline" 
              className="text-sm bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
              onClick={addEmploymentHistory}
            >
              Add Previous Employer
            </Button>
          </CardContent>
        </Card>

        {/* Police & Witness Information */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Police & Witness Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Witness Information</Label>
              <div className="flex items-start space-x-2">
                <Users className="w-4 h-4 text-gray-400 mt-2" />
                <Textarea 
                  className="text-sm bg-white text-gray-900 border-gray-300 min-h-[60px]"
                  placeholder="Names and contact information of witnesses"
                  value={formData.policeWitnessInformation.witnessInfo}
                  onChange={(e) => handleChange(e, 'policeWitnessInformation.witnessInfo')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-500">Police Report Available?</Label>
              <Switch
                checked={policeReportAvailable}
                onCheckedChange={(checked: boolean) => {
                  setPoliceReportAvailable(checked);
                  handleChange({ target: { value: checked.toString() } }, 'policeWitnessInformation.policeReportAvailable');
                }}
              />
            </div>

            {policeReportAvailable && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500">Officer Name</Label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <Input 
                      className="text-sm bg-white text-gray-900 border-gray-300"
                      value={formData.policeWitnessInformation.officerName}
                      onChange={(e) => handleChange(e, 'policeWitnessInformation.officerName')}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500">Police Report Number</Label>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <Input 
                      className="text-sm bg-white text-gray-900 border-gray-300"
                      value={formData.policeWitnessInformation.policeReportNumber}
                      onChange={(e) => handleChange(e, 'policeWitnessInformation.policeReportNumber')}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-500">Client Charged?</Label>
              <Switch
                checked={formData.policeWitnessInformation.clientCharged === 'yes'}
                onCheckedChange={(checked: boolean) => 
                  handleChange({ target: { value: checked ? 'yes' : 'no' } }, 'policeWitnessInformation.clientCharged')
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-500">Third Party Charged?</Label>
              <Switch
                checked={formData.policeWitnessInformation.thirdPartyCharged === 'yes'}
                onCheckedChange={(checked: boolean) => 
                  handleChange({ target: { value: checked ? 'yes' : 'no' } }, 'policeWitnessInformation.thirdPartyCharged')
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Collateral Benefits Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 py-3 px-4 flex flex-row items-center space-x-2">
            <BadgeHelp className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">Collateral Benefits</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 py-3 px-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-500">STD/LTD Available</Label>
              <Switch
                checked={formData.collateralBenefits.stdLtd === 'yes'}
                onCheckedChange={(checked: boolean) => 
                  handleChange({ target: { value: checked ? 'yes' : 'no' } }, 'collateralBenefits.stdLtd')
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Carrier Name</Label>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.collateralBenefits.carrierName}
                  onChange={(e) => handleChange(e, 'collateralBenefits.carrierName')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Policy Number</Label>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.collateralBenefits.policyNumber}
                  onChange={(e) => handleChange(e, 'collateralBenefits.policyNumber')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-500">Extended Health Benefits</Label>
              <Switch
                checked={formData.collateralBenefits.extendedHealthBenefits === 'yes'}
                onCheckedChange={(checked: boolean) => 
                  handleChange({ target: { value: checked ? 'yes' : 'no' } }, 'collateralBenefits.extendedHealthBenefits')
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Amount of Benefits</Label>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <Input 
                  className="text-sm bg-white text-gray-900 border-gray-300"
                  value={formData.collateralBenefits.benefitsAmount}
                  onChange={(e) => handleChange(e, 'collateralBenefits.benefitsAmount')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          className="text-sm bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
          onClick={() => window.location.href = '/'}
        >
          Cancel
        </Button>
        <Button 
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleSubmit}
        >
          Create Case
        </Button>
      </div>
    </div>
  )
}