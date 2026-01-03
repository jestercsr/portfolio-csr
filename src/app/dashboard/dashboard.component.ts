import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Feedback, FeedbackService } from '../_service/feedback.service';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, NgFor, SlicePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})
export class DashboardComponent implements OnInit, OnDestroy {
  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  
  selectedType: 'all' | 'bug' | 'suggestion' | 'compliment' = 'all';
  selectedStatus: 'all' | 'resolved' | 'pending' = 'all';
  searchQuery = '';

  totalFeedbacks = 0;
  bugCount = 0;
  suggestionCount = 0;
  complimentCount = 0;
  resolvedCount = 0;
  averageRating = 0;

  isLoading = true;
  sortBy: 'recent' | 'oldest' | 'rating' = 'recent';
  expandedFeedbackId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private feedbackService: FeedbackService, private titleService: Title) {
    this.titleService.setTitle('Dashboard - Portfolio de Jester CESAR');
  }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getFeedbacks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (feedbacks) => {
          this.feedbacks = feedbacks;
          this.isLoading = false;
          this.updateStatistics();
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error loading feedbacks:', error);
          this.isLoading = false;
        }
      });
  }

  updateStatistics(): void {
    this.totalFeedbacks = this.feedbacks.length;
    this.bugCount = this.feedbacks.filter(f => f.type === 'bug').length;
    this.suggestionCount = this.feedbacks.filter(f => f.type === 'suggestion').length;
    this.complimentCount = this.feedbacks.filter(f => f.type === 'compliment').length;
    this.resolvedCount = this.feedbacks.filter(f => f.resolved).length;

    const compliments = this.feedbacks.filter(f => f.type === 'compliment' && f.rating);
    this.averageRating = compliments.length > 0
      ? compliments.reduce((sum, f) => sum + (f.rating || 0), 0) / compliments.length
      : 0;
  }

  applyFilters(): void {
    let filtered = [...this.feedbacks];

    if (this.selectedType !== 'all') {
      filtered = filtered.filter(f => f.type === this.selectedType);
    }

    if (this.selectedStatus !== 'all') {
      const isResolved = this.selectedStatus === 'resolved';
      filtered = filtered.filter(f => f.resolved === isResolved);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.title.toLowerCase().includes(query) ||
        f.message.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const aTime = new Date(a.timestamp || 0).getTime();
      const bTime = new Date(b.timestamp || 0).getTime();
      
      switch (this.sortBy) {
        case 'oldest':
          return aTime - bTime;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'recent':
        default:
          return bTime - aTime;
      }
    });

    this.filteredFeedbacks = filtered;
  }

  filterByType(type: string): void {
    if (type === 'all' || type === 'bug' || type === 'suggestion' || type === 'compliment') {
      this.selectedType = type as 'all' | 'bug' | 'suggestion' | 'compliment';
      this.applyFilters();
    }
  }

  filterByStatus(status: string): void {
    if (status === 'all' || status === 'resolved' || status === 'pending') {
      this.selectedStatus = status as 'all' | 'resolved' | 'pending';
      this.applyFilters();
    }
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.applyFilters();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = (target.value as 'recent' | 'oldest' | 'rating') || 'recent';
    this.applyFilters();
  }

  toggleExpanded(feedbackId: string | undefined): void {
    if (!feedbackId) return;
    this.expandedFeedbackId = this.expandedFeedbackId === feedbackId ? null : feedbackId;
  }

  resolveFeedback(feedbackId: string | undefined, event: Event): void {
    if (!feedbackId) return;
    event.stopPropagation();

    this.feedbackService.resolveFeedback(feedbackId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadFeedbacks();
        },
        error: (error) => console.error('Error resolving feedback:', error)
      });
  }

  deleteFeedback(feedbackId: string | undefined, event: Event): void {
    if (!feedbackId) return;
    event.stopPropagation();

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce feedback ?')) {
      return;
    }

    this.feedbackService.deleteFeedback(feedbackId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadFeedbacks();
        },
        error: (error) => console.error('Error deleting feedback:', error)
      });
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'bug': '🐛',
      'suggestion': '💡',
      'compliment': '⭐'
    };
    return icons[type] || '📝';
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'bug': '#ef4444',
      'suggestion': '#f59e0b',
      'compliment': '#10b981'
    };
    return colors[type] || '#6b7280';
  }

  getStatusBadgeClass(feedback: Feedback): string {
    return feedback.resolved ? 'badge-resolved' : 'badge-pending';
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  exportFeedbacks(): void {
    const dataStr = JSON.stringify(this.feedbacks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedbacks-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}