import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../profile/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string; name: string }) {
    const existing = await this.profileRepo.findOne({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const profile = this.profileRepo.create({
      email: data.email,
      password: passwordHash,
      name: data.name,
      preferences: {
        genres: [],
        location: { latitude: 0, longitude: 0 },
        preferredEventTypes: [],
      },
    });
    const saved = await this.profileRepo.save(profile);

    const token = this.jwtService.sign({ sub: saved.id, email: saved.email });
    return { token, user: { id: saved.id, name: saved.name, email: saved.email } };
  }

  async login(data: { email: string; password: string }) {
    const profile = await this.profileRepo.findOne({
      where: { email: data.email },
      select: { id: true, email: true, name: true, password: true },
    });
    if (!profile) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(data.password, profile.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: profile.id, email: profile.email });
    return { token, user: { id: profile.id, name: profile.name, email: profile.email } };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, userId: payload.sub, email: payload.email };
    } catch {
      return { valid: false };
    }
  }
}
