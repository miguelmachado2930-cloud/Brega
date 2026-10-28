# Bond Established

Uma pequena página interativa feita como presente. HTML, CSS e JavaScript puros, sem dependências; abre direto no navegador (`index.html`) e está pronta para o GitHub Pages (veja `PUBLICAR.md`).

## Estrutura
```
index.html          páginas e textos (todas as cenas estão aqui)
css/style.css       estilos
js/main.js          interação
assets/images/      fundo, mãos, tinta, Vesalius, pranchas das mãos
assets/audio/       The Glow, Pt. 2 (128 kbps)
assets/fonts/       Bodoni Moda e Jost (locais, com licenças)
assets/papel-de-parede-*.jpg   recompensa no fim da ficha
definir-url.js      preenche a URL da prévia do link
PUBLICAR.md         passo a passo para publicar
```

## O caminho de quem visita
1. **Cena principal.** As mãos quase se tocam; a rosa é um easter egg; clicar perto do anel aproxima as mãos (nunca se tocam; "calma."). No celular em pé a ilustração gira -90° (versão B).
2. **Cartão** ("Tem uma coisa aqui"): a mensagem, que cumprimenta pela hora. Dali: "Virar a página".
3. **Tabula II** (Vesalius) e **Tabula III** (as mãos do projeto): pranchas com pinos numerados, legenda, linha curva, carimbo e notas à margem. Setas do teclado escolhem o item (↑↓) e viram a página (←→).
4. **Ficha do autor** (Rank Up de brincadeira) e, no fim, os papéis de parede.
- **Som:** botão no canto e a inscrição "The Glow / The Microphones" ligam/pausam a música. Nunca toca sozinha. Entra em `SEGUNDO_INICIAL_DA_MUSICA` (3:23), e o fim da faixa se funde com o começo (`SEGUNDOS_DE_FUSAO_DO_LOOP`, 8 s). Com o som ligado, virar a página faz um barulho de papel (sintetizado).

## Onde editar
| O quê | Onde |
|---|---|
| Mensagem do cartão | `index.html`, `<section class="card">` |
| Legendas das pranchas | `index.html`, `.pr__legend` (`#prList` e `#prList3`) |
| Pinos | `index.html`, `.pr__pin` (`--pino-x/--pino-y`; `--pino-girado-x/--pino-girado-y` na versão girada da Tabula III) |
| Ficha do autor (atributos, piadas) | `index.html`, `<section id="ficha">` (`data-v` de 0 a 10) |
| Ponto de entrada e volume da música | `js/main.js`: `SEGUNDO_INICIAL_DA_MUSICA`, `VOLUME_MAXIMO`, `SEGUNDOS_DE_FUSAO_DO_LOOP` |
| Quanto as mãos se aproximam | `js/main.js`, `calcularReacaoDasMaos()` e `MAXIMO_DE_DEGRAUS_DO_QUASE` |
| Cores e fontes | `css/style.css`, variáveis em `:root` |

## Detalhes técnicos
- **Desempenho:** a abertura baixa ~1,4 MB no celular; as imagens das pranchas (~0,5 MB) só carregam em segundo plano depois que a cena principal aparece (ou na hora, se alguém abrir a prancha antes). O desgaste de tinta do título é uma máscara pré-renderizada embutida no CSS (`--mascara-granulado`, uma só vez); máscaras de arquivo são bloqueadas ao abrir o `index.html` direto do disco. A música só é baixada quando alguém aperta play.
- **Acessibilidade:** navegação por teclado, foco visível, `prefers-reduced-motion` respeitado, rótulos nos botões, textos alternativos nas gravuras.
- **Telas:** testado de 320×568 a 1920×1080, inclusive celular deitado. Não testado em iPhone/Android reais: no iPhone o volume do navegador é fixo (a fusão do loop vira loop normal) e `navigator.vibrate` não existe.
- **Se faltar um arquivo:** sem `vesalius.webp` ou sem as pranchas, os pinos somem; sem o áudio, o botão de som some.

## Direitos
A gravura do Vesalius é de domínio público. A música é comercial (veja `PUBLICAR.md`). As ilustrações das mãos e a rosa são do projeto.

## Convenções de código
- Sem comentários nos arquivos de código; os nomes carregam o significado.
- Em `js/main.js` todo identificador tem nome único e descritivo em português (nenhum se repete em escopos diferentes).
- As variáveis do CSS (`--cor-vermelho`, `--largura-palco`, `--pino-x` ...) também são únicas e descritivas, e são os mesmos nomes usados pelo HTML (estilos inline) e pelo JavaScript.
- Classes, ids e atributos `data-*` do HTML não foram renomeados (são o contrato entre HTML, CSS e JS).

## Nomenclatura anatômica
Os nomes das legendas são da Terminologia Anatomica, postos sobre a gravura de Vesalius (1543), que usava letras e não nomes; a Tabula II avisa isso em uma nota. O item 3 é *Musculus zygomaticus major* (principal músculo do sorriso; o *risorius* é de Santorini, posterior ao Vesalius, e frequentemente ausente). Rótulos do easter egg: "M. extensor digitorum" no dorso da mão esquerda e "ossa metacarpalia" no dorso da mão direita.
