import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Dados simulados
const database = [
  { id: 1, nome: 'Produto A', status: 'Ativo' },
  { id: 2, nome: 'Produto B', status: 'Pendente' },
];

// Rota principal
fastify.get('/', async () => {
  return { api: 'Online', protecao: 'Ativa' };
});

// Rota de produtos (já com lógica comercial)
fastify.get('/produtos', async () => {
  return database;
});

// IMPORTANTE: Na Vercel, exportamos o servidor para a plataforma gerenciar.
// Remova qualquer linha que contenha "start()" ou "fastify.listen()".
export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
};