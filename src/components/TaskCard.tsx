import { Task } from '../App';
import { Upload, Link2, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';

interface VehicleDetails {
  make: string;
  registration: string;
  driverName: string;
  contact: string;
}

interface StaffDetails {
  name: string;
  contact: string;
}

interface TaskCardProps {
  task: Task;
  allTasks?: Task[];
  onUpdateInput: (taskId: string, inputValue: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  isReadOnly?: boolean;
}

export function TaskCard({ task, allTasks, onUpdateInput, onUpdateTask, isReadOnly = false }: TaskCardProps) {
  const [fileName, setFileName] = useState<string>('');
  const [staffCount, setStaffCount] = useState<number>(0);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [vehicleCount, setVehicleCount] = useState<number>(0);
  const [vehicles, setVehicles] = useState<VehicleDetails[]>([]);
  const [voucherFileName, setVoucherFileName] = useState<string>('');
  const [staffName, setStaffName] = useState<string>('');
  const [staffContact, setStaffContact] = useState<string>('');
  const [staffMembers, setStaffMembers] = useState<StaffDetails[]>([]);

  // Validation function for 10-digit phone numbers
  const isValidPhoneNumber = (phone: string): boolean => {
    return /^\d{10}$/.test(phone.trim());
  };

  // Check if contact is invalid (not empty and not 10 digits)
  const isInvalidContact = (phone: string): boolean => {
    return phone.trim() !== '' && !isValidPhoneNumber(phone);
  };

  // Task is automatically "done" based on type
  const isDone = task.isNA || (
    task.inputType === 'budget-with-voucher' 
      ? !!(task.budgetAmount && task.voucherFile)
      : !!(task.inputValue && task.inputValue.trim())
  );
  
  // Check if this task belongs to Permits or Equipment category (should show NA checkbox)
  // Don't show N/A for calculated fields
  const showNACheckbox = !task.isCalculated && (
    task.category === 'Permits' || 
    task.category === 'Equipment' || 
    task.inputType === 'budget-with-voucher'
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUpdateInput(task.id, file.name);
      // If file is uploaded, uncheck NA
      if (onUpdateTask) {
        onUpdateTask(task.id, { isNA: false });
      }
    }
  };

  const handleNAChange = (checked: boolean) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { isNA: checked });
      // If NA is checked, clear the input value
      if (checked) {
        onUpdateInput(task.id, '');
        setFileName('');
      }
    }
  };

  const renderInputField = () => {
    // Handle calculated total field
    if (task.isCalculated && allTasks) {
      // Calculate total from budget-with-voucher tasks in the same section and category
      const budgetTasks = allTasks.filter(t => 
        t.category === task.category &&
        t.section === task.section &&
        t.inputType === 'budget-with-voucher' &&
        !t.isNA
      );
      
      const total = budgetTasks.reduce((sum, t) => sum + (t.budgetAmount || 0), 0);
      
      return (
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 font-medium whitespace-nowrap">Total (₹):</label>
          <input
            type="text"
            value={total > 0 ? `₹ ${total.toLocaleString('en-IN')}` : '₹ 0'}
            disabled
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded bg-emerald-50 text-emerald-800 font-semibold cursor-not-allowed"
            readOnly
          />
        </div>
      );
    }

    switch (task.inputType) {
      case 'text':
        return (
          <input
            type="text"
            value={task.inputValue || ''}
            onChange={(e) => onUpdateInput(task.id, e.target.value)}
            placeholder="Enter here..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
            readOnly={isReadOnly}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={task.inputValue || ''}
            onChange={(e) => onUpdateInput(task.id, e.target.value)}
            placeholder="Enter details..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500 resize-none"
            readOnly={isReadOnly}
          />
        );
      
      case 'link':
        return (
          <div className="relative">
            <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="url"
              value={task.inputValue || ''}
              onChange={(e) => onUpdateInput(task.id, e.target.value)}
              placeholder="Paste link here..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
              readOnly={isReadOnly}
            />
          </div>
        );
      
      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              id={`file-${task.id}`}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              disabled={task.isNA || isReadOnly}
            />
            <label
              htmlFor={`file-${task.id}`}
              className={`flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded transition-colors ${
                task.isNA 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-slate-50'
              }`}
            >
              <Upload className={`w-4 h-4 ${task.isNA ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={`flex-1 truncate ${task.isNA ? 'text-slate-400' : 'text-slate-600'}`}>
                {task.isNA ? 'N/A - Upload disabled' : (fileName || task.inputValue || 'Choose file...')}
              </span>
            </label>
          </div>
        );
      
      case 'dropdown':
        return (
          <select
            value={task.inputValue || ''}
            onChange={(e) => onUpdateInput(task.id, e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
            disabled={isReadOnly}
          >
            <option value="">Select...</option>
            {task.dropdownOptions?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'multi-select':
        const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const count = parseInt(e.target.value) || 0;
          setStaffCount(count);
          setStaffMembers(new Array(count).fill({ name: '', contact: '' }));
        };

        const handleStaffMemberChange = (index: number, field: keyof StaffDetails, value: string) => {
          const newStaffMembers = [...staffMembers];
          newStaffMembers[index] = { ...newStaffMembers[index], [field]: value };
          setStaffMembers(newStaffMembers);
          
          // Check if all staff members are fully filled with VALID contact numbers
          const allFilled = newStaffMembers.every(s => 
            s.name.trim() && s.contact.trim() && isValidPhoneNumber(s.contact)
          );
          
          if (allFilled && staffCount > 0) {
            onUpdateInput(task.id, JSON.stringify(newStaffMembers));
          }
        };

        return (
          <div className="space-y-3">
            {/* Number input */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600 whitespace-nowrap">Number of {task.title}:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={staffCount}
                onChange={handleStaffCountChange}
                className="w-20 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
                placeholder="0"
                readOnly={isReadOnly}
              />
            </div>

            {/* Staff member details based on count */}
            {staffCount > 0 && (
              <div className="space-y-3">
                {Array.from({ length: staffCount }).map((_, index) => {
                  const currentStaffName = staffMembers[index]?.name || '';
                  const isCustomName = task.dropdownOptions && task.dropdownOptions.length > 0 && 
                                      !task.dropdownOptions.includes(currentStaffName) && 
                                      currentStaffName !== '';
                  
                  return (
                    <div key={index} className="border border-slate-200 rounded p-3 space-y-2 bg-slate-50">
                      <div className="text-xs text-emerald-700 font-medium mb-2">{task.title.slice(0, -1)} {index + 1}</div>
                      {/* Show dropdown if options exist, otherwise show text input */}
                      {task.dropdownOptions && task.dropdownOptions.length > 0 ? (
                        <div className="space-y-2">
                          <select
                            value={isCustomName ? 'add-new' : currentStaffName}
                            onChange={(e) => {
                              if (e.target.value === 'add-new') {
                                handleStaffMemberChange(index, 'name', '');
                              } else {
                                handleStaffMemberChange(index, 'name', e.target.value);
                              }
                            }}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                            disabled={isReadOnly}
                          >
                            <option value="">Select...</option>
                            {task.dropdownOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                            <option value="add-new" className="text-emerald-600 font-medium">+ Add new</option>
                          </select>
                          
                          {/* Show text input if "Add new" is selected */}
                          {(isCustomName || currentStaffName === '') && (
                            <input
                              type="text"
                              value={currentStaffName}
                              onChange={(e) => handleStaffMemberChange(index, 'name', e.target.value)}
                              placeholder="Enter name..."
                              className="w-full px-3 py-2 text-sm border border-emerald-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                              readOnly={isReadOnly}
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={currentStaffName}
                          onChange={(e) => handleStaffMemberChange(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                          readOnly={isReadOnly}
                        />
                      )}
                      <input
                        type="tel"
                        value={staffMembers[index]?.contact || ''}
                        onChange={(e) => handleStaffMemberChange(index, 'contact', e.target.value)}
                        placeholder="Contact No."
                        className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-emerald-500 bg-white ${
                          isInvalidContact(staffMembers[index]?.contact || '') ? 'border-red-500' : 'border-slate-300'
                        }`}
                        readOnly={isReadOnly}
                      />
                      {isInvalidContact(staffMembers[index]?.contact || '') && (
                        <p className="text-xs text-red-600 mt-1">Contact number must be exactly 10 digits</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      case 'vehicle-multi':
        const handleVehicleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const count = parseInt(e.target.value) || 0;
          setVehicleCount(count);
          setVehicles(new Array(count).fill({ make: '', registration: '', driverName: '', contact: '' }));
        };

        const handleVehicleChange = (index: number, field: keyof VehicleDetails, value: string) => {
          const newVehicles = [...vehicles];
          newVehicles[index] = { ...newVehicles[index], [field]: value };
          setVehicles(newVehicles);
          
          // Check if all vehicles are fully filled with VALID contact numbers
          const allFilled = newVehicles.every(v => 
            v.make.trim() && v.registration.trim() && v.driverName.trim() && v.contact.trim() && isValidPhoneNumber(v.contact)
          );
          
          if (allFilled && vehicleCount > 0) {
            onUpdateInput(task.id, JSON.stringify(newVehicles));
          }
        };

        return (
          <div className="space-y-3">
            {/* Number input */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600 whitespace-nowrap">Number of vehicles:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={vehicleCount}
                onChange={handleVehicleCountChange}
                className="w-20 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
                placeholder="0"
                readOnly={isReadOnly}
              />
            </div>

            {/* Vehicle detail inputs based on count */}
            {vehicleCount > 0 && (
              <div className="space-y-4">
                {Array.from({ length: vehicleCount }).map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded p-3 space-y-2 bg-slate-50">
                    <div className="text-xs text-emerald-700 font-medium mb-2">Vehicle {index + 1}</div>
                    <input
                      type="text"
                      value={vehicles[index]?.make || ''}
                      onChange={(e) => handleVehicleChange(index, 'make', e.target.value)}
                      placeholder="Vehicle Make (e.g., SUV, Tempo)"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                      readOnly={isReadOnly}
                    />
                    <input
                      type="text"
                      value={vehicles[index]?.registration || ''}
                      onChange={(e) => handleVehicleChange(index, 'registration', e.target.value)}
                      placeholder="Vehicle Registration No."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                      readOnly={isReadOnly}
                    />
                    <input
                      type="text"
                      value={vehicles[index]?.driverName || ''}
                      onChange={(e) => handleVehicleChange(index, 'driverName', e.target.value)}
                      placeholder="Driver Name"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                      readOnly={isReadOnly}
                    />
                    <input
                      type="tel"
                      value={vehicles[index]?.contact || ''}
                      onChange={(e) => handleVehicleChange(index, 'contact', e.target.value)}
                      placeholder="Contact No."
                      className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-emerald-500 bg-white ${
                        isInvalidContact(vehicles[index]?.contact || '') ? 'border-red-500' : 'border-slate-300'
                      }`}
                      readOnly={isReadOnly}
                    />
                    {isInvalidContact(vehicles[index]?.contact || '') && (
                      <p className="text-xs text-red-600 mt-1">Contact number must be exactly 10 digits</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'budget-with-voucher':
        const handleBudgetChange = (amount: string) => {
          if (onUpdateTask) {
            const budgetAmount = amount ? parseFloat(amount) : undefined;
            onUpdateTask(task.id, { budgetAmount });
            // If budget is entered, uncheck NA
            if (amount) {
              onUpdateTask(task.id, { isNA: false });
            }
          }
        };

        const handleVoucherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file && onUpdateTask) {
            setVoucherFileName(file.name);
            onUpdateTask(task.id, { voucherFile: file.name, isNA: false });
          }
        };

        return (
          <div className="space-y-3">
            {/* Budget input */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600 whitespace-nowrap">Budget (₹):</label>
              <input
                type="number"
                min="0"
                value={task.budgetAmount ?? ''}
                onChange={(e) => handleBudgetChange(e.target.value)}
                disabled={task.isNA || isReadOnly}
                className={`flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500 ${
                  task.isNA ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''
                }`}
                placeholder="Enter amount"
              />
            </div>

            {/* Voucher file upload */}
            <div className="relative">
              <input
                type="file"
                id={`voucher-file-${task.id}`}
                onChange={handleVoucherFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                disabled={task.isNA || isReadOnly}
              />
              <label
                htmlFor={`voucher-file-${task.id}`}
                className={`flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded transition-colors ${
                  task.isNA 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'cursor-pointer hover:bg-slate-50'
                }`}
              >
                <Upload className={`w-4 h-4 ${task.isNA ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`flex-1 truncate ${task.isNA ? 'text-slate-400' : 'text-slate-600'}`}>
                  {task.isNA ? 'N/A - Upload disabled' : (task.voucherFile || voucherFileName || 'Upload cash voucher...')}
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'staff-with-contact':
        const handleStaffWithContactChange = () => {
          if (staffName && staffContact) {
            const staffData: StaffDetails = { name: staffName, contact: staffContact };
            onUpdateInput(task.id, JSON.stringify(staffData));
          }
        };
        
        const isCustomStaffName = task.dropdownOptions && !task.dropdownOptions.includes(staffName) && staffName !== '';

        return (
          <div className="space-y-3">
            {/* Dropdown for staff selection */}
            {task.dropdownOptions && task.dropdownOptions.length > 0 && (
              <div className="space-y-2">
                <select
                  value={isCustomStaffName ? 'add-new' : staffName}
                  onChange={(e) => {
                    if (e.target.value === 'add-new') {
                      setStaffName('');
                    } else {
                      setStaffName(e.target.value);
                      setTimeout(() => handleStaffWithContactChange(), 0);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-emerald-500"
                  disabled={isReadOnly}
                >
                  <option value="">Select {task.title}...</option>
                  {task.dropdownOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="add-new" className="text-emerald-600 font-medium">+ Add new</option>
                </select>
                
                {/* Show text input if "Add new" is selected */}
                {(isCustomStaffName || staffName === '') && (
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => {
                      setStaffName(e.target.value);
                      setTimeout(() => handleStaffWithContactChange(), 0);
                    }}
                    placeholder="Enter name..."
                    className="w-full px-3 py-2 text-sm border border-emerald-300 rounded focus:outline-none focus:border-emerald-500 bg-emerald-50"
                    readOnly={isReadOnly}
                  />
                )}
              </div>
            )}
            
            {/* Contact number input */}
            <input
              type="tel"
              value={staffContact}
              onChange={(e) => {
                setStaffContact(e.target.value);
                setTimeout(() => handleStaffWithContactChange(), 0);
              }}
              placeholder="Contact No."
              className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-emerald-500 ${
                isInvalidContact(staffContact) ? 'border-red-500' : 'border-slate-300'
              }`}
              readOnly={isReadOnly}
            />
            {isInvalidContact(staffContact) && (
              <p className="text-xs text-red-600 mt-1">Contact number must be exactly 10 digits</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg border-2 transition-all p-4 ${ 
      isDone
        ? 'border-emerald-300 bg-emerald-50/30' 
        : 'border-slate-200'
    }`}>
      {/* Task Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="text-base flex items-center gap-2">
            <span className="text-emerald-700 font-medium">{task.sectionNumber}.{task.taskNumber}</span>
            <span className={isDone ? 'text-slate-600' : 'text-slate-900'}>{task.title}</span>
            {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{task.description}</p>
        </div>
        {showNACheckbox && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.isNA}
              onChange={(e) => handleNAChange(e.target.checked)}
              className="mr-2"
              disabled={isReadOnly}
            />
            <label className="text-sm text-slate-500">N/A</label>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="mt-3">
        {renderInputField()}
      </div>
    </div>
  );
}