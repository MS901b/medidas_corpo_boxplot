/**************************************
		INICIALIZACAO
**************************************/
var SalvaLocalLoaded = false;
var GGBLoaded = false;
var HTMLLoaded = false;

document.observe('dom:safeLoaded', function(ev){
	HTMLLoaded = true;
	SalvaLocalLoaded = true;
	checkInits();
});



function ggbOnInit() {
	GGBLoaded = true;
	checkInits();
}

function checkInits() {
	// Checagem se tanto SalvaLocal e Geogebra foram carregados.
	if  (SalvaLocalLoaded && GGBLoaded && HTMLLoaded) InitOnLoad();
}

function InitOnLoad(){
	/* exemplo de como habilitar as partes 
	   tem que lembrar de apagar este trecho pro software oficial */
	   

	setAtividade('atividade_2',2,false);	//Comecou a fazer a atividade_2

	BlocoNotas = new Blocao();
	
	MeuBloco[0] = 'Tabela da Altura';
	MeuBloco[1] = [	
					[{value: ' ', largura: 4},	{value: 'Gênero Feminino', largura: 4},	{value: 'Gênero Masculino', largura: 4}],	//header
					[{value: 'Mínimo', tipo: 'texto'}, {value: getResp('minF'), tipo: 'texto'},	{value: getResp('minM'), tipo: 'texto'}],
					[{value: 'Màximo', tipo: 'texto'}, {value: getResp('maxF'), tipo: 'texto'},	{value: getResp('maxM'), tipo: 'texto'}],
					[{value: 'Média', tipo: 'texto'}, {value: getResp('mediaF'), tipo: 'texto'}, {value: getResp('mediaM'), tipo: 'texto'}],
					[{value: 'Mediana', tipo: 'texto'}, {value: getResp('medianaF'), tipo: 'texto'}, {value: getResp('medianaM'), tipo: 'texto'}],
					[{value: 'Quantil 25%', tipo: 'texto'},	{value: getResp('Q25F'), tipo: 'texto'},	{value: getResp('Q25M'), tipo: 'texto'}],
					[{value: 'Quantil 75%', tipo: 'texto'},	{value: getResp('Q75F'), tipo: 'texto'},	{value: getResp('Q75M'), tipo: 'texto'}] 
				];

	MeuBloco[2] = '<br>';
	MeuBloco[3] = '<br>';
	MeuBloco[4] = '<br>';
	MeuBloco[5] = 'Tabela do Numero do Calçado';
	MeuBloco[6] = [	
					[{value: ' ', largura: 4},	{value: 'Gênero Feminino', largura: 4},	{value: 'Gênero Masculino', largura: 4}],	//header
					[{value: 'Mínimo', tipo: 'texto'}, {value: getResp('minCalcadoF'), tipo: 'texto'},	{value: getResp('minCalcadoM'), tipo: 'texto'}],
					[{value: 'Màximo', tipo: 'texto'}, {value: getResp('maxCalcadoF'), tipo: 'texto'},	{value: getResp('maxCalcadoM'), tipo: 'texto'}],
					[{value: 'Média', tipo: 'texto'}, {value: getResp('mediaCalcadoF'), tipo: 'texto'}, {value: getResp('mediaCalcadoM'), tipo: 'texto'}],
					[{value: 'Mediana', tipo: 'texto'}, {value: getResp('medianaCalcadoF'), tipo: 'texto'}, {value: getResp('medianaCalcadoM'), tipo: 'texto'}],
					[{value: 'Quantil 25%', tipo: 'texto'},	{value: getResp('Q25CalcadoF'), tipo: 'texto'},	{value: getResp('Q25CalcadoM'), tipo: 'texto'}],
					[{value: 'Quantil 75%', tipo: 'texto'},	{value: getResp('Q75CalcadoF'), tipo: 'texto'},	{value: getResp('Q75CalcadoM'), tipo: 'texto'}] 
				];

	if(PosicaoAtual.Parte == 2) {
		Event.observe('questao_4_b_1', 'focus', function(evento) {
			$('corretor_questao_4_b_1').removeClassName('incorreto');
			$('corretor_questao_4_b_1').removeClassName('correto');
		});
		Event.observe('questao_4_b_2', 'focus', function(evento) {
			$('corretor_questao_4_b_2').removeClassName('incorreto');
			$('corretor_questao_4_b_2').removeClassName('correto');
		});
	
	
	}
	
	
	
	// Guardar e Carregar respostas dos usuários
	if (PosicaoAtual.Parte == 2) {

		var ids = [ 'questao_4_b_1', 'questao_4_b_2', 'parte3_q3_c', 'parte3_q4_d' ];

		ids.each(function(s) 
		{
			$(s).value=getResp('atividade2_'+s);
			Event.observe(s, 'change', function(evento){
			setResp('atividade2_'+this.id,this.value);
			});
		});
		
		var ids_multi_escolha = [ 'parte3_q3_a', 'parte3_q3_b', 'parte3_q4_a', 'parte3_q4_c' ];
		ids_multi_escolha.each(function(item) 
		{ 
			for (var i=1;i<4;i++) 
			{
				Event.observe(item+'_'+i, 'change', function(evento)
				{
					setResp('atividade2_'+item,$(this.id).value);					
				});
			}
			switch (getResp('atividade2_'+item)) 
			{
				case 'm':
					$(item+'_'+1).setChecked(true);
				break
				case 'f':
					$(item+'_'+2).setChecked(true);
				break;
				case 'i':
					$(item+'_'+3).setChecked(true);
				break;
			}
			
		});
	};

	var maxF = getResp('maxF');
	var minF = getResp('minF');
	var alturaF = maxF - minF;
	
	var maxM = getResp('maxM');
	var minM = getResp('minM');
	var alturaM = maxM - minM;

	if(alturaM > alturaF) {
		setResp('maiorVariabilidade',alturaM);
	} else if(alturaM < alturaF) {
		setResp('maiorVariabilidade',alturaF);
	} else {
		setResp('maiorVariabilidade',alturaF);
	}
	
	//Calcula o zoom da coordenada Y
	var minGeral = (Number(getResp('minF'))<Number(getResp('minM')))?Number(getResp('minF')):Number(getResp('minM'));
	var maxGeral = (Number(getResp('maxF'))>Number(getResp('maxM')))?Number(getResp('maxF')):Number(getResp('maxM'));
	var margemVertical = 5;
	var deltaAltura = (maxGeral - minGeral) + margemVertical*2;
	var alturaQuadro = deltaAltura /15;

	var applet = document.ggbApplet;
	if(PosicaoAtual.Parte == 2) {	
		// Parte 3
		//Usando uma solução por XML devido a bug do geogebra

		//applet.setCoordSystem(-3.5,14,minGeral-10,maxGeral+10);
		mudarEscala(-3.5,14,minGeral-margemVertical,maxGeral+margemVertical);
		applet.setCoords('Minimo',3.5,Number(getResp('minF')));
		applet.setCoords('Maximo',3.5,Number(getResp('maxF')));
		applet.setCoords('Q25',3.5,Number(getResp('Q25F')));
		applet.setCoords('Q75',3.5,Number(getResp('Q75F')));
		applet.setCoords('Mediana',3.5,Number(getResp('medianaF')));
		applet.setCoords('Minimo2',8.5,Number(getResp('minM')));
		applet.setCoords('Maximo2',8.5,Number(getResp('maxM')));
		applet.setCoords('Q25_2',8.5,Number(getResp('Q25M')));
		applet.setCoords('Q75_2',8.5,Number(getResp('Q75M')));
		applet.setCoords('Mediana2',8.5,Number(getResp('medianaM')));

		
		applet.setVisible('Minimo',false);
		applet.setVisible('Maximo',false);
		applet.setVisible('Q25',false);
		applet.setVisible('Q75',false);
		applet.setVisible('Mediana',false);
		applet.setVisible('Minimo2',false);
		applet.setVisible('Maximo2',false);
		applet.setVisible('Q25_2',false);
		applet.setVisible('Q75_2',false);
		applet.setVisible('Mediana2',false);
		
		
		//Coloca quadrado branco nos cantos
		applet.evalCommand('branco = Polygon[(-3.5,'+(maxGeral+margemVertical)+'),(-1.5,'+(maxGeral+margemVertical)+'),(-1.5,'+(maxGeral+margemVertical-alturaQuadro)+'),(-3.5,+'+(maxGeral+margemVertical-alturaQuadro)+')]');
		applet.setColor('branco',255,255,255);
		applet.setFilling('branco',1);
		applet.setFixed('branco',1);

		//Canto inferior		
		applet.evalCommand('branco2 = Polygon[(12,'+(minGeral-margemVertical+alturaQuadro)+'),(14,'+(minGeral-margemVertical+alturaQuadro)+'),(14,'+(minGeral-margemVertical)+'),(12,+'+(minGeral-margemVertical)+')]');
		applet.setColor('branco2',255,255,255);
		applet.setFilling('branco2',1);
		applet.setFixed('branco2',1);
		
		//Fim colca quadrado branco nos cantos
	} else {
		// Partes 1 e 2
		
		//Usando uma solução por XML devido a bug do geogebra
		//applet.setCoordSystem(-0.5,3,minGeral-10,maxGeral+10);
		mudarEscala(-0.5,3,minGeral-margemVertical,maxGeral+margemVertical);


		// Seta coordenadas dos pontos:
		applet.setCoords('Minimo',3.5,roundNumber(Number(minGeral-margemVertical+(deltaAltura/6)),0));
		applet.setCoords('Maximo',3.5,roundNumber(Number(minGeral-margemVertical+(5*deltaAltura/6)),0));
		applet.setCoords('Q25',3.5,roundNumber(Number(minGeral-margemVertical+(2*deltaAltura/6)),0));
		applet.setCoords('Q75',3.5,roundNumber(Number(minGeral-margemVertical+(4*deltaAltura/6)),0));
		applet.setCoords('Mediana',3.5,roundNumber(Number(minGeral-margemVertical+(3*deltaAltura/6)),0));

		//Coloca quadrado branco nos cantos
		applet.evalCommand('branco = Polygon[(-0.5,'+(maxGeral+margemVertical)+'),(-0.1,'+(maxGeral+margemVertical)+'),(-0.1,'+(maxGeral+margemVertical-alturaQuadro)+'),(-0.5,+'+(maxGeral+margemVertical-alturaQuadro)+')]');
		applet.setColor('branco',255,255,255);
		applet.setFilling('branco',1);
		applet.setFixed('branco',1);

		//Canto inferior
		applet.evalCommand('branco2 = Polygon[(2.5,'+(minGeral-margemVertical+alturaQuadro)+'),(3,'+(minGeral-margemVertical+alturaQuadro)+'),(3,'+(minGeral-margemVertical)+'),(2.5,+'+(minGeral-margemVertical)+')]');
		applet.setColor('branco2',255,255,255);
		applet.setFilling('branco2',1);	
		applet.setFixed('branco',2);
		//Fim colca quadrado branco nos cantos
		
	}
	//Fim calculo do zoom
	
}

