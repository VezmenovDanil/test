import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker/datepicker-input-base';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  BehaviorSubject,
  catchError,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MockService, Room, DateRange } from '../mock/mock.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal-window/modal-window.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit, OnInit, OnDestroy {
  readonly displayedColumns: string[] = ['number', 'capacity', 'price'];
  public dataSource = new MatTableDataSource();
  public stateSort = 'DefaultSort';
  public updateDataEventBus$ = new BehaviorSubject<boolean>(true);
  public destroy$ = new Subject<boolean>();
  public sortState: Sort = {
    active: 'price',
    direction: 'asc',
  };
  public filterState: DateRange = {
    startDate: 0,
    endDate: 0,
  };

  constructor(private mockService: MockService, public dialog: MatDialog) {}

  ngOnInit() {
    this.updateDataEventBus$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return this.mockService
            .render(
              this.sortState.active,
              this.sortState.direction,
              this.filterState
            )
            .pipe(catchError(() => of(null)));
        })
      )
      .subscribe((data) => {
        this.onDataUpdate(data);
      });
  }

  @ViewChild('matPaginator')
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  private onDataUpdate(data: Room[] | null): void {
    if (!data) {
      this.dataSource.data = [];
      return;
    }
    this.dataSource.data = data;
  }

  onSortChange(event: Sort): void {
    this.sortState = event;
    this.updateDataEventBus$.next(true);
  }

  datePickerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let forbidden = true;
      if (control.value) {
        const dateNow = Math.floor(new Date().getTime() / 100000000);
        const printDate = Math.floor(control.value / 100000000);
        if (printDate >= dateNow) forbidden = false;
      }
      return forbidden ? { invalidDOBYear: true } : null;
    };
  }

  dataRangeForm = new FormGroup({
    start: new FormControl('', [
      Validators.required,
      this.datePickerValidator(),
    ]),
    end: new FormControl('', [Validators.required, this.datePickerValidator()]),
  });

  addEvent(event: MatDatepickerInputEvent<Date>) {
    if (
      this.dataRangeForm.controls?.['start'].valid &&
      this.dataRangeForm.controls?.['end'].valid
    ) {
      this.filterState.startDate = Math.floor(
        Date.parse(this.dataRangeForm.controls?.['start'].value) / 100000000
      );
      this.filterState.endDate = Math.floor(
        Date.parse(this.dataRangeForm.controls?.['end'].value) / 100000000
      );
      this.updateDataEventBus$.next(true);
    }
  }

  openDialog(element: Room) {
    this.dialog.open(ModalComponent, {
      data: element
    });
  }
}
