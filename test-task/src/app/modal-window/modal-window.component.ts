import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Room } from '../mock/mock.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css'],
})
export class ModalComponent implements OnInit {
  ngOnInit() {
    console.log(this.data);
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Room,
    private readonly location: Location,
    private readonly dialogRef: MatDialogRef<ModalComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
    this.location.go(`issues`);
  }
}
