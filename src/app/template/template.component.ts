import { Component, OnInit } from '@angular/core';
import { Templates } from '../_models/Templates';
import { TemplatesService } from '../_service/templates.service';
import { NgFor } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NgbCollapseConfig, NgbCollapseModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TemplateModalComponent } from '../template-modal/template-modal.component';

@Component({
  selector: 'app-template',
  imports: [NgFor, NgbCollapseModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent implements OnInit {
  templates = {} as Templates[];

  constructor(private templatesService: TemplatesService, private titleService: Title, config: NgbCollapseConfig, private modalService: NgbModal) {
    this.titleService.setTitle('Templates - Portfolio de Jester CESAR');
    config.animation = true
  }

  ngOnInit(): void {
    this.templates = this.templatesService.templates;
  }

  OpenProjectModal(template: Templates) {
      const modalOptions: NgbModalOptions = {
        size: 'lg',
        keyboard: false
        
      }
      const modalRef = this.modalService.open(TemplateModalComponent, modalOptions);
      modalRef.componentInstance.template = template;
    }

}
