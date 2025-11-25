import { Component, inject } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { TokenService } from '../../../../services/auth/token/token.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FlashyService } from '../../../../services/flashy/flashy.service';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  userService = inject(UserService)
  tokenService = inject(TokenService)
  flashyService = inject(FlashyService);

  formUser!: FormGroup
  formPassword!: FormGroup

  constructor(private fb: FormBuilder) {
    this.formUser = fb.group({
      name: [''],
      lastName: [''],
      email: ['']
    })

    this.formPassword = this.fb.group({
      passwordActual: [''],
      passwordNueva: [''],
      passwordConfirmar: ['']
    })
  }

  idUser!: any
  user!: any



  ngOnInit() {
    this.idUser = this.tokenService.getFromToken('id')
    console.log(this.idUser);
    this.getUser(this.idUser)

  }

  getUser(idUser: any) {
    this.userService.getUser(idUser).subscribe({
      next: (res: any) => {
        this.user = res
        console.log(this.user);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  infoForm() {
    this.userService.getUserOne(this.idUser).subscribe({
      next: (res: any) => {
        this.formUser.patchValue({
          name: res.name,
          lastName: res.lastName,
          email: res.email
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  actualizarUser() {
    this.flashyService.confirm('¿Estas seguro de modificar tu perfil?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.userService.updateUser(this.idUser, this.formUser.value).subscribe({
          next: (res: any) => {
            this.getUser(this.idUser)
            this.flashyService.success('Perfil modificado con exito',
              {
                duration: 5000
            })

          },
          error: (error: any) => {
            console.log(error);
          }
        })
      },
      onCancel: () => {
        this.flashyService.info('Modificación cancelada.', {
          duration: 5000
        });
      }
    })
  }

  updatePassword() {
    if (this.formPassword.value.passwordNueva !== this.formPassword.value.passwordConfirmar) {
      this.flashyService.error('La nueva contraseña y la confirmación no coinciden.', {
        duration: 5000
      });
      return;
    }

    const body = {
      password: this.formPassword.value.passwordNueva,
      oldPassword: this.formPassword.value.passwordActual
    }

    this.userService.updateUser(this.idUser, body).subscribe({
      next: (dataApi: any) => {
        this.flashyService.success('Contraseña actualizada con exito',
          {
            duration: 5000
        });
        this.formPassword.reset();
      },
      error: (error: any) => {
        console.log('Error al actualizar contraseña', error)
        this.flashyService.error('Error al actualizar la contraseña. Por favor, verifique su contraseña actual e intente nuevamente.', {
          duration: 5000
        });
      }
    })
  }
}
