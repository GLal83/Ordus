'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CustomizeCards } from './customize-cards'
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
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
  File,
  FileImage,
  FileText as FileTextIcon,
  File as FilePdf,
  File as FileArchive,
  File as FileSpreadsheet,
  File as FileCode,
  FileVideo,
  FileAudio,
  Trash2,
  Download,
  Upload,
  Loader2,
  Maximize2,
  Edit,
  Copy,
  MoreHorizontal,
  MessageSquare,
  XCircle,
  X,
  Eye
} from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"

interface CaseDetailsProps {
  caseId: string;
}

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  type: string;
  size: string;
  url?: string;
}

// Add these type definitions at the top of the file
interface FileResponse {
  success: boolean;
  error?: string;
  filePath?: string;
  data?: {
    filePath: string;
  };
}

interface CommandResponse {
  success: boolean;
  error?: string;
}

const getFileIcon = (type: string) => {
  const fileType = type.toLowerCase();
  if (fileType.includes('image')) return FileImage;
  if (fileType.includes('pdf')) return FilePdf;
  if (fileType.includes('zip') || fileType.includes('rar')) return FileArchive;
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return FileSpreadsheet;
  if (fileType.includes('video')) return FileVideo;
  if (fileType.includes('audio')) return FileAudio;
  if (fileType.includes('text')) return FileTextIcon;
  if (fileType.includes('code') || fileType.includes('json')) return FileCode;
  return File;
};

// Initialize visibleCards with all card options
const initialVisibleCards: Record<string, boolean> = {
  clientInfo: true,
  contactInfo: true,
  emergencyContact: true,
  caseInfo: true,
  legalTeam: true,
  keyDeadlines: true,
  accidentDetails: true,
  injuries: true,
  preExistingInjuries: true,
  medicalProviders: true,
  diagnosis: true,
  autoInsurance: true,
  defendantInsurance: true,
  collateralBenefits: true,
  employment: true,
  policeInfo: true,
  witnessInfo: true,
  documents: true,
  memos: true,
  denials: true
};

// Update the ExpandedFileView props interface
interface ExpandedFileViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  files: Document[];
  onUpload: (files: File[]) => void;
  onDownload: (file: Document) => void;
  onDelete: (id: string) => void;
  onFileClick: (file: Document) => void;
  getRootProps: any; // From react-dropzone
  getInputProps: any; // From react-dropzone
  type: 'documents' | 'memos' | 'denials';
}

