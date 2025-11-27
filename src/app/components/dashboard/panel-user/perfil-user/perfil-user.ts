import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user/user.service';
import { TokenService } from '../../../../services/auth/token/token.service';
import { FlashyService } from '../../../../services/flashy/flashy.service';

@Component({
  selector: 'app-perfil-user',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil-user.html',
  styleUrl: './perfil-user.css',
})
export class PerfilUser {
 userService = inject(UserService)
  tokenService = inject(TokenService)
  flashyService = inject(FlashyService);

  formRegistro!: FormGroup
  formPersonal!: FormGroup
  formFinanciera!: FormGroup
  formPassword!: FormGroup

  constructor(private fb: FormBuilder) {
    //  FORM 1 — INFORMACIÓN DE REGISTRO
    this.formRegistro = this.fb.group({
      name: [''],
      lastName: [''],
      documentType: [''],
      documentNumber: [''],
      email: [''],
    });

    // FORM 2 — INFORMACIÓN PERSONAL
    this.formPersonal = this.fb.group({
      gender: [''],
      age: [''],
      maritalStatus: [''],
      academicLevel: [''],
      employmentType: [''],
      ocupacion: [''],
      contractType: [''],
      employmentYears: [''],
      profession: [''],
      nit: [''],
      hasRUT: ['']
    });

    //  FORM 3 — INFORMACIÓN FINANCIERA
    this.formFinanciera = this.fb.group({
      housingType: [''],
      ownerProperty: [''],
      incomeMonthly: [''],
      otherIncomeMonthly: [''],
      expensesMonthly: [''],
      valueOfAssets: [''],
      creditScore: [''],
      profile: [''],
      totalDebt: [''],
      activeLoans: ['']
    });

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

      // ===== INFORMACIÓN DE REGISTRO =====
      this.formRegistro.patchValue({
        name: res.name,
        lastName: res.lastName,
        documentType: res.documentType,
        documentNumber: res.documentNumber,
        email: res.email
      });

      // ===== INFORMACIÓN PERSONAL =====
      this.formPersonal.patchValue({
        gender: res.gender,
        age: res.age,
        maritalStatus: res.maritalStatus,
        academicLevel: res.academicLevel,
        employmentType: res.employmentType,
        ocupacion: res.ocupacion,
        contractType: res.contractType,
        employmentYears: res.employmentYears,
        profession: res.profession,
        nit: res.nit,
        hasRUT: res.hasRUT
      });

      // ===== INFORMACIÓN FINANCIERA =====
      this.formFinanciera.patchValue({
        housingType: res.housingType,
        ownerProperty: res.ownerProperty,
        incomeMonthly: res.incomeMonthly,
        otherIncomeMonthly: res.otherIncomeMonthly,
        expensesMonthly: res.expensesMonthly,
        valueOfAssets: res.valueOfAssets,
        creditScore: res.creditScore,
        profile: res.profile,
        totalDebt: res.totalDebt,
        activeLoans: res.activeLoans
      });

    },
    error: (error: any) => {
      console.log(error);
    }
  });
}


 actualizarUser(tipo: 'registro' | 'personal' | 'financiera') {

  const formData =
    tipo === 'registro'   ? this.formRegistro.value :
    tipo === 'personal'   ? this.formPersonal.value :
                             this.formFinanciera.value;

  const modalId =
    tipo === 'registro'   ? 'cerrarModalRegistro' :
    tipo === 'personal'   ? 'cerrarModalPersonal' :
                             'cerrarModalFinanciera';

  this.flashyService.confirm('¿Estás seguro de modificar tu perfil?', {
    position: 'top-center',
    animation: 'bounce',

    onConfirm: () => {
      this.userService.updateUser(this.idUser, formData).subscribe({
        next: (res: any) => {

          this.getUser(this.idUser);

          this.flashyService.success('Perfil modificado con éxito', {
            duration: 5000
          });

          // CERRAR MODAL AUTOMÁTICAMENTE
          document.getElementById(modalId)?.click();
        },

        error: (error: any) => {
          console.log(error);
        }
      });
    },

    onCancel: () => {
      this.flashyService.info('Modificación cancelada.', {
        duration: 5000
      });
    }
  });
}


  updatePassword() {
    if (this.formPassword.value.passwordNueva !== this.formPassword.value.passwordConfirmar) {
      this.flashyService.error('La nueva contraseña y la confirmación no coinciden.', {
        duration: 5000
      });
      return;
    }

    this.flashyService.confirm('¿Estas seguro de modificar tu contraseña?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
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
            document.getElementById('cerrarModalPassword')?.click();
          },
          error: (error: any) => {
            console.log('Error al actualizar contraseña', error)
            this.flashyService.error('Error al actualizar la contraseña. Por favor, verifique su contraseña actual e intente nuevamente.', {
              duration: 5000
            });
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

  limpiarFormPassword() {
    this.formPassword.reset();
  }
}
