# Corte Inteligente (Smart Cut) - Extensão para Adobe Premiere

<div align="center">
  <a href="https://github.com/Mattys03/CorteInteligente/releases/latest">
    <img src="https://img.shields.io/badge/📦_Download_Release-FF0000?style=for-the-badge&logo=adobe" alt="Download Release" />
  </a>
</div>

![Platform](https://img.shields.io/badge/Plataforma-Adobe%20Premiere%20Pro-blue)
![Tech](https://img.shields.io/badge/Tecnologia-CEP%20%7C%20ExtendScript-green)
![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-purple)
[![JS Check CI](https://github.com/Mattys03/CorteInteligente/actions/workflows/js-check.yml/badge.svg)](https://github.com/Mattys03/CorteInteligente/actions/workflows/js-check.yml)

**Corte Inteligente** é uma Extensão Nativa baseada no CEP (*Common Extensibility Platform*) para o Adobe Premiere Pro. Ela tem como objetivo acelerar drasticamente o fluxo de edição de vídeo, automatizando cortes e a manipulação dinâmica da timeline (linha do tempo).

A ferramenta utiliza o ecossistema Web (HTML, JavaScript, CSS) renderizado num navegador Chromium embarcado, e faz a ponte diretamente com a API do Premiere através de *ExtendScript* (JSX).

## 🚀 Funcionalidades

- **Operações Dinâmicas de Timeline:** Acionamento programático de cortes e exclusões com ondulação (*ripple delete*).
- **Integração Nativa de Painel:** Funciona perfeitamente ancorado dentro da interface de usuário padrão do Premiere Pro.
- **Ponte ExtendScript (JSX):** Interação em baixo nível com o DOM do Premiere Pro, permitindo modificar *Sequences*, *Tracks* (Faixas) e *Clips* sem atrasos.

## 🛠️ Arquitetura

- **`CSXS/manifest.xml`**: O "coração" da extensão, definindo o tamanho da janela, versões compatíveis com o Adobe host e pontos de entrada.
- **`index.html` & `CSInterface.js`**: O painel *Frontend* e a ponte de comunicação oficial disponibilizada pela Adobe.
- **`jsx/`**: Diretório contendo a lógica *Backend* escrita em ExtendScript para comandar as APIs do software.

## 📦 Instalação (Para Desenvolvedores / Debug)

1. Faça o clone ou download deste repositório para a pasta oficial de extensões CEP:
   - Windows: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
2. Habilite o `PlayerDebugMode` no Registro do Windows para que o Premiere aceite painéis não assinados digitalmente.
   - O projeto já acompanha o arquivo `INSTALAR.bat` que cria a ponte de diretórios (symlink) e insere as chaves no registro automaticamente.
3. Reinicie o Adobe Premiere Pro e acesse o menu **Janela -> Extensões -> Corte Inteligente**.

## 📝 Licença

Distribuído sob a Licença MIT.
