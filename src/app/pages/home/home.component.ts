import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'senso-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  private readonly router = inject(Router);

  @ViewChild('heroVideo') heroVideoRef?: ElementRef<HTMLVideoElement>;

  howItWorksOpen = false;

  ngAfterViewInit(): void {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;
    this.prepareVideo(video);
    video.play().catch(() => this.playOnFirstInteraction(video));
  }

  playHeroVideo(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.prepareVideo(video);
    video.play().catch(() => {
      this.playOnFirstInteraction(video);
      video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
    });
  }

  startWardrobe(): void {
    void this.router.navigate(['/entrar'], { queryParams: { returnUrl: '/guarda-roupa' } });
  }

  toggleHowItWorks(): void {
    this.howItWorksOpen = !this.howItWorksOpen;
  }

  @HostListener('document:click')
  closeHowItWorks(): void {
    this.howItWorksOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeHowItWorksOnEscape(): void {
    this.howItWorksOpen = false;
  }

  private prepareVideo(video: HTMLVideoElement): void {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  }

  private playOnFirstInteraction(video: HTMLVideoElement): void {
    const play = () => video.play().catch(() => {});
    document.addEventListener('click', play, { once: true });
    document.addEventListener('touchstart', play, { once: true });
  }
}
