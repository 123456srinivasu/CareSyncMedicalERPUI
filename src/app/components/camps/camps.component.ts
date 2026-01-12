import { Component, OnInit, inject } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CampsService } from '../../core/services/camps.service';

interface CampMedicine {
  medicine_id?: number;
  medicine_name: string;
  medicine_type: string;
  quantity: number;
}

interface Camp {
  schedule_week?: string;
  schedule_day?: string;
  camp_id?: number;
  camp_code?: string;
  camp_name: string;
  is_active: boolean;
  created_by?: string;
  update_at?: Date;
  updated_by?: Date;
  planned_date?: Date;
  ready_for_camp?: boolean;
  camp_started?: boolean;
  camp_ended?: boolean;
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
    MultiSelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './camps.component.html',
  styleUrl: './camps.component.scss'
})
export class CampsComponent implements OnInit {
  private readonly campsService = inject(CampsService);
  private readonly messageService = inject(MessageService);
  
  camps: Camp[] = [];
  filteredCamps: Camp[] = [];
  selectedCamp: Camp | null = null;
  displayDialog: boolean = false;
  displayDateDialog: boolean = false;
  selectedCampForDate: Camp | null = null;
  newPlannedDate: Date | null = null;
  selectedDoctors: any[] = [];
  selectedVolunteers: any[] = [];
  availableDoctors: any[] = [];
  availableDoctorsFiltered: any[] = [];
  doctorSearchTextNew: string = '';
  availableVolunteers: any[] = [];
  availableVolunteersFiltered: any[] = [];
  volunteerSearchTextNew: string = '';
  editingOrganizerName: boolean = false;
  editingOrganizerPhone: boolean = false;
  tempOrganizerName1: string = '';
  tempOrganizerName2: string = '';
  tempOrganizerPhone1: string = '';
  tempOrganizerPhone2: string = '';
  campMedicines: CampMedicine[] = [];
  
  // Not Ready for Camp Dialog
  displayNotReadyDialog: boolean = false;
  selectedCampForNotReady: Camp | null = null;
  selectedDoctorsNotReady: any[] = [];
  selectedVolunteersNotReady: any[] = [];
  selectedDoctorsForDisable: any[] = [];
  selectedVolunteersForDisable: any[] = [];
  availableDoctorsNotReady: any[] = [];
  availableDoctorsNotReadyFiltered: any[] = [];
  doctorSearchText: string = '';
  availableVolunteersNotReady: any[] = [];
  availableVolunteersNotReadyFiltered: any[] = [];
  volunteerSearchText: string = '';
  printerAvailable: boolean = false;
  paperAvailable: boolean = false;
  campMedicinesNotReady: CampMedicine[] = [];
  
  // Start Camp Confirmation Dialog
  displayStartCampDialog: boolean = false;
  selectedCampForStart: Camp | null = null;
  
  // Stop Camp Confirmation Dialog
  displayStopCampDialog: boolean = false;
  selectedCampForStop: Camp | null = null;
  
  // Disable Password Dialog
  displayDisablePasswordDialog: boolean = false;
  selectedCampForDisablePassword: Camp | null = null;
  
  doctors: any[] = [
    { label: 'Dr. John Smith', value: 1, selected: false },
    { label: 'Dr. Jane Doe', value: 2, selected: false},
    { label: 'Dr. Robert Johnson', value: 3, selected: false},
    { label: 'Dr. Emily Williams', value: 4, selected: false},
    { label: 'Dr. Michael Brown', value: 5, selected: false},
    { label: 'Dr. Sarah Davis', value: 6, selected: false}
  ];
  
  volunteers: any[] = [
    { label: 'Alice Johnson', value: 1, selected: false },
    { label: 'Bob Wilson', value: 2, selected: false },
    { label: 'Carol Martinez', value: 3, selected: false },
    { label: 'David Anderson', value: 4, selected: false },
    { label: 'Emma Taylor', value: 5, selected: false },
    { label: 'Frank Thomas', value: 6, selected: false },
    { label: 'Grace Lee', value: 7, selected: false },
    { label: 'Henry White', value: 8, selected: false }
  ];
  searchText: string = '';
  searchState: string = '';
  searchDistrict: string = '';
  searchMandal: string = '';
  searchCity: string = '';
  searchStatus: string = 'All';
  isEditMode: boolean = false;

