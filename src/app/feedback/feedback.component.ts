import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Feedback, FeedbackService } from '../_service/feedback.service';
import { CommonModule, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLightbulbFill, bootstrapStarFill } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-feedback',
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, CommonModule, ReactiveFormsModule, NgIcon],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
  standalone: true,
  providers: [provideIcons({bootstrapLightbulbFill, bootstrapStarFill})],
})
export class FeedbackComponent implements OnInit, OnDestroy {
  feedbackForm: FormGroup;
  isOpen = false;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';
  selectedType: 'bug' | 'suggestion' | 'compliment' = 'bug';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.feedbackForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', Validators.email],
      rating: [5, [Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {}

  selectType(type: string): void {
    if (type === 'bug' || type === 'suggestion' || type === 'compliment') {
      this.selectedType = type as 'bug' | 'suggestion' | 'compliment';
    }
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const feedback: Feedback = {
      type: this.selectedType,
      title: this.feedbackForm.get('title')?.value,
      message: this.feedbackForm.get('message')?.value,
      email: this.feedbackForm.get('email')?.value,
      rating: this.feedbackForm.get('rating')?.value,
      pageUrl: window.location.href
    };

    this.feedbackService.submitFeedback(feedback)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.resetForm();
          
          // Fermer le widget après 2 secondes
          setTimeout(() => {
            this.isOpen = false;
            this.submitSuccess = false;
          }, 2000);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          this.errorMessage = 'Erreur lors de l\'envoi. Veuillez réessayer.';
          console.error('Feedback submission error:', error);
        }
      });
  }

  resetForm(): void {
    this.feedbackForm.reset({ rating: 5 });
    this.selectedType = 'bug';
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
