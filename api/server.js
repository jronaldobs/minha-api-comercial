import Fastify from 'fastify';
import { z } from 'zod';

const fastify = Fastify({ logger: true });

// Dados e Filtros (Padrão Comercial)
const database = [
  { id: 1, nome: 'Produto A', CRPFornecedores: '123', status: 'Ativo' },
  { id: 2, nome: 'Produto B', tag: '^', info: '!Account', TCash: 500 },
];

fastify.get('/produtos', async (request, reply) => {
  const termosProibidos = ['CRPFornecedores', '^', '!Account', 'Ngeral', 'TCash'];
  return database.map(item => {
    const novoItem = { ...item };
    Object.keys(novoItem).forEach(key => {
      if (termosProibidos.includes(key) || termosProibidos.includes(novoItem[key])) {
        delete novoItem[key];
      }
    });
    return novoItem;
  });
});

// ESSENCIAL PARA VERCEL: Exportar como uma função
export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
};