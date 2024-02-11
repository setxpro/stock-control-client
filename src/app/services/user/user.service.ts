import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequests';
import { SignUpUserResponse } from 'src/app/models/interfaces/user/SignUpUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = enviroment.API_URL;

  constructor(
    private http: HttpClient,
     private cookieService: CookieService
    ) {}

  // Sign UP
  // O que é retornado na requisição... ? Observable -> <Interface>
  signUpUser(requestData: SignupUserRequest): Observable<SignUpUserResponse> {
    return this.http.post<SignUpUserResponse>(`${this.API_URL}/user`, requestData)
  }

  // Authentication
  authUser(requestData: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestData)
  }

  isLoggedIn(): boolean {
    // Validation if token exists
    const JWT_TOKEN = this.cookieService.get("USER_INFO");
    return JWT_TOKEN ? true : false;
  }
}
