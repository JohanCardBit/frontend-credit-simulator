import { Component, inject } from '@angular/core';
import { PerfilesService } from '../../../../services/perfilesRiesgo/perfiles.service';
import { FlashyService } from '../../../../services/flashy/flashy.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfiles-de-riesgo',
  imports: [ReactiveFormsModule],
  templateUrl: './perfiles-de-riesgo.html',
  styleUrl: './perfiles-de-riesgo.css',
})
export class PerfilesDeRiesgo {
  perfilRiesgoService = inject(PerfilesService)
  flashyService = inject(FlashyService);

  perfilForm!: FormGroup

  constructor(private fb: FormBuilder) {
    this.perfilForm = fb.group({
      category: ['', [Validators.required]],
      minScore: [0, [Validators.required, Validators.min(0)]],
      maxScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      interestRate: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]]
    })
  }

  perfiles: any[] = []

  ngOnInit() {
    this.getPerfilesRiesgo()
  }

  getPerfilesRiesgo() {
    this.perfilRiesgoService.getRiskProfiles().subscribe({
      next: (res: any) => {
        this.perfiles = res
        console.log(res);

      },
      error: (error: any) => {
        console.log(error);
      }
    })

  }

  crearPerfilDeRiesgo() {
    this.flashyService.confirm('¿Estas seguro de crear un nuevo perfil de riesgo?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.perfilRiesgoService.createRiskProfile(this.perfilForm.value).subscribe({
          next: (res: any) => {
            this.getPerfilesRiesgo()
            this.flashyService.success('Perfil de riesgo creado con exito',
              {
                duration: 5000
              })
            console.log(res);
            document.getElementById('modalCerrar')?.click()
          },
          error: (error: any) => {
            this.flashyService.error(`${error.error.msj}`, {
              duration: 5000
            })
            console.log(error);
          }
        })
      }
    })
  }

  limpiarModal() {
    this.perfilForm.reset()
  }

  idperfil!: any
  verCategoria(id: any) {
    this.perfilRiesgoService.getRiskProfile(id).subscribe({
      next: (res: any) => {
        this.idperfil = id

        this.perfilForm.patchValue({
          category: res.category,
          minScore: res.minScore,
          maxScore: res.maxScore,
          interestRate: res.interestRate,
          description: res.description
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  actualizarPerfil() {
    this.flashyService.confirm('¿Estas seguro de modificar este perfil de riesgo?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.perfilRiesgoService.updateRiskProfile(this.idperfil, this.perfilForm.value).subscribe({
          next: (res: any) => {
            this.getPerfilesRiesgo()
            this.flashyService.success('Perfil de riesgo actualizado con exito',
              {
                duration: 5000
              }
            )
            console.log(res);
            document.getElementById('modalEditarCerrar')?.click()
          },
          error: (error: any) => {
            this.flashyService.error(`${error.error.msj}`, {
              duration: 5000
            })
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

  eliminarPerfil(id: any) {
    this.flashyService.confirm('¿Estas seguro de eliminar este perfil de riesgo?', {
      position: 'top-center',
      animation: 'bounce',
      onConfirm: () => {
        this.perfilRiesgoService.deleteRiskProfile(id).subscribe({
          next: (res: any) => {
            this.getPerfilesRiesgo()
            this.flashyService.success('Perfil de riesgo eliminado con exito',
              {
                duration: 5000
              })
            console.log(res);
          },
          error: (error: any) => {
            console.log(error);
          }
        })
      }
    })
  }

}
