import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  showHow = false;
  activeSlide = 0;
  private readonly slideCount = 2;
  private autoplayHandle?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.autoplayHandle = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.slideCount;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.autoplayHandle) {
      clearInterval(this.autoplayHandle);
    }
  }

  openHow(): void {
    this.showHow = true;
  }

  closeHow(): void {
    this.showHow = false;
  }
}
