import Fastify from 'fastify';
import { z } from 'zod';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const fastify = Fastify({ logger: true });

// 1. Configuração do Swagger (Padrão Comercial)
await fastify.register(swagger);
await fastify.register(swaggerUi, { routePrefix: '/docs' });

// 2. Mock de dados (Simulando um banco de dados)
const database = [
  { id: 1, nome: 'Produto A', CRPFornecedores: '123', status: 'Ativo' },
  { id: 2, nome: 'Produto B', tag: '^', info: '!Account', TCash: 500 },
];

// 3. Rota de Listagem com Filtro de Termos Restritos
fastify.get('/produtos', async (request, reply) => {
  // Lista de termos a serem excluídos conforme sua instrução
  const termosProibidos = ['CRPFornecedores', '^', '!Account', 'Ngeral', 'TCash'];

  const dadosLimpos = database.map(item => {
    const novoItem = { ...item };
    // Remove chaves proibidas ou valores que contenham os termos
    Object.keys(novoItem).forEach(key => {
      if (termosProibidos.includes(key) || termosProibidos.includes(novoItem[key])) {
        delete novoItem[key];
      }
    });
    return novoItem;
  });

  return dadosLimpos;
});

// 4. Rota de Criação com Validação (Zod)
fastify.post('/produtos', async (request, reply) => {
  const produtoSchema = z.object({
    nome: z.string(),
    status: z.string().default('Pendente')
  });

  const body = produtoSchema.parse(request.body);
  return reply.status(201).send({ message: 'Criado com sucesso', data: body });
});

// Inicialização
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server rodando em http://localhost:3000');
    console.log('📖 Documentação em http://localhost:3000/docs');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();