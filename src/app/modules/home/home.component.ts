import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequests';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

    loginCard = true;

    // Antes de implementar o FormBuilder --- certificar de ter importado o ReactiveFormsModule mo app.module.ts

    loginForm = this.formBuilder.group({
      // initial state = ''
      email: ['', Validators.required],
      password: ['', Validators.required]
    })

    signupForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
    })

    constructor(
      private formBuilder: FormBuilder,
      private userService: UserService,
      private cookieService: CookieService,
      private messageServive: MessageService,
      private router: Router
    ) {}

    handleSignin():void {
      if (this.loginForm.value && this.loginForm.valid) {
        this.userService.authUser(
          this.loginForm.value as AuthRequest
        )
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({
          next:(res) => {
            if (res) {
              // Cookie
              this.cookieService.set('USER_INFO', res?.token)
              this.cookieService.set('USER_DATA', JSON.stringify(res))
              this.loginForm.reset();

              this.router.navigate(['/dashboard'])

              this.messageServive.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta, ${res.name}`,
                life: 2000 // tempo de exibição em 2000MS
              })
            }
          },
          error: (err) => {
            this.messageServive.add({
              severity: 'error',
              summary: 'Erro',
              detail: `${err.error.error}`,
              life: 2000 // tempo de exibição em 2000MS
            })
          }
        })
      }
    }


    handleSignUp():void {
        if (this.signupForm.value && this.signupForm.valid) {
          this.userService.signUpUser(
            this.signupForm.value as SignupUserRequest
          )
          .pipe(
            takeUntil(this.destroy$) // Conclui o fluxo -> emitindo um valor e completando no onDestroy
          )
          .subscribe({
            // dados de retorno do calback
            next: (response) => {
              if (response) {
                this.signupForm.reset(); // resetar o formulário...
                this.loginCard = true; // direciona para o formulário de login
                this.messageServive.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: `Usuário criado com sucesso`,
                  life: 2000 // tempo de exibição em 2000MS
                })
              }
            },
            error: (err) => {
              this.messageServive.add({
                severity: 'error',
                summary: 'Erro',
                detail: `${err.error.error}`,
                life: 2000 // tempo de exibição em 2000MS
              })
            }
          }
          )
        }
    }

    // Encerra a inscrição no observable

    // Evita o vazamento de memória...
    // Boa prática..

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

}
