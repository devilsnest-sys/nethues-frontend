import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { authFetch } from '../common/fetch-helper';
import { HistoryService } from '../history/history.service';

export interface ChatResponse {
  numericResult: number;
  words: string;
  createdAt: string;   // ✅ include createdAt
  raw?: any;
}

@Injectable()
export class ChatService {
  private base = environment.baseApiUrl;
  constructor(private auth: AuthService, private history: HistoryService) {}

  async evaluate(expression: string): Promise<ChatResponse> {
    const res = await authFetch(this.auth, `${this.base}/Chat/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ expression })
    });
    if (!res.ok) throw new Error(await res.text());
    const text = await res.text();

    try {
      const json = JSON.parse(text);
      return this.normalize(json);
    } catch {
      // fallback: server returned plain text
      const numeric = Number(text);
      const words = isNaN(numeric) ? text : numberToWords(numeric);
      const payload: ChatResponse = { 
        numericResult: numeric, 
        words, 
        createdAt: new Date().toISOString() 
      };
      this.history.add({ expression, response: payload, timestamp: payload.createdAt });
      return payload;
    }
  }

  private normalize(payload: any): ChatResponse {
    const numericResult = payload.result 
                       ?? payload.numeric 
                       ?? payload.numericResult 
                       ?? null;
    const words = payload.words 
               ?? payload.resultInWords  // ✅ handle API key
               ?? payload.wordsResult 
               ?? null;
    const createdAt = payload.createdAt ?? new Date().toISOString();

    const response: ChatResponse = { 
      numericResult, 
      words, 
      createdAt, 
      raw: payload 
    };
    return response;
  }
}

function numberToWords(n: number) {
  const a = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (n < 20) return a[n];
  if (n < 100) return (b[Math.floor(n/10)] + (n%10 ? ' ' + a[n%10] : ''));
  return n.toString();
}
