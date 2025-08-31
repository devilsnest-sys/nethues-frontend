import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { HistoryService } from '../../history/history.service';
import { AuthService } from '../../auth/auth.service';

interface Message {
  id?: string;
  from: 'user' | 'system';
  text: string;
  numeric?: number | null;
  words?: string | null;
  time: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: false
})
export class ChatComponent {
  input = '';
  messages: Message[] = [];
  sending = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  constructor(private chat: ChatService, private hist: HistoryService, private auth: AuthService) {
    const stored = this.hist.getAll();
    // show recent history as system messages
    this.messages = stored.map(h => ({
      id: h.id,
      from: 'user',
      text: h.expression,
      numeric: h.response?.numericResult ?? null,
      words: h.response?.words ?? null,
      time: h.timestamp
    }));
  }

  private scrollToBottom() {
    setTimeout(() => {
      try {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      } catch {}
    }, 50);
  }

  async send() {
    if (!this.input.trim()) return;
    const expr = this.input.trim();

    // Push user message
    this.messages.push({
      from: 'user',
      text: expr,
      time: new Date().toISOString()
    });
    this.input = '';
    this.sending = true;
    this.scrollToBottom();

    try {
      const resp = await this.chat.evaluate(expr);

      // Push system message with proper fields
      this.messages.push({
        from: 'system',
        text: expr, // keep expression for context
        numeric: resp.numericResult,
        words: resp.words,
        time: resp.createdAt // use server-provided createdAt
      });

      // Store activity in history
      this.hist.add({
        expression: expr,
        response: resp,
        timestamp: resp.createdAt
      });

    } catch (err: any) {
      this.messages.push({
        from: 'system',
        text: 'Error: ' + (err.message || err),
        time: new Date().toISOString()
      });
    } finally {
      this.sending = false;
      this.scrollToBottom();
    }
  }
}
