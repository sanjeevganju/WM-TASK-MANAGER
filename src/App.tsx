import { useState, useMemo, useEffect } from 'react';
import { BaseSelectionPage, BaseData } from './components/BaseSelectionPage';
import { TrekSelectionPage, TrekData } from './components/TrekSelectionPage';
import { TrekDetailPage, CategoryProgress } from './components/TrekDetailPage';
import { CategoryTasksPage } from './components/CategoryTasksPage';
import { trekAPI, taskAPI, staffAPI } from './utils/api';
import { seedDatabase, checkIfSeeded } from './utils/seedData';

export type TrekType = 'treks' | 'expeditions' | 'climbs';
export type Team = 'ground-ops' | 'support' | 'trip-leader' | 'head-office';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';
export type Priority = 'high' | 'medium' | 'low';
export type InputType = 'text' | 'file' | 'link' | 'textarea' | 'dropdown' | 'multi-select' | 'vehicle-multi' | 'budget-with-voucher' | 'staff-with-contact';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  daysBeforeTrek: number;
  trekType: TrekType;
  team: Team;
  inputType?: 'text' | 'textarea' | 'file' | 'link' | 'dropdown' | 'multi-select' | 'vehicle-multi' | 'budget-with-voucher' | 'staff-with-contact';
  inputValue?: string;
  section: string;
  sectionNumber: number;
  taskNumber: number;
  category: string;
  trekName: string;
  baseName: string;
  isNA?: boolean; // Not Applicable checkbox - for permits
  allowMultiple?: boolean; // For Assistant Guides and Support Staff
  dropdownOptions?: string[]; // For dropdown selections
  budgetAmount?: number; // For budget fields
  voucherFile?: string; // For voucher file uploads
  isCalculated?: boolean; // For calculated total fields
}

type PageLevel = 'base' | 'selection' | 'detail' | 'tasks';

