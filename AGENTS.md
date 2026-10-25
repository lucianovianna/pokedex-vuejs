# Princípios

- Seguir YAGNI e KISS no código e na comunicação.
- Preservar a essência do desafio de júnior: mudanças pequenas, sem migrações ou abstrações fora do escopo.
- Manter baixo acoplamento e alta coesão na estrutura existente.
- Escrever novos identificadores e comentários em inglês; comunicar e documentar em português.
- Responder de forma curta e direta.
- Usar Node 16 e npm; preservar o lockfile em tarefas sem mudança de dependências.
- Aplicar TDD para regras ou bugs testáveis e executar `npm test`.
- Validar os fluxos afetados e, para mudanças de código, executar build e lint sem correções automáticas (`npm run lint -- --no-fix`). Informar o que foi verificado.
- Manter o README atualizado; colocar documentação adicional em `docs/` apenas quando necessário.
