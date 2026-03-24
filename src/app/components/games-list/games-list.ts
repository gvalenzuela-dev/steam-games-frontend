import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamesService, Game } from '../../services/games.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './games-list.html',
  styleUrls: ['./games-list.css'],
})
export class GamesList implements OnInit {
  
  games = signal<Game[]>([]);
  filteredGames = signal<Game[]>([]);

  searchTerm = '';

  currentPage = 1;
  pageSize = 10;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  lastKeys: string[] = [];
  hasNextPage = true;
  loading = false;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    this.loadPage(1);
  }

  
loadPage(page: number) {
  if (this.loading) return;

  this.loading = true;

  const lastKey =
    page > 1 ? this.lastKeys[page - 2] : undefined;

  this.gamesService.getGames(this.pageSize, lastKey).subscribe(res => {
    const data = res.data ?? res;
    
  this.games.set(data);
  this.filteredGames.set([...data]);

  
  if (res.lastKey) {
      this.lastKeys[page - 1] = res.lastKey;
  }


  this.currentPage = page;
  this.hasNextPage = !!res.lastKey;
  this.loading = false;

  });
}
  
nextPage() {
  if (!this.hasNextPage || this.loading) return;
  this.loadPage(this.currentPage + 1);
}


prevPage() {
  if (this.currentPage > 1 && !this.loading) {
    this.loadPage(this.currentPage - 1);
  }
}



search() {
  const term = this.searchTerm.trim();

  // 🔁 Vacío → volver a la página actual
  if (!term) {
    this.filteredGames.set([...this.games()]);
    this.hasNextPage = true;
    return;
  }

  this.loading = true;

  // 🔍 MISMO endpoint /games/:value
  this.gamesService.getGameById(term).subscribe(res => {
    const data = res.data ?? res;

    // Unificamos la estructura para la tabla
    this.filteredGames.set(Array.isArray(data) ? data : [data]);
    this.hasNextPage = false;
    this.loading = false;
  });
}

}