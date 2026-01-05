import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

interface CampMedicine {
  medicine_id?: number;
  medicine_name: string;
  medicine_type: string;
  quantity: number;
}

interface Camp {
  camp_id?: number;
  camp_code?: string;
  camp_name: string;
  is_active: boolean;
  created_by?: string;
  update_at?: Date;
  updated_by?: Date;
  planned_date?: Date;
  medicines?: CampMedicine[];
  organizer_name_1?: string;
  organizer_phone_no_1?: string;
  organizer_email_1?: string;
  organizer_name_2?: string;
  organizer_phone_no_2?: string;
  organizer_email_2?: string;
  shipping_state?: string;
  shipping_district?: string;
  shipping_mandle?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_pin_code?: string;
  location_state?: string;
  location_district?: string;
  location_mandle?: string;
  location_address?: string;
  location_city?: string;
  location_pin_code?: string;
  january?: boolean;
  february?: boolean;
  march?: boolean;
  april?: boolean;
  may?: boolean;
  june?: boolean;
  july?: boolean;
  august?: boolean;
  september?: boolean;
  october?: boolean;
  november?: boolean;
  december?: boolean;
  january_week?: string;
  january_day?: string;
  february_week?: string;
  february_day?: string;
  march_week?: string;
  march_day?: string;
  april_week?: string;
  april_day?: string;
  may_week?: string;
  may_day?: string;
  june_week?: string;
  june_day?: string;
  july_week?: string;
  july_day?: string;
  august_week?: string;
  august_day?: string;
  september_week?: string;
  september_day?: string;
  october_week?: string;
  october_day?: string;
  november_week?: string;
  november_day?: string;
  december_week?: string;
  december_day?: string;
  medicine_responsibility?: string;
  medicine_responsibility_type?: string;
  medicine_responsibility_outside?: string;
}

@Component({
  selector: 'app-camps',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    TagModule,
    CardModule,
    CheckboxModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule,
    MultiSelectModule
  ],
  templateUrl: './camps.component.html',
  styleUrl: './camps.component.scss'
})
export class CampsComponent implements OnInit {
  camps: Camp[] = [];
  filteredCamps: Camp[] = [];
  selectedCamp: Camp | null = null;
  displayDialog: boolean = false;
  displayDateDialog: boolean = false;
  selectedCampForDate: Camp | null = null;
  newPlannedDate: Date | null = null;
  selectedDoctors: any[] = [];
  selectedVolunteers: any[] = [];
  editingOrganizerName: boolean = false;
  editingOrganizerPhone: boolean = false;
  tempOrganizerName1: string = '';
  tempOrganizerName2: string = '';
  tempOrganizerPhone1: string = '';
  tempOrganizerPhone2: string = '';
  campMedicines: CampMedicine[] = [];
  
  doctors: any[] = [
    { label: 'Dr. John Smith', value: 1 },
    { label: 'Dr. Jane Doe', value: 2 },
    { label: 'Dr. Robert Johnson', value: 3 },
    { label: 'Dr. Emily Williams', value: 4 },
    { label: 'Dr. Michael Brown', value: 5 },
    { label: 'Dr. Sarah Davis', value: 6 }
  ];
  
  volunteers: any[] = [
    { label: 'Alice Johnson', value: 1 },
    { label: 'Bob Wilson', value: 2 },
    { label: 'Carol Martinez', value: 3 },
    { label: 'David Anderson', value: 4 },
    { label: 'Emma Taylor', value: 5 },
    { label: 'Frank Thomas', value: 6 },
    { label: 'Grace Lee', value: 7 },
    { label: 'Henry White', value: 8 }
  ];
  searchText: string = '';
  searchState: string = '';
  searchDistrict: string = '';
  searchMandal: string = '';
  searchCity: string = '';
  searchStatus: string = 'All';
  isEditMode: boolean = false;

