'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Scale, Briefcase, ChevronUp, ChevronDown, Search, Settings2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AllClientsProps {
  onCaseSelect: (caseId: string) => void;
}

interface Column {
  id: string;
  label: string;
  width: number;
  sortable?: boolean;
  visible?: boolean;
}

interface AvailableColumn extends Column {
  field: string;
  category: string;
}

const AVAILABLE_COLUMNS: AvailableColumn[] = [
  // Default columns
  { id: 'fileNo', label: 'File No.', width: 120, sortable: true, visible: true, field: 'fileNo', category: 'Basic Info' },
  { id: 'name', label: 'Client Name', width: 200, sortable: true, visible: true, field: 'clientName', category: 'Basic Info' },
  { id: 'caseType', label: 'Case Type', width: 150, sortable: true, visible: true, field: 'caseType', category: 'Basic Info' },
  { id: 'abCategory', label: 'AB Category', width: 140, sortable: true, visible: true, field: 'abCategory', category: 'Basic Info' },
  { id: 'dateOfLoss', label: 'Date of Loss', width: 150, sortable: true, visible: true, field: 'dateOfLoss', category: 'Basic Info' },
  { id: 'lawyer', label: 'Assigned Lawyer', width: 200, sortable: true, visible: true, field: 'lawyer', category: 'Basic Info' },
  { id: 'paralegal', label: 'Assigned Paralegal', width: 200, sortable: true, visible: true, field: 'paralegal', category: 'Basic Info' },
  // Additional columns
  { id: 'abInsurer', label: 'AB Insurer', width: 180, sortable: true, visible: false, field: 'details.automobileInsurance.insuranceCompany', category: 'Insurance' },
  { id: 'abClaimNumber', label: 'AB Claim Number', width: 160, sortable: true, visible: false, field: 'details.automobileInsurance.claimNumber', category: 'Insurance' },
  { id: 'defendantInsurer', label: 'Defendant Insurer', width: 180, sortable: true, visible: false, field: 'details.defendantInsurance.insuranceCompany', category: 'Insurance' },
  { id: 'status', label: 'Status', width: 140, sortable: true, visible: false, field: 'status', category: 'Basic Info' },
  { id: 'familyDoctor', label: 'Family Doctor', width: 180, sortable: true, visible: false, field: 'details.caseDetails.familyDoctor', category: 'Medical' },
  { id: 'hospital', label: 'Hospital', width: 180, sortable: true, visible: false, field: 'details.caseDetails.hospitalAttended', category: 'Medical' }
];

type SortDirection = 'asc' | 'desc' | null;
type SortConfig = { key: string; direction: SortDirection };