  states: any[] = [
    { label: 'Andhra Pradesh', value: '1', 
      districts:[      
      { label: "Alluri Sitharama Raju", value: '1', mandles:[] },
      { label: "Anakapalli", value: '2', mandles:[] },
      { label: "Ananthapuramu", value: '3', mandles:[] },
      { label: "Annamayya", value: '4', mandles:[] },
      { label: "Bapatla", value: '5', mandles:[] },
      { label: "Chittoor", value: '6', mandles:[] },
      { label: "Dr. B.R. Ambedkar Konaseema", value: '7', mandles:[] },
      { label: "East Godavari", value: '8', mandles:[] },
      { label: "Eluru", value: '9', mandles:[] },
      { label: "Guntur", value: '10', mandles:[] },
      { label: "Kakinada", value: '11', mandles:[] },
      { label: "Krishna", value: '12', mandles:[
        { label: "A Konduru", value: '1' },
        { label: "Chandarlapadu", value: '2' },
        { label: "G Konduru", value: '3' },
        { label: "Gampalagudem", value: '4' },
        { label: "Jaggaiahpet (Jaggayyapeta)", value: '5' },
        { label: "Kanchikacherla", value: '6' },
        { label: "Mylavaram", value: '7' },
        { label: "Nandigama", value: '8' },
        { label: "Penuganchiprolu", value: '9' },
        { label: "Reddigudem", value: '10' },
        { label: "Tiruvuru", value: '11' },
        { label: "Vatsavai", value: '12' },
        { label: "Veerullapadu", value: '13' },
        { label: "Vijayawada Central", value: '14' },
        { label: "Vijayawada East", value: '15' },
        { label: "Vijayawada North", value: '16' },
        { label: "Vijayawada Rural", value: '17' },
        { label: "Vijayawada West", value: '18' },
        { label: "Vissannapeta", value: '19' }
      ] },
      { label: "Kurnool", value: '13', mandles:[] },
      { label: "Markapuram", value: '14', mandles:[] },
      { label: "Nandyal", value: '15', mandles:[] },
      { label: "NTR", value: '16', mandles:[] },
      { label: "Palnadu", value: '17', mandles:[] },
      { label: "Parvathipuram Manyam", value: '18', mandles:[] },
      { label: "Polavaram", value: '19', mandles:[] },
      { label: "Prakasam", value: '20', mandles:[] },
      { label: "Sri Potti Sriramulu Nellore", value: '21', mandles:[] },
      { label: "Sri Sathya Sai", value: '22', mandles:[] },
      { label: "Srikakulam", value: '23', mandles:[] },
      { label: "Tirupati", value: '24', mandles:[] },
      { label: "Visakhapatnam", value: '25', mandles:[] },
      { label: "Vizianagaram", value: '26', mandles:[] },
      { label: "West Godavari", value: '27', mandles:[] },
      { label: "YSR Kadapa", value: '28', mandles:[] }      
  ]}
];


