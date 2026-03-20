import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamesList } from "./components/games-list/games-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GamesList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('steam-games-frontend');
}