/**************************************
		FUNCOES DE USO GERAL
**************************************/
function tudoCerto() {
	if(PosicaoAtual.Parte == 2) {//Ultima parte
		setAtividade('atividade_2',3,true);		//atividade_2 estah feita
	}
}

//Exibe ou esconde a legenda no applet
function mostrarLegendaA2_P1() {
	var applet = document.ggbApplet;
	if (document.getElementById('checkBoxA2_P1').checked) {
		applet.setValue('o', 1);
	} else {
		applet.setValue('o', 0);
	}
}

function salientaSegmento(objeto) {
	var applet = document.ggbApplet;
	applet.setFilling(objeto, 0.4);
}

/**************************************
		FUNCOES DE CORRECAO
**************************************/
function corrige_q_1_a(valor) {
	var applet = document.ggbApplet;
	var minimo = applet.getYcoord('Minimo');
	
	if (Math.abs(Number(getResp('minF')) - minimo) < 0.5) {
		setResp('minAlunoF',minimo);
		return [true];
	} else return [false];
}

function corrige_q_1_b(valor) {
	var applet = document.ggbApplet;
	var maximo = applet.getYcoord('Maximo');
	
	if (Math.abs(Number(getResp('maxF')) - maximo) < 0.5) {
		setResp('maxAlunoF',maximo);
		return [true];
	} else return [false];
}

