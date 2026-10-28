# Como publicar (GitHub Pages)

1. **Crie um repositório** no GitHub (ex.: `bond`) e envie todo o conteúdo desta pasta (`index.html`, `css/`, `js/`, `assets/`). O `index.html` precisa ficar na raiz do repositório.
2. No repositório: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.** Em um ou dois minutos o endereço aparece: `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.
3. **Preencha a URL da prévia do link.** Com Node instalado, na pasta do projeto:
   `node definir-url.js https://SEU-USUARIO.github.io/NOME-DO-REPO/`
   Ou, à mão, troque `SEU-USUARIO` e `NOME-DO-REPO` na linha `og:image` do `index.html`. Envie a alteração ao GitHub.
4. **Teste a prévia mandando o link para você mesmo** no WhatsApp/Instagram. Esses apps guardam a prévia em cache: se mudar a imagem depois, acrescente `?v=2` ao final do link.
5. **Teste em um celular de verdade** (iPhone e Android, se der): giro da ilustração, botão de som (a música só toca se apertar), a prancha e a ficha.

## Antes de mandar: confira
- Os textos da **ficha do autor** (`index.html`, `<section id="ficha">`): são piadas de exemplo; deixe só o que for verdade e engraçado para você.
- O latim das legendas (Tabula II e III) e dos rótulos do easter egg.
- Se quiser acrescentar **um detalhe que só você sabe** (algo que ela contou), é a melhor coisa que dá para pôr na mensagem do cartão ou na legenda.

## Direitos da música
A faixa é comercial. Num repositório público ela fica disponível a qualquer pessoa com o link e pode receber pedido de remoção. Opções: repositório privado (GitHub Pages em plano pago), um trecho curto no lugar da faixa inteira, ou remover `assets/audio/` e os blocos `<audio>`/`.som` (e o botão some sozinho se o arquivo faltar).

## Privacidade
A página tem `noindex` (não aparece em buscas) e não guarda nem coleta dados. O link ainda é público para quem o tiver. Não coloque seu número de telefone nem outros dados pessoais no código.
