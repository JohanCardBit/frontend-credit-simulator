import { Component, inject } from '@angular/core';
import { LoginService } from '../../../services/auth/login/login.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from '../../../services/auth/token/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  seviceLogin = inject(LoginService)
  serviceToken = inject(TokenService)

  formLogin!: FormGroup;
  role!: any
  userId!: any

  constructor(private fb: FormBuilder, private cookie: CookieService, private router: Router) {
     this.formLogin = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }


  iniciarSesion() {
  if (this.formLogin.valid) {
    this.seviceLogin.postLogin(this.formLogin.value).subscribe({
      next: (res: any) => {

        // Guardar token en cookie
        this.cookie.set('token', res.token, {
          expires: 1,             // 1 día
          path: '/',              // disponible en toda la app
          sameSite: 'Lax',        // esto es para proteger la cookie de CSRF (cross-site request forgery)
          secure: false           // true si usas HTTPS
        });

        console.log('Token guardado en cookie:', res.token);

        this.role =this.serviceToken.getFromToken('role')
        if (this.role == 'owner') {
          this.router.navigate(['/dashboard/admin/perfil'])
        }else{
          this.router.navigate(['/dashboard/panel-user/simularYsolicitar'])
        }

        this.userId = this.serviceToken.getFromToken('id')
        this.cookie.set('userId', this.userId, {
          expires: 1,             // 1 dia
          path: '/',              // disponible en toda la app
          sameSite: 'Lax',        // esto es para proteger la cookie de CSRF (cross-site request forgery)
          secure: false           // true si usas HTTPS
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}

}
