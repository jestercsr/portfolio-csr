import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-invoice-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './invoice-modal.component.html',
  styleUrl: './invoice-modal.component.css',
  standalone: true,
})
export class InvoiceModalComponent implements OnInit {
  public offer: any = null;
  public provider: any = null;
  public client: any = {
    name: '',
    email: '',
    address: '',
  };
  public message: string = '';
  public today = new Date();
  public tva = 20;
  public subtotal = 0;
  public total = 0;
  public invoiceNumber = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (!this.provider) {
      this.provider = {
        company: 'Jester CESAR',
        addressLine1: '1O rue de Varennes',
        addressLine2: '95190 GOUSSAINVILLE',
        phone: '06 04 52 32 70',
        siret: '992 596 338 00010',
        email: 'jester.csr@gmail.com',
      };
    }

    if (this.offer && !this.message) {
      this.message = `${this.offer.type} - ${this.offer.detail}\n\n${
        this.offer.details?.slice(0, 3).join(', ') ||
        this.offer.description ||
        ''
      }`;
    }
    this.generateInvoiceNumber();
    this.calculateTotals();
  }

  ngOnChanges() {
    this.calculateTotals();
  }

  close() {
    this.activeModal.dismiss();
  }

  generateInvoiceNumber() {
    const date = new Date();
    this.invoiceNumber = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}-${Math.floor(Math.random() * 9000) + 1000}`;
  }

  calculateTotals() {
    const prix = parseFloat(this.offer.prix.replace(/[^0-9.]/g, ''));
    this.subtotal = prix;
    this.total = this.subtotal + (this.subtotal * this.tva) / 100;
  }

  downloadPDF() {
    const invoice = document.getElementById('invoice-preview')!;

    const options = {
      margin: 10,
      filename: this.invoiceNumber + '.pdf',
      image: {
        type: 'png' as const,
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const,
      },
    };

    html2pdf().from(invoice).set(options).save();
  }
}
