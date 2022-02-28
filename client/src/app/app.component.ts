import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hospital-management';

  constructor(public authService: AuthService) {
    /*this.authService
      .register({
        firstName: 'Vamsee Kalyan',
        lastName: 'Sunkara',
        email: 'vamsi.flex@gmail.com',
        password: '12345',
      })
      .subscribe(
        (value: IRegisterResponse) => {
          debugger;
        },
        (error: HttpErrorResponse) => {
          alert(error.error.error);
        }
      );*/
    /*this.authService.login('vamsi.flex@gmail.com', '12345').subscribe(
      (res: IRegisterResponse) => {
        // debugger;
        localStorage.setItem('token', res.token);
        this.authService.user().subscribe((value1: any) => {
          debugger;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.error.error);
      }
    );*/

    this.authService.user().subscribe((value1: any) => {
      debugger;
    });
  }
}
