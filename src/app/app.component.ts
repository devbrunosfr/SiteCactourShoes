import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { DialogComponent } from './shared/dialog.component';

@Component({
  selector: 'senso-root',
  standalone: true,
  imports: [RouterOutlet, DialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.restoreSession();
  }
}
