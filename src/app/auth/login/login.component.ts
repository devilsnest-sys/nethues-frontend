import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from "@angular/material/card";
import { MaterialModule } from "../../../material.module";
import Swal from 'sweetalert2';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
  // imports: [MatCard, MaterialModule]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async submit() {
  if (this.form.invalid) return;
  this.loading = true;
  try {
    const { username } = await this.auth.login(
      this.form.value.username,
      this.form.value.password
    );
    this.snack.open(`Welcome ${username}`, 'Close', { duration: 2000 });
    this.router.navigate(['/']);
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid username or password!',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Try Again'
    });
  } finally {
    this.loading = false;
  }
}

}
