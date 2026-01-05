import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CampsService, Camp, MedicineStock, CampMedicineStockSummary } from '../../core/services/camps.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface StockItem {
  campId: number;
  medicine_name: string;
  medicine_type: string;
  quantity: number;
  batch_no?: string;
  exp_date?: Date;
}

@Component({
  selector: 'app-current-stock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    TableModule
  ],
  templateUrl: './current-stock.component.html',
  styleUrl: './current-stock.component.scss'
})
export class CurrentStockComponent implements OnInit {
  private readonly campsService = inject(CampsService);
  
  camps: Camp[] = [];
  campOptions: { label: string, value: number }[] = [];
  selectedCampId: number | null = null;
  stockItems: StockItem[] = [];
  filteredStockItems: StockItem[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.loadCamps();
  }

  loadCamps() {
    this.loading = true;
    this.errorMessage = '';
    
    this.campsService.getActiveCamps()
      .pipe(
        catchError(error => {
          console.error('Error loading camps:', error);
          this.errorMessage = 'Failed to load camps. Please try again later.';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (camps: Camp[]) => {
          this.camps = camps;
          if(this.camps.length > 0) {
          this.campOptions = this.camps
            .filter(c => c.campId !== undefined)
            .map(c => ({
              label: c.campCode ? `${c.campCode} - ${c.campName}` : c.campName,
              value: c.campId
            }));
          this.loading = false;

          // Load stock data from camps
          //this.loadStockDataFromCamps(camps);
          this.loadSampleStockData();
          } else {
            this.campOptions = [
              {
                "label": "HC001 - JANA VIGNANA VEDIKA TIRUVURU",
                "value": 1
              },
              {
                "label": "BDC002 - JANA VIGNANA VEDIKA BAPATLA",
                "value": 2
              }
            ];

            // Load sample stock data
            this.loadSampleStockData();
            
            this.errorMessage = 'No camps found. Please try again later.';
            this.loading = false;
          }
          
          console.log('campOptions--->', this.campOptions);
        },
        error: (error) => {
          console.error('Error in camps subscription:', error);
          this.loading = false;
        }
      });
  }

  loadStockDataFromCamps(camps: Camp[]) {
    // Transform medicineStocks from API response to StockItem format
    this.stockItems = [];
    
    camps.forEach(camp => {
      if (camp.medicineStocks && camp.medicineStocks.length > 0) {
        camp.medicineStocks.forEach((stock: MedicineStock) => {
          // For now, using HSN code as identifier until medicine details API is available
          // TODO: Integrate with medicine API to get medicine name and type from HSN code
          const medicineName = `Medicine (HSN: ${stock.hsnCode})`;
          const medicineType = 'N/A'; // Will be populated when medicine API is integrated
          
          this.stockItems.push({
            campId: camp.campId,
            medicine_name: medicineName,
            medicine_type: medicineType,
            quantity: stock.quantity,
            batch_no: stock.batchNumber,
            exp_date: stock.expiryDate ? new Date(stock.expiryDate) : undefined
          });
        });
      }
    });
  }

  loadStockData() {
    // This method is now replaced by loadStockDataFromCamps
    // Keeping for backward compatibility if needed
  }

  loadSampleStockData() {
    // Sample stock data matching the sample camps
    this.stockItems = [
      // Stock for HC001 - JANA VIGNANA VEDIKA TIRUVURU (Camp ID: 1)
      {
        campId: 1,
        medicine_name: 'Medicine (HSN: 300450)',
        medicine_type: 'Tablet',
        quantity: 100,
        batch_no: 'BATCH001',
        exp_date: new Date('2027-12-01')
      },
      {
        campId: 1,
        medicine_name: 'Medicine (HSN: 300451)',
        medicine_type: 'Capsule',
        quantity: 400,
        batch_no: 'BATCH002',
        exp_date: new Date('2027-12-01')
      },
      // Stock for BDC002 - JANA VIGNANA VEDIKA BAPATLA (Camp ID: 2)
      {
        campId: 2,
        medicine_name: 'Medicine (HSN: 300452)',
        medicine_type: 'Syrup',
        quantity: 250,
        batch_no: 'BATCH003',
        exp_date: new Date('2026-06-30')
      },
      {
        campId: 2,
        medicine_name: 'Medicine (HSN: 300453)',
        medicine_type: 'Tablet',
        quantity: 500,
        batch_no: 'BATCH004',
        exp_date: new Date('2026-08-15')
      },
      {
        campId: 2,
        medicine_name: 'Medicine (HSN: 300454)',
        medicine_type: 'Injection',
        quantity: 150,
        batch_no: 'BATCH005',
        exp_date: new Date('2026-09-20')
      }
    ];
  }

  onCampChange() {
    if (this.selectedCampId) {
      this.loading = true;
      this.errorMessage = '';
      
      this.campsService.getCampMedicineStockSummary(this.selectedCampId)
        .pipe(
          catchError(error => {
            console.error('Error loading camp medicine stock summary:', error);
            this.errorMessage = 'Failed to load stock summary. Please try again later.';
            this.loading = false;
            this.filteredStockItems = [];
            return of([]);
          })
        )
        .subscribe({
          next: (summary: CampMedicineStockSummary[]) => {
            console.log('summary--->', summary);
            
            // Transform API response to StockItem format
            this.filteredStockItems = summary.map(item => {
              // Get batch info from medicineStocks array (check summary level first, then medicineLookupNew level)
              const stockInfo = item.medicineStocks && item.medicineStocks.length > 0 
                ? item.medicineStocks[0] 
                : (item.medicineLookupNew?.medicineStocks && item.medicineLookupNew.medicineStocks.length > 0
                  ? item.medicineLookupNew.medicineStocks[0]
                  : null);
              
              return {
                campId: this.selectedCampId!,
                medicine_name: item.medicineLookupNew?.medicationName || 'N/A',
                medicine_type: item.medicineLookupNew?.medicineType || 'N/A',
                quantity: item.quantity,
                batch_no: stockInfo?.batchNumber,
                exp_date: stockInfo?.expiryDate ? new Date(stockInfo.expiryDate) : undefined
              };
            });
            this.loading = false;
          },
          error: (error) => {
            console.error('Error in camp medicine stock summary subscription:', error);
            this.loading = false;
            this.filteredStockItems = [];
          }
        });
    } else {
      this.filteredStockItems = [];
    }
  }

  clearSelection() {
    this.selectedCampId = null;
    this.filteredStockItems = [];
  }

  getTotalQuantity(): number {
    return this.filteredStockItems.reduce((total, item) => total + item.quantity, 0);
  }
}

