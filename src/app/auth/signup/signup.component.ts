import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_service/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapEyeFill, bootstrapEyeSlashFill } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  providers: [provideIcons({ bootstrapEyeFill, bootstrapEyeSlashFill })],
  imports: [CommonModule, ReactiveFormsModule, NgIcon]
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
    this.titleService.setTitle('Inscription - Portfolio de Jester CESAR');
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  getNameError(): string {
    const control = this.signupForm.get('name');
    if (control?.hasError('required')) return 'Nom requis';
    if (control?.hasError('minlength')) return 'Minimum 2 caractères';
    return '';
  }

  getEmailError(): string {
    const control = this.signupForm.get('email');
    if (control?.hasError('required')) return 'Email requis';
    if (control?.hasError('email')) return 'Email invalide';
    return '';
  }

  getPasswordError(): string {
    const control = this.signupForm.get('password');
    if (control?.hasError('required')) return 'Mot de passe requis';
    if (control?.hasError('minlength')) return 'Minimum 8 caractères';
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.signupForm.get('confirmPassword');
    if (control?.hasError('required')) return 'Confirmation requise';
    if (this.signupForm.hasError('passwordMismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password } = this.signupForm.value;

    this.authService.signup({ name, email, password })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = typeof error === 'string' ? error : 'Erreur lors de l\'inscription';
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}