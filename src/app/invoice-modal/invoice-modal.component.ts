import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapPrinterFill } from '@ng-icons/bootstrap-icons';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

@Component({
  selector: 'app-invoice-modal',
  imports: [FormsModule, CommonModule, NgIcon],
  templateUrl: './invoice-modal.component.html',
  styleUrl: './invoice-modal.component.css',
  standalone: true,
  providers: [
    provideIcons({
      bootstrapPrinterFill,
    }),
  ],
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
  public tva = 0;
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

  printPDF() {
    const printContents = document.getElementById('invoice-preview')!.innerHTML;

    const popup = window.open('', '_blank', 'width=900,height=1000');
    popup!.document.open();
    popup!.document.write(`
    <html>
      <head>
        <title>Facture</title>
        <style>
          body {
            font-family: "Inter", sans-serif;
            padding: 40px;
            color: #1a1a1a;
          }
          .invoice-header {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            margin: 25px 0 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 15px;
          }
          td {
            padding: 10px 0;
            border-bottom: 1px solid #e6e6e6;
          }
          .total {
            font-weight: bold;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
    popup!.document.close();
    popup!.print();
  }

  async downloadPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);

    const width = page.getWidth();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // HEADER BAR
    page.drawRectangle({
      x: 0,
      y: 800,
      width: width,
      height: 50,
      color: rgb(0.05, 0.05, 0.05),
    });

    page.drawText('Facture', {
      x: 40,
      y: 815,
      size: 22,
      font: bold,
      color: rgb(1, 1, 1),
    });

    page.drawText(this.invoiceNumber, {
      x: width - 160,
      y: 815,
      size: 12,
      font,
      color: rgb(1, 1, 1),
    });

    // PROVIDER BLOCK (Odoo style)
    page.drawText(this.provider.company, {
      x: 40,
      y: 750,
      size: 14,
      font: bold,
    });

    page.drawText(`${this.provider.addressLine1}`, {
      x: 40,
      y: 730,
      size: 11,
      font,
    });
    page.drawText(`${this.provider.addressLine2}`, {
      x: 40,
      y: 715,
      size: 11,
      font,
    });
    page.drawText(`${this.provider.phone}`, { x: 40, y: 700, size: 11, font });
    page.drawText(`${this.provider.email}`, { x: 40, y: 685, size: 11, font });

    // CLIENT SECTION (Stripe style card)
    page.drawRectangle({
      x: 300,
      y: 690,
      width: 250,
      height: 90,
      borderColor: rgb(0.6, 0.6, 0.6),
      borderWidth: 1.2,
    });

    page.drawText('Facturé à', {
      x: 315,
      y: 760,
      size: 13,
      font: bold,
    });

    page.drawText(`${this.client.name}`, { x: 315, y: 740, size: 11, font });
    page.drawText(`${this.client.address}`, { x: 315, y: 725, size: 11, font });
    page.drawText(`${this.client.email}`, { x: 315, y: 710, size: 11, font });

    /// TABLE HEADER
    page.drawRectangle({
      x: 40,
      y: 620,
      width: 515,
      height: 30,
      color: rgb(0.95, 0.95, 0.95),
    });

    const headerY = 630;

    page.drawText('Service', { x: 50, y: headerY, size: 12, font: bold });
    page.drawText('Prix', { x: 500, y: headerY, size: 12, font: bold });

    // LINE
    page.drawText(this.offer.type, { x: 50, y: 600, size: 12, font });
    page.drawText(this.offer.prix + ' €', { x: 500, y: 600, size: 12, font });

    // TOTAL STRIPE STYLE
    page.drawText('Sous-total:', { x: 400, y: 520, size: 12, font });
    page.drawText(this.subtotal.toFixed(2) + '€', {
      x: 500,
      y: 520,
      size: 12,
      font,
    });

    page.drawText('TVA (' + this.tva + '%):', {
      x: 400,
      y: 500,
      size: 12,
      font,
    });
    page.drawText(((this.subtotal * this.tva) / 100).toFixed(2) + '€', {
      x: 500,
      y: 500,
      size: 12,
      font,
    });

    page.drawText('TOTAL', {
      x: 400,
      y: 470,
      size: 14,
      font: bold,
    });

    page.drawText(this.total.toFixed(2) + ' €', {
      x: 500,
      y: 470,
      size: 14,
      font: bold,
      color: rgb(0.15, 0.15, 0.15),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: 'application/pdf',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = this.invoiceNumber + '.pdf';
    link.click();
  }
}
