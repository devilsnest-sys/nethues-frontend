import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
 form: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder, private auth: AuthService, private snack: MatSnackBar, private router: Router) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    try {
      await this.auth.changePassword(this.form.value.oldPassword, this.form.value.newPassword);
      this.snack.open('Password changed', 'Close', { duration: 2000 });
      this.router.navigate(['/']);
    } catch (err:any) {
      this.snack.open(err.message || 'Failed', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }
}
