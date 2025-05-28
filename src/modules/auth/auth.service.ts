import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { User } from "../users/entities/user.entity"
import { UsersService } from "../users/users.service"

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Identifiants invalides')
    }
    return user
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}