function corrige_q_1_c(valor) {
	var applet = document.ggbApplet;
	var q25 = applet.getYcoord('Q25');
	
	if (Math.abs(Number(getResp('Q25F')) - q25) < 0.5 ) {
		setResp('Q25AlunoF',q25);
		return [true];
	} else return [false];
}

function corrige_q_1_d(valor) {
	var applet = document.ggbApplet;
	var q75 = applet.getYcoord('Q75');
	
	if (Math.abs(Number(getResp('Q75F')) - q75) < 0.5 ) {;
		setResp('Q75AlunoF',q75);
			return [true];
	} else return [false];
}

function corrige_q_1_e(valor) {
	var applet = document.ggbApplet;
	var mediana = applet.getYcoord('Mediana');
	
	if (Math.abs(Number(getResp('medianaF')) - mediana) < 0.5 ) {;
		setResp('medianaAlunoF',mediana);
		return [true];
	} else return [false];
}

function corrige_q_2_a(valor) {
	var applet = document.ggbApplet;
	var minimo = applet.getYcoord('Minimo');
	
	if (Math.abs(Number(getResp('minM')) - minimo) < 0.5 ) {
		setResp('minAlunoM',minimo);
		return [true];
	} else return [false];	
}

function corrige_q_2_b(valor) {
	var applet = document.ggbApplet;
	var maximo = applet.getYcoord('Maximo');
	
	if (Math.abs(Number(getResp('maxM')) - maximo) < 0.5 ) {
		setResp('maxAlunoM',maximo);
		return [true];
	} else return [false];	
}

