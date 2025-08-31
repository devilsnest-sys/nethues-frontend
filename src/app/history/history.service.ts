import { Injectable } from '@angular/core';

export interface Activity {
  id?: string;
  expression: string;
  response: any;
  timestamp: string;
}

const KEY = 'arithmetic_history_v1';

@Injectable()
export class HistoryService {
  private list: Activity[] = [];

  constructor() {
    const raw = localStorage.getItem(KEY);
    this.list = raw ? JSON.parse(raw) : [];
  }

  getAll() {
    // return a copy
    return [...this.list].sort((a,b) => b.timestamp.localeCompare(a.timestamp));
  }

  add(entry: Activity) {
    entry.id = (Date.now() + Math.random()).toString(36);
    this.list.unshift(entry);
    localStorage.setItem(KEY, JSON.stringify(this.list));
  }

  clear() {
    this.list = [];
    localStorage.removeItem(KEY);
  }
}
