import { type User, type InsertUser, type Challenge } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private currentUserId: number;
  private currentChallengeId: number;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.currentUserId = 1;
    this.currentChallengeId = 1;
    
    // Adicionar usuários de demonstração
    this.initializeMockData();
  }

  private initializeMockData() {
    // Usuário de demonstração
    const demoUser: User = {
      id: this.currentUserId++,
      username: "demo",
      email: "demo@exemplo.com"
    };
    this.users.set(demoUser.id, demoUser);

    // Desafios de demonstração
    const mockChallenges: Omit<Challenge, 'id'>[] = [
      {
        titulo: "Reduzir Consumo de Água",
        descricao: "Reduza o consumo de água em casa por uma semana usando técnicas simples como banhos mais curtos e fechamento de torneiras.",
        nivelDificuldade: "Fácil",
        categoria: "Água",
        pontuacaoMaxima: 100,
        tempoEstimado: 7,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Energia Solar Caseira",
        descricao: "Instale um pequeno sistema de energia solar para carregamento de dispositivos móveis.",
        nivelDificuldade: "Médio",
        categoria: "Energia",
        pontuacaoMaxima: 250,
        tempoEstimado: 30,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Transporte Sustentável",
        descricao: "Use apenas transporte público, bicicleta ou caminhada por uma semana inteira.",
        nivelDificuldade: "Médio",
        categoria: "Transporte",
        pontuacaoMaxima: 200,
        tempoEstimado: 7,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Compostagem Doméstica",
        descricao: "Crie um sistema de compostagem caseira para resíduos orgânicos da cozinha.",
        nivelDificuldade: "Difícil",
        categoria: "Resíduos",
        pontuacaoMaxima: 300,
        tempoEstimado: 14,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        titulo: "Zero Plástico",
        descricao: "Elimine completamente o uso de plástico descartável por um mês.",
        nivelDificuldade: "Difícil",
        categoria: "Resíduos",
        pontuacaoMaxima: 400,
        tempoEstimado: 30,
        statusAtivo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    mockChallenges.forEach(challenge => {
      const challengeWithId: Challenge = {
        ...challenge,
        id: this.currentChallengeId++
      };
      this.challenges.set(challengeWithId.id, challengeWithId);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge> {
    const now = new Date().toISOString();
    const newChallenge: Challenge = {
      ...challenge,
      id: this.currentChallengeId++,
      createdAt: now,
      updatedAt: now
    };
    this.challenges.set(newChallenge.id, newChallenge);
    return newChallenge;
  }

  async updateChallenge(id: number, challenge: Partial<Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Challenge | undefined> {
    const existing = this.challenges.get(id);
    if (!existing) return undefined;
    
    const updated: Challenge = {
      ...existing,
      ...challenge,
      updatedAt: new Date().toISOString()
    };
    this.challenges.set(id, updated);
    return updated;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    return this.challenges.delete(id);
  }
}

export const storage = new MemStorage();
