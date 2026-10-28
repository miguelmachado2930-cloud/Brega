const moduloArquivos = require('fs');
const urlInformada = process.argv[2];

if (!urlInformada || !/^https:\/\/.+/.test(urlInformada)) {
  console.error('Uso: node definir-url.js https://usuario.github.io/nome-do-repo/');
  process.exit(1);
}

const urlBase = urlInformada.endsWith('/') ? urlInformada : urlInformada + '/';
const conteudoOriginal = moduloArquivos.readFileSync('index.html', 'utf8');
let conteudoHtml = conteudoOriginal.replace(/https:\/\/SEU-USUARIO\.github\.io\/NOME-DO-REPO\//g, urlBase);

if (!/property="og:url"/.test(conteudoHtml)) {
  conteudoHtml = conteudoHtml.replace(
    '<meta property="og:title"',
    `<meta property="og:url" content="${urlBase}">\n  <meta property="og:title"`
  );
}

if (conteudoHtml === conteudoOriginal) {
  console.log('Nada para trocar (a URL talvez já tenha sido definida).');
} else {
  moduloArquivos.writeFileSync('index.html', conteudoHtml);
  console.log('Pronto. Prévia do link aponta para ' + urlBase);
}