function corrige_q_2_c(valor) {
	var applet = document.ggbApplet;
	var q25 = applet.getYcoord('Q25');
	
	if (Math.abs(Number(getResp('Q25M')) - q25) < 0.5 ) {
		setResp('Q25AlunoM',q25);
		return [true];
	} else return [false];	
	
}

function corrige_q_2_d(valor) {
	var applet = document.ggbApplet;
	var q75 = applet.getYcoord('Q75');
	
	if (Math.abs(Number(getResp('Q75M')) - q75) < 0.5 ) {
		setResp('Q75AlunoM',q75);
		return [true];
	} else return [false];	
	
}

function corrige_q_2_e(valor) {
	var applet = document.ggbApplet;
	var mediana = applet.getYcoord('Mediana');
	
	if (Math.abs(Number(getResp('medianaM')) - mediana) < 0.5 ) {
		setResp('medianaAlunoM',mediana);
		return [true];
	} else return [false];	
	
}

function corrige_q_3_a(valor) {
	var maxF = getResp('maxF');
	var maxM = getResp('maxM');
	if(maxM > maxF) {
		return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null];
	} else if(maxM < maxF) {
		return [valor[0]?false:null, valor[1]?true:null, valor[1]?false:null];
	} else {
		return [valor[0]?false:null, valor[1]?false:null, valor[2]?true:null];
	}
}

