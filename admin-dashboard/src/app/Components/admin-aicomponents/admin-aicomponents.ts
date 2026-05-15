import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAIService, AdminAIResponse, ChatMessage } from '../../Services/admin-ai-service';
import { Auth } from '../../Services/auth';
import { Iuser } from '../../Models/iuser';

@Component({
  selector: 'app-admin-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-aicomponents.html',
  styleUrl: './admin-aicomponents.scss'
})
export class AdminAIComponents implements OnInit {
  messages: ChatMessage[] = [];
  question: string = '';
  loading: boolean = false;
  error: string = '';
  userProfileImage: string = 'assets/default-avatar.png'; // Default avatar
  adminName: string = 'Admin';
  private readonly STORAGE_KEY = 'adminAIChatMessages';

  constructor(private aiService: AdminAIService, private auth: Auth) { }

  ngOnInit(): void {
    const hasPersisted = this.loadPersistedMessages();
    this.loadUserData(hasPersisted);
    if (!hasPersisted) {
      // Fallback welcome if fetchMe is slow/unavailable
      this.setWelcomeMessage();
    }
  }

  sendQuestion(): void {
    if (!this.question.trim()) return;

    // Add user message
    const userMsg = this.buildMessage('user', this.question);
    this.messages.push(userMsg);
    this.saveMessages();
      // Auto scroll to bottom after adding user message
      setTimeout(() => {
        const chatBox = document.getElementById('chatBox');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 0);
    this.error = '';

    // Call API
    this.loading = true;
    const q = this.question;
    this.question = '';

    this.aiService.askQuestion(q).subscribe({
      next: (response: AdminAIResponse) => {
        const assistantMsg = this.buildMessage('assistant', response.answer, response.timestamp);
        this.messages.push(assistantMsg);
        this.saveMessages();

        this.loading = false;

        // Keep viewport pinned to top for new replies
          // Auto scroll to bottom after assistant reply
          setTimeout(() => {
            const chatBox = document.getElementById('chatBox');
            if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
          }, 50);
      },
      error: (err) => {
        // Prefer server message, then error field, then network status
        if (err?.error?.message) this.error = err.error.message;
        else if (err?.error?.error) this.error = err.error.error;
        else if (err?.status === 0) this.error = 'تعذر الاتصال بالخادم';
        else this.error = err?.message || 'حدث خطأ في الاتصال';
        this.loading = false;
      }
    });
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendQuestion();
    }
  }

  clearChat(): void {
    this.setWelcomeMessage();
    this.error = '';
  }

  private loadUserData(hasPersisted: boolean): void {
    const cached = localStorage.getItem('userProfileImage');
    if (cached) {
      this.userProfileImage = cached;
    }

    const tokenUser = this.auth.getUser() as Partial<Iuser> | null;
    if (tokenUser?.name) this.adminName = tokenUser.name;

    try {
      this.auth.fetchMe().subscribe({
        next: ({ user }: { user: Iuser }) => {
          const img = user?.profilePicture || user?.profile?.profilePicture;
          if (img) {
            this.userProfileImage = img;
            localStorage.setItem('userProfileImage', img);
          }
          const name = user?.name || user?.profile?.name;
          if (name) this.adminName = name;
          if (!hasPersisted && this.messages.length === 1) {
            this.setWelcomeMessage();
          }
        },
        error: () => {
          if (!hasPersisted && this.messages.length === 0) {
            this.setWelcomeMessage();
          }
          /* Ignore avatar load failure; fallback already set */
        }
      });
    } catch {
      if (!hasPersisted) {
        this.setWelcomeMessage();
      }
      /* Ignore avatar load failure */
    }
  }