function App() {
  const [selectedTrekType] = useState<TrekType>('treks'); // Fixed to 'treks', no UI selector
  const [selectedTeam, setSelectedTeam] = useState<Team>('support'); // Fixed to 'support', no UI selector
  const [currentPage, setCurrentPage] = useState<PageLevel>('base');
  const [selectedBaseIndex, setSelectedBaseIndex] = useState<number | null>(null);
  const [selectedTrekIndex, setSelectedTrekIndex] = useState(0);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  
  // Backend integration state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendTreks, setBackendTreks] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Base names
  const baseNames = [
    'Uttarakhand',
    'Ladakh',
    'Himachal',
    'Sikkim',
    'Kashmir'
  ];

  // Mock data for treks with base assignments
  const trekNames = ['Markha Valley Trek', 'Hampta Pass Trek', 'Nubra Valley Trek', 'Hidden Meadows Garhwal'];
  
  // Mock staff database for dropdowns
  const staffDatabase = {
    tripLeaders: ['Rajesh Kumar', 'Amit Singh', 'Priya Sharma', 'Deepak Verma', 'Neha Patel'],
    cooks: ['Ramesh Bisht', 'Suresh Negi', 'Kailash Thapa', 'Mohan Rawat', 'Dinesh Kumar'],
    assistantGuides: ['Vijay Singh', 'Sonam Dorje', 'Tashi Namgyal', 'Karma Wangdi', 'Lobsang Dorji', 'Rinchen Dorji'],
    supportStaff: ['Raju Lal', 'Shankar Prasad', 'Bhim Bahadur', 'Jeet Singh', 'Narender Kumar', 'Prakash Rai']
  };
  
  // Load data from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if database has been seeded
        const isSeeded = await checkIfSeeded();
        
        if (!isSeeded) {
          console.log('Database not seeded. Seeding now...');
          await seedDatabase();
        }
        
        // Load treks from backend
        const treksFromBackend = await trekAPI.getAll();
        console.log('Loaded treks from backend:', treksFromBackend);
        setBackendTreks(treksFromBackend);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data from backend:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Sample tasks with simplified categories: Transport, Permits, Equipment, Kitchen, Team Assigned, Field Accounts
  const [tasks, setTasks] = useState<Task[]>([
    // Markha Valley Trek - Permits
    {
      id: 'mv-permit-1',
      title: 'IMF Permit',
      description: 'Upload IMF permit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 1,
      category: 'Permits',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-permit-2',
      title: 'Trekking Permit',
      description: 'Upload trekking permit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 2,
      category: 'Permits',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-permit-3',
      title: 'Trekking Chit',
      description: 'Upload trekking chit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 3,
      category: 'Permits',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-permit-4',
      title: 'Any other permit',
      description: 'Upload any other permit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 4,
      category: 'Permits',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-permit-5',
      title: 'Staff Insurance',
      description: 'Upload staff insurance or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 5,
      category: 'Permits',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    // Markha Valley Trek - Transport
    {
      id: 'mv-transport-1',
      title: 'Support Vehicle',
      description: 'Enter number of support vehicles and their details',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'vehicle-multi',
      section: 'Transport',
      sectionNumber: 2,
      taskNumber: 1,
      category: 'Transport',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      allowMultiple: true
    },
    {
      id: 'mv-transport-2',
      title: 'Client Transport',
      description: 'Enter vehicle registration, driver name, and contact',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'vehicle-multi',
      section: 'Transport',
      sectionNumber: 2,
      taskNumber: 2,
      category: 'Transport',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      allowMultiple: true
    },
    // Markha Valley Trek - Equipment
    {
      id: 'mv-equipment-1',
      title: 'Final Equipment List',
      description: 'Upload final equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 1,
      category: 'Equipment',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-equipment-2',
      title: 'Rental Equipment List',
      description: 'Upload rental equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 2,
      category: 'Equipment',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    // Markha Valley Trek - Kitchen
    {
      id: 'mv-kitchen-1',
      title: 'Kitchen Equipment Checklist',
      description: 'Verify and upload kitchen equipment checklist',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 1,
      category: 'Kitchen',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-kitchen-2',
      title: 'Menu',
      description: 'Create and upload menu plan',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 2,
      category: 'Kitchen',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-kitchen-3',
      title: 'Dry Ration Shopping List',
      description: 'Purchase and document dry rations',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 3,
      category: 'Kitchen',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-kitchen-4',
      title: 'Vegetable List',
      description: 'Purchase and document fresh vegetables',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 4,
      category: 'Kitchen',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-kitchen-5',
      title: 'Perishable Checklist',
      description: 'Purchase and document perishables (eggs, chicken, etc)',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 5,
      category: 'Kitchen',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    // Markha Valley Trek - Team Assigned
    {
      id: 'mv-team-1',
      title: 'Trip Leader',
      description: 'Select trip leader and enter contact number',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 15,
      trekType: 'treks',
      team: 'support',
      inputType: 'staff-with-contact',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 1,
      category: 'Team Assigned',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      dropdownOptions: staffDatabase.tripLeaders
    },
    {
      id: 'mv-team-2',
      title: 'Cook',
      description: 'Select cook and enter contact number',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 15,
      trekType: 'treks',
      team: 'support',
      inputType: 'staff-with-contact',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 2,
      category: 'Team Assigned',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      dropdownOptions: staffDatabase.cooks
    },
    {
      id: 'mv-team-3',
      title: 'Assistant Guides',
      description: 'Enter number of assistant guides, select from database and enter contact numbers',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'multi-select',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 3,
      category: 'Team Assigned',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      allowMultiple: true,
      dropdownOptions: staffDatabase.assistantGuides
    },
    {
      id: 'mv-team-4',
      title: 'Support Staff',
      description: 'Enter number of support staff, select from database and enter contact numbers',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'multi-select',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 4,
      category: 'Team Assigned',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      allowMultiple: true,
      dropdownOptions: staffDatabase.supportStaff
    },
    {
      id: 'mv-team-5',
      title: 'Personal Porter',
      description: 'Enter number of personal porters, their names and contact numbers',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'multi-select',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 5,
      category: 'Team Assigned',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      allowMultiple: true,
      dropdownOptions: []
    },
    // Markha Valley Trek - Field Accounts
    {
      id: 'mv-accounts-1',
      title: 'Guide Budget',
      description: 'Enter guide budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 1,
      category: 'Field Accounts',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-accounts-2',
      title: 'Cook Budget',
      description: 'Enter cook budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 2,
      category: 'Field Accounts',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-accounts-3',
      title: 'Any cash payments',
      description: 'Enter any additional cash payments and upload cash voucher',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 3,
      category: 'Field Accounts',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'mv-accounts-4',
      title: 'Total Budget',
      description: 'Automatically calculated total of all budgets',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 4,
      category: 'Field Accounts',
      trekName: 'Markha Valley Trek',
      baseName: 'Ladakh',
      isCalculated: true
    },

    // Hampta Pass Trek - Sample tasks
    {
      id: 'hp-permit-1',
      title: 'Obtain trekking permit',
      description: 'Upload pdf of permit',
      status: 'completed',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 1,
      category: 'Permits',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-permit-2',
      title: 'Forest clearance',
      description: 'Upload forest clearance',
      status: 'completed',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 2,
      category: 'Permits',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-permit-3',
      title: 'Staff Insurance',
      description: 'Upload staff insurance or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 3,
      category: 'Permits',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-transport-1',
      title: 'Support vehicle booking',
      description: 'Book support vehicles',
      status: 'completed',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Transport',
      sectionNumber: 2,
      taskNumber: 1,
      category: 'Transport',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-transport-2',
      title: 'Client vehicle booking',
      description: 'Book client transport',
      status: 'completed',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Transport',
      sectionNumber: 2,
      taskNumber: 2,
      category: 'Transport',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-equipment-1',
      title: 'Final Equipment List',
      description: 'Upload final equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 1,
      category: 'Equipment',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-equipment-2',
      title: 'Rental Equipment List',
      description: 'Upload rental equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 2,
      category: 'Equipment',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-kitchen-1',
      title: 'Kitchen Equipment Checklist',
      description: 'Verify and upload kitchen equipment checklist',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 1,
      category: 'Kitchen',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-kitchen-2',
      title: 'Menu',
      description: 'Create and upload menu plan',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 2,
      category: 'Kitchen',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-kitchen-3',
      title: 'Dry Ration Shopping List',
      description: 'Purchase and document dry rations',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 3,
      category: 'Kitchen',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-kitchen-4',
      title: 'Vegetable List',
      description: 'Purchase and document fresh vegetables',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 4,
      category: 'Kitchen',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-kitchen-5',
      title: 'Perishable Checklist',
      description: 'Purchase and document perishables (eggs, chicken, etc)',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 5,
      category: 'Kitchen',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-team-1',
      title: 'Guide',
      description: 'Assign guide and document details',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 15,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 1,
      category: 'Team Assigned',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-accounts-1',
      title: 'Guide Budget',
      description: 'Enter guide budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 1,
      category: 'Field Accounts',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-accounts-2',
      title: 'Cook Budget',
      description: 'Enter cook budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 2,
      category: 'Field Accounts',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-accounts-3',
      title: 'Any cash payments',
      description: 'Enter any additional cash payments and upload cash voucher',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 3,
      category: 'Field Accounts',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal'
    },
    {
      id: 'hp-accounts-4',
      title: 'Total Budget',
      description: 'Automatically calculated total of all budgets',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 4,
      category: 'Field Accounts',
      trekName: 'Hampta Pass Trek',
      baseName: 'Himachal',
      isCalculated: true
    },

    // Nubra Valley Trek - Sample tasks
    {
      id: 'nv-permit-1',
      title: 'Obtain trekking permit',
      description: 'Upload pdf of permit',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 1,
      category: 'Permits',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-permit-2',
      title: 'Staff Insurance',
      description: 'Upload staff insurance or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 2,
      category: 'Permits',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-transport-1',
      title: 'Support vehicle booking',
      description: 'Book support vehicles',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Transport',
      sectionNumber: 2,
      taskNumber: 1,
      category: 'Transport',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-equipment-1',
      title: 'Final Equipment List',
      description: 'Upload final equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 1,
      category: 'Equipment',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-equipment-2',
      title: 'Rental Equipment List',
      description: 'Upload rental equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 2,
      category: 'Equipment',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-kitchen-1',
      title: 'Kitchen Equipment Checklist',
      description: 'Verify and upload kitchen equipment checklist',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 1,
      category: 'Kitchen',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-kitchen-2',
      title: 'Menu',
      description: 'Create and upload menu plan',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 2,
      category: 'Kitchen',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-kitchen-3',
      title: 'Dry Ration Shopping List',
      description: 'Purchase and document dry rations',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 3,
      category: 'Kitchen',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-kitchen-4',
      title: 'Vegetable List',
      description: 'Purchase and document fresh vegetables',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 4,
      category: 'Kitchen',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-kitchen-5',
      title: 'Perishable Checklist',
      description: 'Purchase and document perishables (eggs, chicken, etc)',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 5,
      category: 'Kitchen',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-team-1',
      title: 'Guide',
      description: 'Assign guide and document details',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 15,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 1,
      category: 'Team Assigned',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-accounts-1',
      title: 'Guide Budget',
      description: 'Enter guide budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 1,
      category: 'Field Accounts',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-accounts-2',
      title: 'Cook Budget',
      description: 'Enter cook budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 2,
      category: 'Field Accounts',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-accounts-3',
      title: 'Any cash payments',
      description: 'Enter any additional cash payments and upload cash voucher',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 3,
      category: 'Field Accounts',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh'
    },
    {
      id: 'nv-accounts-4',
      title: 'Total Budget',
      description: 'Automatically calculated total of all budgets',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 4,
      category: 'Field Accounts',
      trekName: 'Nubra Valley Trek',
      baseName: 'Ladakh',
      isCalculated: true
    },

    // Hidden Meadows Garhwal - Permits
    {
      id: 'hm-permit-1',
      title: 'IMF Permit',
      description: 'Upload IMF permit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 1,
      category: 'Permits',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-permit-2',
      title: 'Trekking Permit',
      description: 'Upload trekking permit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 2,
      category: 'Permits',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-permit-3',
      title: 'Trekking Chit',
      description: 'Upload trekking chit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 3,
      category: 'Permits',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-permit-4',
      title: 'Any other permit',
      description: 'Upload any other permit or mark as NA if not applicable',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 4,
      category: 'Permits',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-permit-5',
      title: 'Staff Insurance',
      description: 'Upload staff insurance or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 7,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Permits',
      sectionNumber: 1,
      taskNumber: 5,
      category: 'Permits',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    // Hidden Meadows Garhwal - Transport
    {
      id: 'hm-transport-1',
      title: 'Support Vehicle',
      description: 'Enter number of support vehicles and their details',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'vehicle-multi',
      section: 'Transport',
      sectionNumber: 2,
      taskNumber: 1,
      category: 'Transport',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      allowMultiple: true
    },
    {
      id: 'hm-transport-2',
      title: 'Client Transport',
      description: 'Enter vehicle registration, driver name, and contact',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'vehicle-multi',
      section: 'Transport',
      sectionNumber: 2,
      taskNumber: 2,
      category: 'Transport',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      allowMultiple: true
    },
    // Hidden Meadows Garhwal - Equipment
    {
      id: 'hm-equipment-1',
      title: 'Final Equipment List',
      description: 'Upload final equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 1,
      category: 'Equipment',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-equipment-2',
      title: 'Rental Equipment List',
      description: 'Upload rental equipment list or mark as NA if not applicable',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 5,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Equipment',
      sectionNumber: 3,
      taskNumber: 2,
      category: 'Equipment',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-kitchen-1',
      title: 'Kitchen Equipment Checklist',
      description: 'Verify and upload kitchen equipment checklist',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 1,
      category: 'Kitchen',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-kitchen-2',
      title: 'Menu',
      description: 'Create and upload menu plan',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 2,
      category: 'Kitchen',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-kitchen-3',
      title: 'Dry Ration Shopping List',
      description: 'Purchase and document dry rations',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 3,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 3,
      category: 'Kitchen',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-kitchen-4',
      title: 'Vegetable List',
      description: 'Purchase and document fresh vegetables',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 4,
      category: 'Kitchen',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-kitchen-5',
      title: 'Perishable Checklist',
      description: 'Purchase and document perishables (eggs, chicken, etc)',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 1,
      trekType: 'treks',
      team: 'support',
      inputType: 'file',
      section: 'Kitchen',
      sectionNumber: 4,
      taskNumber: 5,
      category: 'Kitchen',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    // Hidden Meadows Garhwal - Team Assigned
    {
      id: 'hm-team-1',
      title: 'Trip Leader',
      description: 'Select trip leader and enter contact number',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 15,
      trekType: 'treks',
      team: 'support',
      inputType: 'staff-with-contact',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 1,
      category: 'Team Assigned',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      dropdownOptions: staffDatabase.tripLeaders
    },
    {
      id: 'hm-team-2',
      title: 'Cook',
      description: 'Select cook and enter contact number',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 15,
      trekType: 'treks',
      team: 'support',
      inputType: 'staff-with-contact',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 2,
      category: 'Team Assigned',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      dropdownOptions: staffDatabase.cooks
    },
    {
      id: 'hm-team-3',
      title: 'Assistant Guides',
      description: 'Enter number of assistant guides, select from database and enter contact numbers',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'multi-select',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 3,
      category: 'Team Assigned',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      allowMultiple: true,
      dropdownOptions: staffDatabase.assistantGuides
    },
    {
      id: 'hm-team-4',
      title: 'Support Staff',
      description: 'Enter number of support staff, select from database and enter contact numbers',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'multi-select',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 4,
      category: 'Team Assigned',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      allowMultiple: true,
      dropdownOptions: staffDatabase.supportStaff
    },
    {
      id: 'hm-team-5',
      title: 'Personal Porter',
      description: 'Enter number of personal porters, their names and contact numbers',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 10,
      trekType: 'treks',
      team: 'support',
      inputType: 'multi-select',
      section: 'Team Assigned',
      sectionNumber: 5,
      taskNumber: 5,
      category: 'Team Assigned',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      allowMultiple: true,
      dropdownOptions: []
    },
    // Hidden Meadows Garhwal - Field Accounts
    {
      id: 'hm-accounts-1',
      title: 'Guide Budget',
      description: 'Enter guide budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 1,
      category: 'Field Accounts',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-accounts-2',
      title: 'Cook Budget',
      description: 'Enter cook budget amount and upload cash voucher',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 2,
      category: 'Field Accounts',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-accounts-3',
      title: 'Any cash payments',
      description: 'Enter any additional cash payments and upload cash voucher',
      status: 'not-started',
      priority: 'medium',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'budget-with-voucher',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 3,
      category: 'Field Accounts',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand'
    },
    {
      id: 'hm-accounts-4',
      title: 'Total Budget',
      description: 'Automatically calculated total of all budgets',
      status: 'not-started',
      priority: 'high',
      daysBeforeTrek: 2,
      trekType: 'treks',
      team: 'support',
      inputType: 'text',
      section: 'Field Accounts',
      sectionNumber: 6,
      taskNumber: 4,
      category: 'Field Accounts',
      trekName: 'Hidden Meadows Garhwal',
      baseName: 'Uttarakhand',
      isCalculated: true
    }
  ]);

  // Calculate progress for each trek
  const treksData: TrekData[] = useMemo(() => {
    return trekNames.map((name, index) => {
      const trekTasks = tasks.filter(t => 
        t.trekName === name && 
        t.trekType === selectedTrekType && 
        t.team === selectedTeam &&
        (selectedBaseIndex === null || t.baseName === baseNames[selectedBaseIndex])
      );
      // Task is completed if it has an inputValue OR isNA is checked
      const completed = trekTasks.filter(t => (t.inputValue && t.inputValue.trim()) || t.isNA).length;
      
      // Specific dates for each trek
      let startDate, endDate, numberOfClients;
      
      if (name === 'Hidden Meadows Garhwal') {
        startDate = new Date(2026, 2, 15); // March 15, 2026
        endDate = new Date(2026, 2, 19); // March 19, 2026
        numberOfClients = 24;
      } else {
        // Mock data for other treks
        startDate = new Date(2025, 5, 15 + index * 7);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7); // 7-day treks
        numberOfClients = [12, 18, 8][index] || 10; // Mock client numbers
      }
      
      return {
        name,
        startDate,
        endDate,
        numberOfClients,
        completed,
        total: trekTasks.length
      };
    });
  }, [tasks, selectedTrekType, selectedTeam, selectedBaseIndex, baseNames, trekNames]);

  // Calculate base data with active/total trips
  const basesData: BaseData[] = useMemo(() => {
    return baseNames.map((baseName) => {
      // Get unique treks for this base
      const baseTreks = new Set(
        tasks
          .filter(t => 
            t.baseName === baseName && 
            t.trekType === selectedTrekType && 
            t.team === selectedTeam
          )
          .map(t => t.trekName)
      );
      
      const totalTrips = baseTreks.size;
      
      // Count active treks (treks with at least one in-progress or completed task)
      let activeTrips = 0;
      baseTreks.forEach(trekName => {
        const trekTasks = tasks.filter(t => 
          t.trekName === trekName && 
          t.baseName === baseName &&
          t.trekType === selectedTrekType && 
          t.team === selectedTeam
        );
        const hasActivity = trekTasks.some(t => 
          t.status === 'in-progress' || t.status === 'completed'
        );
        if (hasActivity) activeTrips++;
      });
      
      return {
        name: baseName,
        activeTrips,
        totalTrips,
        region: baseName
      };
    });
  }, [tasks, baseNames, selectedTrekType, selectedTeam]);

  // Filter treks by selected base
  const filteredTreksData = useMemo(() => {
    if (selectedBaseIndex === null) {
      return treksData; // Show all treks
    }
    
    const selectedBaseName = baseNames[selectedBaseIndex];
    return treksData.filter(trek => {
      // Check if this trek has tasks from the selected base
      const hasTasks = tasks.some(t => 
        t.trekName === trek.name && 
        t.baseName === selectedBaseName &&
        t.trekType === selectedTrekType && 
        t.team === selectedTeam
      );
      return hasTasks;
    });
  }, [treksData, selectedBaseIndex, baseNames, tasks, selectedTrekType, selectedTeam]);

  // Calculate category progress for selected trek
  const categories: CategoryProgress[] = useMemo(() => {
    const categoryNames = [
      'Transport',
      'Permits',
      'Equipment',
      'Kitchen',
      'Team Assigned',
      'Field Accounts'
    ];

    const selectedTrekName = trekNames[selectedTrekIndex];
    
    return categoryNames.map(catName => {
      const catTasks = tasks.filter(t => 
        t.trekName === selectedTrekName &&
        t.category === catName &&
        t.trekType === selectedTrekType &&
        t.team === selectedTeam
      );
      // Task is completed if it has an inputValue OR isNA is checked
      const completed = catTasks.filter(t => (t.inputValue && t.inputValue.trim()) || t.isNA).length;
      
      return {
        name: catName,
        completed,
        total: catTasks.length,
        icon: null
      };
    });
  }, [tasks, selectedTrekIndex, selectedTrekType, selectedTeam, trekNames]);

  // Get tasks for selected category
  const categoryTasks = useMemo(() => {
    const selectedTrekName = trekNames[selectedTrekIndex];
    const selectedCategory = categories[selectedCategoryIndex];
    
    return tasks.filter(t => 
      t.trekName === selectedTrekName &&
      t.category === selectedCategory?.name &&
      t.trekType === selectedTrekType &&
      t.team === selectedTeam
    );
  }, [tasks, selectedTrekIndex, selectedCategoryIndex, selectedTrekType, selectedTeam, trekNames, categories]);

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    // Update local state immediately for responsive UI
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    
    // Save to backend (auto-save)
    const saveToBackend = async () => {
      try {
        setIsSaving(true);
        
        // Find the trek that this task belongs to
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
          console.error('Task not found:', taskId);
          return;
        }
        
        // Find the backend trek ID
        const backendTrek = backendTreks.find(t => t.name === task.trekName);
        if (!backendTrek) {
          console.error('Trek not found in backend:', task.trekName);
          return;
        }
        
        // Save task update to backend
        await taskAPI.update(backendTrek.id, taskId, updates);
        
        setLastSaved(new Date());
        console.log('Task saved to backend:', taskId, updates);
      } catch (err) {
        console.error('Error saving task to backend:', err);
        // Still keep the local update even if backend save fails
      } finally {
        setIsSaving(false);
      }
    };
    
    // Debounce the save to avoid too many API calls
    const timeoutId = setTimeout(saveToBackend, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleBaseSelect = (index: number) => {
    setSelectedBaseIndex(index);
    setCurrentPage('selection');
  };

  const handleTrekSelect = (index: number) => {
    setSelectedTrekIndex(index);
    setCurrentPage('detail');
  };

  const handleCategorySelect = (index: number) => {
    setSelectedCategoryIndex(index);
    setCurrentPage('tasks');
  };

  const handleBackFromSelection = () => {
    setCurrentPage('base');
    setSelectedBaseIndex(null);
  };

  const handleBackFromDetail = () => {
    setCurrentPage('selection');
  };

  const handleBackFromTasks = () => {
    setCurrentPage('detail');
  };

  const handleViewAllBases = () => {
    setSelectedBaseIndex(null);
    setCurrentPage('selection');
  };
  
  // Show loading screen while data loads
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-lg text-gray-700">Loading trek data...</p>
        </div>
      </div>
    );
  }
  
  // Show error screen if data failed to load
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Render current page
  if (currentPage === 'base') {
    return (
      <BaseSelectionPage
        bases={basesData}
        onSelectBase={handleBaseSelect}
        onViewAllBases={handleViewAllBases}
      />
    );
  }

  if (currentPage === 'selection') {
    return (
      <TrekSelectionPage
        treks={filteredTreksData}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        onSelectTrek={handleTrekSelect}
        onBack={handleBackFromSelection}
      />
    );
  }

  if (currentPage === 'detail') {
    const currentTrek = filteredTreksData[selectedTrekIndex] || filteredTreksData[0];
    return (
      <TrekDetailPage
        trek={currentTrek}
        categories={categories}
        onBack={handleBackFromDetail}
        onSelectCategory={handleCategorySelect}
      />
    );
  }

  if (currentPage === 'tasks') {
    const currentTrek = filteredTreksData[selectedTrekIndex] || filteredTreksData[0];
    const currentCategory = categories[selectedCategoryIndex];
    return (
      <CategoryTasksPage
        trekName={currentTrek.name}
        categoryName={currentCategory.name}
        tasks={categoryTasks}
        trekStartDate={currentTrek.startDate}
        onBack={handleBackFromTasks}
        onUpdateTask={handleUpdateTask}
      />
    );
  }

  return null;
}

export default App;