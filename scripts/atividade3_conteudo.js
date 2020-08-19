/*
	Padronização do ID: 
		- [['p/parte','q/questao','/item'],'_'] vai gerar um id do tipo p1_q2_1
		- [['p/parte','q/questao','/itemletra'],'_'] vai gerar um id do tipo p1_q2_a
	Palavras-chave: questao, parte, item, itemletra, subitem
	Devem ser precedidas de uma barra '/'.
	A palavra-chave subitem será usada somente em questões com mais de um campo
*/

var IdPadrao = [
    ['parte/parte', 'q/questao', '/itemletra', '/subitem'], '_'
];

var nomeSoft = 'estat2';
var Partes = ['1', '2', '3'];

var Questoes = [{ //Parte 1
        parte1_q1: //Questão 1
        {
            enunciadoGeral: 'De acordo com as <a href="#" onclick="BlocoNotas.abre(); event.returnValue = false;  return false;">medidas resumos</a> da sua amostra, posicione os segmentos de forma que o box plot ao lado represente os números do calçado das meninas da amostra.',
            itens: [{ //A
                    tipo: 'instrucao',
                    corrigir: corrige_q_1_a,
                    enunciado: 'Posicione o segmento que representa o mínimo da amostra.',
                    msgErro: 'Observe o valor de mínimo na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_a">ponto</a> em destaque no quadro ao lado.',
                    msgAjuda: 'Na <a id="referencia2">referência 2</a> existe uma figura com especificações sobre o que representa cada segmento.'
                },
                { //B
                    tipo: 'instrucao',
                    corrigir: corrige_q_1_b,
                    enunciado: 'Posicione o segmento que representa o máximo da amostra.',
                    msgErro: 'Observe o valor de máximo na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_b">ponto</a> em destaque no quadro ao lado.'
                },
                { //C
                    tipo: 'instrucao',
                    corrigir: corrige_q_1_c,
                    enunciado: 'Posicione o segmento que representa o quantil 25% da amostra.',
                    msgErro: 'Observe o valor do quantil 25% na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_c">ponto</a> em destaque no quadro ao lado.'
                },
                { //D
                    tipo: 'instrucao',
                    corrigir: corrige_q_1_d,
                    enunciado: 'Posicione o segmento que representa o quantil 75% da amostra.',
                    msgErro: 'Observe o valor do quantil 75% na tabela do bloco de nota, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_d">ponto</a> em destaque no quadro ao lado.'
                },
                { //E
                    tipo: 'instrucao',
                    corrigir: corrige_q_1_e,
                    enunciado: 'Por fim, posicione o segmento que representa a mediana da amostra.',
                    msgErro: 'Observe o valor da mediana na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_e">ponto</a> em destaque no quadro ao lado.'
                }
            ]
        }
    },
    { //Parte 2
        parte2_q2: //Questão 2
        {
            enunciadoGeral: 'Posicione os segmentos de forma que o box plot ao lado represente a amostra de números do calçado dos meninos.',
            itens: [{ //A
                    tipo: 'instrucao',
                    corrigir: corrige_q_2_a,
                    enunciado: 'Posicione o segmento que representa o mínimo da amostra.',
                    msgErro: 'Observe o valor de mínimo na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_a">ponto</a> em destaque no quadro ao lado.',
                    msgAjuda: 'Na <a id="referencia2">referência 2</a> existe uma figura com especificações sobre o que representa cada segmento.'
                },
                { //B
                    tipo: 'instrucao',
                    corrigir: corrige_q_2_b,
                    enunciado: 'Posicione o segmento que representa o máximo da amostra.',
                    msgErro: 'Observe o valor de máximo na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_b">ponto</a> em destaque no quadro ao lado.'
                },
                { //C
                    tipo: 'instrucao',
                    corrigir: corrige_q_2_c,
                    enunciado: 'Posicione o segmento que representa o quantil 25% da amostra.',
                    msgErro: 'Observe o valor do quantil 25% na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_c">ponto</a> em destaque no quadro ao lado.'
                },
                { //D
                    tipo: 'instrucao',
                    corrigir: corrige_q_2_d,
                    enunciado: 'Posicione o segmento que representa o quantil 75% da amostra.',
                    msgErro: 'Observe o valor do quantil 75% na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_d">ponto</a> em destaque no quadro ao lado.'
                },
                { //E
                    tipo: 'instrucao',
                    corrigir: corrige_q_2_e,
                    enunciado: 'Por fim, posicione o segmento que representa a mediana da amostra.',
                    msgErro: 'Observe o valor da mediana na tabela do bloco de notas, na segunda página, e posicione o segmento correspondente movendo o <a id="ponto_verde_erro_e">ponto</a> em destaque no quadro ao lado.'
                }
            ]
        }
    },
    { //Parte 3
        parte3_q3: //Questão 3
        {
            enunciadoGeral: 'Analisando visualmente os dois blox plots, responda:',
            itens: [{ //A
                    tipo: 'multipla_escolha',
                    corrigir: corrige_q_3_a,
                    enunciado: 'Qual dos dois grupos tem o maior número de calçado?',
                    dados: [
                        { value: 'm', label: 'Masculino' },
                        { value: 'f', label: 'Feminino' },
                        { value: 'i', label: 'Iguais' }
                    ],
                    msgErro: 'Observe nos gráficos ao lado qual possui maior valor máximo.'
                },
                { //B
                    tipo: 'multipla_escolha',
                    corrigir: corrige_q_3_b,
                    enunciado: 'Qual dos dois grupos tem o menor número de calçado?',
                    dados: [
                        { value: 'm', label: 'Masculino' },
                        { value: 'f', label: 'Feminino' },
                        { value: 'i', label: 'Iguais' }
                    ],
                    msgErro: 'Observe nos gráficos ao lado qual possui menor valor mínimo.'
                },
                { //C
                    tipo: 'input',
                    corrigir: corrige_q_3_c,
                    enunciado: 'Qual é o maior valor de mediana entre os dois grupos?',
                    msgErro: 'Você pode obter essa informação observando os gráficos no quadro ao lado. Para certificar-se de qual segmento representa a mediana, basta olhar o exemplo de box plot na referencia 2.'
                }
            ]
        },
        parte3_q4: //Questão 4
        {
            enunciadoGeral: '',
            itens: [{ //A
                    tipo: 'multipla_escolha',
                    corrigir: corrige_q_4_a,
                    enunciado: 'Qual dos dois grupos é <a id="concentrado">mais concentrado</a> em torno da mediana?',
                    dados: [
                        { value: 'm', label: 'Masculino' },
                        { value: 'f', label: 'Feminino' },
                        { value: 'i', label: 'Iguais' }
                    ],
                    msgErro: 'Observe a diferença entre os valores dos quantis 25% e 75% de cada um dos gráficos.',
                    msgAjuda: 'Quantil 25% é o 1&#176 quartil e quantil 75% é o 3&#176 quartil.'
                },
                { //B
                    tipo: 'generico',
                    corrigir: corrige_q_4_b,
                    enunciado: 'Qual é o intervalo dessa concentração?',
                    dados: '<span class="a_esquerda">[</span><div id="corretor_questao_4_b_1"><input id="questao_4_b_1" style="width:20px; margin: 0 5px !important;"/></div><span class="a_esquerda antes_depois depois">;</span><div id="corretor_questao_4_b_2"><input id="questao_4_b_2" style="width:20px; margin: 0 5px !important;"/></div><div class="a_esquerda" style="margin-right:5px;"><span>]</span></div><br class="limpador" />',
                    msgErro: 'Você precisa dos valores de número do calçado correspondentes aos quantis 25% e 75% do grupo mais concentrado.',
                    msgAjuda: 'O intervalo deve ser escrito do menor para o maior valor.'
                },
                { //C
                    tipo: 'multipla_escolha',
                    corrigir: corrige_q_4_c,
                    enunciado: 'Qual dos dois tem maior <a id="variabilidade">variabilidade</a>?',
                    dados: [
                        { value: 'm', label: 'Masculino' },
                        { value: 'f', label: 'Feminino' },
                        { value: 'i', label: 'Iguais' }
                    ],
                    msgErro: 'Essa não é a amostra que tem a maior distância entre o mínimo e o máximo.',
                    msgAjuda: 'Observe a diferença entre os valores de máximo e de mínimo de cada um dos gráficos.'
                },
                { //D
                    tipo: 'input',
                    corrigir: corrige_q_4_d,
                    enunciado: 'Qual é o valor da maior variabilidade entre os dois grupos?',
                    msgErro: 'Faça a subtração entre o máximo e o mínimo do grupo de maior variabilidade.'
                }
            ]
        }
    }
]

var MeuBloco = new Array();