export function AllClients({ onCaseSelect }: AllClientsProps) {
  const [columns, setColumns] = useState<Column[]>(
    AVAILABLE_COLUMNS.filter(col => col.visible)
  );
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resizing, setResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'fileNo', direction: null });
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'fileNo',
    'clientName',
    'caseType',
    'status',
    'dateOpened',
    'lawyer',
    'paralegal'
  ]);

  // Function to get nested object value by path
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || 'N/A';
  };

  // Function to toggle column visibility
  const toggleColumn = (columnId: string) => {
    const availableColumn = AVAILABLE_COLUMNS.find(col => col.id === columnId);
    if (!availableColumn) return;

    setColumns(prevColumns => {
      const columnExists = prevColumns.some(col => col.id === columnId);
      if (columnExists) {
        return prevColumns.filter(col => col.id !== columnId);
      } else {
        return [...prevColumns, availableColumn];
      }
    });
  };

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('/api/cases/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const transformedData = data.map((item: any) => ({
          id: item.id,
          fileNo: item.fileNo,
          clientName: item.clientName,
          caseType: item.caseType,
          status: item.status,
          dateOpened: new Date(item.createdAt).toLocaleDateString(),
          lawyer: item.lawyer || 'N/A',
          paralegal: item.paralegal || 'N/A'
        }));
        
        setClients(transformedData);
      } catch (error) {
        console.error('Error fetching cases:', error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleMouseDown = (e: React.MouseEvent, columnId: string, initialWidth: number) => {
    setResizing(columnId);
    setStartX(e.pageX);
    setStartWidth(initialWidth);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        const diff = e.pageX - startX;
        setColumns(prevColumns => 
          prevColumns.map(col => 
            col.id === resizing 
              ? { ...col, width: Math.max(50, startWidth + diff) }
              : col
          )
        );
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, startX, startWidth]);

  const handleSort = (columnId: string) => {
    setSortConfig(prevConfig => ({
      key: columnId,
      direction: 
        prevConfig.key === columnId
          ? prevConfig.direction === 'asc'
            ? 'desc'
            : prevConfig.direction === 'desc'
              ? null
              : 'asc'
          : 'asc'
    }));
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (sortConfig.direction === null) return 0;
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Filter clients based on search query
  const filteredClients = sortedClients.filter(client => {
    const searchLower = searchQuery.toLowerCase();
    return columns.some(column => {
      const value = getNestedValue(client, AVAILABLE_COLUMNS.find(col => col.id === column.id)?.field || column.id);
      return String(value).toLowerCase().includes(searchLower);
    });
  });

  return (
    <div className="p-4">
      {/* Header with Search Bar and Column Settings */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">All Clients</h2>
        <div className="flex items-center space-x-4">
          <div className="w-72 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/95 border-gray-200 text-gray-900 placeholder:text-gray-500 h-9 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              <Settings2 className="h-4 w-4 mr-2 text-gray-600" />
              Columns
            </Button>
            {showColumnSelector && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-50 border border-gray-200 divide-y divide-gray-100">
                <div className="p-2">
                  <div className="text-sm font-semibold px-2 py-1 text-gray-900">Visible Columns</div>
                  {Object.entries(
                    AVAILABLE_COLUMNS.reduce<Record<string, AvailableColumn[]>>((acc, col) => {
                      (acc[col.category] = acc[col.category] || []).push(col);
                      return acc;
                    }, {})
                  ).map(([category, categoryColumns]) => (
                    <div key={category}>
                      <div className="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-50">{category}</div>
                      {categoryColumns.map((col) => (
                        <div
                          key={col.id}
                          className="flex items-center px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleColumn(col.id)}
                        >
                          <input
                            type="checkbox"
                            checked={columns.some(column => column.id === col.id)}
                            onChange={() => toggleColumn(col.id)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{col.label}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-pink-50/90 border-b border-gray-200/50">
          <div className="px-6 py-4 bg-white/50 backdrop-blur-sm">
            <div className="flex w-full">
              {columns.map((column, index) => (
                <div
                  key={column.id}
                  className="flex items-center"
                  style={{ width: column.width }}
                >
                  <div 
                    className={cn(
                      "flex items-center gap-2 flex-1 min-w-0 group",
                      column.sortable && "cursor-pointer select-none"
                    )}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "text-sm font-semibold transition-colors duration-200",
                        sortConfig.key === column.id
                          ? "text-blue-600"
                          : "text-gray-600 group-hover:text-gray-900"
                      )}>
                        {column.label}
                      </div>
                      {column.sortable && (
                        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <ChevronUp 
                            className={cn(
                              "w-3 h-3 -mb-1 transition-colors duration-200",
                              sortConfig.key === column.id && sortConfig.direction === 'asc'
                                ? "text-blue-600"
                                : "text-gray-400"
                            )}
                          />
                          <ChevronDown 
                            className={cn(
                              "w-3 h-3 transition-colors duration-200",
                              sortConfig.key === column.id && sortConfig.direction === 'desc'
                                ? "text-blue-600"
                                : "text-gray-400"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {index < columns.length - 1 && (
                    <div
                      className={cn(
                        "w-px h-4 mx-2 bg-gray-200/50 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-600/50 transition-colors duration-200",
                        resizing === column.id && "bg-blue-600/50"
                      )}
                      onMouseDown={(e) => handleMouseDown(e, column.id, column.width)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200/50">
          {loading ? (
            <div className="px-6 py-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading cases...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-gray-600">
                {clients.length === 0 ? "No cases found" : "No matching cases found"}
              </p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => onCaseSelect(client.id)}
                className="group px-6 py-3 hover:bg-gray-50/50 cursor-pointer transition-colors duration-200"
              >
                <div className="flex w-full">
                  {columns.map((column, index) => {
                    const availableColumn = AVAILABLE_COLUMNS.find(col => col.id === column.id);
                    const value = getNestedValue(client, availableColumn?.field || column.id);
                    
                    return (
                      <div 
                        key={column.id}
                        style={{ width: column.width }} 
                        className="flex items-center space-x-2"
                      >
                        {column.id === 'name' ? (
                          <>
                            <div className="p-1.5 rounded-full bg-blue-500/10 shrink-0">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">{value}</span>
                          </>
                        ) : column.id === 'caseType' ? (
                          <>
                            <Scale className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-900 truncate">{value}</span>
                          </>
                        ) : column.id === 'lawyer' || column.id === 'paralegal' ? (
                          <>
                            <User className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-900 truncate">{value}</span>
                          </>
                        ) : column.id === 'abCategory' ? (
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            value === 'CAT' ? "bg-red-100 text-red-700" :
                            value === 'Non-CAT' ? "bg-purple-100 text-purple-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {value}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-900">{value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}