import { Command, CommandRunner } from 'nest-commander';
import { FixturesService } from './fixtures.service';

console.log('Début du fichier fixtures.command.ts');

@Command({ name: 'load-fixtures', description: 'Charge les fixtures dans la base de données' })
export class LoadFixturesCommand extends CommandRunner {
  constructor(private readonly fixturesService: FixturesService) {
    super();
    console.log('Constructeur LoadFixturesCommand appelé');
  }

  async run(): Promise<void> {
    console.log('Méthode run de LoadFixturesCommand appelée');
    try {
      const result = await this.fixturesService.loadFixtures();
      console.log('Fixtures chargées avec succès :');
      console.log(`- ${result.users} utilisateurs`);
      console.log(`- ${result.interests} centres d'intérêt`);
      console.log(`- ${result.projects} projets`);
      console.log(`- ${result.investments} investissements`);
    } catch (error) {
      console.error('Erreur lors du chargement des fixtures :', error);
    }
  }
} 