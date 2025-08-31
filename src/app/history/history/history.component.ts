import { Component } from '@angular/core';
import { HistoryService, Activity } from '../history.service';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../layout/header/header.component";
import { MatCard } from "@angular/material/card";
import { MaterialModule } from "../../../material.module";

@Component({
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
 standalone: false
})
export class HistoryComponent {
  activities: Activity[] = [];
  constructor(private hist: HistoryService, private router: Router) {
    this.activities = hist.getAll();
  }

  clear() {
    this.hist.clear();
    this.activities = [];
  }
}