  districts: any[] = [
    { label: "Alluri Sitharama Raju", value: '1', mandles:[] },
    { label: "Anakapalli", value: '2', mandles:[] },
    { label: "Ananthapuramu", value: '3', mandles:[] },
    { label: "Annamayya", value: '4', mandles:[] },
    { label: "Bapatla", value: '5', mandles:[] },
    { label: "Chittoor", value: '6', mandles:[] },
    { label: "Dr. B.R. Ambedkar Konaseema", value: '7', mandles:[] },
    { label: "East Godavari", value: '8', mandles:[] },
    { label: "Eluru", value: '9', mandles:[] },
    { label: "Guntur", value: '10', mandles:[] },
    { label: "Kakinada", value: '11', mandles:[] },
    { label: "Krishna", value: '12', mandles:[]},
    { label: "Kurnool", value: '13', mandles:[] },
    { label: "Markapuram", value: '14', mandles:[] },
    { label: "Nandyal", value: '15', mandles:[] },
    { label: "NTR", value: '16', mandles:[] },
    { label: "Palnadu", value: '17', mandles:[] },
    { label: "Parvathipuram Manyam", value: '18', mandles:[] },
    { label: "Polavaram", value: '19', mandles:[] },
    { label: "Prakasam", value: '20', mandles:[] },
    { label: "Sri Potti Sriramulu Nellore", value: '21', mandles:[] },
    { label: "Sri Sathya Sai", value: '22', mandles:[] },
    { label: "Srikakulam", value: '23', mandles:[] },
    { label: "Tirupati", value: '24', mandles:[] },
    { label: "Visakhapatnam", value: '25', mandles:[] },
    { label: "Vizianagaram", value: '26', mandles:[] },
    { label: "West Godavari", value: '27', mandles:[] },
    { label: "YSR Kadapa", value: '28', mandles:[] } 
  ];
  mandles: any[] = [
    { label: "A Konduru", value: '1' },
    { label: "Chandarlapadu", value: '2' },
    { label: "G Konduru", value: '3' },
    { label: "Gampalagudem", value: '4' },
    { label: "Jaggaiahpet (Jaggayyapeta)", value: '5' },
    { label: "Kanchikacherla", value: '6' },
    { label: "Mylavaram", value: '7' },
    { label: "Nandigama", value: '8' },
    { label: "Penuganchiprolu", value: '9' },
    { label: "Reddigudem", value: '10' },
    { label: "Tiruvuru", value: '11' },
    { label: "Vatsavai", value: '12' },
    { label: "Veerullapadu", value: '13' },
    { label: "Vijayawada Central", value: '14' },
    { label: "Vijayawada East", value: '15' },
    { label: "Vijayawada North", value: '16' },
    { label: "Vijayawada Rural", value: '17' },
    { label: "Vijayawada West", value: '18' },
    { label: "Vissannapeta", value: '19' }
  ];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weeks: any[] = [
    { label: 'Week 1', value: '1' },
    { label: 'Week 2', value: '2' },
    { label: 'Week 3', value: '3' },
    { label: 'Week 4', value: '4' },
    { label: 'Week 5', value: '5' }
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
    schedule_week: '',
    schedule_day: '',
    medicine_responsibility: '',
    medicine_responsibility_type: '',
    medicine_responsibility_outside: ''
  };
  isPasswordDisabled: boolean = true;
 
  errorMessage: any = '';
  successMessage: string = '';

  ngOnInit() {
    // Sample data
    this.loadCamps();
  }

