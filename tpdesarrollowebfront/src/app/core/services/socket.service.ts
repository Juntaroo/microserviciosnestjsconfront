import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  connect(token?: string) {
    this.socket = io('http://localhost:3000', {
      auth: { token }
    });
  }

  onStockUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('stock:update', (data) => observer.next(data));
      return () => this.socket.off('stock:update');
    });
  }

  disconnect() {
    this.socket?.disconnect();
  }
}
