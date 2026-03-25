import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { IAuthService, AuthResponse } from './interfaces/auth.service.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) throw new ConflictException('El email ya está en uso');

    const user = await this.userRepository.create(dto.name, dto.email, dto.password);
    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    return this.buildResponse(user);
  }

  private buildResponse(user: any): AuthResponse {
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}