  loadCamps() {
    this.campsService.getAllCamps().subscribe({
      next: (apiCamps: any[]) => {
        // Map API response to component Camp interface
        this.camps = apiCamps.map((apiCamp: any) => {
          // Extract location address from campAddresses if available
          const locationAddress = apiCamp.campAddresses?.find((addr: any) => addr.addressType === 'LOCATION') || apiCamp.campAddresses?.[0];
          const shippingAddress = apiCamp.campAddresses?.find((addr: any) => addr.addressType === 'SHIPPING') || apiCamp.campAddresses?.[0];
          
          // Map schedule from schedules array if available
          const schedule = apiCamp.schedules?.[0];
          
          return {
            camp_id: apiCamp.campId,
            camp_code: apiCamp.campCode || '',
            camp_name: apiCamp.campName || '',
            is_active: apiCamp.isActive ?? true,
            created_by: apiCamp.createdBy || '',
            update_at: apiCamp.updateAt ? new Date(apiCamp.updateAt) : new Date(),
            updated_by: apiCamp.updatedBy ? new Date(apiCamp.updatedBy) : undefined,
            organizer_name_1: apiCamp.organizerName || '',
            organizer_email_1: apiCamp.organizerEmail || '',
            organizer_phone_no_1: apiCamp.organizerPhone || '',
            location_address: locationAddress?.addressLine1 || '',
            location_city: locationAddress?.city || '',
            location_state: locationAddress?.stateId?.toString() || '',
            location_district: locationAddress?.districtId?.toString() || '',
            location_mandle: locationAddress?.mandalId?.toString() || '',
            location_pin_code: locationAddress?.postalCode || '',
            shipping_address: shippingAddress?.addressLine1 || '',
            shipping_city: shippingAddress?.city || '',
            shipping_state: shippingAddress?.stateId?.toString() || '',
            shipping_district: shippingAddress?.districtId?.toString() || '',
            shipping_mandle: shippingAddress?.mandalId?.toString() || '',
            shipping_pin_code: shippingAddress?.postalCode || '',
            medicine_responsibility: apiCamp.medicineResponsibility || '',
            schedule_week: schedule?.weekOfMonth ? `Week ${schedule.weekOfMonth}` : '',
            schedule_day: schedule?.dayOfWeek || '',
            january: schedule?.january || false,
            february: schedule?.february || false,
            march: schedule?.march || false,
            april: schedule?.april || false,
            may: schedule?.may || false,
            june: schedule?.june || false,
            july: schedule?.july || false,
            august: schedule?.august || false,
            september: schedule?.september || false,
            october: schedule?.october || false,
            november: schedule?.november || false,
            december: schedule?.december || false,
            medicines: []
          } as Camp;
        });
        this.filteredCamps=this.camps;
        this.onSearch();
      },
      error: (error: any) => {
        console.error('Error loading camps:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load camps. Please try again later.'
        });
        // Fallback to empty array on error
        this.camps = [];
        this.onSearch();
      }
    });
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
      schedule_week: '',
      schedule_day: '',      
      medicine_responsibility: '',
      medicine_responsibility_type: '',
      medicine_responsibility_outside: ''
    };
    // Initialize doctors and volunteers for New Camp dialog
    this.selectedDoctors = [];
    this.selectedVolunteers = [];
    this.availableDoctors = [...this.doctors];
    this.availableDoctorsFiltered = [...this.doctors];
    this.doctorSearchTextNew = '';
    this.availableVolunteers = [...this.volunteers];
    this.availableVolunteersFiltered = [...this.volunteers];
    this.volunteerSearchTextNew = '';
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
      console.log('campForm---->',newId,this.campForm);
      const payload = {
        "campName": this.campForm.camp_name,
        "description": "",
        "establishmentYear": new Date().getFullYear(),
        "campCode": this.campForm.camp_code,
        "organizerName": this.campForm.organizer_name_1,
        "organizerEmail": this.campForm.organizer_email_1,
        "organizerPhone": this.campForm.organizer_phone_no_1,
        "medicineResponsibility": this.campForm.medicine_responsibility,
        "locationAddress": {
          "addressLine1": this.campForm.location_address, 
          "addressLine2": this.campForm.location_address,
          "city": this.campForm.location_city,
          "stateId": this.campForm.location_state,
          "districtId": this.campForm.location_district,
          "mandalId": this.campForm.location_mandle,
          "postalCode": this.campForm.location_pin_code,
          "createdBy": "admin",
          "updatedBy": ""
        },
        "shippingAddress": {
          "addressLine1": this.campForm.shipping_address,
          "addressLine2": this.campForm.shipping_address,
          "city": this.campForm.shipping_city,
          "stateId": this.campForm.shipping_state,
          "districtId": this.campForm.shipping_district,
          "mandalId": this.campForm.shipping_mandle,
          "postalCode": this.campForm.shipping_pin_code,
          "createdBy": "admin",
          "updatedBy":""
        },
        "campScheduleTemplate": {   
          "dayOfWeek": this.campForm.schedule_day,
          "weekOfMonth": this.campForm.schedule_week,
          "january": this.campForm.january,
          "february": this.campForm.february,
          "march": this.campForm.march,
          "april": this.campForm.april,
          "may": this.campForm.may,
          "june": this.campForm.june,
          "july": this.campForm.july,
          "august": this.campForm.august,
          "september": this.campForm.september,
          "october": this.campForm.october,
          "november": this.campForm.november,
          "december": this.campForm.december
        }
      }
      console.log('payload---->',payload, this.selectedDoctors, this.selectedVolunteers); 
       
      this.campsService.createCamp(payload).subscribe({
        next: (response: any) => {
          console.log('Camp created:', response);
          this.displayDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message || 'Camp created successfully'
          });
          this.loadCamps();
        },
        error: (error: any) => {
          console.error('Error creating camp:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create camp. Please try again.'
          });
        }
      });
    }
   // this.filteredCamps = [...this.camps];
   // this.displayDialog = false;
    // this.campForm = { 
    //   camp_name: '', 
    //   is_active: true,
    //   organizer_name_1: '',
    //   organizer_phone_no_1: '',
    //   organizer_email_1: '',
    //   organizer_name_2: '',
    //   organizer_phone_no_2: '',
    //   organizer_email_2: '',
    //   shipping_state: '',
    //   shipping_district: '',
    //   shipping_mandle: '',
    //   shipping_address: '',
    //   shipping_city: '',
    //   shipping_pin_code: '',
    //   location_state: '',
    //   location_district: '',
    //   location_mandle: '',
    //   location_address: '',
    //   location_city: '',
    //   location_pin_code: '',
    //   january: false,
    //   february: false,
    //   march: false,
    //   april: false,
    //   may: false,
    //   june: false,
    //   july: false,
    //   august: false,
    //   september: false,
    //   october: false,
    //   november: false,
    //   december: false,
    //   schedule_week: '',
    //   schedule_day: '',
    //   medicine_responsibility: '',
    //   medicine_responsibility_type: '',
    //   medicine_responsibility_outside: ''
    // };
  }

  markReadyForCamp(camp: Camp) {
    // Mark camp as ready
    const index = this.camps.findIndex(c => c.camp_id === camp.camp_id);
    if (index !== -1) {
      if (confirm(`Mark "${camp.camp_name}" as ready for camp?`)) {
        this.camps[index].ready_for_camp = true;
        this.filteredCamps = [...this.camps];
        // You can also show a toast notification here
      }
    }
  }

  markNotReadyForCamp(camp: Camp) {
    this.selectedCampForNotReady = camp;
    // Initialize selected doctors and volunteers
    this.selectedDoctorsNotReady = [];
    this.selectedVolunteersNotReady = [];
    // Initialize available doctors (all doctors initially)
    this.availableDoctorsNotReady = [...this.doctors];
    this.availableDoctorsNotReadyFiltered = [...this.doctors];
    this.doctorSearchText = '';
    // Initialize available volunteers (all volunteers initially)
    this.availableVolunteersNotReady = [...this.volunteers];
    this.availableVolunteersNotReadyFiltered = [...this.volunteers];
    this.volunteerSearchText = '';
    this.printerAvailable = false;
    this.paperAvailable = false;
    // Load medicines for the camp
    this.campMedicinesNotReady = camp.medicines ? [...camp.medicines] : [];
    this.displayNotReadyDialog = true;
  }

  // Methods for moving doctors between panels
  addDoctor(doctor: any) {
    if (!this.selectedDoctorsNotReady.find(d => d.value === doctor.value)) {
      this.selectedDoctorsNotReady.push(doctor);
      this.availableDoctorsNotReady = this.availableDoctorsNotReady.filter(d => d.value !== doctor.value);
      this.filterAvailableDoctors();
    }
  }

  onDoctorCheckboxChange(doctor: any) {
    if (doctor.selected) {
      if (!this.selectedDoctorsForDisable.find(d => d.value === doctor.value)) {
        doctor.selected = true;
        this.selectedDoctorsForDisable.push(doctor);
      }
    } else {
      doctor.selected = false;
      this.selectedDoctorsForDisable = this.selectedDoctorsForDisable.filter(d => d.value !== doctor.value);
    }
  }

  removeDoctor(doctor: any) {
    this.selectedDoctorsNotReady = this.selectedDoctorsNotReady.filter(d => d.value !== doctor.value);
    this.selectedDoctorsForDisable = this.selectedDoctorsForDisable.filter(d => d.value !== doctor.value);
    if (!this.availableDoctorsNotReady.find(d => d.value === doctor.value)) {
      this.availableDoctorsNotReady.push(doctor);
      this.filterAvailableDoctors();
    }
  }

  addAllDoctors() {
    this.availableDoctorsNotReady.forEach(doctor => {
      if (!this.selectedDoctorsNotReady.find(d => d.value === doctor.value)) {
        this.selectedDoctorsNotReady.push(doctor);
      }
    });
    this.availableDoctorsNotReady = [];
    this.availableDoctorsNotReadyFiltered = [];
  }

  removeAllDoctors() {
    this.selectedDoctorsNotReady.forEach(doctor => {
      if (!this.availableDoctorsNotReady.find(d => d.value === doctor.value)) {
        this.availableDoctorsNotReady.push(doctor);
      }
    });
    this.selectedDoctorsNotReady = [];
    this.filterAvailableDoctors();
  }

  filterAvailableDoctors() {
    if (!this.doctorSearchText || this.doctorSearchText.trim() === '') {
      this.availableDoctorsNotReadyFiltered = [...this.availableDoctorsNotReady];
    } else {
      const searchLower = this.doctorSearchText.toLowerCase();
      this.availableDoctorsNotReadyFiltered = this.availableDoctorsNotReady.filter(doctor =>
        doctor.label.toLowerCase().includes(searchLower)
      );
    }
  }

  // Methods for moving volunteers between panels
  addVolunteer(volunteer: any) {
    if (!this.selectedVolunteersNotReady.find(v => v.value === volunteer.value)) {
      this.selectedVolunteersNotReady.push(volunteer);
      this.availableVolunteersNotReady = this.availableVolunteersNotReady.filter(v => v.value !== volunteer.value);
      this.filterAvailableVolunteers();
    }
  }

  onVolunteerCheckboxChange(volunteer: any) {
    if (volunteer.selected) {
      if (!this.selectedVolunteersForDisable.find(v => v.value === volunteer.value)) {
        volunteer.selected = true;
        this.selectedVolunteersForDisable.push(volunteer);
      }
    } else {
      volunteer.selected = false;
      this.selectedVolunteersForDisable = this.selectedVolunteersForDisable.filter(v => v.value !== volunteer.value);
    }
  }

  removeVolunteer(volunteer: any) {
    this.selectedVolunteersNotReady = this.selectedVolunteersNotReady.filter(v => v.value !== volunteer.value);
    this.selectedVolunteersForDisable = this.selectedVolunteersForDisable.filter(v => v.value !== volunteer.value);
    if (!this.availableVolunteersNotReady.find(v => v.value === volunteer.value)) {
      this.availableVolunteersNotReady.push(volunteer);
      this.filterAvailableVolunteers();
    }
  }

  addAllVolunteers() {
    this.availableVolunteersNotReady.forEach(volunteer => {
      if (!this.selectedVolunteersNotReady.find(v => v.value === volunteer.value)) {
        this.selectedVolunteersNotReady.push(volunteer);
      }
    });
    this.availableVolunteersNotReady = [];
    this.availableVolunteersNotReadyFiltered = [];
  }

  removeAllVolunteers() {
    this.selectedVolunteersNotReady.forEach(volunteer => {
      if (!this.availableVolunteersNotReady.find(v => v.value === volunteer.value)) {
        this.availableVolunteersNotReady.push(volunteer);
      }
    });
    this.selectedVolunteersNotReady = [];
    this.filterAvailableVolunteers();
  }

  filterAvailableVolunteers() {
    if (!this.volunteerSearchText || this.volunteerSearchText.trim() === '') {
      this.availableVolunteersNotReadyFiltered = [...this.availableVolunteersNotReady];
    } else {
      const searchLower = this.volunteerSearchText.toLowerCase();
      this.availableVolunteersNotReadyFiltered = this.availableVolunteersNotReady.filter(volunteer =>
        volunteer.label.toLowerCase().includes(searchLower)
      );
    }
  }

  // Methods for New Camp Dialog - Doctors
  addDoctorNew(doctor: any) {
    if (!this.selectedDoctors.find(d => d.value === doctor.value)) {
      this.selectedDoctors.push(doctor);
      this.availableDoctors = this.availableDoctors.filter(d => d.value !== doctor.value);
      this.filterAvailableDoctorsNew();
    }
  }

  removeDoctorNew(doctor: any) {
    this.selectedDoctors = this.selectedDoctors.filter(d => d.value !== doctor.value);
    if (!this.availableDoctors.find(d => d.value === doctor.value)) {
      this.availableDoctors.push(doctor);
      this.filterAvailableDoctorsNew();
    }
  }

  addAllDoctorsNew() {
    this.availableDoctors.forEach(doctor => {
      if (!this.selectedDoctors.find(d => d.value === doctor.value)) {
        this.selectedDoctors.push(doctor);
      }
    });
    this.availableDoctors = [];
    this.availableDoctorsFiltered = [];
  }

  removeAllDoctorsNew() {
    this.selectedDoctors.forEach(doctor => {
      if (!this.availableDoctors.find(d => d.value === doctor.value)) {
        this.availableDoctors.push(doctor);
      }
    });
    this.selectedDoctors = [];
    this.filterAvailableDoctorsNew();
  }

  filterAvailableDoctorsNew() {
    if (!this.doctorSearchTextNew || this.doctorSearchTextNew.trim() === '') {
      this.availableDoctorsFiltered = [...this.availableDoctors];
    } else {
      const searchLower = this.doctorSearchTextNew.toLowerCase();
      this.availableDoctorsFiltered = this.availableDoctors.filter(doctor =>
        doctor.label.toLowerCase().includes(searchLower)
      );
    }
  }

  // Methods for New Camp Dialog - Volunteers
  addVolunteerNew(volunteer: any) {
    if (!this.selectedVolunteers.find(v => v.value === volunteer.value)) {
      this.selectedVolunteers.push(volunteer);
      this.availableVolunteers = this.availableVolunteers.filter(v => v.value !== volunteer.value);
      this.filterAvailableVolunteersNew();
    }
  }

  removeVolunteerNew(volunteer: any) {
    this.selectedVolunteers = this.selectedVolunteers.filter(v => v.value !== volunteer.value);
    if (!this.availableVolunteers.find(v => v.value === volunteer.value)) {
      this.availableVolunteers.push(volunteer);
      this.filterAvailableVolunteersNew();
    }
  }

  addAllVolunteersNew() {
    this.availableVolunteers.forEach(volunteer => {
      if (!this.selectedVolunteers.find(v => v.value === volunteer.value)) {
        this.selectedVolunteers.push(volunteer);
      }
    });
    this.availableVolunteers = [];
    this.availableVolunteersFiltered = [];
  }

  removeAllVolunteersNew() {
    this.selectedVolunteers.forEach(volunteer => {
      if (!this.availableVolunteers.find(v => v.value === volunteer.value)) {
        this.availableVolunteers.push(volunteer);
      }
    });
    this.selectedVolunteers = [];
    this.filterAvailableVolunteersNew();
  }

  filterAvailableVolunteersNew() {
    if (!this.volunteerSearchTextNew || this.volunteerSearchTextNew.trim() === '') {
      this.availableVolunteersFiltered = [...this.availableVolunteers];
    } else {
      const searchLower = this.volunteerSearchTextNew.toLowerCase();
      this.availableVolunteersFiltered = this.availableVolunteers.filter(volunteer =>
        volunteer.label.toLowerCase().includes(searchLower)
      );
    }
  }

  saveNotReadyCamp() {
    if (!this.selectedCampForNotReady) {
      return;
    }

    const camp = this.selectedCampForNotReady;

    // Helper function to extract week number from "Week 1", "Week 2", etc.
    const extractWeekNumber = (weekStr: string | undefined): number => {
      if (!weekStr) return 1;
      const match = weekStr.match(/\d+/);
      return match ? parseInt(match[0], 10) : 1;
    };

    // Helper function to convert day name to uppercase format
    const formatDayOfWeek = (dayStr: string | undefined): string => {
      if (!dayStr) return 'MONDAY';
      return dayStr.toUpperCase();
    };

    // Use schedule_week and schedule_day from camp
    const dayOfWeek = formatDayOfWeek(camp.schedule_day);
    const weekOfMonth = extractWeekNumber(camp.schedule_week);

    // Map medicine responsibility - API expects "GBL" but component has "GBR Warehouse" or "Outside"
    let medicineResponsibility = 'GBL';
    if (camp.medicine_responsibility === 'GBR Warehouse') {
      medicineResponsibility = 'GBL';
    } else if (camp.medicine_responsibility === 'Outside') {
      medicineResponsibility = camp.medicine_responsibility_outside || 'GBL';
    }

  

    //Call the API
    // this.campsService.createCamp(payload).subscribe({
    //   next: (response) => {
    //     console.log('Camp created successfully:', response);
    //     // Update local camp data
    //     const index = this.camps.findIndex(c => c.camp_id === camp.camp_id);
    //     if (index !== -1) {
    //       this.camps[index].update_at = new Date();
    //       this.camps[index].ready_for_camp = true;
    //       this.filteredCamps = [...this.camps];
    //     }
    //     // Close dialog
    //     this.cancelNotReadyDialog();
    //     // You can also show a toast notification here
    //   },
    //   error: (error) => {
    //     console.error('Error creating camp:', error);
    //     // Handle error - you can show an error message to the user
    //   }
    // });

    console.log('Selected Volunteers:', this.selectedVolunteersNotReady);
    console.log('Selected Providers:', this.selectedDoctorsNotReady);
  }

  openDisablePasswordDialog(camp: Camp) {
    this.selectedCampForDisablePassword = camp;
    // Load selected providers and volunteers for this camp
    // For now, we'll use the ones from the Not Ready dialog
    // You may need to load from camp data if stored separately
    this.displayDisablePasswordDialog = true;
  }

  disablePassword() {
    console.log('Selected Providers:', this.selectedDoctorsForDisable);
    console.log('Selected Volunteers:', this.selectedVolunteersForDisable);
    console.log('Selected Camp:', this.selectedDoctorsNotReady);
    console.log('Selected Camp:', this.selectedVolunteersNotReady);
    // Add your logic here to disable password for selected providers and volunteers
    this.closeDisablePasswordDialog();
  }

  closeDisablePasswordDialog() {
    this.displayDisablePasswordDialog = false;
    this.selectedCampForDisablePassword = null;
  }

  cancelNotReadyDialog() {
    this.displayNotReadyDialog = false;
    this.selectedCampForNotReady = null;
   // this.selectedDoctorsNotReady = [];
   // this.selectedVolunteersNotReady = [];
    this.selectedDoctorsForDisable = [];
    this.selectedVolunteersForDisable = [];
    this.availableDoctorsNotReady = [];
    this.availableDoctorsNotReadyFiltered = [];
    this.doctorSearchText = '';
    this.availableVolunteersNotReady = [];
    this.availableVolunteersNotReadyFiltered = [];
    this.volunteerSearchText = '';
    this.printerAvailable = false;
    this.paperAvailable = false;
    this.campMedicinesNotReady = [];
  }

  deleteCamp(camp: Camp) {
    if (confirm(`Are you sure you want to delete ${camp.camp_name}?`)) {
      this.camps = this.camps.filter(c => c.camp_id !== camp.camp_id);
      this.filteredCamps = [...this.camps];
    }
  }

  // Start Camp Methods
  openStartCampDialog(camp: Camp) {
    this.selectedCampForStart = camp;
    this.displayStartCampDialog = true;
  }

  startCamp() {
    if (this.selectedCampForStart) {
      const index = this.camps.findIndex(c => c.camp_id === this.selectedCampForStart?.camp_id);
      if (index !== -1) {
        this.camps[index].camp_started = true;
        this.filteredCamps = [...this.camps];
      }
      this.closeStartCampDialog();
    }
  }

  openStopCampDialog(camp: Camp) {
    this.selectedCampForStop = camp;
    this.displayStopCampDialog = true;
  }

  stopCamp() {
    if (this.selectedCampForStop) {
      const index = this.camps.findIndex(c => c.camp_id === this.selectedCampForStop?.camp_id);
      if (index !== -1) {
        this.camps[index].camp_started = true;
        this.camps[index].camp_ended = true;
        this.filteredCamps = [...this.camps];
      }
      this.closeStopCampDialog();
    }
  }

  closeStopCampDialog() {
    this.displayStopCampDialog = false;
    this.selectedCampForStop = null;
  }

  closeStartCampDialog() {
    this.displayStartCampDialog = false;
    this.selectedCampForStart = null;
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
    this.displayDialog = false;
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

