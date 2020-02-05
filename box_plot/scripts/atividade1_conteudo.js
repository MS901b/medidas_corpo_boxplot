var IdPadrao = [['parte/parte','q/questao','/itemletra','/subitem'],'_'];

var nomeSoft = 'estat2';
var Partes = ['1', '2','3'];

var Questoes = 
[
	{
	},
	{//Parte 2
		parte2_q1: //Questão 1
		{
			enunciadoGeral: 'Observe a figura e responda:',
			itens: 
			[
				{//A
					tipo: 'input',
					corrigir: corrige_q_1_a,
					enunciado: 'Qual é o máximo valor de altura do conjunto de dados representado por este box plot?',
					msgErro: 'Esse não é o máximo do conjunto. Ative a legenda para ajudá-lo a identificar o segmento correspondente.',
					msgAjuda: 'Clique o botão “legenda” para saber que medida de tendência representa cada segmento.'
				},
				{//B
					tipo: 'input',
					corrigir: corrige_q_1_b,
					enunciado: 'Qual é o valor da mediana desse conjunto de dados?',
					msgErro: 'Esse não é o valor da mediana. Ative a legenda e observe o valor ao lado do segmento correspondente.',
					msgAjuda: 'Clique o botão "legenda" para saber que medida de tendência representa cada segmento.'
				}
			]
		}
	}
];
	
var MeuBloco = new Array();

