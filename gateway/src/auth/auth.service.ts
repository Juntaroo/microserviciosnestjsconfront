import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USERS_SERVICE } from 'src/configuration/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'validateUser' }, { email, password }),
    );
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
