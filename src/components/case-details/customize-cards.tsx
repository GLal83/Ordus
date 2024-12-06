'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings } from "lucide-react"
import { Label } from "@/components/ui/label"

interface CustomizeCardsProps {
  visibleCards: Record<string, boolean>;
  onVisibilityChange: (cardId: string, isVisible: boolean) => void;
}

const CARD_OPTIONS = [
  { id: 'clientInfo', label: 'Client Information', category: 'Personal' },
  { id: 'contactInfo', label: 'Contact Information', category: 'Personal' },
  { id: 'emergencyContact', label: 'Emergency Contact', category: 'Personal' },
  { id: 'caseInfo', label: 'Case Information', category: 'Case' },
  { id: 'legalTeam', label: 'Legal Team', category: 'Case' },
  { id: 'keyDeadlines', label: 'Key Deadlines', category: 'Case' },
  { id: 'accidentDetails', label: 'Accident Details', category: 'Accident' },
  { id: 'injuries', label: 'Injuries', category: 'Medical' },
  { id: 'preExistingInjuries', label: 'Pre-existing Injuries', category: 'Medical' },
  { id: 'medicalProviders', label: 'Medical Providers', category: 'Medical' },
  { id: 'diagnosis', label: 'Diagnosis & Treatment', category: 'Medical' },
  { id: 'autoInsurance', label: 'Automobile Insurance', category: 'Insurance' },
  { id: 'defendantInsurance', label: 'Defendant Insurance', category: 'Insurance' },
  { id: 'collateralBenefits', label: 'Collateral Benefits', category: 'Insurance' },
  { id: 'employment', label: 'Employment History', category: 'Employment' },
  { id: 'policeInfo', label: 'Police Information', category: 'Police & Witness' },
  { id: 'witnessInfo', label: 'Witness Information', category: 'Police & Witness' },
  { id: 'documents', label: 'Documents', category: 'Files' },
  { id: 'memos', label: 'Memos', category: 'Files' },
  { id: 'denials', label: 'Denials', category: 'Files' }
]

const CATEGORIES = [
  'Personal',
  'Case',
  'Accident',
  'Medical',
  'Insurance',
  'Employment',
  'Police & Witness',
  'Files'
]

export function CustomizeCards({ visibleCards, onVisibilityChange }: CustomizeCardsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-4 bg-white hover:bg-gray-50 border-gray-200"
        >
          <Settings className="w-4 h-4 mr-2 text-gray-700" />
          <span className="text-sm font-medium text-gray-900">Customize Cards</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader className="space-y-2 pb-3 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Customize Visible Cards
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700">
            Select which cards you want to show in the case details view. Changes will be saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 pt-3">
          {CATEGORIES.map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-900 pb-1.5 border-b border-gray-200">
                {category}
              </h3>
              <div className="space-y-1">
                {CARD_OPTIONS.filter(card => card.category === category).map((card) => (
                  <div 
                    key={card.id} 
                    className="flex items-center space-x-2 py-1 px-1.5 rounded transition-colors hover:bg-gray-100/80"
                  >
                    <Checkbox
                      id={card.id}
                      checked={visibleCards[card.id]}
                      onCheckedChange={(checked) => onVisibilityChange(card.id, checked as boolean)}
                      className="h-3.5 w-3.5 rounded border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label 
                      htmlFor={card.id} 
                      className="text-sm font-medium text-gray-900 cursor-pointer select-none"
                    >
                      {card.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 