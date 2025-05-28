import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UserRole } from "../users/enums/role.enum";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Limiter les rôles disponibles lors de l'inscription
    if (createUserDto.role && createUserDto.role !== UserRole.ENTREPRENEUR && createUserDto.role !== UserRole.INVESTOR) {
      throw new UnauthorizedException('Rôle non autorisé lors de l\'inscription');
    }

    // Si aucun rôle n'est spécifié, mettre entrepreneur par défaut
    if (!createUserDto.role) {
      createUserDto.role = UserRole.ENTREPRENEUR;
    }

    const user = await this.authService.register(createUserDto);
    return this.authService.login(user);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return this.authService.login(user);
  }
}
