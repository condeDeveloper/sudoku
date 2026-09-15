# 🔢 Sudoku

Sudoku com gerador de puzzles de solução única, em HTML, CSS e JavaScript puro. Sem dependências, sem build.

**Jogar online:** https://condedeveloper.github.io/sudoku/

## Rodar local

```bash
npx serve -l 5193 .
```

## Níveis

| Nível   | Pistas aproximadas |
|---------|--------------------|
| Fácil   | 40                 |
| Médio   | 32                 |
| Difícil | 27                 |
| Expert  | 23                 |

## Controles

| Ação            | Tecla / gesto              |
|-----------------|----------------------------|
| Selecionar      | Clique ou setas            |
| Preencher       | 1 a 9 ou teclado na tela   |
| Apagar          | Backspace, Delete ou 0     |
| Anotações       | N                          |
| Dica            | H (3 por partida)          |
| Desfazer        | Ctrl+Z                     |
| Pausar          | P ou Espaço                |

## Funcionalidades

- Gerador: preenche uma grade completa com backtracking aleatório e remove células enquanto a solução continuar única
- Resolvedor com heurística de menor número de candidatos
- Destaque de linha, coluna, bloco e números iguais ao selecionado
- Anotações (candidatos) que somem automaticamente quando o número é colocado na região
- Limite de 3 erros, 3 dicas, desfazer com histórico
- Contador de quantos faltam de cada número
- Partida salva automaticamente (fecha e continua depois), pausa automática ao trocar de aba
- Melhor tempo por nível no `localStorage`

## Estrutura

```
js/config.js     # níveis e constantes
js/solver.js     # backtracking, contagem de soluções, pares
js/generator.js  # geração de puzzle único
js/board.js      # estado, anotações, histórico
js/timer.js      # cronômetro
js/storage.js    # partida salva e recordes
js/render.js     # DOM
js/input.js      # teclado e botões
js/game.js       # orquestração
```

## Licença

MIT
