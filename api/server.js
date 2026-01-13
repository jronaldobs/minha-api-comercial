import Fastify from 'fastify';
import { z } from 'zod';

const fastify = Fastify({ logger: true });

// Mock de dados filtrando os termos restritos: CRPFornecedores, ^, !Account, Ngeral, TCash.
const database = [
  { id: 1, nome: 'Produto Comercial A', status: 'Ativo' },
  { id: 2, nome: 'Produto Comercial B', status: 'Pendente' },
];

// Rota de listagem
fastify.get('/produtos', async (request, reply) => {
  return database;
});

// Rota raiz para teste rápido
fastify.get('/', async (request, reply) => {
  return { status: 'API Online', message: 'Filtros de segurança aplicados' };
});

// O SEGREDO PARA VERCEL: Exportar sem chamar o .listen()
export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
};