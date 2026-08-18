# WhatsApp Privacy Extension

Extensão para Chrome que adiciona uma camada visual de privacidade ao WhatsApp Web.

> Este projeto não é afiliado, mantido ou endossado pelo WhatsApp ou pela Meta.

## Recursos

- Desfoca mensagens, prévias de conversas, nomes e mídias sensíveis.
- Revela o conteúdo ao posicionar o mouse sobre ele.
- Recolhe a lista lateral de conversas para ampliar o painel principal.
- Remove completamente a área vazia da lista ao recolher a sidebar.
- Botão flutuante **P** para ativar ou desativar a privacidade:
  - Verde: privacidade ativada.
  - Cinza: privacidade desativada.
- Salva o estado de privacidade e da sidebar no navegador.

## Instalação

1. Baixe ou clone este repositório.
2. Abra `chrome://extensions` no Google Chrome ou no Microsoft Edge.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta deste projeto.
6. Abra ou atualize o [WhatsApp Web](https://web.whatsapp.com/).

## Como usar

- Clique no botão **P**, no canto inferior direito, para alternar a privacidade.
- Clique no botão lateral `<` ou `>` para recolher ou mostrar a lista de conversas.
- Passe o mouse sobre um conteúdo desfocado para visualizá-lo temporariamente.

### Atalhos

| Atalho | Ação |
| --- | --- |
| `Alt + Shift + P` | Ativa/desativa a privacidade |
| `Alt + Shift + S` | Recolhe/mostra a sidebar |

## Estrutura do projeto

```text
├── manifest.json  # Configuração da extensão Chrome (Manifest V3)
├── content.js     # Comportamento, controles e persistência de estado
└── style.css      # Blur, layout da sidebar e estilos dos botões
```

## Desenvolvimento

Após alterar algum arquivo, volte a `chrome://extensions`, clique no botão de recarregar da extensão e atualize a página do WhatsApp Web.

O WhatsApp Web pode alterar sua estrutura interna e seus seletores. Caso algum recurso deixe de funcionar após uma atualização do WhatsApp, revise os seletores `data-testid` em `style.css`.

## Privacidade

A extensão atua somente na interface do WhatsApp Web. Ela não envia, coleta ou armazena mensagens. As únicas preferências salvas localmente são o estado da privacidade e o estado da sidebar.