  states: any[] = [
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Delhi', value: 'Delhi' }
  ];
  districts: any[] = [
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Pune', value: 'Pune' },
    { label: 'Nagpur', value: 'Nagpur' },
    { label: 'Nashik', value: 'Nashik' },
    { label: 'Aurangabad', value: 'Aurangabad' }
  ];
  mandles: any[] = [
    { label: 'Mandle 1', value: 'Mandle 1' },
    { label: 'Mandle 2', value: 'Mandle 2' },
    { label: 'Mandle 3', value: 'Mandle 3' },
    { label: 'Mandle 4', value: 'Mandle 4' },
    { label: 'Mandle 5', value: 'Mandle 5' }
  ];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weeks: any[] = [
    { label: 'Week 1', value: 'Week 1' },
    { label: 'Week 2', value: 'Week 2' },
    { label: 'Week 3', value: 'Week 3' },
    { label: 'Week 4', value: 'Week 4' }
  ];
  days: any[] = [
    { label: 'Sunday', value: 'Sunday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' }
  ];
  yesNoOptions: any[] = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];
  statusOptions: any[] = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];
  medicineResponsibilityTypes: any[] = [
    { label: 'GBR Warehouse', value: 'GBR Warehouse' },
    { label: 'Outside', value: 'Outside' }
  ];

  campForm: Camp = {
    camp_name: '',
    is_active: true,
    organizer_name_1: '',
    organizer_phone_no_1: '',
    organizer_email_1: '',
    organizer_name_2: '',
    organizer_phone_no_2: '',
    organizer_email_2: '',
    shipping_state: '',
    shipping_district: '',
    shipping_mandle: '',
    shipping_address: '',
    shipping_city: '',
    shipping_pin_code: '',
    location_state: '',
    location_district: '',
    location_mandle: '',
    location_address: '',
    location_city: '',
    location_pin_code: '',
    january: false,
    february: false,
    march: false,
    april: false,
    may: false,
    june: false,
    july: false,
    august: false,
    september: false,
    october: false,
    november: false,
    december: false,
    january_week: '',
    january_day: '',
    february_week: '',
    february_day: '',
    march_week: '',
    march_day: '',
    april_week: '',
    april_day: '',
    may_week: '',
    may_day: '',
    june_week: '',
    june_day: '',
    july_week: '',
    july_day: '',
    august_week: '',
    august_day: '',
    september_week: '',
    september_day: '',
    october_week: '',
    october_day: '',
    november_week: '',
    november_day: '',
    december_week: '',
    december_day: '',
    medicine_responsibility: '',
    medicine_responsibility_type: '',
    medicine_responsibility_outside: ''
  };

  ngOnInit() {
    // Sample data
    this.loadCamps();
  }

  loadCamps() {
    this.camps = [
      { 
        camp_id: 1, 
        camp_code: 'CAMP001',
        camp_name: 'General Health Camp', 
        is_active: true, 
        created_by: 'Admin', 
        update_at: new Date(),
        organizer_name_1: 'John Doe',
        organizer_phone_no_1: '+91 9876543210',
        location_city: 'Mumbai',
        location_district: 'Mumbai',
        location_state: 'Maharashtra',
        planned_date: new Date('2024-03-15'),
        medicines: [
          { medicine_id: 1, medicine_name: 'Paracetamol', medicine_type: 'Tablet', quantity: 500 },
          { medicine_id: 2, medicine_name: 'Amoxicillin', medicine_type: 'Capsule', quantity: 200 },
          { medicine_id: 3, medicine_name: 'Ibuprofen', medicine_type: 'Tablet', quantity: 300 }
        ]
      },
      { 
        camp_id: 2, 
        camp_code: 'CAMP002',
        camp_name: 'Diabetes Screening Camp', 
        is_active: true, 
        created_by: 'Admin', 
        update_at: new Date(),
        organizer_name_1: 'Jane Smith',
        organizer_phone_no_1: '+91 9876543211',
        location_city: 'Pune',
        location_district: 'Pune',
        location_state: 'Maharashtra',
        planned_date: new Date('2024-03-20'),
        medicines: [
          { medicine_id: 1, medicine_name: 'Metformin', medicine_type: 'Tablet', quantity: 1000 },
          { medicine_id: 2, medicine_name: 'Glipizide', medicine_type: 'Tablet', quantity: 500 }
        ]
      },
      { 
        camp_id: 3, 
        camp_code: 'CAMP003',
        camp_name: 'Eye Care Camp', 
        is_active: false, 
        created_by: 'Admin', 
        update_at: new Date(),
        organizer_name_1: 'Robert Johnson',
        organizer_phone_no_1: '+91 9876543212',
        location_city: 'Nagpur',
        location_district: 'Nagpur',
        location_state: 'Maharashtra',
        planned_date: new Date('2024-03-25'),
        medicines: []
      }
    ];
    this.onSearch();
  }

  onSearch() {
    this.filteredCamps = this.camps.filter(camp => {
      // Search by camp name
      const matchesName = !this.searchText || 
        camp.camp_name.toLowerCase().includes(this.searchText.toLowerCase());

      // Search by state (check both shipping and location state)
      const matchesState = !this.searchState || 
        camp.shipping_state === this.searchState || 
        camp.location_state === this.searchState;

      // Search by district (check both shipping and location district)
      const matchesDistrict = !this.searchDistrict || 
        camp.shipping_district === this.searchDistrict || 
        camp.location_district === this.searchDistrict;

      // Search by mandal (check both shipping and location mandal)
      const matchesMandal = !this.searchMandal || 
        camp.shipping_mandle === this.searchMandal || 
        camp.location_mandle === this.searchMandal;

      // Search by city (check both shipping and location city)
      const matchesCity = !this.searchCity || 
        (camp.shipping_city && camp.shipping_city.toLowerCase().includes(this.searchCity.toLowerCase())) ||
        (camp.location_city && camp.location_city.toLowerCase().includes(this.searchCity.toLowerCase()));

      // Search by status
      let matchesStatus = true;
      if (this.searchStatus === 'Active') {
        matchesStatus = camp.is_active === true;
      } else if (this.searchStatus === 'Inactive') {
        matchesStatus = camp.is_active === false;
      }

      return matchesName && matchesState && matchesDistrict && matchesMandal && matchesCity && matchesStatus;
    });
  }

  onFilterChange() {
    this.onSearch();
  }

  clearFilters() {
    this.searchText = '';
    this.searchState = '';
    this.searchDistrict = '';
    this.searchMandal = '';
    this.searchCity = '';
    this.searchStatus = 'All';
    this.onSearch();
  }

  openNew() {
    this.campForm = {
      camp_name: '',
      is_active: true,
      organizer_name_1: '',
      organizer_phone_no_1: '',
      organizer_email_1: '',
      organizer_name_2: '',
      organizer_phone_no_2: '',
      organizer_email_2: '',
      shipping_state: '',
      shipping_district: '',
      shipping_mandle: '',
      shipping_address: '',
      shipping_city: '',
      shipping_pin_code: '',
      location_state: '',
      location_district: '',
      location_mandle: '',
      location_address: '',
      location_city: '',
      location_pin_code: '',
      january: false,
      february: false,
      march: false,
      april: false,
      may: false,
      june: false,
      july: false,
      august: false,
      september: false,
      october: false,
      november: false,
      december: false,
      january_week: '',
      january_day: '',
      february_week: '',
      february_day: '',
      march_week: '',
      march_day: '',
      april_week: '',
      april_day: '',
      may_week: '',
      may_day: '',
      june_week: '',
      june_day: '',
      july_week: '',
      july_day: '',
      august_week: '',
      august_day: '',
      september_week: '',
      september_day: '',
      october_week: '',
      october_day: '',
      november_week: '',
      november_day: '',
      december_week: '',
      december_day: '',
      medicine_responsibility: '',
      medicine_responsibility_type: '',
      medicine_responsibility_outside: ''
    };
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editCamp(camp: Camp) {
    this.selectedCamp = { ...camp };
    this.campForm = { ...camp };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  saveCamp() {
    if (this.isEditMode && this.selectedCamp?.camp_id) {
      const index = this.camps.findIndex(c => c.camp_id === this.selectedCamp?.camp_id);
      if (index !== -1) {
        this.camps[index] = { ...this.campForm, camp_id: this.selectedCamp.camp_id, update_at: new Date() };
      }
    } else {
      const newId = Math.max(...this.camps.map(c => c.camp_id || 0)) + 1;
      this.camps.push({
        ...this.campForm,
        camp_id: newId,
        created_by: 'Current User',
        update_at: new Date()
      });
    }
    this.filteredCamps = [...this.camps];
    this.displayDialog = false;
    this.campForm = { 
      camp_name: '', 
      is_active: true,
      organizer_name_1: '',
      organizer_phone_no_1: '',
      organizer_email_1: '',
      organizer_name_2: '',
      organizer_phone_no_2: '',
      organizer_email_2: '',
      shipping_state: '',
      shipping_district: '',
      shipping_mandle: '',
      shipping_address: '',
      shipping_city: '',
      shipping_pin_code: '',
      location_state: '',
      location_district: '',
      location_mandle: '',
      location_address: '',
      location_city: '',
      location_pin_code: '',
      january: false,
      february: false,
      march: false,
      april: false,
      may: false,
      june: false,
      july: false,
      august: false,
      september: false,
      october: false,
      november: false,
      december: false,
      january_week: '',
      january_day: '',
      february_week: '',
      february_day: '',
      march_week: '',
      march_day: '',
      april_week: '',
      april_day: '',
      may_week: '',
      may_day: '',
      june_week: '',
      june_day: '',
      july_week: '',
      july_day: '',
      august_week: '',
      august_day: '',
      september_week: '',
      september_day: '',
      october_week: '',
      october_day: '',
      november_week: '',
      november_day: '',
      december_week: '',
      december_day: '',
      medicine_responsibility: '',
      medicine_responsibility_type: '',
      medicine_responsibility_outside: ''
    };
  }

  deleteCamp(camp: Camp) {
    if (confirm(`Are you sure you want to delete ${camp.camp_name}?`)) {
      this.camps = this.camps.filter(c => c.camp_id !== camp.camp_id);
      this.filteredCamps = [...this.camps];
    }
  }

  getSeverity(isActive: boolean) {
    return isActive ? 'success' : 'warning';
  }

  getOrganizerName(camp: Camp | null): string {
    if (!camp) return 'N/A';
    if (camp.organizer_name_1) {
      return camp.organizer_name_2 ? `${camp.organizer_name_1}, ${camp.organizer_name_2}` : camp.organizer_name_1;
    }
    return camp.organizer_name_2 || 'N/A';
  }

  getOrganizerPhone(camp: Camp | null): string {
    if (!camp) return 'N/A';
    if (camp.organizer_phone_no_1) {
      return camp.organizer_phone_no_2 ? `${camp.organizer_phone_no_1}, ${camp.organizer_phone_no_2}` : camp.organizer_phone_no_1;
    }
    return camp.organizer_phone_no_2 || 'N/A';
  }

  getLocation(camp: Camp): string {
    const locationParts: string[] = [];
    if (camp.location_city) locationParts.push(camp.location_city);
    if (camp.location_district) locationParts.push(camp.location_district);
    if (camp.location_state) locationParts.push(camp.location_state);
    
    if (locationParts.length > 0) {
      return locationParts.join(', ');
    }
    
    // Fallback to shipping address if location is not available
    const shippingParts: string[] = [];
    if (camp.shipping_city) shippingParts.push(camp.shipping_city);
    if (camp.shipping_district) shippingParts.push(camp.shipping_district);
    if (camp.shipping_state) shippingParts.push(camp.shipping_state);
    
    return shippingParts.length > 0 ? shippingParts.join(', ') : 'N/A';
  }

  openDateDialog(camp: Camp) {
    this.selectedCampForDate = camp;
    this.newPlannedDate = camp.planned_date ? new Date(camp.planned_date) : null;
    // Initialize selected doctors and volunteers (you can load from camp data if available)
    this.selectedDoctors = [];
    this.selectedVolunteers = [];
    // Initialize organizer fields
    this.tempOrganizerName1 = camp.organizer_name_1 || '';
    this.tempOrganizerName2 = camp.organizer_name_2 || '';
    this.tempOrganizerPhone1 = camp.organizer_phone_no_1 || '';
    this.tempOrganizerPhone2 = camp.organizer_phone_no_2 || '';
    this.editingOrganizerName = false;
    this.editingOrganizerPhone = false;
    // Initialize medicines
    this.campMedicines = camp.medicines ? [...camp.medicines] : [];
    this.displayDateDialog = true;
  }

  savePlannedDate() {
    if (this.selectedCampForDate && this.newPlannedDate) {
      const index = this.camps.findIndex(c => c.camp_id === this.selectedCampForDate?.camp_id);
      if (index !== -1) {
        this.camps[index].planned_date = this.newPlannedDate;
        // Save organizer information if edited
        if (this.editingOrganizerName || this.editingOrganizerPhone) {
          this.camps[index].organizer_name_1 = this.tempOrganizerName1;
          this.camps[index].organizer_name_2 = this.tempOrganizerName2;
          this.camps[index].organizer_phone_no_1 = this.tempOrganizerPhone1;
          this.camps[index].organizer_phone_no_2 = this.tempOrganizerPhone2;
        }
        // Medicines are read-only, no need to save
        this.camps[index].update_at = new Date();
        // Save selected doctors and volunteers (you can add these fields to Camp interface if needed)
        // For now, we'll just update the planned date
        this.filteredCamps = [...this.camps];
      }
    }
    this.displayDateDialog = false;
    this.selectedCampForDate = null;
    this.newPlannedDate = null;
    this.selectedDoctors = [];
    this.selectedVolunteers = [];
    this.editingOrganizerName = false;
    this.editingOrganizerPhone = false;
    this.tempOrganizerName1 = '';
    this.tempOrganizerName2 = '';
    this.tempOrganizerPhone1 = '';
    this.tempOrganizerPhone2 = '';
    this.campMedicines = [];
  }

  cancelDateDialog() {
    this.displayDateDialog = false;
    this.selectedCampForDate = null;
    this.newPlannedDate = null;
    this.selectedDoctors = [];
    this.selectedVolunteers = [];
    this.editingOrganizerName = false;
    this.editingOrganizerPhone = false;
    this.tempOrganizerName1 = '';
    this.tempOrganizerName2 = '';
    this.tempOrganizerPhone1 = '';
    this.tempOrganizerPhone2 = '';
    this.campMedicines = [];
  }


  editOrganizerName() {
    this.editingOrganizerName = true;
  }

  cancelEditOrganizerName() {
    if (this.selectedCampForDate) {
      this.tempOrganizerName1 = this.selectedCampForDate.organizer_name_1 || '';
      this.tempOrganizerName2 = this.selectedCampForDate.organizer_name_2 || '';
    }
    this.editingOrganizerName = false;
  }

  editOrganizerPhone() {
    this.editingOrganizerPhone = true;
  }

  cancelEditOrganizerPhone() {
    if (this.selectedCampForDate) {
      this.tempOrganizerPhone1 = this.selectedCampForDate.organizer_phone_no_1 || '';
      this.tempOrganizerPhone2 = this.selectedCampForDate.organizer_phone_no_2 || '';
    }
    this.editingOrganizerPhone = false;
  }

  getMonthValue(month: string): boolean {
    const monthKey = month.toLowerCase() as keyof Camp;
    return (this.campForm[monthKey] as boolean) || false;
  }

  setMonthValue(month: string, value: boolean) {
    const monthKey = month.toLowerCase() as keyof Camp;
    (this.campForm[monthKey] as boolean) = value;
    if (!value) {
      const weekField = `${month.toLowerCase()}_week` as keyof Camp;
      const dayField = `${month.toLowerCase()}_day` as keyof Camp;
      (this.campForm[weekField] as any) = '';
      (this.campForm[dayField] as any) = '';
    }
  }

  onMonthChange(month: string, event: any) {
    const isChecked = event.checked;
    this.setMonthValue(month, isChecked);
  }

  onMedicineResponsibilityChange(event: any) {
    const value = event.value;
    if (value === 'No') {
      this.campForm.medicine_responsibility_type = '';
      this.campForm.medicine_responsibility_outside = '';
    }
  }

  onMedicineResponsibilityTypeChange(value: string) {
    if (value !== 'Outside') {
      this.campForm.medicine_responsibility_outside = '';
    }
  }
}

