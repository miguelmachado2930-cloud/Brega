(() => {
  'use strict';

  const selecionarUm = (seletorUm, raizUm = document) => raizUm.querySelector(seletorUm);
  const selecionarTodos = (seletorTodos, raizTodos = document) =>
    Array.from(raizTodos.querySelectorAll(seletorTodos));
  const cenaPrincipal = selecionarUm('#scene');
  const botaoChamada = selecionarUm('#cta');
  const cartaoMensagem = selecionarUm('#mensagem');
  const botaoVoltarMensagem = selecionarUm('#voltar');
  const subtituloPrincipal = selecionarUm('#sub');
  const quadroArtePrincipal = selecionarUm('#plate');
  const rosaClicavel = selecionarUm('#roseHit');
  const regiaoAnuncios = selecionarUm('#live');
  const anelCentral = selecionarUm('#ring');
  const botaoAtalhoPrancha = selecionarUm('#eggGo');
  const botaoInscricaoSom = selecionarUm('#insSom');
  const linhaChamadaNota = selecionarUm('#kicker');
  const zonaQuase = selecionarUm('#quase');
  const textoCalma = selecionarUm('#calma');
  const secaoFicha = selecionarUm('#ficha');
  const paginaFicha = selecionarUm('#rkPage');
  const faixaVermelhaFicha = selecionarUm('#rkRed');
  const botaoVoltarFicha = selecionarUm('#rkVoltar');
  const botaoAbrirFicha = selecionarUm('#rkAbrir');
  const botaoVirarPagina = selecionarUm('#virar');
  const secaoPrancha = selecionarUm('#prancha');
  const paginaPrancha = selecionarUm('#prPage');
  const anelVoadorPrancha = selecionarUm('#prFly');
  const circuloPranchaCorpo = selecionarUm('#prRing');
  const figuraCorpo = selecionarUm('#prFig');
  const imagemCorpo = selecionarUm('#prImg');
  const figuraMaos = selecionarUm('#prFig3');
  const imagemMaos = selecionarUm('#prImg3');
  const circuloPranchaMaos = selecionarUm('#prRing3');
  const tituloPrancha = selecionarUm('.pr__title');
  const subtituloPrancha = selecionarUm('.pr__sub');
  const botaoVoltarPrancha = selecionarUm('#prVoltar');
  const painelLegenda = selecionarUm('#prLegend');
  const alcaPainelLegenda = selecionarUm('#prHandle');
  const tracoLigacao = selecionarUm('#prLead');
  const todosPinos = selecionarTodos('.pr__pin');
  const todasLinhasLegenda = selecionarTodos('.pr__row');
  const preferenciaMovimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const consultaTelaEmPe = window.matchMedia('(max-aspect-ratio: 1/1)');
  const TEXTO_SUBTITULO_REPOUSO = 'ESTABLISHED';
  const TEXTO_SUBTITULO_ABERTO = 'ESTABLISHING…';
  let mensagemAberta = false;
  let rotulosAnatomicosVisiveis = false;
  let temporizadorRotulos = 0;
  let rotulosJaMostrados = false;
  let pranchaAberta = false;
  cartaoMensagem.inert = true;
  secaoPrancha.inert = true;
  secaoFicha.inert = true;
  botaoAtalhoPrancha.inert = true;
  const decodificarImagem = (imagemParaDecodificar) =>
    imagemParaDecodificar.decode
      ? imagemParaDecodificar.decode().catch(() => {})
      : new Promise((concluirDecodificacao) => {
          if (imagemParaDecodificar.complete) return concluirDecodificacao();
          imagemParaDecodificar.addEventListener('load', concluirDecodificacao, {
            once: true
          });
          imagemParaDecodificar.addEventListener('error', concluirDecodificacao, {
            once: true
          });
        });
  const fundoPronto = new Promise((concluirFundo) => {
    const imagemDoFundo = new Image();
    imagemDoFundo.onload = imagemDoFundo.onerror = concluirFundo;
    imagemDoFundo.src = 'assets/images/fundo.webp';
  });
  const fontesProntas = document.fonts
    ? Promise.all([
        document.fonts.load('900 100px "Bodoni Moda"'),
        document.fonts.load('400 20px "Bodoni Moda"'),
        document.fonts.load('italic 400 20px "Bodoni Moda"'),
        document.fonts.load('500 12px "Jost"')
      ]).catch(() => {})
    : Promise.resolve();
  const limiteDeEspera = new Promise((concluirEspera) => setTimeout(concluirEspera, 6000));
  Promise.race([
    Promise.all([
      ...selecionarTodos('img', cenaPrincipal).map(decodificarImagem),
      fundoPronto,
      fontesProntas
    ]),
    limiteDeEspera
  ]).then(() => requestAnimationFrame(() => cenaPrincipal.classList.add('is-ready')));
  function apontarManchaDeTinta() {
    const retanguloAnelMancha = (anelCentral || botaoChamada).getBoundingClientRect();
    const manchaCentroX = retanguloAnelMancha.left + retanguloAnelMancha.width / 2;
    const manchaCentroY = retanguloAnelMancha.top + retanguloAnelMancha.height / 2;
    const raioCoberturaMancha = Math.hypot(
      Math.max(manchaCentroX, innerWidth - manchaCentroX),
      Math.max(manchaCentroY, innerHeight - manchaCentroY)
    );
    cenaPrincipal.style.setProperty('--mancha-origem-x', manchaCentroX + 'px');
    cenaPrincipal.style.setProperty('--mancha-origem-y', manchaCentroY + 'px');
    cenaPrincipal.style.setProperty('--mancha-escala-cobertura', (raioCoberturaMancha / 30).toFixed(1));
  }
  function abrirMensagem() {
    if (mensagemAberta) return;
    mensagemAberta = true;
    esconderRotulosAnatomicos();
    apontarManchaDeTinta();
    cenaPrincipal.dataset.open = 'true';
    botaoChamada.setAttribute('aria-expanded', 'true');
    subtituloPrincipal.textContent = TEXTO_SUBTITULO_ABERTO;
    cartaoMensagem.inert = false;
    window.setTimeout(
      () =>
        cartaoMensagem.focus({
          preventScroll: true
        }),
      preferenciaMovimentoReduzido.matches ? 0 : 750
    );
  }
  function fecharMensagem() {
    if (!mensagemAberta) return;
    mensagemAberta = false;
    cenaPrincipal.dataset.open = 'false';
    botaoChamada.setAttribute('aria-expanded', 'false');
    subtituloPrincipal.textContent = TEXTO_SUBTITULO_REPOUSO;
    cartaoMensagem.inert = true;
    botaoChamada.focus({
      preventScroll: true
    });
  }
  botaoChamada.addEventListener('click', abrirMensagem);
  anelCentral.addEventListener('click', abrirMensagem);
  const marcarDestaqueChamada = (destaqueLigado) => {
    anelCentral.classList.toggle('is-hot', destaqueLigado);
    botaoChamada.classList.toggle('is-hot', destaqueLigado);
  };
  botaoChamada.addEventListener('pointerenter', () => marcarDestaqueChamada(true));
  botaoChamada.addEventListener('pointerleave', () => marcarDestaqueChamada(false));
  botaoChamada.addEventListener('focus', () => marcarDestaqueChamada(true));
  botaoChamada.addEventListener('blur', () => marcarDestaqueChamada(false));
  anelCentral.addEventListener('pointerenter', () => botaoChamada.classList.add('is-hot'));
  anelCentral.addEventListener('pointerleave', () => botaoChamada.classList.remove('is-hot'));
  botaoVoltarMensagem.addEventListener('click', fecharMensagem);
  function pontoDoPalcoNaTela(fracaoX, fracaoY) {
    const retanguloQuadroArte = quadroArtePrincipal.getBoundingClientRect();
    return consultaTelaEmPe.matches
      ? {
          x: retanguloQuadroArte.left + fracaoY * retanguloQuadroArte.width,
          y: retanguloQuadroArte.top + (1 - fracaoX) * retanguloQuadroArte.height
        }
      : {
          x: retanguloQuadroArte.left + fracaoX * retanguloQuadroArte.width,
          y: retanguloQuadroArte.top + fracaoY * retanguloQuadroArte.height
        };
  }
  function posicionarRotulosAnatomicos() {
    const telaEmPe = consultaTelaEmPe.matches;
    selecionarTodos('.tag').forEach((rotulo) => {
      const dadosDoRotulo = rotulo.dataset;
      const larguraInicialRotulo = rotulo.offsetWidth,
        alturaInicialRotulo = rotulo.offsetHeight;
      const pontoAlvo = pontoDoPalcoNaTela(+dadosDoRotulo.px / 100, +dadosDoRotulo.py / 100);
      const alvoX = pontoAlvo.x,
        alvoY = pontoAlvo.y;
      let ancoraX, ancoraY;
      if (telaEmPe) {
        ancoraX = Math.min(Math.max(alvoX + +dadosDoRotulo.mox, 8), innerWidth - larguraInicialRotulo - 8);
        ancoraY = Math.min(
          Math.max(alvoY + +dadosDoRotulo.moy, alturaInicialRotulo),
          innerHeight - alturaInicialRotulo
        );
      } else {
        const pontoAncoraDesktop = pontoDoPalcoNaTela(+dadosDoRotulo.tx / 100, +dadosDoRotulo.ty / 100);
        ancoraX = pontoAncoraDesktop.x;
        ancoraY = pontoAncoraDesktop.y;
      }
      rotulo.style.left = ancoraX + 'px';
      rotulo.style.top = ancoraY + 'px';
      const larguraRotulo = rotulo.offsetWidth;
      const linhaSaiPelaDireita = alvoX > ancoraX + larguraRotulo / 2;
      const inicioLinhaRotuloX = linhaSaiPelaDireita ? ancoraX + larguraRotulo : ancoraX;
      const linhaDoRotulo = selecionarUm('i', rotulo);
      linhaDoRotulo.style.left = (linhaSaiPelaDireita ? larguraRotulo : 0) + 'px';
      linhaDoRotulo.style.width = Math.hypot(alvoX - inicioLinhaRotuloX, alvoY - ancoraY) + 'px';
      linhaDoRotulo.style.rotate = Math.atan2(alvoY - ancoraY, alvoX - inicioLinhaRotuloX) + 'rad';
    });
    const dadosDoAtalho = botaoAtalhoPrancha.dataset;
    let atalhoX, atalhoY;
    if (telaEmPe) {
      atalhoX = (innerWidth * +dadosDoAtalho.mgx) / 100;
      atalhoY = (innerHeight * +dadosDoAtalho.mgy) / 100;
    } else {
      const pontoAtalhoDesktop = pontoDoPalcoNaTela(+dadosDoAtalho.gx, +dadosDoAtalho.gy);
      atalhoX = pontoAtalhoDesktop.x;
      atalhoY = pontoAtalhoDesktop.y;
    }
    botaoAtalhoPrancha.style.left = atalhoX + 'px';
    botaoAtalhoPrancha.style.top = atalhoY + 'px';
  }
  function mostrarRotulosAnatomicos() {
    rotulosAnatomicosVisiveis = true;
    rotulosJaMostrados = true;
    rosaClicavel.classList.remove('hint');
    posicionarRotulosAnatomicos();
    botaoAtalhoPrancha.inert = false;
    cenaPrincipal.dataset.egg = 'true';
    rosaClicavel.setAttribute('aria-pressed', 'true');
    regiaoAnuncios.textContent =
      'Detalhe escondido: anotações anatômicas apareceram sobre as mãos, com um atalho para a prancha Tabula II.';
    window.clearTimeout(temporizadorRotulos);
    temporizadorRotulos = window.setTimeout(esconderRotulosAnatomicos, 12000);
  }
  function esconderRotulosAnatomicos() {
    if (!rotulosAnatomicosVisiveis) return;
    rotulosAnatomicosVisiveis = false;
    botaoAtalhoPrancha.inert = true;
    cenaPrincipal.dataset.egg = 'false';
    rosaClicavel.setAttribute('aria-pressed', 'false');
    regiaoAnuncios.textContent = '';
    window.clearTimeout(temporizadorRotulos);
  }
  window.setTimeout(() => {
    if (!rotulosJaMostrados && !mensagemAberta) rosaClicavel.classList.add('hint');
  }, 9000);
  rosaClicavel.addEventListener('click', () => {
    if (mensagemAberta) return;
    rotulosAnatomicosVisiveis ? esconderRotulosAnatomicos() : mostrarRotulosAnatomicos();
  });
  const CURVA_VOO_DO_ANEL = 'cubic-bezier(.65,0,.2,1)';
  let animacaoVooDoAnel = null,
    animacaoAberturaDoPapel = null,
    numeroDoItemAtivo = 3;
  const duracaoAjustada = (milissegundos) => (preferenciaMovimentoReduzido.matches ? 1 : milissegundos);
  const PRANCHAS = {
    2: {
      titulo: 'Tabula II',
      subtitulo: 'De manibus et rosa',
      figura: figuraCorpo,
      circulo: circuloPranchaCorpo,
      itemInicialAtivo: 3
    },
    3: {
      titulo: 'Tabula III',
      subtitulo: 'De spatio inter manus',
      figura: figuraMaos,
      circulo: circuloPranchaMaos,
      itemInicialAtivo: 4
    }
  };
  let numeroDaPranchaAtual = 2;
  const numeroDaPranchaDoElemento = (elementoDentroDaPrancha) =>
    elementoDentroDaPrancha.closest('[data-tab]').dataset.tab;
  const pinosDaPranchaAtual = () =>
    todosPinos.filter(
      (pinoCandidato) => numeroDaPranchaDoElemento(pinoCandidato) === String(numeroDaPranchaAtual)
    );
  const linhasDaPranchaAtual = () =>
    todasLinhasLegenda.filter(
      (linhaCandidata) => numeroDaPranchaDoElemento(linhaCandidata) === String(numeroDaPranchaAtual)
    );
  function acompanharCarregamentoDaImagem(imagemAcompanhada, figuraAcompanhada) {
    const atualizarProporcaoDaFigura = () => {
      if (imagemAcompanhada.naturalWidth)
        figuraAcompanhada.style.setProperty(
          '--proporcao-figura',
          (imagemAcompanhada.naturalWidth / imagemAcompanhada.naturalHeight).toFixed(4)
        );
    };
    imagemAcompanhada.addEventListener('load', () => {
      figuraAcompanhada.classList.remove('pr__fig--noimg');
      atualizarProporcaoDaFigura();
    });
    imagemAcompanhada.addEventListener('error', () => figuraAcompanhada.classList.add('pr__fig--noimg'));
  }
  acompanharCarregamentoDaImagem(imagemCorpo, figuraCorpo);
  acompanharCarregamentoDaImagem(imagemMaos, figuraMaos);
  let imagensDasPranchasCarregadas = false;
  function carregarImagensDasPranchas() {
    if (imagensDasPranchasCarregadas) return;
    imagensDasPranchasCarregadas = true;
    selecionarTodos('source[data-srcset]', secaoPrancha).forEach((elementoFonteDeImagem) => {
      elementoFonteDeImagem.srcset = elementoFonteDeImagem.dataset.srcset;
    });
    selecionarTodos('img[data-src]', secaoPrancha).forEach((elementoImagemDaPrancha) => {
      elementoImagemDaPrancha.src = elementoImagemDaPrancha.dataset.src;
    });
  }
  window.addEventListener(
    'load',
    () => window.setTimeout(carregarImagensDasPranchas, preferenciaMovimentoReduzido.matches ? 300 : 3200),
    {
      once: true
    }
  );
  if (document.readyState === 'complete') window.setTimeout(carregarImagensDasPranchas, 3200);
  function posicionarAnelVoador() {
    const retanguloCirculoFinal = PRANCHAS[numeroDaPranchaAtual].circulo.getBoundingClientRect();
    anelVoadorPrancha.style.left = retanguloCirculoFinal.left + 'px';
    anelVoadorPrancha.style.top = retanguloCirculoFinal.top + 'px';
    anelVoadorPrancha.style.width = retanguloCirculoFinal.width + 'px';
    anelVoadorPrancha.style.height = retanguloCirculoFinal.height + 'px';
    return retanguloCirculoFinal;
  }
  function desenharTracoDeLigacao(reiniciarAnimacaoDoTraco) {
    if (consultaTelaEmPe.matches || !pranchaAberta) return;
    const pinoDoItemAtivo = pinosDaPranchaAtual().find(
      (pinoDaBusca) => +pinoDaBusca.dataset.n === numeroDoItemAtivo
    );
    const linhaDoItemAtivo = linhasDaPranchaAtual().find(
      (linhaDaBusca) => +linhaDaBusca.dataset.n === numeroDoItemAtivo
    );
    if (
      !pinoDoItemAtivo ||
      !linhaDoItemAtivo ||
      PRANCHAS[numeroDaPranchaAtual].figura.classList.contains('pr__fig--noimg')
    )
      return;
    const numeroDaLinha = selecionarUm('.pr__num', linhaDoItemAtivo);
    const retanguloDoPino = pinoDoItemAtivo.getBoundingClientRect(),
      retanguloDoNumero = numeroDaLinha.getBoundingClientRect();
    const centroPinoX = retanguloDoPino.left + retanguloDoPino.width / 2,
      centroPinoY = retanguloDoPino.top + retanguloDoPino.height / 2;
    const centroNumeroX = retanguloDoNumero.left + retanguloDoNumero.width / 2,
      centroNumeroY = retanguloDoNumero.top + retanguloDoNumero.height / 2;
    const distanciaPinoNumero = Math.hypot(centroNumeroX - centroPinoX, centroNumeroY - centroPinoY) || 1;
    const direcaoX = (centroNumeroX - centroPinoX) / distanciaPinoNumero,
      direcaoY = (centroNumeroY - centroPinoY) / distanciaPinoNumero;
    const saidaDoPinoX = centroPinoX + (direcaoX * retanguloDoPino.width) / 2,
      saidaDoPinoY = centroPinoY + (direcaoY * retanguloDoPino.width) / 2;
    const chegadaNoNumeroX = centroNumeroX - (direcaoX * retanguloDoNumero.width) / 2,
      chegadaNoNumeroY = centroNumeroY - (direcaoY * retanguloDoNumero.width) / 2;
    const curvaturaDoTraco =
      Math.min(distanciaPinoNumero * 0.16, 90) * (centroPinoY < centroNumeroY ? 1 : -1);
    const controleDaCurvaX = (saidaDoPinoX + chegadaNoNumeroX) / 2 - direcaoY * curvaturaDoTraco,
      controleDaCurvaY = (saidaDoPinoY + chegadaNoNumeroY) / 2 + direcaoX * curvaturaDoTraco;
    tracoLigacao.setAttribute(
      'd',
      `M${saidaDoPinoX.toFixed(1)} ${saidaDoPinoY.toFixed(1)} Q${controleDaCurvaX.toFixed(1)} ${controleDaCurvaY.toFixed(1)} ${chegadaNoNumeroX.toFixed(1)} ${chegadaNoNumeroY.toFixed(1)}`
    );
    if (reiniciarAnimacaoDoTraco) {
      tracoLigacao.classList.remove('go');
      void tracoLigacao.getBoundingClientRect();
    }
    tracoLigacao.classList.add('go');
  }
  function definirItemAtivo(numeroDoItem, veioDoPino) {
    numeroDoItemAtivo = numeroDoItem;
    const linhasAtuais = linhasDaPranchaAtual(),
      pinosAtuais = pinosDaPranchaAtual();
    linhasAtuais.forEach((linhaPercorrida) => {
      const linhaEstaAtiva = +linhaPercorrida.dataset.n === numeroDoItem;
      linhaPercorrida.classList.toggle('is-on', linhaEstaAtiva);
      if (linhaEstaAtiva) linhaPercorrida.setAttribute('aria-current', 'true');
      else linhaPercorrida.removeAttribute('aria-current');
    });
    pinosAtuais.forEach((pinoPercorrido) => {
      const pinoEstaAtivo = +pinoPercorrido.dataset.n === numeroDoItem;
      pinoPercorrido.classList.toggle('is-on', pinoEstaAtivo);
      pinoPercorrido.setAttribute('aria-pressed', String(pinoEstaAtivo));
    });
    const linhaSelecionada = linhasAtuais.find(
      (linhaProcurada) => +linhaProcurada.dataset.n === numeroDoItem
    );
    const telaBaixa = window.matchMedia('(max-height: 520px)').matches;
    if ((consultaTelaEmPe.matches && veioDoPino) || telaBaixa)
      linhaSelecionada.scrollIntoView({
        block: 'nearest',
        behavior: telaBaixa || preferenciaMovimentoReduzido.matches ? 'auto' : 'smooth'
      });
    desenharTracoDeLigacao(true);
  }
  function reposicionarPrancha() {
    desenharTracoDeLigacao(false);
  }
  function definirPranchaAtual(numeroDaNovaPrancha) {
    numeroDaPranchaAtual = numeroDaNovaPrancha;
    secaoPrancha.dataset.tab = String(numeroDaNovaPrancha);
    tituloPrancha.textContent = PRANCHAS[numeroDaNovaPrancha].titulo;
    subtituloPrancha.textContent = PRANCHAS[numeroDaNovaPrancha].subtitulo;
    numeroDoItemAtivo = PRANCHAS[numeroDaNovaPrancha].itemInicialAtivo;
  }
  function virarParaPrancha(numeroDaPranchaDestino) {
    if (
      !pranchaAberta ||
      fichaAberta ||
      numeroDaPranchaDestino === numeroDaPranchaAtual ||
      secaoPrancha.dataset.s !== 'plate'
    )
      return;
    tracoLigacao.classList.remove('go');
    secaoPrancha.dataset.turn = '1';
    vibrarCurto(10);
    tocarBarulhoDePapel(0.36, 5200);
    window.setTimeout(
      () => {
        if (!pranchaAberta) return;
        definirPranchaAtual(numeroDaPranchaDestino);
        painelLegenda.dataset.open = 'false';
        alcaPainelLegenda.setAttribute('aria-expanded', 'false');
        secaoPrancha.removeAttribute('data-go');
        void secaoPrancha.offsetWidth;
        secaoPrancha.dataset.go = '1';
        definirItemAtivo(numeroDoItemAtivo, false);
        selecionarTodos('.pr__list').forEach((listaDaLegenda) => {
          listaDaLegenda.scrollTop = 0;
        });
        secaoPrancha.removeAttribute('data-turn');
        window.setTimeout(
          () => {
            if (pranchaAberta && numeroDaPranchaAtual === numeroDaPranchaDestino)
              desenharTracoDeLigacao(true);
          },
          preferenciaMovimentoReduzido.matches ? 0 : 1900
        );
        regiaoAnuncios.textContent = `${PRANCHAS[numeroDaPranchaDestino].titulo}, ${PRANCHAS[numeroDaPranchaDestino].subtitulo}. Use os números ou a legenda para destacar cada item.`;
      },
      preferenciaMovimentoReduzido.matches ? 0 : 230
    );
  }
  selecionarTodos('[data-tab-go]').forEach((botaoDeNavegacao) =>
    botaoDeNavegacao.addEventListener('click', () => virarParaPrancha(+botaoDeNavegacao.dataset.tabGo))
  );
  const realcarParCorrespondente = (elementoRealcado, realceLigado) => {
    const numeroDoPar = +elementoRealcado.dataset.n;
    const parCorrespondente = (
      elementoRealcado.classList.contains('pr__pin') ? linhasDaPranchaAtual() : pinosDaPranchaAtual()
    ).find((candidatoAoPar) => +candidatoAoPar.dataset.n === numeroDoPar);
    if (parCorrespondente) parCorrespondente.classList.toggle('is-peek', realceLigado);
  };
  [...todosPinos, ...todasLinhasLegenda].forEach((elementoSobPonteiro) => {
    elementoSobPonteiro.addEventListener('pointerenter', (eventoPonteiroEntrou) => {
      if (eventoPonteiroEntrou.pointerType === 'mouse') realcarParCorrespondente(elementoSobPonteiro, true);
    });
    elementoSobPonteiro.addEventListener('pointerleave', () =>
      realcarParCorrespondente(elementoSobPonteiro, false)
    );
  });
  window.addEventListener('keydown', (eventoTeclaNaPrancha) => {
    if (
      !pranchaAberta ||
      fichaAberta ||
      eventoTeclaNaPrancha.altKey ||
      eventoTeclaNaPrancha.ctrlKey ||
      eventoTeclaNaPrancha.metaKey
    )
      return;
    if (eventoTeclaNaPrancha.key === 'ArrowDown' || eventoTeclaNaPrancha.key === 'ArrowUp') {
      const linhasNavegaveis = linhasDaPranchaAtual(),
        indiceDoItemAtual = linhasNavegaveis.findIndex(
          (linhaNavegavel) => +linhaNavegavel.dataset.n === numeroDoItemAtivo
        );
      const indiceDoProximoItem =
        (indiceDoItemAtual + (eventoTeclaNaPrancha.key === 'ArrowDown' ? 1 : -1) + linhasNavegaveis.length) %
        linhasNavegaveis.length;
      eventoTeclaNaPrancha.preventDefault();
      definirItemAtivo(+linhasNavegaveis[indiceDoProximoItem].dataset.n, false);
      linhasNavegaveis[indiceDoProximoItem].scrollIntoView({
        block: 'nearest'
      });
    } else if (eventoTeclaNaPrancha.key === 'ArrowRight' && numeroDaPranchaAtual === 2) virarParaPrancha(3);
    else if (eventoTeclaNaPrancha.key === 'ArrowLeft' && numeroDaPranchaAtual === 3) virarParaPrancha(2);
  });
  let abertaPeloCartao = true;
  function abrirPrancha() {
    if (pranchaAberta) return;
    carregarImagensDasPranchas();
    abertaPeloCartao = mensagemAberta;
    pranchaAberta = true;
    definirPranchaAtual(2);
    secaoPrancha.removeAttribute('data-turn');
    esconderRotulosAnatomicos();
    secaoPrancha.classList.add('is-on');
    secaoPrancha.inert = false;
    secaoPrancha.setAttribute('aria-hidden', 'false');
    cartaoMensagem.inert = true;
    cenaPrincipal.dataset.page = 'turn';
    secaoPrancha.dataset.s = 'turning';
    painelLegenda.dataset.open = 'false';
    alcaPainelLegenda.setAttribute('aria-expanded', 'false');
    secaoPrancha.removeAttribute('data-go');
    window.setTimeout(
      () => {
        if (pranchaAberta) secaoPrancha.dataset.go = '1';
      },
      preferenciaMovimentoReduzido.matches ? 0 : 750
    );
    const retanguloCirculoDestino = posicionarAnelVoador();
    const retanguloAnelOrigem = anelCentral.getBoundingClientRect();
    const escalaInicialDoAnel = Math.max(retanguloAnelOrigem.width / retanguloCirculoDestino.width, 0.01);
    const deslocamentoDoAnelX =
      retanguloAnelOrigem.left +
      retanguloAnelOrigem.width / 2 -
      (retanguloCirculoDestino.left + retanguloCirculoDestino.width / 2);
    const deslocamentoDoAnelY =
      retanguloAnelOrigem.top +
      retanguloAnelOrigem.height / 2 -
      (retanguloCirculoDestino.top + retanguloCirculoDestino.height / 2);
    const centroDoCirculoX = retanguloCirculoDestino.left + retanguloCirculoDestino.width / 2,
      centroDoCirculoY = retanguloCirculoDestino.top + retanguloCirculoDestino.height / 2;
    const raioDeAberturaDoPapel =
      Math.hypot(
        Math.max(centroDoCirculoX, innerWidth - centroDoCirculoX),
        Math.max(centroDoCirculoY, innerHeight - centroDoCirculoY)
      ) + 8;
    animacaoVooDoAnel = anelVoadorPrancha.animate(
      [
        {
          transform: `translate(${deslocamentoDoAnelX}px,${deslocamentoDoAnelY}px) scale(${escalaInicialDoAnel})`,
          borderWidth: `${(1.5 / escalaInicialDoAnel).toFixed(1)}px`,
          borderColor: '#f1ecdf'
        },
        {
          transform: 'translate(0,0) scale(1)',
          borderWidth: '1.5px',
          borderColor: '#b3101e'
        }
      ],
      {
        duration: duracaoAjustada(1100),
        easing: CURVA_VOO_DO_ANEL,
        fill: 'both'
      }
    );
    animacaoAberturaDoPapel = paginaPrancha.animate(
      [
        {
          clipPath: `circle(0px at ${centroDoCirculoX}px ${centroDoCirculoY}px)`
        },
        {
          clipPath: `circle(${raioDeAberturaDoPapel}px at ${centroDoCirculoX}px ${centroDoCirculoY}px)`
        }
      ],
      {
        duration: duracaoAjustada(1000),
        delay: duracaoAjustada(650),
        easing: 'cubic-bezier(.5,0,.25,1)',
        fill: 'both'
      }
    );
    Promise.all([animacaoVooDoAnel.finished, animacaoAberturaDoPapel.finished])
      .then(() => {
        if (!pranchaAberta) return;
        secaoPrancha.dataset.s = 'plate';
        cenaPrincipal.dataset.page = 'plate';
        definirItemAtivo(numeroDoItemAtivo, false);
        if (consultaTelaEmPe.matches)
          todasLinhasLegenda
            .find((linhaDoItemAtivoParaRolar) => +linhaDoItemAtivoParaRolar.dataset.n === numeroDoItemAtivo)
            .scrollIntoView({
              block: 'nearest'
            });
        window.setTimeout(
          () => {
            if (pranchaAberta) desenharTracoDeLigacao(true);
          },
          preferenciaMovimentoReduzido.matches ? 0 : 1900
        );
        secaoPrancha.focus({
          preventScroll: true
        });
        regiaoAnuncios.textContent =
          'Tabula II, prancha anatômica. Use os números ou a legenda para destacar cada item. Esc volta.';
      })
      .catch(() => {});
  }
  function fecharPrancha() {
    if (!pranchaAberta) return;
    pranchaAberta = false;
    regiaoAnuncios.textContent = '';
    tracoLigacao.classList.remove('go');
    if (numeroDaPranchaAtual !== 2) {
      definirPranchaAtual(2);
      definirItemAtivo(numeroDoItemAtivo, false);
    }
    secaoPrancha.removeAttribute('data-turn');
    secaoPrancha.dataset.s = 'turning';
    delete cenaPrincipal.dataset.page;
    animacaoVooDoAnel.reverse();
    animacaoAberturaDoPapel.reverse();
    Promise.all([animacaoVooDoAnel.finished, animacaoAberturaDoPapel.finished])
      .then(() => {
        if (pranchaAberta) return;
        secaoPrancha.classList.remove('is-on');
        secaoPrancha.removeAttribute('data-go');
        secaoPrancha.inert = true;
        secaoPrancha.setAttribute('aria-hidden', 'true');
        secaoPrancha.dataset.s = '';
        cartaoMensagem.inert = !abertaPeloCartao;
        (abertaPeloCartao ? botaoVirarPagina : rosaClicavel).focus({
          preventScroll: true
        });
      })
      .catch(() => {});
  }
  botaoVirarPagina.addEventListener('click', abrirPrancha);
  botaoAtalhoPrancha.addEventListener('click', abrirPrancha);
  botaoVoltarPrancha.addEventListener('click', fecharPrancha);
  const vibrarCurto = (duracaoDaVibracaoMs) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(duracaoDaVibracaoMs);
      } catch (erroDeVibracao) {}
    }
  };
  todosPinos.forEach((pinoClicado) =>
    pinoClicado.addEventListener('click', () => {
      definirItemAtivo(+pinoClicado.dataset.n, true);
      vibrarCurto(12);
    })
  );
  todasLinhasLegenda.forEach((linhaClicada) =>
    linhaClicada.addEventListener('click', () => definirItemAtivo(+linhaClicada.dataset.n, false))
  );
  alcaPainelLegenda.addEventListener('click', () => {
    const legendaVaiAbrir = painelLegenda.dataset.open !== 'true';
    painelLegenda.dataset.open = String(legendaVaiAbrir);
    alcaPainelLegenda.setAttribute('aria-expanded', String(legendaVaiAbrir));
    alcaPainelLegenda.setAttribute(
      'aria-label',
      legendaVaiAbrir ? 'Recolher a legenda' : 'Mostrar toda a legenda'
    );
  });
  const SEGUNDO_INICIAL_DA_MUSICA = 203;
  const SEGUNDOS_DE_FUSAO_DO_LOOP = 8;
  const VOLUME_MAXIMO = 0.8;
  const playerPrincipal = selecionarUm('#som');
  const playerGemeo = new Audio(playerPrincipal.src);
  playerGemeo.preload = 'none';
  const botaoSom = selecionarUm('#somBtn');
  const textoDoBotaoSom = selecionarUm('.som__txt', botaoSom);
  const playersDaMusica = [playerPrincipal, playerGemeo];
  const navegadorControlaVolume = (() => {
    const playerDeTeste = new Audio();
    playerDeTeste.volume = 0.5;
    return playerDeTeste.volume === 0.5;
  })();
  if (!navegadorControlaVolume) playerPrincipal.loop = true;
  let musicaJaIniciou = false;
  let indiceDoPlayerAtual = 0,
    fusaoEmAndamento = false,
    volumeAtual = 0,
    volumeAlvo = 0,
    pessoaQuerTocar = false,
    temporizadorDoFade = 0,
    instanteDoUltimoPasso = 0;
  function aplicarVolumes(ganhoDoPlayerAtual, ganhoDoOutroPlayer) {
    const playerAtualAoAplicar = playersDaMusica[indiceDoPlayerAtual],
      outroPlayerAoAplicar = playersDaMusica[1 - indiceDoPlayerAtual];
    playerAtualAoAplicar.volume = Math.min(Math.max(volumeAtual * ganhoDoPlayerAtual, 0), 1);
    outroPlayerAoAplicar.volume = Math.min(Math.max(volumeAtual * ganhoDoOutroPlayer, 0), 1);
  }
  function passoDoFade() {
    const instanteAgora = performance.now(),
      segundosDesdeOPasso = Math.min((instanteAgora - instanteDoUltimoPasso) / 1000, 0.25);
    instanteDoUltimoPasso = instanteAgora;
    if (volumeAtual !== volumeAlvo) {
      const taxaDeVolumePorSegundo = volumeAlvo > volumeAtual ? VOLUME_MAXIMO / 2.2 : VOLUME_MAXIMO / 0.7;
      const passoDeVolume = taxaDeVolumePorSegundo * segundosDesdeOPasso;
      volumeAtual =
        volumeAlvo > volumeAtual
          ? Math.min(volumeAtual + passoDeVolume, volumeAlvo)
          : Math.max(volumeAtual - passoDeVolume, volumeAlvo);
    }
    let ganhoAtualNaFusao = 1,
      ganhoOutroNaFusao = 0;
    const playerAtualNaFusao = playersDaMusica[indiceDoPlayerAtual],
      outroPlayerNaFusao = playersDaMusica[1 - indiceDoPlayerAtual];
    if (
      navegadorControlaVolume &&
      pessoaQuerTocar &&
      isFinite(playerAtualNaFusao.duration) &&
      playerAtualNaFusao.duration > SEGUNDOS_DE_FUSAO_DO_LOOP * 3
    ) {
      const segundosRestantes = playerAtualNaFusao.duration - playerAtualNaFusao.currentTime;
      if (segundosRestantes <= SEGUNDOS_DE_FUSAO_DO_LOOP) {
        if (!fusaoEmAndamento) {
          fusaoEmAndamento = true;
          outroPlayerNaFusao.currentTime = 0;
          outroPlayerNaFusao.volume = 0;
          outroPlayerNaFusao.play().catch(() => {});
        }
        const progressoDaFusao = Math.min(Math.max(1 - segundosRestantes / SEGUNDOS_DE_FUSAO_DO_LOOP, 0), 1);
        ganhoAtualNaFusao = Math.cos((progressoDaFusao * Math.PI) / 2);
        ganhoOutroNaFusao = Math.sin((progressoDaFusao * Math.PI) / 2);
        if (progressoDaFusao >= 1 || playerAtualNaFusao.ended) {
          playerAtualNaFusao.pause();
          playerAtualNaFusao.currentTime = 0;
          indiceDoPlayerAtual = 1 - indiceDoPlayerAtual;
          fusaoEmAndamento = false;
          ganhoAtualNaFusao = 1;
          ganhoOutroNaFusao = 0;
        }
      }
    }
    aplicarVolumes(ganhoAtualNaFusao, ganhoOutroNaFusao);
    if (!pessoaQuerTocar && volumeAtual === 0) {
      playersDaMusica.forEach((playerParaPausar) => playerParaPausar.pause());
      if (fusaoEmAndamento) {
        indiceDoPlayerAtual = 1 - indiceDoPlayerAtual;
        fusaoEmAndamento = false;
      }
      window.clearInterval(temporizadorDoFade);
      temporizadorDoFade = 0;
    }
  }
  function iniciarTemporizadorDoFade() {
    if (temporizadorDoFade) return;
    instanteDoUltimoPasso = performance.now();
    temporizadorDoFade = window.setInterval(passoDoFade, 50);
  }
  playersDaMusica.forEach((playerObservado, indiceDoPlayerObservado) =>
    playerObservado.addEventListener('ended', () => {
      if (!pessoaQuerTocar || indiceDoPlayerObservado !== indiceDoPlayerAtual || fusaoEmAndamento) return;
      playerObservado.currentTime = 0;
      playerObservado.play().catch(() => {});
    })
  );
  function atualizarInterfaceDoSom(somLigado) {
    botaoSom.setAttribute('aria-pressed', String(somLigado));
    botaoSom.setAttribute(
      'aria-label',
      somLigado ? 'Pausar The Glow, Pt. 2' : 'Ouvir The Glow, Pt. 2, de The Microphones'
    );
    textoDoBotaoSom.textContent = somLigado ? 'pausar' : 'ouvir';
    botaoInscricaoSom.classList.toggle('is-playing', somLigado);
    botaoInscricaoSom.setAttribute(
      'aria-label',
      somLigado ? 'Pausar The Glow, Pt. 2' : 'Ouvir The Glow, Pt. 2, de The Microphones'
    );
  }
  botaoInscricaoSom.addEventListener('click', () => botaoSom.click());
  let contextoDeAudioDosEfeitos = null;
  function tocarBarulhoDePapel(duracaoDoEfeitoEmSegundos, frequenciaFinalEmHz) {
    if (!pessoaQuerTocar) return;
    try {
      contextoDeAudioDosEfeitos =
        contextoDeAudioDosEfeitos || new (window.AudioContext || window.webkitAudioContext)();
      if (contextoDeAudioDosEfeitos.state === 'suspended') contextoDeAudioDosEfeitos.resume();
      const totalDeAmostras = Math.floor(contextoDeAudioDosEfeitos.sampleRate * duracaoDoEfeitoEmSegundos),
        bufferDoRuido = contextoDeAudioDosEfeitos.createBuffer(
          1,
          totalDeAmostras,
          contextoDeAudioDosEfeitos.sampleRate
        ),
        amostrasDoRuido = bufferDoRuido.getChannelData(0);
      for (let indiceDaAmostra = 0; indiceDaAmostra < totalDeAmostras; indiceDaAmostra++)
        amostrasDoRuido[indiceDaAmostra] =
          (Math.random() * 2 - 1) * Math.pow(Math.sin((Math.PI * indiceDaAmostra) / totalDeAmostras), 1.4);
      const fonteDoRuido = contextoDeAudioDosEfeitos.createBufferSource();
      fonteDoRuido.buffer = bufferDoRuido;
      const filtroPassaFaixa = contextoDeAudioDosEfeitos.createBiquadFilter();
      filtroPassaFaixa.type = 'bandpass';
      filtroPassaFaixa.Q.value = 0.9;
      filtroPassaFaixa.frequency.setValueAtTime(900, contextoDeAudioDosEfeitos.currentTime);
      filtroPassaFaixa.frequency.exponentialRampToValueAtTime(
        frequenciaFinalEmHz,
        contextoDeAudioDosEfeitos.currentTime + duracaoDoEfeitoEmSegundos
      );
      const ganhoDoEfeito = contextoDeAudioDosEfeitos.createGain();
      ganhoDoEfeito.gain.value = 0.11;
      fonteDoRuido.connect(filtroPassaFaixa);
      filtroPassaFaixa.connect(ganhoDoEfeito);
      ganhoDoEfeito.connect(contextoDeAudioDosEfeitos.destination);
      fonteDoRuido.start();
    } catch (erroDoEfeitoSonoro) {}
  }
  botaoSom.addEventListener('click', () => {
    if (!pessoaQuerTocar) {
      if (!musicaJaIniciou && SEGUNDO_INICIAL_DA_MUSICA > 0) {
        musicaJaIniciou = true;
        const posicionarNoSegundoInicial = () => {
          try {
            playerPrincipal.currentTime = SEGUNDO_INICIAL_DA_MUSICA;
          } catch (erroAoPosicionar) {}
        };
        if (playerPrincipal.readyState >= 1) posicionarNoSegundoInicial();
        else
          playerPrincipal.addEventListener('loadedmetadata', posicionarNoSegundoInicial, {
            once: true
          });
      }
      musicaJaIniciou = true;
      pessoaQuerTocar = true;
      volumeAlvo = VOLUME_MAXIMO;
      playersDaMusica[indiceDoPlayerAtual]
        .play()
        .then(iniciarTemporizadorDoFade)
        .catch(() => {
          pessoaQuerTocar = false;
          atualizarInterfaceDoSom(false);
        });
      iniciarTemporizadorDoFade();
      atualizarInterfaceDoSom(true);
      if ('mediaSession' in navigator && window.MediaMetadata) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'The Glow, Pt. 2',
          artist: 'The Microphones'
        });
      }
    } else {
      pessoaQuerTocar = false;
      volumeAlvo = 0;
      atualizarInterfaceDoSom(false);
      iniciarTemporizadorDoFade();
    }
  });
  playerPrincipal.addEventListener('error', () => {
    botaoSom.hidden = true;
  });
  (function cumprimentarPelaHora() {
    const horaAtual = new Date().getHours();
    const trechoDoCumprimento =
      horaAtual < 5
        ? 'a essa hora?'
        : horaAtual < 12
          ? 'bom dia'
          : horaAtual < 18
            ? 'boa tarde'
            : 'boa noite';
    linhaChamadaNota.textContent = `Uma nota (${trechoDoCumprimento})`;
  })();
  if (window.console && console.log) {
    console.log(
      '%cBond Established',
      'font:900 20px Georgia,serif;color:#b3101e',
      '\nFeito com carinho, uma rosa e duas horas de CSS (tecnicamente).'
    );
  }
  const tituloOriginalDaAba = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'tem uma rosa esperando' : tituloOriginalDaAba;
  });
  selecionarTodos('.rk__row').forEach((linhaDoAtributo, indiceDoAtributo) => {
    linhaDoAtributo.style.setProperty('--ordem-atributo-ficha', indiceDoAtributo);
    const valorDoAtributo = +linhaDoAtributo.dataset.v,
      caixaDasCasinhas = selecionarUm('.rk__pips', linhaDoAtributo);
    for (let indiceDaCasinha = 0; indiceDaCasinha < 10; indiceDaCasinha++) {
      const casinha = document.createElement('i');
      if (indiceDaCasinha < valorDoAtributo) {
        casinha.className = 'on';
        casinha.style.setProperty('--ordem-casinha-preenchida', indiceDaCasinha);
        casinha.style.setProperty('--ordem-atributo-ficha', indiceDoAtributo);
      }
      caixaDasCasinhas.appendChild(casinha);
    }
  });
  let fichaAberta = false,
    animacoesDaFicha = [];
  const RECORTE_INICIAL_DA_VARREDURA = 'polygon(-10% 0,-10% 0,-30% 100%,-30% 100%)';
  const RECORTE_FINAL_DA_VARREDURA = 'polygon(-40% 0,140% 0,120% 100%,-60% 100%)';
  function abrirFicha() {
    if (fichaAberta || !pranchaAberta) return;
    fichaAberta = true;
    secaoFicha.classList.add('is-on');
    secaoFicha.inert = false;
    secaoFicha.setAttribute('aria-hidden', 'false');
    secaoPrancha.inert = true;
    secaoFicha.removeAttribute('data-go');
    tocarBarulhoDePapel(0.5, 7000);
    const duracaoDaVarredura = duracaoAjustada(760);
    animacoesDaFicha = [
      faixaVermelhaFicha.animate(
        [
          {
            clipPath: RECORTE_INICIAL_DA_VARREDURA
          },
          {
            clipPath: RECORTE_FINAL_DA_VARREDURA
          }
        ],
        {
          duration: duracaoDaVarredura,
          easing: 'cubic-bezier(.7,0,.2,1)',
          fill: 'both'
        }
      ),
      paginaFicha.animate(
        [
          {
            clipPath: RECORTE_INICIAL_DA_VARREDURA
          },
          {
            clipPath: RECORTE_FINAL_DA_VARREDURA
          }
        ],
        {
          duration: duracaoDaVarredura,
          delay: duracaoAjustada(170),
          easing: 'cubic-bezier(.7,0,.2,1)',
          fill: 'both'
        }
      )
    ];
    window.setTimeout(
      () => {
        if (fichaAberta) secaoFicha.dataset.go = '1';
      },
      preferenciaMovimentoReduzido.matches ? 0 : 520
    );
    Promise.all(animacoesDaFicha.map((animacaoAguardadaAoAbrir) => animacaoAguardadaAoAbrir.finished))
      .then(() => {
        if (fichaAberta)
          secaoFicha.focus({
            preventScroll: true
          });
      })
      .catch(() => {});
  }
  function fecharFicha() {
    if (!fichaAberta) return;
    fichaAberta = false;
    secaoFicha.removeAttribute('data-go');
    animacoesDaFicha.forEach((animacaoParaReverter) => animacaoParaReverter.reverse());
    Promise.all(animacoesDaFicha.map((animacaoAguardadaAoFechar) => animacaoAguardadaAoFechar.finished))
      .then(() => {
        if (fichaAberta) return;
        secaoFicha.classList.remove('is-on');
        secaoFicha.inert = true;
        secaoFicha.setAttribute('aria-hidden', 'true');
        secaoPrancha.inert = false;
        botaoAbrirFicha.focus({
          preventScroll: true
        });
      })
      .catch(() => {});
  }
  botaoAbrirFicha.addEventListener('click', abrirFicha);
  botaoVoltarFicha.addEventListener('click', fecharFicha);
  window.addEventListener('keydown', (eventoTeclaGeral) => {
    if (eventoTeclaGeral.key !== 'Escape') return;
    if (fichaAberta) fecharFicha();
    else if (pranchaAberta) fecharPrancha();
    else if (mensagemAberta) fecharMensagem();
    else esconderRotulosAnatomicos();
  });
  window.addEventListener('resize', () => {
    if (rotulosAnatomicosVisiveis) posicionarRotulosAnatomicos();
    if (mensagemAberta) apontarManchaDeTinta();
    if (pranchaAberta) {
      reposicionarPrancha();
    }
  });
  const PROFUNDIDADE_DAS_CAMADAS = {
    left: {
      fatorDeProfundidade: 1.0,
      variaveisDeDeslocamento: ['--deslocamento-mao-esquerda-x', '--deslocamento-mao-esquerda-y']
    },
    right: {
      fatorDeProfundidade: 1.35,
      variaveisDeDeslocamento: ['--deslocamento-mao-direita-x', '--deslocamento-mao-direita-y']
    },
    title: {
      fatorDeProfundidade: -0.45,
      variaveisDeDeslocamento: ['--deslocamento-titulo-x', '--deslocamento-titulo-y']
    },
    sub: {
      fatorDeProfundidade: -0.65,
      variaveisDeDeslocamento: ['--deslocamento-subtitulo-x', '--deslocamento-subtitulo-y']
    },
    splats: {
      fatorDeProfundidade: 0.75,
      variaveisDeDeslocamento: ['--deslocamento-manchas-x', '--deslocamento-manchas-y']
    },
    lines: {
      fatorDeProfundidade: 1.2,
      variaveisDeDeslocamento: ['--deslocamento-linhas-x', '--deslocamento-linhas-y']
    }
  };
  let larguraDoQuadroEmPixels = quadroArtePrincipal.getBoundingClientRect().width;
  const medirLarguraDoQuadro = () => {
    larguraDoQuadroEmPixels = quadroArtePrincipal.getBoundingClientRect().width;
  };
  window.addEventListener('resize', medirLarguraDoQuadro);
  const definirDeslocamentoDaCamada = (nomeDaVariavelCss, valorEmPixels) =>
    cenaPrincipal.style.setProperty(nomeDaVariavelCss, valorEmPixels.toFixed(2) + 'px');
  const MAXIMO_DE_DEGRAUS_DO_QUASE = 5;
  let degrauDoQuase = 0,
    temporizadorDoRetornoDasMaos = 0,
    temporizadorDoTextoCalma = 0;
  let aplicarReacaoAgora = () => {};
  function calcularReacaoDasMaos() {
    if (mensagemAberta)
      return {
        esquerdaX: larguraDoQuadroEmPixels * 0.004,
        direitaX: -larguraDoQuadroEmPixels * 0.0114
      };
    const fracaoDoDegrau = degrauDoQuase / MAXIMO_DE_DEGRAUS_DO_QUASE;
    return {
      esquerdaX: larguraDoQuadroEmPixels * 0.01 * fracaoDoDegrau,
      direitaX: -larguraDoQuadroEmPixels * 0.017 * fracaoDoDegrau
    };
  }
  function aproximarMaos() {
    if (mensagemAberta || pranchaAberta) return;
    const jaEstavaNoMaximo = degrauDoQuase >= MAXIMO_DE_DEGRAUS_DO_QUASE;
    degrauDoQuase = Math.min(degrauDoQuase + 1, MAXIMO_DE_DEGRAUS_DO_QUASE);
    aplicarReacaoAgora();
    if (!preferenciaMovimentoReduzido.matches)
      anelCentral.animate(
        [
          {
            scale: 1
          },
          {
            scale: 1.22
          },
          {
            scale: 0.94
          },
          {
            scale: 1
          }
        ],
        {
          duration: jaEstavaNoMaximo ? 520 : 380,
          easing: 'ease-out'
        }
      );
    if (degrauDoQuase >= MAXIMO_DE_DEGRAUS_DO_QUASE) vibrarCurto(jaEstavaNoMaximo ? 24 : 14);
    if (degrauDoQuase >= MAXIMO_DE_DEGRAUS_DO_QUASE - 1) {
      const retanguloAnelParaCalma = anelCentral.getBoundingClientRect();
      textoCalma.style.left = retanguloAnelParaCalma.right + retanguloAnelParaCalma.width * 0.5 + 'px';
      textoCalma.style.top = retanguloAnelParaCalma.top + retanguloAnelParaCalma.height / 2 + 'px';
      textoCalma.classList.add('on');
      window.clearTimeout(temporizadorDoTextoCalma);
      temporizadorDoTextoCalma = window.setTimeout(() => textoCalma.classList.remove('on'), 2400);
    }
    window.clearTimeout(temporizadorDoRetornoDasMaos);
    temporizadorDoRetornoDasMaos = window.setTimeout(() => {
      degrauDoQuase = 0;
      aplicarReacaoAgora();
    }, 6500);
  }
  zonaQuase.addEventListener('click', aproximarMaos);
  if (preferenciaMovimentoReduzido.matches) {
    const aplicarReacaoSemAnimacao = () => {
      const reacaoSemAnimacao = calcularReacaoDasMaos();
      definirDeslocamentoDaCamada('--deslocamento-mao-esquerda-x', reacaoSemAnimacao.esquerdaX);
      definirDeslocamentoDaCamada('--deslocamento-mao-direita-x', reacaoSemAnimacao.direitaX);
    };
    aplicarReacaoAgora = aplicarReacaoSemAnimacao;
    botaoChamada.addEventListener('click', aplicarReacaoSemAnimacao);
    botaoVoltarMensagem.addEventListener('click', aplicarReacaoSemAnimacao);
    window.addEventListener('keydown', (eventoTeclaMovimentoReduzido) => {
      if (eventoTeclaMovimentoReduzido.key === 'Escape') aplicarReacaoSemAnimacao();
    });
  } else {
    let alvoDoPonteiroX = 0,
      alvoDoPonteiroY = 0;
    let posicaoSuavizadaX = 0,
      posicaoSuavizadaY = 0;
    let reacaoSuavizadaDireita = 0,
      reacaoSuavizadaEsquerda = 0;
    let instanteDoUltimoQuadro = performance.now();
    let instanteDaUltimaEntrada = 0;
    const calcularAmplitudeDoPonteiro = () =>
      Math.min(Math.max(innerWidth * 0.017, 11), 30) * (consultaTelaEmPe.matches ? 1.4 : 1);
    window.addEventListener(
      'pointermove',
      (eventoPonteiroMoveu) => {
        alvoDoPonteiroX = eventoPonteiroMoveu.clientX / innerWidth - 0.5;
        alvoDoPonteiroY = eventoPonteiroMoveu.clientY / innerHeight - 0.5;
        instanteDaUltimaEntrada = performance.now();
      },
      {
        passive: true
      }
    );
    document.documentElement.addEventListener('mouseleave', () => {
      alvoDoPonteiroX = 0;
      alvoDoPonteiroY = 0;
    });
    window.addEventListener(
      'deviceorientation',
      (eventoDeInclinacao) => {
        if (eventoDeInclinacao.gamma == null || eventoDeInclinacao.beta == null) return;
        if (performance.now() - instanteDaUltimaEntrada < 1500) return;
        alvoDoPonteiroX = Math.max(-0.5, Math.min(0.5, eventoDeInclinacao.gamma / 40));
        alvoDoPonteiroY = Math.max(-0.5, Math.min(0.5, (eventoDeInclinacao.beta - 50) / 50));
      },
      {
        passive: true
      }
    );
    function animarQuadro(instanteDoQuadro) {
      const segundosDesdeOQuadro = Math.min((instanteDoQuadro - instanteDoUltimoQuadro) / 1000, 0.05);
      instanteDoUltimoQuadro = instanteDoQuadro;
      const segundosTotais = instanteDoQuadro / 1000;
      const fatorDeSuavizacaoDoPonteiro = 1 - Math.exp(-segundosDesdeOQuadro * 4.5);
      posicaoSuavizadaX += (alvoDoPonteiroX - posicaoSuavizadaX) * fatorDeSuavizacaoDoPonteiro;
      posicaoSuavizadaY += (alvoDoPonteiroY - posicaoSuavizadaY) * fatorDeSuavizacaoDoPonteiro;
      const reacaoDasMaos = calcularReacaoDasMaos();
      const fatorDeSuavizacaoDaReacao = 1 - Math.exp(-segundosDesdeOQuadro * 2.2);
      reacaoSuavizadaEsquerda +=
        (reacaoDasMaos.esquerdaX - reacaoSuavizadaEsquerda) * fatorDeSuavizacaoDaReacao;
      reacaoSuavizadaDireita += (reacaoDasMaos.direitaX - reacaoSuavizadaDireita) * fatorDeSuavizacaoDaReacao;
      const amplitudeAtual = calcularAmplitudeDoPonteiro();
      const deslocamentoDoPonteiroX = -posicaoSuavizadaX * 2 * amplitudeAtual;
      const deslocamentoDoPonteiroY = -posicaoSuavizadaY * 2 * amplitudeAtual * 0.7;
      const amplitudeDaFlutuacao = Math.min(innerWidth * 0.004, 6);
      const flutuacaoPorCamada = {
        left: [
          Math.sin(segundosTotais * 0.55) * amplitudeDaFlutuacao,
          Math.sin(segundosTotais * 0.8 + 1.0) * amplitudeDaFlutuacao * 0.8
        ],
        right: [
          Math.sin(segundosTotais * 0.62 + 2.1) * amplitudeDaFlutuacao * 1.2,
          Math.sin(segundosTotais * 0.9 + 0.4) * amplitudeDaFlutuacao
        ],
        title: [
          Math.sin(segundosTotais * 0.35 + 0.7) * amplitudeDaFlutuacao * 0.5,
          Math.cos(segundosTotais * 0.45) * amplitudeDaFlutuacao * 0.4
        ],
        sub: [
          Math.sin(segundosTotais * 0.4 + 1.9) * amplitudeDaFlutuacao * 0.5,
          Math.cos(segundosTotais * 0.5 + 1.1) * amplitudeDaFlutuacao * 0.4
        ],
        splats: [
          Math.sin(segundosTotais * 0.3 + 2.6) * amplitudeDaFlutuacao * 0.8,
          Math.cos(segundosTotais * 0.38) * amplitudeDaFlutuacao * 0.8
        ],
        lines: [
          Math.sin(segundosTotais * 0.5 + 0.3) * amplitudeDaFlutuacao * 1.1,
          Math.cos(segundosTotais * 0.7 + 2.2) * amplitudeDaFlutuacao * 0.9
        ]
      };
      for (const chaveDaCamada in PROFUNDIDADE_DAS_CAMADAS) {
        const configuracaoDaCamada = PROFUNDIDADE_DAS_CAMADAS[chaveDaCamada];
        let deslocamentoFinalX =
          deslocamentoDoPonteiroX * configuracaoDaCamada.fatorDeProfundidade +
          flutuacaoPorCamada[chaveDaCamada][0];
        let deslocamentoFinalY =
          deslocamentoDoPonteiroY * configuracaoDaCamada.fatorDeProfundidade +
          flutuacaoPorCamada[chaveDaCamada][1];
        if (chaveDaCamada === 'left') deslocamentoFinalX += reacaoSuavizadaEsquerda;
        if (chaveDaCamada === 'right') deslocamentoFinalX += reacaoSuavizadaDireita;
        if (consultaTelaEmPe.matches) {
          const valorTemporarioDeTroca = deslocamentoFinalX;
          deslocamentoFinalX = -deslocamentoFinalY;
          deslocamentoFinalY = valorTemporarioDeTroca;
        }
        definirDeslocamentoDaCamada(configuracaoDaCamada.variaveisDeDeslocamento[0], deslocamentoFinalX);
        definirDeslocamentoDaCamada(configuracaoDaCamada.variaveisDeDeslocamento[1], deslocamentoFinalY);
      }
      requestAnimationFrame(animarQuadro);
    }
    requestAnimationFrame(animarQuadro);
  }
})();