// Add this dialog component for expanded view
const ExpandedFileView = ({
  isOpen,
  onClose,
  title,
  icon,
  files,
  onUpload,
  onDownload,
  onDelete,
  onFileClick,
  getRootProps,
  getInputProps,
  type
}: ExpandedFileViewProps) => {
  const gradientClass = type === 'documents' 
    ? "bg-gradient-to-r from-violet-500/10 to-violet-600/10"
    : type === 'memos'
    ? "bg-gradient-to-r from-amber-500/10 to-amber-600/10"
    : "bg-gradient-to-r from-red-500/10 to-red-600/10";

  const hoverClass = type === 'documents'
    ? "hover:border-violet-400"
    : type === 'memos'
    ? "hover:border-amber-400"
    : "hover:border-red-400";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-white/90 backdrop-blur-sm shadow-sm border border-white/20">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            View and manage {type}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-[600px]" role="region" aria-label={`${title} file viewer`}>
          <div className={`flex items-center justify-between p-3 ${gradientClass}`}>
            <div className="flex items-center space-x-2">
              {icon}
              <h2 id={`${type}-heading`} className="text-sm font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500 border-b border-gray-300 pb-1" role="presentation">
                <span className="mr-8">Name</span>
                <span className="mr-8">Date Modified</span>
                <span className="mr-8">Size</span>
                <span>Kind</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4">
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed border-gray-200 rounded-lg p-4 ${hoverClass} transition-colors mb-4`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Upload ${type}`}
                >
                  <input {...getInputProps()} aria-label={`Choose ${type} to upload`} />
                  <p className="text-sm text-gray-500 text-center">Drop files here or click to upload</p>
                </div>
                <div 
                  className="space-y-2"
                  role="list"
                  aria-label={`${title} list`}
                >
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-white/50 rounded-lg group hover:bg-white/80 transition-colors"
                      role="listitem"
                      onClick={() => onFileClick(file)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onFileClick(file);
                        }
                      }}
                      tabIndex={0}
                      aria-label={`${file.name}, ${file.type}, ${file.size}`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex items-center w-[300px]">
                          <div className="flex-shrink-0 mr-2" aria-hidden="true">
                            {file.type.includes('pdf') ? (
                              <FileText className="h-4 w-4 text-red-500" />
                            ) : file.type.includes('word') || file.type.includes('docx') ? (
                              <FileText className="h-4 w-4 text-blue-500" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                        </div>
                        <div className="w-[200px]">
                          <time 
                            className="text-sm text-gray-500"
                            dateTime={file.uploadDate}
                          >
                            {new Date(file.uploadDate).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </time>
                        </div>
                        <div className="w-[100px]">
                          <span className="text-sm text-gray-500">{file.size}</span>
                        </div>
                        <div className="w-[150px]">
                          <span className="text-sm text-gray-500">
                            {file.type.includes('pdf') ? 'PDF Document' :
                             file.type.includes('docx') ? 'Microsoft Word Document' :
                             file.type.includes('doc') ? 'Microsoft Word Document' :
                             'Document'}
                          </span>
                        </div>
                      </div>
                      <div 
                        className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        role="group"
                        aria-label="File actions"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(file);
                          }}
                          aria-label={`Download ${file.name}`}
                        >
                          <Download className="h-4 w-4 text-gray-500" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(file.id);
                          }}
                          aria-label={`Delete ${file.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function CaseDetails({ caseId }: CaseDetailsProps) {
  const { toast } = useToast();
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [memos, setMemos] = useState<Document[]>([]);
  const [denials, setDenials] = useState<Document[]>([]);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isMemosOpen, setIsMemosOpen] = useState(false);
  const [isDenialsOpen, setIsDenialsOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>(initialVisibleCards);
  const [expandedDialog, setExpandedDialog] = useState<'documents' | 'memos' | 'denials' | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], type: 'document' | 'memo' | 'denial' = 'document') => {
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`/api/cases/${caseId}/${type}s`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${type}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || `Failed to upload ${type}`);
        }
      }
      
      // Refresh lists after successful upload
      const response = await fetch(`/api/cases/${caseId}/${type}s`);
      if (!response.ok) {
        throw new Error(`Failed to fetch updated ${type}s`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || `Failed to fetch updated ${type}s`);
      }
      
      switch (type) {
        case 'document':
          setDocuments(result.data);
          break;
        case 'memo':
          setMemos(result.data);
          break;
        case 'denial':
          setDenials(result.data);
          break;
      }
    } catch (error) {
      console.error(`Error uploading ${type}s:`, error);
      // TODO: Add error toast notification
    } finally {
      setIsUploading(false);
    }
  }, [caseId]);

  const { getRootProps: getDocumentRootProps, getInputProps: getDocumentInputProps } = useDropzone({ 
    onDrop: (files) => onDrop(files, 'document'),
    multiple: true 
  });

  const { getRootProps: getMemoRootProps, getInputProps: getMemoInputProps } = useDropzone({ 
    onDrop: (files) => onDrop(files, 'memo'),
    multiple: true 
  });

  const { getRootProps: getDenialRootProps, getInputProps: getDenialInputProps } = useDropzone({ 
    onDrop: (files) => onDrop(files, 'denial'),
    multiple: true 
  });

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        // Fetch case details
        const response = await fetch(`/api/cases/${caseId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Case not found');
          }
          throw new Error(`Failed to load case details (${response.status})`);
        }
        const data = await response.json();
        
        // Transform the data to match our UI structure
        const details = data.details || {};
        const transformedData = {
          clientInfo: {
            name: data.clientName,
            dateOfBirth: details.clientInformation?.dateOfBirth || 'N/A',
            email: details.contactInformation?.email || 'N/A',
            phone: details.contactInformation?.cellPhone || 'N/A'
          },
          contactInformation: {
            address: details.contactInformation?.address || 'N/A',
            cellPhone: details.contactInformation?.cellPhone || 'N/A',
            homePhone: details.contactInformation?.homePhone || 'N/A',
            workPhone: details.contactInformation?.workPhone || 'N/A',
            email: details.contactInformation?.email || 'N/A',
            emergencyContact: {
              name: details.contactInformation?.emergencyContact?.name || 'N/A',
              number: details.contactInformation?.emergencyContact?.number || 'N/A',
              email: details.contactInformation?.emergencyContact?.email || 'N/A'
            }
          },
          caseInfo: {
            caseNumber: data.fileNo,
            type: data.caseType,
            status: data.status,
            dateOpened: new Date(data.createdAt).toLocaleDateString(),
            assignedLawyer: data.lawyer || 'N/A',
            assignedParalegal: data.paralegal || 'N/A'
          },
          accidentDetails: {
            date: data.dateOfLoss || 'N/A',
            location: details.accidentLocation || 'N/A',
            description: details.caseDetails?.accidentDetails || 'N/A',
            type: details.caseDetails?.accidentType || 'N/A',
            abCaseType: details.caseDetails?.abCaseType || 'N/A',
            driverPassenger: details.caseDetails?.driverPassenger || 'N/A'
          },
          medicalDetails: {
            familyDoctor: details.caseDetails?.familyDoctor || 'N/A',
            hospitalAttended: details.caseDetails?.hospitalAttended || 'N/A',
            specialist: details.caseDetails?.specialist || 'N/A',
            initialDiagnosis: details.caseDetails?.initialDiagnosis || 'N/A',
            injuries: details.caseDetails?.injuries || 'N/A',
            preExistingInjuries: details.caseDetails?.preExistingInjuries || 'N/A',
            clinics: details.caseDetails?.clinics || 'N/A'
          },
          automobileInsurance: {
            insuranceCompany: details.automobileInsurance?.insuranceCompany || 'N/A',
            policyNumber: details.automobileInsurance?.policyNumber || 'N/A',
            claimNumber: details.automobileInsurance?.claimNumber || 'N/A',
            policyHolder: details.automobileInsurance?.policyHolder || 'N/A',
            adjuster: details.automobileInsurance?.adjuster || 'N/A'
          },
          defendantInsurance: {
            insuranceCompany: details.defendantInsurance?.insuranceCompany || 'N/A',
            policyHolder: details.defendantInsurance?.policyHolder || 'N/A',
            policyNumber: details.defendantInsurance?.policyNumber || 'N/A',
            vehicleInfo: details.defendantInsurance?.vehicleInfo || 'N/A'
          },
          employmentInformation: details.employmentInformation || [],
          policeWitnessInformation: {
            witnessInfo: details.policeWitnessInformation?.witnessInfo || 'N/A',
            policeReportAvailable: details.policeWitnessInformation?.policeReportAvailable || false,
            officerName: details.policeWitnessInformation?.officerName || 'N/A',
            policeReportNumber: details.policeWitnessInformation?.policeReportNumber || 'N/A',
            clientCharged: details.policeWitnessInformation?.clientCharged || 'N/A',
            thirdPartyCharged: details.policeWitnessInformation?.thirdPartyCharged || 'N/A'
          },
          collateralBenefits: {
            stdLtd: details.collateralBenefits?.stdLtd || 'N/A',
            carrierName: details.collateralBenefits?.carrierName || 'N/A',
            policyNumber: details.collateralBenefits?.policyNumber || 'N/A',
            extendedHealthBenefits: details.collateralBenefits?.extendedHealthBenefits || 'N/A',
            benefitsAmount: details.collateralBenefits?.benefitsAmount || 'N/A'
          }
        };
        
        setCaseDetails(transformedData);

        // Fetch documents, memos, and denials
        try {
          const [docsResponse, memosResponse, denialsResponse] = await Promise.all([
            fetch(`/api/cases/${caseId}/documents`),
            fetch(`/api/cases/${caseId}/memos`),
            fetch(`/api/cases/${caseId}/denials`)
          ]);

          // Check for 404s (case not found)
          if (docsResponse.status === 404 || memosResponse.status === 404 || denialsResponse.status === 404) {
            throw new Error('Case not found');
          }

          // Check for other errors
          if (!docsResponse.ok) throw new Error(`Documents error: ${docsResponse.status}`);
          if (!memosResponse.ok) throw new Error(`Memos error: ${memosResponse.status}`);
          if (!denialsResponse.ok) throw new Error(`Denials error: ${denialsResponse.status}`);

          const [docsData, memosData, denialsData] = await Promise.all([
            docsResponse.json(),
            memosResponse.json(),
            denialsResponse.json()
          ]);

          // Check for success and set data
          if (docsData.success) setDocuments(docsData.data);
          if (memosData.success) setMemos(memosData.data);
          if (denialsData.success) setDenials(denialsData.data);
        } catch (error) {
          console.error('Error fetching documents/memos/denials:', error);
          // If it's a case not found error, set the main error state
          if (error instanceof Error && error.message === 'Case not found') {
            setError('Case not found');
          }
          // Otherwise, just log it and let the main case details show
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load case details';
        setError(message);
        console.error('Error fetching case:', error);
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      fetchCaseDetails();
    }
  }, [caseId]);

  // Update the handleDocumentClick function
  const handleDocumentClick = async (doc: Document, type: 'document' | 'memo' | 'denial' = 'document') => {
    try {
      // Use the new route structure
      const response = await fetch(`/api/cases/${caseId}/${type}s/${doc.id}/open`);
      
      if (!response.ok) {
        throw new Error(`Failed to open ${type}. Server returned ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.filePath) {
        throw new Error('Server did not return a valid file path');
      }

      // Use the run_terminal_command to open the file with the default application
      const command = process.platform === 'win32' 
        ? `start "" "${data.filePath}"`  // Windows
        : process.platform === 'darwin' 
        ? `open "${data.filePath}"`      // macOS
        : `xdg-open "${data.filePath}"`; // Linux

      await runCommand(command);
    } catch (error) {
      let errorMessage: string;
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'An unexpected error occurred';
      }

      console.error('[Document Operation Error]:', {
        type,
        documentId: doc.id,
        error: errorMessage
      });
      
      toast({
        title: "Error Opening File",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Update the runCommand function with proper type annotations
  const runCommand = async (command: string): Promise<CommandResponse> => {
    try {
      const response = await fetch('/api/system/run-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || `Failed to run command (${response.status})`);
      }

      const result = await response.json() as CommandResponse;
      if (!result.success) {
        throw new Error(result.error || 'Command failed to execute');
      }

      return result;
    } catch (error) {
      console.error('Error running command:', error);
      throw error;
    }
  };

  const handleDownload = async (doc: Document, type: 'document' | 'memo' | 'denial' = 'document') => {
    try {
      // For download, we'll use the same endpoint but force download
      const response = await fetch(`/api/cases/${caseId}/${type}s/${doc.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name; // This will force download instead of opening
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
    }
  };

  const handleDelete = async (docId: string, type: 'document' | 'memo' | 'denial' = 'document') => {
    try {
      const response = await fetch(`/api/cases/${caseId}/${type}s/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      switch (type) {
        case 'document':
          setDocuments(documents.filter(doc => doc.id !== docId));
          break;
        case 'memo':
          setMemos(memos.filter(memo => memo.id !== docId));
          break;
        case 'denial':
          setDenials(denials.filter(denial => denial.id !== docId));
          break;
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleRename = async (docId: string, newName: string, type: 'document' | 'memo' | 'denial' = 'document') => {
    try {
      const response = await fetch(`/api/cases/${caseId}/${type}s/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error(`Failed to rename ${type}`);

      const updatedDoc = await response.json();
      
      switch (type) {
        case 'document':
          setDocuments(documents.map(doc => 
            doc.id === docId ? { ...doc, name: updatedDoc.name } : doc
          ));
          break;
        case 'memo':
          setMemos(memos.map(memo => 
            memo.id === docId ? { ...memo, name: updatedDoc.name } : memo
          ));
          break;
        case 'denial':
          setDenials(denials.map(denial => 
            denial.id === docId ? { ...denial, name: updatedDoc.name } : denial
          ));
          break;
      }
    } catch (error) {
      console.error(`Error renaming ${type}:`, error);
    }
  };

  // Prepare the context for AI Assistant
  const aiContext = caseDetails ? {
    filename: `Case ${caseDetails.caseInfo.caseNumber}`,
    content: `
Case Information:
- Case Number: ${caseDetails.caseInfo.caseNumber}
- Type: ${caseDetails.caseInfo.type}
- Status: ${caseDetails.caseInfo.status}
- Date Opened: ${caseDetails.caseInfo.dateOpened}

Personal Information:
- Name: ${caseDetails.clientInfo.name}
- Date of Birth: ${caseDetails.clientInfo.dateOfBirth}
- Email: ${caseDetails.clientInfo.email}
- Phone: ${caseDetails.clientInfo.phone}

Accident Details:
- Date: ${caseDetails.accidentDetails.date}
- Location: ${caseDetails.accidentDetails.location}
- Description: ${caseDetails.accidentDetails.description}

Medical Information:
- Family Doctor: ${caseDetails.medicalDetails.familyDoctor}
- Hospital Attended: ${caseDetails.medicalDetails.hospitalAttended}

Insurance Information:
- Insurance Company: ${caseDetails.automobileInsurance.insuranceCompany}
- Policy Number: ${caseDetails.automobileInsurance.policyNumber}
- Claim Number: ${caseDetails.automobileInsurance.claimNumber}

Legal Team:
- Assigned Lawyer: ${caseDetails.caseInfo.assignedLawyer}
- Assigned Paralegal: ${caseDetails.caseInfo.assignedParalegal}
`
  } : undefined;

  const handleVisibilityChange = (cardId: string, isVisible: boolean) => {
    setVisibleCards(prev => ({
      ...prev,
      [cardId]: isVisible
    }));
  };

  // Function to handle card expansion
  const handleExpand = (type: 'documents' | 'memos' | 'denials') => {
    setExpandedDialog(type);
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[400px]">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-r-transparent"></div>
        <p className="ml-2 text-sm text-gray-600">Loading case details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!caseDetails) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>No case details found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <CustomizeCards 
        visibleCards={visibleCards} 
        onVisibilityChange={handleVisibilityChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Client Information Card */}
        {visibleCards.clientInfo && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{caseDetails?.clientInfo.name}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Date of Birth</p>
                  <p className="text-sm text-gray-900">{caseDetails?.clientInfo.dateOfBirth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information Card */}
        {visibleCards.contactInfo && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Phone className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Cell Phone</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.cellPhone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Home Phone</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.homePhone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Work Phone</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.workPhone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Case Information Card */}
        {visibleCards.caseInfo && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Case Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Case Number</p>
                  <p className="text-sm text-gray-900">{caseDetails?.caseInfo.caseNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Type</p>
                  <p className="text-sm text-gray-900">{caseDetails?.caseInfo.type}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <p className="text-sm text-gray-900">{caseDetails?.caseInfo.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact Card */}
        {visibleCards.emergencyContact && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.emergencyContact.name}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.emergencyContact.number}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{caseDetails?.contactInformation.emergencyContact.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legal Team Card */}
        {visibleCards.legalTeam && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Legal Team</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Assigned Lawyer</p>
                  <p className="text-sm text-gray-900">{caseDetails?.caseInfo.assignedLawyer}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Assigned Paralegal</p>
                  <p className="text-sm text-gray-900">{caseDetails?.caseInfo.assignedParalegal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Deadlines Card */}
        {visibleCards.keyDeadlines && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-500/10 to-rose-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Calendar className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Key Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {caseDetails?.keyDeadlines?.map((deadline: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">{deadline.title}</p>
                    <p className="text-sm text-gray-900">{deadline.date}</p>
                  </div>
                </div>
              )) || <p className="text-sm text-gray-500">No deadlines set</p>}
            </CardContent>
          </Card>
        )}

        {/* Accident Details Card */}
        {visibleCards.accidentDetails && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Car className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Accident Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">{caseDetails?.accidentDetails.date}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">{caseDetails?.accidentDetails.location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Description</p>
                  <p className="text-sm text-gray-900">{caseDetails?.accidentDetails.description}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Type</p>
                  <p className="text-sm text-gray-900">{caseDetails?.accidentDetails.type}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">AB Case Type</p>
                  <p className="text-sm text-gray-900">{caseDetails?.accidentDetails.abCaseType}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Driver/Passenger</p>
                  <p className="text-sm text-gray-900">{caseDetails?.accidentDetails.driverPassenger}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Injuries Card */}
        {visibleCards.injuries && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-500/10 to-red-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-red-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Injuries</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Current Injuries</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails?.injuries || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pre-existing Injuries Card */}
        {visibleCards.preExistingInjuries && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Pre-existing Injuries</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Pre-existing Conditions</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails?.preExistingInjuries || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Providers Card */}
        {visibleCards.medicalProviders && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Hospital className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Medical Providers</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Family Doctor</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.familyDoctor}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Hospital className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Hospital Attended</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.hospitalAttended}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Specialist</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.specialist}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Initial Diagnosis</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.initialDiagnosis}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Injuries</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.injuries}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Pre-existing Injuries</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.preExistingInjuries}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Building className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Clinics</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.clinics}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis Card */}
        {visibleCards.diagnosis && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-cyan-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Diagnosis & Treatment</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Initial Diagnosis</p>
                  <p className="text-sm text-gray-900">{caseDetails?.medicalDetails.initialDiagnosis}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto Insurance Card */}
        {visibleCards.autoInsurance && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Automobile Insurance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Building className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Insurance Company</p>
                  <p className="text-sm text-gray-900">{caseDetails?.automobileInsurance.insuranceCompany}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Policy Number</p>
                  <p className="text-sm text-gray-900">{caseDetails?.automobileInsurance.policyNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Claim Number</p>
                  <p className="text-sm text-gray-900">{caseDetails?.automobileInsurance.claimNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Policy Holder</p>
                  <p className="text-sm text-gray-900">{caseDetails?.automobileInsurance.policyHolder}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Adjuster</p>
                  <p className="text-sm text-gray-900">{caseDetails?.automobileInsurance.adjuster}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Defendant Insurance Card */}
        {visibleCards.defendantInsurance && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Defendant Insurance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Building className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Insurance Company</p>
                  <p className="text-sm text-gray-900">{caseDetails?.defendantInsurance.insuranceCompany}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Policy Holder</p>
                  <p className="text-sm text-gray-900">{caseDetails?.defendantInsurance.policyHolder}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Policy Number</p>
                  <p className="text-sm text-gray-900">{caseDetails?.defendantInsurance.policyNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Car className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Vehicle Information</p>
                  <p className="text-sm text-gray-900">{caseDetails?.defendantInsurance.vehicleInfo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collateral Benefits Card */}
        {visibleCards.collateralBenefits && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Collateral Benefits</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">STD/LTD</p>
                  <p className="text-sm text-gray-900">{caseDetails?.collateralBenefits.stdLtd}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Building className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Carrier Name</p>
                  <p className="text-sm text-gray-900">{caseDetails?.collateralBenefits.carrierName}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Policy Number</p>
                  <p className="text-sm text-gray-900">{caseDetails?.collateralBenefits.policyNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Extended Health Benefits</p>
                  <p className="text-sm text-gray-900">{caseDetails?.collateralBenefits.extendedHealthBenefits}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <DollarSign className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Benefits Amount</p>
                  <p className="text-sm text-gray-900">{caseDetails?.collateralBenefits.benefitsAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employment History Card */}
        {visibleCards.employment && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-500/10 to-slate-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Briefcase className="w-5 h-5 text-slate-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Employment History</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {caseDetails?.employmentInformation?.map((employment: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Building className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Employer</p>
                      <p className="text-sm text-gray-900">{employment.employer}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 mt-2">
                    <Briefcase className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Position</p>
                      <p className="text-sm text-gray-900">{employment.position}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 mt-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Duration</p>
                      <p className="text-sm text-gray-900">{employment.startDate} - {employment.endDate || 'Present'}</p>
                    </div>
                  </div>
                </div>
              )) || <p className="text-sm text-gray-500">No employment history available</p>}
            </CardContent>
          </Card>
        )}

        {/* Police Information Card */}
        {visibleCards.policeInfo && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-zinc-500/10 to-zinc-600/10 py-3 px-4 flex flex-row items-center space-x-2">
              <Shield className="w-5 h-5 text-zinc-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">Police Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Witness Information</p>
                  <p className="text-sm text-gray-900">{caseDetails?.policeWitnessInformation.witnessInfo}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Officer Name</p>
                  <p className="text-sm text-gray-900">{caseDetails?.policeWitnessInformation.officerName}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Report Number</p>
                  <p className="text-sm text-gray-900">{caseDetails?.policeWitnessInformation.policeReportNumber}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Client Charged</p>
                  <p className="text-sm text-gray-900">{caseDetails?.policeWitnessInformation.clientCharged}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Third Party Charged</p>
                  <p className="text-sm text-gray-900">{caseDetails?.policeWitnessInformation.thirdPartyCharged}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents Card */}
        {visibleCards.documents && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-500/10 to-violet-600/10 py-3 px-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-violet-600" />
                <CardTitle className="text-sm font-semibold text-gray-900">Documents</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => handleExpand('documents')}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div {...getDocumentRootProps()} className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-violet-400 transition-colors mb-4">
                <input {...getDocumentInputProps()} />
                <p className="text-sm text-gray-500 text-center">Drop documents here or click to upload</p>
              </div>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {doc.type.includes('pdf') ? (
                        <FileText className="h-4 w-4 text-red-500" />
                      ) : doc.type.includes('word') || doc.type.includes('docx') ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDocumentClick(doc, 'document')}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <ExpandedFileView
          isOpen={expandedDialog === 'documents'}
          onClose={() => setExpandedDialog(null)}
          title="Documents"
          icon={<FileText className="w-5 h-5 text-violet-600" />}
          files={documents}
          onUpload={(files) => handleUpload(files, 'document')}
          onDownload={(file) => handleDownload(file)}
          onDelete={(id) => handleDelete(id)}
          onFileClick={(file) => handleDocumentClick(file, 'document')}
          getRootProps={getDocumentRootProps}
          getInputProps={getDocumentInputProps}
          type="documents"
        />

        {/* Memos Card */}
        {visibleCards.memos && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 py-2 px-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-sm font-semibold text-gray-900">Memos</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => handleExpand('memos')}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div {...getMemoRootProps()} className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-amber-400 transition-colors mb-4">
                <input {...getMemoInputProps()} />
                <p className="text-sm text-gray-500 text-center">Drop memos here or click to upload</p>
              </div>
              <div className="space-y-2">
                {memos.map((memo) => (
                  <div
                    key={memo.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {memo.type.includes('pdf') ? (
                        <FileText className="h-4 w-4 text-red-500" />
                      ) : memo.type.includes('word') || memo.type.includes('docx') ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-900 truncate">{memo.name}</p>
                        <p className="text-xs text-gray-500">{memo.type} • {memo.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDocumentClick(memo, 'memo')}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(memo)}
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(memo.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <ExpandedFileView
          isOpen={expandedDialog === 'memos'}
          onClose={() => setExpandedDialog(null)}
          title="Memos"
          icon={<MessageSquare className="w-5 h-5 text-amber-600" />}
          files={memos}
          onUpload={(files) => handleUpload(files, 'memo')}
          onDownload={(file) => handleDownload(file)}
          onDelete={(id) => handleDelete(id)}
          onFileClick={(file) => handleDocumentClick(file, 'memo')}
          getRootProps={getMemoRootProps}
          getInputProps={getMemoInputProps}
          type="memos"
        />

        {/* Denials Card */}
        {visibleCards.denials && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-500/10 to-red-600/10 py-2 px-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-sm font-semibold text-gray-900">Denials</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => handleExpand('denials')}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div {...getDenialRootProps()} className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-red-400 transition-colors mb-4">
                <input {...getDenialInputProps()} />
                <p className="text-sm text-gray-500 text-center">Drop denials here or click to upload</p>
              </div>
              <div className="space-y-2">
                {denials.map((denial) => (
                  <div
                    key={denial.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {denial.type.includes('pdf') ? (
                        <FileText className="h-4 w-4 text-red-500" />
                      ) : denial.type.includes('word') || denial.type.includes('docx') ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-900 truncate">{denial.name}</p>
                        <p className="text-xs text-gray-500">{denial.type} • {denial.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDocumentClick(denial, 'denial')}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(denial)}
                      >
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(denial.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <ExpandedFileView
          isOpen={expandedDialog === 'denials'}
          onClose={() => setExpandedDialog(null)}
          title="Denials"
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          files={denials}
          onUpload={(files) => handleUpload(files, 'denial')}
          onDownload={(file) => handleDownload(file)}
          onDelete={(id) => handleDelete(id)}
          onFileClick={(file) => handleDocumentClick(file, 'denial')}
          getRootProps={getDenialRootProps}
          getInputProps={getDenialInputProps}
          type="denials"
        />
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {/* Add document preview content here */}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant */}
      <AIAssistant currentFile={aiContext} />
    </div>
  );
}