  private loadPersistedMessages(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length) {
        this.messages = parsed;
        return true;
      }
    } catch {
      // ignore parse error
    }
    return false;
  }

  private saveMessages(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages));
    } catch {
      // ignore storage errors
    }
  }

  private setWelcomeMessage(): void {
    const welcomeText = this.buildWelcomeText();
    this.messages = [this.buildMessage('assistant', welcomeText)];
    this.saveMessages();
  }

  private buildWelcomeText(): string {
    const name = this.adminName || 'Admin';
    return `👋 Eng ${name}, مرحباً! أنا مساعدك الذكي للتحليلات. اسأل عن المبيعات أو المخزون أو العملاء. 📊\n\nHi Eng ${name}, I'm your AI analytics assistant. Ask me about sales, inventory, or customer insights.`;
  }

  // Helpers
  private isArabic(text: string) {
    return /[\u0600-\u06FF\u0750-\u077F]/.test(text);
  }

  private escapeHtml(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private formatAsBullets(text: string) {
    if (!text) return '';
    // split by newlines first
    let parts = text.split(/\r?\n+/).map(s => s.trim()).filter(Boolean);
    if (parts.length <= 1) {
      // try to split by sentence terminators (Arabic and English)
      parts = text.split(/(?<=[.؟?!])\s+/u).map(s => s.trim()).filter(Boolean);
    }
    // fallback: if still single long line, split by semicolons or commas if lengthy
    if (parts.length <= 1 && text.length > 120) {
      parts = text.split(/;|,|\u2022/).map(s => s.trim()).filter(Boolean);
    }
    const items = parts.map(p => `<li>${this.escapeHtml(p)}</li>`).join('');
    return `<ul class="ai-bullets">${items}</ul>`;
  }

  private buildMessage(role: 'user' | 'assistant', content: string, timestamp?: string, options?: { rawHtml?: boolean }): ChatMessage {
    const dir = this.isArabic(content) ? 'rtl' : 'ltr';
    const formatted = options?.rawHtml
      ? content
      : role === 'assistant'
        ? this.formatAsBullets(content)
        : this.escapeHtml(content).replace(/\n/g, '<br/>');
    return {
      role,
      content: formatted,
      timestamp: timestamp || new Date().toISOString(),
      dir,
    };
  }

  private buildStructuredHtml(structured: any): string {
    if (!structured) return '';
    const parts: string[] = [];

    parts.push('<div class="ai-structured"><div class="ai-structured-grid">');

    // Profit summary
    if (structured.profits) {
      const p = structured.profits;
      const fmt = (n: any) => Number(n || 0).toLocaleString('en-EG', { maximumFractionDigits: 2 });
      parts.push(`
        <div class="ai-card ai-card-wide">
          <div class="ai-card-head"><span class="badge">Profits</span><h5>📈 Profit Summary</h5></div>
          <table class="ai-table">
            <thead><tr><th>Period</th><th>Total Profit</th><th>New</th><th>Used</th><th>Per Admin</th></tr></thead>
            <tbody>
              <tr><td>Today</td><td>${fmt(p.today?.totalProfit)} EGP</td><td>${fmt(p.today?.newProfit)} EGP</td><td>${fmt(p.today?.usedProfit)} EGP</td><td>${fmt(p.today?.perAdmin)} EGP</td></tr>
              <tr><td>This Month</td><td>${fmt(p.month?.totalProfit)} EGP</td><td>${fmt(p.month?.newProfit)} EGP</td><td>${fmt(p.month?.usedProfit)} EGP</td><td>${fmt(p.month?.perAdmin)} EGP</td></tr>
              <tr><td>This Year</td><td>${fmt(p.year?.totalProfit)} EGP</td><td>${fmt(p.year?.newProfit)} EGP</td><td>${fmt(p.year?.usedProfit)} EGP</td><td>${fmt(p.year?.perAdmin)} EGP</td></tr>
            </tbody>
          </table>
        </div>
      `);
    }

    // Charts payload preview (front-end chart lib can consume it)
    if (Array.isArray(structured.charts) && structured.charts.length) {
      const chartJson = this.escapeHtml(JSON.stringify(structured.charts, null, 2));
      parts.push(`
        <div class="ai-card">
          <div class="ai-card-head"><span class="badge">Charts</span><h5>📊 Charts Data (JSON)</h5></div>
          <pre class="ai-pre">${chartJson}</pre>
        </div>
      `);
    }

    // Product cards
    if (Array.isArray(structured.productCards) && structured.productCards.length) {
      const cards = structured.productCards
        .map((c: any) => {
          const name = this.escapeHtml(c?.name?.en || c?.name?.ar || c?.name || 'Product');
          const condition = this.escapeHtml(c?.condition || 'new');
          const profit = Number(c?.profit || 0).toLocaleString('en-EG', { maximumFractionDigits: 2 });
          const saleAmount = Number(c?.saleAmount || 0).toLocaleString('en-EG', { maximumFractionDigits: 2 });
          const qty = Number(c?.quantity || 0);
          const img = this.escapeHtml(c?.image || '');
          const imgTag = img ? `<img src="${img}" alt="${name}" />` : '<div class="img-placeholder">No image</div>';
          return `
            <div class="ai-product-card">
              ${imgTag}
              <div class="ai-product-info">
                <h6>${name}</h6>
                <p>Condition: ${condition}</p>
                <p>Profit: ${profit} EGP</p>
                <p>Sales: ${saleAmount} EGP · Qty: ${qty}</p>
              </div>
            </div>
          `;
        })
        .join('');

      parts.push(`
        <div class="ai-card">
          <div class="ai-card-head"><span class="badge">Products</span><h5>🏆 Top Profit Products</h5></div>
          <div class="ai-product-grid">${cards}</div>
        </div>
      `);
    }

    parts.push('</div></div>');
    return parts.join('');
  }
}