function corrige_q_3_b(valor) {
	var minF = getResp('minF');
	var minM = getResp('minM');
	if(minM < minF) {
		return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null];
	} else if(minM > minF) {
		return [valor[0]?false:null, valor[1]?true:null, valor[2]?false:null];
	} else {
		return [valor[0]?false:null, valor[1]?false:null, valor[2]?true:null];
	}
}

function corrige_q_3_c(valor) {
	if(valor[0]!="") {
		valor[0] = valor[0].replace(',','.');
		var medianaF = getResp('medianaF');
		var medianaM = getResp('medianaM');
		if(medianaM > medianaF) {
			return [valor[0] == medianaM];
		}
		return [valor[0] == medianaF];
	} else {
		return[false];
	}
}

function corrige_q_4_a(valor) {
	var Q25F = getResp('Q25F');
	var Q75F = getResp('Q75F');
	var alturaF = Q75F - Q25F;
	
	var Q25M = getResp('Q25M');
	var Q75M = getResp('Q75M');
	var alturaM = Q75M - Q25M;

	if(alturaM < alturaF) {
		return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null];
	} else if (alturaM > alturaF) {
		return [valor[0]?false:null, valor[1]?true:null, valor[2]?false:null];
	} else {
		return [valor[0]?false:null, valor[1]?false:null, valor[2]?true:null];
	}

}

function corrige_q_4_b(valor) {
	var Q25F = getResp('Q25F');
	var Q75F = getResp('Q75F');
	var alturaF = Q75F - Q25F;
	
	var Q25M = getResp('Q25M');
	var Q75M = getResp('Q75M');
	var alturaM = Q75M - Q25M;

	var primeiraCaixa = false;
	var segundaCaixa = false;
	
	var Q25R = ($('questao_4_b_1').value).replace(',','.');
	var Q75R = ($('questao_4_b_2').value).replace(',','.');

	if(alturaM < alturaF) {
		//Masculino
		primeiraCaixa = (Q25R==Q25M);
		segundaCaixa = (Q75R==Q75M);
	};
	if(alturaF<alturaM) {
		//Feminino
		primeiraCaixa = (Q25R==Q25F);
		segundaCaixa = (Q75R==Q75F);
	} 
	if(alturaF==alturaM){
		primeiraCaixa = ( (Q25R==Q25F) || (Q25R==Q25M) );
		segundaCaixa = ( (Q75R==Q75F) || (Q75R==Q75M) );
	}

	if(primeiraCaixa) {
		$('corretor_questao_4_b_1').removeClassName('incorreto');
		$('corretor_questao_4_b_1').addClassName('correto');
	} else {
		$('corretor_questao_4_b_1').removeClassName('correto');
		$('corretor_questao_4_b_1').addClassName('incorreto');		
	}

	if(segundaCaixa) {
		$('corretor_questao_4_b_2').removeClassName('incorreto');
		$('corretor_questao_4_b_2').addClassName('correto');
	} else {
		$('corretor_questao_4_b_2').removeClassName('correto');
		$('corretor_questao_4_b_2').addClassName('incorreto');		
	}
	
	return [(primeiraCaixa&&segundaCaixa)];

}

function corrige_q_4_c(valor) {
	var maxF = getResp('maxF');
	var minF = getResp('minF');
	var alturaF = maxF - minF;
	
	var maxM = getResp('maxM');
	var minM = getResp('minM');
	var alturaM = maxM - minM;

	if(alturaM > alturaF) {
		return [valor[0]?true:null, valor[1]?false:null, valor[2]?false:null];
	} else if(alturaM < alturaF) {
		return [valor[0]?false:null, valor[1]?true:null, valor[2]?false:null];
	} else {
		return [valor[0]?false:null, valor[1]?false:null, valor[2]?true:null];
	}
}

function corrige_q_4_d(valor) {
	valor[0] = valor[0].replace(',','.');

	return [Math.abs(getResp('maiorVariabilidade') - valor[0]) < 0.01];
}
