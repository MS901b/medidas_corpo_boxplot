//Adiciona uma linha na tabela utilizada pela parte1, parte2 e desafio.
function addRow(idTabela){

	var tbody = document.getElementById("tabelaDados").getElementsByTagName("TBODY")[0];
    var row = document.createElement("TR");

	row.setAttribute("id", "linha_" + idTabela);
	row.setAttribute("status", "0");
	
	//Icone da lixeira
	var td = document.createElement("TD");	
	td.id = "apaga_" + idTabela;
	var doc = document.createElement('div');	
	doc.innerHTML = '<a href="javascript:removeRow('+idTabela+');"><img src="imgs/lixeira.jpg"/></a>';	
	td.appendChild(doc);
	row.appendChild(td);		
	
	//Adiciona os campos de Genero
	//doc = document.createTextNode(valorDado1);td.appendChild(doc);
	td = document.createElement("TD");	
	doc = document.createElement("input");  
	doc.setAttribute("id", "sexo_"+ idTabela);		
	td.appendChild(doc);
    row.appendChild(td);	
	
	//Adiciona os campos NUMERO CALCADO
	td = document.createElement("TD");	
	doc = document.createElement("input");  
	doc.setAttribute("id", "calcado_" + idTabela);	
	//doc.setAttribute("style", "width:200px");	
	td.appendChild(doc);
    row.appendChild(td);		

	//Adiciona os campos de ALTURA
	td = document.createElement("TD");	
	doc = document.createElement("input");  
	doc.setAttribute("id", "altura_" + idTabela);	
	doc.setAttribute("style", "width:30px");	
	td.appendChild(doc);
    row.appendChild(td);		

	
	//Icone de entrada valida
	td = document.createElement("TD");	
	td.id = "valida_" + idTabela;
	doc = document.createTextNode(" ");	
	td.appendChild(doc);
	row.appendChild(td);	
	
	// Adiciona a row no tbody.
    tbody.appendChild(row);

}

function removeRow(idLinha){
	
	var arrayDados = criaArrayDados();
	//setResp('tabela_principal', arrayDados.toJSON(), 'estat-dados');
	
	var dados = eval(criaArrayDados().toJSON());	
	dados.splice(idLinha, 1);		
	//setRespSoft('tabela_principal', dados.toJSON(), 'estat-dados');

	limparTabela();
	carregarDadosTabela(true, dados);	
	
	// Se por um acaso tenha alterado os dados 
	if (arrayDados.toJSON() != dados.toJSON()) {
		//$('SalvaLocal').ApagaTudo('estat2');						

		var tabelaOK = verificaRestricoesTabela();
	}	
}

function validacaoRespostaNumericaSimples(id,casas) {

	valor = $(id).value;
	if (isNaN(valor) || (valor==null)) {
		$(id).value='';
		return false;
	} else {
		$(id).value=roundNumber(valor,casas);
	}

}
function validacaoRespostaNumerica(id,casas) {
	valor = $(id).value;
	valor = processaNumero(valor);

	if (isNaN(valor) || (valor==null)) {
		$(id).value='';
		return false;
	} else {
		if ($(id).value.indexOf('%')>-1) 
		{
			$(id).value=roundNumber(valor*100,0)+'%';
		} else
		if ($(id).value.indexOf('/')>-1) 
		{
			//Formato de fração
		} 
		else
		{
			$(id).value=roundNumber(valor,casas);
		}
		return true;
	}
	
}



function roundNumber(num, dec) {
	var result = Math.round( Math.round( num * Math.pow( 10, dec + 1 ) ) / Math.pow( 10, 1 ) ) / Math.pow(10,dec);
	return result;
}


function processaNumero(respStr) 
{	
	var respStrSplited = respStr.split('/');
	
	var respostaValida = true;
	if (respStrSplited.length>1) 
	{
		
		for (var i=0;i<respStrSplited.length;i++)
		{	
			respStrSplited[i]=processaNumero(respStrSplited[i]);
			if (respStrSplited[i]==null) respostaValida=false;
			if (respostaValida) 
			{
				if (i==0) 
				{
					var resp=respStrSplited[i];
				} 
				else 
				{
					resp=resp/respStrSplited[i];
				}
				
			}
		}
		if (respostaValida) return resp;
		else return null;
	} 
	else
	{
		if (respStr.indexOf('%')>-1) 
		{
			respStr=respStr.replace(/%/,'');
			var porcento=true;
		} else var procento=false;
		
		respStr=respStr.replace(/,/g,'.');
		if ( !isNaN(respStr) && (respStr.length>0) ) 
		{
			if (porcento) respStr=respStr/100;
		} else respStr=null;
		return respStr;
	}

}

function carregarDadosTabela(carregaDoVetor, Vetor) {
	//var dados = getResp('tabela_principal');
	if (carregaDoVetor){
		var dados = Vetor;
	} else {
		var dados = getRespSoft('tabela_principal', 'estat-dados');
		dados = eval(dados);
	}
	
	for (i=0; i < dados.length; i++) {
		addRow(i);
		$('sexo_'+i).value = dados[i].sexo; 
		$('calcado_'+i).value = dados[i].calcado; 
		$('altura_'+i).value = dados[i].altura;				
		$('valida_'+i).update('<img src="img_layout/certinho.gif"/>');
		$('linha_'+i).writeAttribute("status", 1);
	}
	
	idTabela = i;
	$('nDadosValidos').update(i);		
	nCorretos = i;
	
	var k = 10 - dados.length;
	if (k > 0) {
		adicionarLinhas(k);
	}
}


function adicionarLinhas(num) {
	//alert("ooi" + num);
	
	for (i=1; i <= num; i++) {
		addRow(idTabela);
		idTabela++;
	}

	var tbody = document.getElementById("tabelaDados").getElementsByTagName("TBODY")[0];
	adicionaInputListener(tbody.rows.length);
	
	
}

function criaArrayDados() {
	var tbody = document.getElementById("tabelaDados").getElementsByTagName("TBODY")[0];
	var nLinhas = tbody.rows.length;
	var dados = new Array();
	
	var sexo, calcado, altura;
	for (i=0; i < nLinhas; i++) {
		// Somente inclui os dados validos
		
		if ($('linha_'+i).readAttribute("status") == "1") {
		//if ($('status_'+i).innerHTML == "1") {
			sexo= $('sexo_'+i).value.toUpperCase();
			calcado = Number($('calcado_'+i).value); 
			altura = Number(processaNumero($('altura_'+i).value));
			dados.push( {sexo: sexo, calcado: calcado, altura: altura});
		}
	}
	
	
	setResp('tabela_num_elementos', dados.length);	
	setResp('tabela_num_elementos', dados.length, "estat-dados");
	return dados;
}

function calculaDadosAltura() {
	var dados = getRespSoft('tabela_principal', 'estat-dados');
	dados = eval(dados);
	
	var alturaFeminina = new Array();
	var alturaMasculina = new Array();
	var vetorFrequenciaF = new Array();
	var vetorFrequenciaM = new Array();
	
	/* Cria os vetores das alturas F e M. */
	for (var i=0; i < dados.length; i++) {
		if(dados[i].sexo == 'F') {	// Vetor Feminino
			alturaFeminina.push(Number(dados[i].altura));

			/* Calcula a frequencia para tirar a moda */
			var j = encontraElementoArray(dados[i].altura, vetorFrequenciaF, compara_dados);
			if (j == -1) {
				vetorFrequenciaF.push({dado:dados[i].altura, freq:1});
			} else {
				vetorFrequenciaF[j].freq++;
			}

		} else {	// Vetor Masculino
			alturaMasculina.push(Number(dados[i].altura));

			/* Calcula a frequencia para tirar a moda */
			var j = encontraElementoArray(dados[i].altura, vetorFrequenciaM, compara_dados);
			if (j == -1) {
				vetorFrequenciaM.push({dado:dados[i].altura, freq:1});
			} else {
				vetorFrequenciaM[j].freq++;
			}
		}
	}
	
	//var indexFrequencia = new Array();
	var frequenciaMax = 1;
	for(var i = 0; i < vetorFrequenciaF.length; i++) {
		if(vetorFrequenciaF[i].freq > frequenciaMax) {
			frequenciaMax = vetorFrequenciaF[i].freq
		}
	}
	//var modaF = new Array();
	var modaF = '';
	for(var i = 0; i < vetorFrequenciaF.length; i++) {
		if(frequenciaMax != 1 && vetorFrequenciaF[i].freq == frequenciaMax) {
			//modaF.push(vetorFrequenciaF[i].dado);
			modaF+= vetorFrequenciaF[i].dado+' ';
		}
	}
	//console.log(modaF);
	//console.log(vetorFrequenciaF);
	alturaFeminina.sort(sortNumber);
	alturaMasculina.sort(sortNumber);
	
	var minF = alturaFeminina.min();
	var maxF = alturaFeminina.max();
	var mediaF = alturaFeminina.sum() / alturaFeminina.length;
	
	if( (alturaFeminina.length % 2) == 0) {	// Se for par
		var index = (alturaFeminina.length/2);
		var medianaF = (alturaFeminina[index - 1] + alturaFeminina[index]) / 2;
	} else {	// Se for impar
		var index = ((alturaFeminina.length + 1) / 2) - 1;
		var medianaF = alturaFeminina[index];
	}
	
	/* Calcula os quantis */
	var indexQuantil25F = alturaFeminina.length / 4;
	indexQuantil25F = Math.ceil(indexQuantil25F);
	var quantil25F = alturaFeminina[indexQuantil25F - 1];
	
	
	//console.log(indexQuantil25F);
	//console.log(alturaFeminina);
	//console.log(quantil25F);

	var indexQuantil75F = (alturaFeminina.length / 4) * 3;
	indexQuantil75F = Math.ceil(indexQuantil75F);
	var quantil75F = alturaFeminina[indexQuantil75F - 1];
	//console.log(indexQuantil75F);
	//console.log(alturaFeminina);
	//console.log(quantil75F);
/********************
	Masculino
*********************/	
	frequenciaMax = 1;
	for(var i = 0; i < vetorFrequenciaM.length; i++) {
		if(vetorFrequenciaM[i].freq > frequenciaMax) {
			frequenciaMax = vetorFrequenciaM[i].freq
		}
	}
	var modaM = '';
	for(var i = 0; i < vetorFrequenciaM.length; i++) {
		if(frequenciaMax != 1 && vetorFrequenciaM[i].freq == frequenciaMax) {
			modaM+= vetorFrequenciaM[i].dado+' ';
		}
	}
	//console.log(modaM);
	//console.log(vetorFrequenciaM);

	var minM = alturaMasculina.min();
	var maxM = alturaMasculina.max();
	var mediaM = alturaMasculina.sum() / alturaMasculina.length;
	if( (alturaMasculina.length % 2) == 0) {	// Se for par
		var index = (alturaMasculina.length / 2);
		var medianaM = (alturaMasculina[alturaMasculina.length/2 - 1] + alturaMasculina[alturaMasculina.length/2]) / 2;
	} else {	// Se for impar
		var index = ((alturaMasculina.length + 1) / 2) - 1;
		var medianaM = alturaMasculina[index];
	}
	
	/* Calcula os quantis */
	var indexQuantil25M = alturaMasculina.length / 4;
	indexQuantil25M = Math.ceil(indexQuantil25M);
	var quantil25M = alturaMasculina[indexQuantil25M - 1];
	
	//console.log(indexQuantil25M);
	//console.log(alturaMasculina);
	//console.log(quantil25M);

	var indexQuantil75M = (alturaMasculina.length / 4) * 3;
	indexQuantil75M = Math.ceil(indexQuantil75M);
	var quantil75M = alturaMasculina[indexQuantil75M - 1];
	//console.log(indexQuantil75M);
	//console.log(alturaMasculina);
	//console.log(quantil75M);
	
	/*
	if(minF < minM) {
		setResp('minGeral',minF);
	} else {
		setResp('minGeral',minM);
	}
	
	if(maxF > maxM) {
		setResp('maxGeral',maxF);
	} else {
		setResp('maxGeral',maxM);
	}
	*/
		
	/***********************************
		Insercao dos dados na tabela
	************************************/
	
	setResp('minF',roundNumber(minF,2));
	setResp('minM',roundNumber(minM,2));
	setResp('maxF',roundNumber(maxF,2));
	setResp('maxM',roundNumber(maxM,2));
	setResp('mediaF',roundNumber(mediaF,2));
	setResp('mediaM',roundNumber(mediaM,2));
	setResp('medianaF',roundNumber(medianaF,2));
	setResp('medianaM',roundNumber(medianaM,2));
	setResp('Q25F',roundNumber(quantil25F,2));
	setResp('Q25M',roundNumber(quantil25M,2));
	setResp('Q75F',roundNumber(quantil75F,2));
	setResp('Q75M',roundNumber(quantil75M,2));

}

function calculaDadosCalcado() {
	var dados = getRespSoft('tabela_principal', 'estat-dados');
	dados = eval(dados);
	
	var calcadoFeminina = new Array();
	var calcadoMasculina = new Array();
	var vetorFrequenciaF = new Array();
	var vetorFrequenciaM = new Array();

	/* Cria os vetores das calcados F e M. */
	for (var i=0; i < dados.length; i++) {
		if(dados[i].sexo == 'F') {	// Vetor Feminino
			calcadoFeminina.push(Number(dados[i].calcado));

			/* Calcula a frequencia para tirar a moda */
			var j = encontraElementoArray(dados[i].calcado, vetorFrequenciaF, compara_dados);
			if (j == -1) {
				vetorFrequenciaF.push({dado:dados[i].calcado, freq:1});
			} else {
				vetorFrequenciaF[j].freq++;
			}

		} else {	// Vetor Masculino
			calcadoMasculina.push(Number(dados[i].calcado));

			/* Calcula a frequencia para tirar a moda */
			var j = encontraElementoArray(dados[i].calcado, vetorFrequenciaM, compara_dados);
			if (j == -1) {
				vetorFrequenciaM.push({dado:dados[i].calcado, freq:1});
			} else {
				vetorFrequenciaM[j].freq++;
			}
		}
	}
	
	//var indexFrequencia = new Array();
	var frequenciaMax = 1;
	for(var i = 0; i < vetorFrequenciaF.length; i++) {
		if(vetorFrequenciaF[i].freq > frequenciaMax) {
			frequenciaMax = vetorFrequenciaF[i].freq
		}
	}
	//var modaF = new Array();
	var modaF = '';
	for(var i = 0; i < vetorFrequenciaF.length; i++) {
		if(frequenciaMax != 1 && vetorFrequenciaF[i].freq == frequenciaMax) {
			//modaF.push(vetorFrequenciaF[i].dado);
			modaF+= vetorFrequenciaF[i].dado+' ';
		}
	}
	//console.log(modaF);
	//console.log(vetorFrequenciaF);

	calcadoFeminina.sort(sortNumber);
	calcadoMasculina.sort(sortNumber);
	
	var minF = calcadoFeminina.min();
	var maxF = calcadoFeminina.max();
	var mediaF = calcadoFeminina.sum() / calcadoFeminina.length;
	if( (calcadoFeminina.length % 2) == 0) {	// Se for par
		var index = (calcadoFeminina.length/2);
		var medianaF = (calcadoFeminina[index - 1] + calcadoFeminina[index]) / 2;
	} else {	// Se for impar
		var index = ((calcadoFeminina.length + 1) / 2) - 1;
		var medianaF = calcadoFeminina[index];
	}
	/* Calcula os quantis */
	var indexQuantil25F = calcadoFeminina.length / 4;
	indexQuantil25F = Math.ceil(indexQuantil25F);
	var quantil25F = calcadoFeminina[indexQuantil25F - 1];
	
	//console.log(indexQuantil25F);
	//console.log(calcadoFeminina);
	//console.log(quantil25F);

	var indexQuantil75F = (calcadoFeminina.length / 4) * 3;
	indexQuantil75F = Math.ceil(indexQuantil75F);
	var quantil75F = calcadoFeminina[indexQuantil75F - 1];
	//console.log(indexQuantil75F);
	//console.log(calcadoFeminina);
	//console.log(quantil75F);
/********************
	Masculino
*********************/	
	frequenciaMax = 1;
	for(var i = 0; i < vetorFrequenciaM.length; i++) {
		if(vetorFrequenciaM[i].freq > frequenciaMax) {
			frequenciaMax = vetorFrequenciaM[i].freq
		}
	}
	var modaM = '';
	for(var i = 0; i < vetorFrequenciaM.length; i++) {
		if(frequenciaMax != 1 && vetorFrequenciaM[i].freq == frequenciaMax) {
			modaM+= vetorFrequenciaM[i].dado+' ';
		}
	}
	//console.log(modaM);
	//console.log(vetorFrequenciaM);

	var minM = calcadoMasculina.min();
	var maxM = calcadoMasculina.max();
	var mediaM = calcadoMasculina.sum() / calcadoMasculina.length;
	if( (calcadoMasculina.length % 2) == 0) {	// Se for par
		var index = (calcadoMasculina.length / 2);
		var medianaM = (calcadoMasculina[calcadoMasculina.length/2 - 1] + calcadoMasculina[calcadoMasculina.length/2]) / 2;
	} else {	// Se for impar
		var index = ((calcadoMasculina.length + 1) / 2) - 1;
		var medianaM = calcadoMasculina[index];
	}
	
	/* Calcula os quantis */
	var indexQuantil25M = calcadoMasculina.length / 4;
	indexQuantil25M = Math.ceil(indexQuantil25M);
	var quantil25M = calcadoMasculina[indexQuantil25M - 1];
	
	//console.log(indexQuantil25M);
	//console.log(calcadoMasculina);
	//console.log(quantil25M);

	var indexQuantil75M = (calcadoMasculina.length / 4) * 3;
	indexQuantil75M = Math.ceil(indexQuantil75M);
	var quantil75M = calcadoMasculina[indexQuantil75M - 1];
	//console.log(indexQuantil75M);
	//console.log(calcadoMasculina);
	//console.log(quantil75M);
	
	/*
	if(minF < minM) {
		setResp('minGeral',minF);
	} else {
		setResp('minGeral',minM);
	}
	
	if(maxF > maxM) {
		setResp('maxGeral',maxF);
	} else {
		setResp('maxGeral',maxM);
	}
	*/
		
	/***********************************
		Insercao dos dados na tabela
	************************************/

	setResp('minCalcadoF',roundNumber(minF,2));
	setResp('minCalcadoM',roundNumber(minM,2));
	setResp('maxCalcadoF',roundNumber(maxF,2));
	setResp('maxCalcadoM',roundNumber(maxM,2));
	setResp('mediaCalcadoF',roundNumber(mediaF,2));
	setResp('mediaCalcadoM',roundNumber(mediaM,2));
	setResp('medianaCalcadoF',roundNumber(medianaF,2));
	setResp('medianaCalcadoM',roundNumber(medianaM,2));
	setResp('Q25CalcadoF',roundNumber(quantil25F,2));
	setResp('Q25CalcadoM',roundNumber(quantil25M,2));
	setResp('Q75CalcadoF',roundNumber(quantil75F,2));
	setResp('Q75CalcadoM',roundNumber(quantil75M,2));
	
}

function initA1_P3() {
	$('minF').update(getResp('minF'));
	$('minM').update(getResp('minM'));
	$('maxF').update(getResp('maxF'));
	$('maxM').update(getResp('maxM'));
	$('mediaF').update(getResp('mediaF'));
	$('mediaM').update(getResp('mediaM'));
	$('medianaF').update(getResp('medianaF'));
	$('medianaM').update(getResp('medianaM'));
	$('Q25F').update(getResp('Q25F'));
	$('Q25M').update(getResp('Q25M'));
	$('Q75F').update(getResp('Q75F'));
	$('Q75M').update(getResp('Q75M'));

	$('minCalcadoF').update(getResp('minCalcadoF'));
	$('minCalcadoM').update(getResp('minCalcadoM'));
	$('maxCalcadoF').update(getResp('maxCalcadoF'));
	$('maxCalcadoM').update(getResp('maxCalcadoM'));
	$('mediaCalcadoF').update(getResp('mediaCalcadoF'));
	$('mediaCalcadoM').update(getResp('mediaCalcadoM'));
	$('medianaCalcadoF').update(getResp('medianaCalcadoF'));
	$('medianaCalcadoM').update(getResp('medianaCalcadoM'));
	$('Q25CalcadoF').update(getResp('Q25CalcadoF'));
	$('Q25CalcadoM').update(getResp('Q25CalcadoM'));
	$('Q75CalcadoF').update(getResp('Q75CalcadoF'));
	$('Q75CalcadoM').update(getResp('Q75CalcadoM'));
}

function calculaDadosCalcadoAltura() {
	var dados = getRespSoft('tabela_principal', 'estat-dados');
	dados = eval(dados);

	var vetorCalcado = new Array();
	var vetorAltura = new Array();
	
	var somaCalcado = 0;
	var somaAltura = 0;
	
	for(var i = 0; i < dados.length; i++) {
		somaCalcado+= dados[i].calcado;
		vetorCalcado.push(dados[i].calcado);
		somaAltura+= dados[i].altura;
		vetorAltura.push(dados[i].altura);
	}
	
	vetorCalcado.sort(sortNumber);	// ordena o vetor
	vetorAltura.sort(sortNumber);	// ordena o vetor

	var minCalcado = vetorCalcado[0];
	setResp('minCalcado',minCalcado);
	var maxCalcado = vetorCalcado[dados.length-1];
	setResp('maxCalcado',maxCalcado);
	
	var minAltura = vetorAltura[0];
	setResp('minAltura',minAltura);
	var maxAltura = vetorAltura[dados.length-1];
	setResp('maxAltura',maxAltura);

	
	var mediaCalcado = somaCalcado / vetorCalcado.length;
	var mediaAltura = somaAltura / vetorAltura.length;
	
	if((vetorCalcado.length % 2) == 0) {
		var index = (vetorCalcado.length / 2);
		var medianaCalcado = (vetorCalcado[index - 1] + vetorCalcado[index]) / 2;
	} else {
		var index = ((vetorCalcado.length + 1) / 2) - 1;
		var medianaCalcado = vetorCalcado[index];
	}
	
	if((vetorAltura.length % 2) == 0) {
		var index = (vetorAltura.length / 2);
		var medianaAltura = (vetorAltura[index - 1] + vetorAltura[index]) / 2;
	} else {
		var index = ((vetorAltura.length + 1) / 2) - 1;
		var medianaAltura = vetorAltura[index];
	}
	
	var vetorCalcadoFreq = getResp('vetorCalcado');
	//console.log(vetorCalcadoFreq);
	vetorCalcadoFreq = eval(vetorCalcadoFreq);
	var vetorAlturaFreq = getResp('vetorAltura');
	//console.log(vetorAlturaFreq);
	vetorAlturaFreq = eval(vetorAlturaFreq);

	
	//Moda do calcado
	var frequenciaMax = 1;
	for(var i = 0; i < vetorCalcadoFreq.length; i++) {
			//console.log(vetorCalcadoFreq[i].freq);
		if(vetorCalcadoFreq[i].freq > frequenciaMax) {
			frequenciaMax = vetorCalcadoFreq[i].freq;
		}
	}
	//console.log(frequenciaMax);
	var modaCalcado = '';
	for(var i = 0; i < vetorCalcadoFreq.length; i++) {
		if(frequenciaMax != 1 && vetorCalcadoFreq[i].freq == frequenciaMax) {
			modaCalcado+= vetorCalcadoFreq[i].dado+' ';
		}
	}
	//console.log(modaCalcado);
	
	//Moda da altura
	var frequenciaMax = 1;
	for(var i = 0; i < vetorAlturaFreq.length; i++) {
		if(vetorAlturaFreq[i].freq > frequenciaMax) {
			frequenciaMax = vetorAlturaFreq[i].freq;
		}
	}
	var modaAltura = '';
	for(var i = 0; i < vetorAlturaFreq.length; i++) {
		if(frequenciaMax != 1 && vetorAlturaFreq[i].freq == frequenciaMax) {
			modaAltura+= vetorAlturaFreq[i].dado+' ';
		}
	}

	var variancia = 0;
	var diferenca;
	for(var i = 0; i < vetorCalcado.length; i++) {
		diferenca = vetorCalcado[i] - mediaCalcado;
		variancia+= Math.pow(diferenca,2);
	}
	variancia = variancia / (vetorCalcado.length - 1);
	var desvioCalcado = Math.sqrt(variancia);
	desvioCalcado = arredonda(desvioCalcado, 3);
	
	variancia = 0;
	for(var i = 0; i < vetorAltura.length; i++) {
		diferenca = vetorAltura[i] - mediaAltura;
		variancia+= Math.pow(diferenca,2);
	}
	variancia = variancia / (vetorAltura.length - 1);
	var desvioAltura = Math.sqrt(variancia);
	desvioAltura = arredonda(desvioAltura, 3);
	
	/***********************************
		Insercao dos dados na tabela
	************************************/
	$('mediaCalcado').update(arredonda(mediaCalcado,2));
	$('mediaAltura').update(arredonda(mediaAltura,2));
	$('medianaCalcado').update(arredonda(medianaCalcado,2));
	$('medianaAltura').update(arredonda(medianaAltura,2));
	$('desvioPadraoCalcado').update(arredonda(desvioCalcado),2);
	$('desvioPadraoAltura').update(arredonda(desvioAltura,2));

	setResp('mediaCalcado',arredonda(mediaCalcado,2));
	setResp('mediaAltura',arredonda(mediaAltura,2));
	setResp('medianaCalcado',arredonda(medianaCalcado,2));
	setResp('medianaAltura',arredonda(medianaAltura,2));
	setResp('desvioPadraoCalcado',arredonda(desvioCalcado,2));
	setResp('desvioPadraoAltura',arredonda(desvioAltura,2));
		
}

function montaVetoresDados() {
	var vetorDados = getRespSoft('tabela_principal', 'estat-dados');

	vetorSexo = new Array();
	vetorCalcado = new Array();
	vetorAltura = new Array();

	//Um vetor de dados;
	vetorDados = eval(vetorDados);
	for (var i=0; i < vetorDados.length; i++) {
		//Para sexo
		var j=encontraElementoArray(vetorDados[i].sexo, vetorSexo, compara_dados);
		if (j == -1) {
			vetorSexo.push({dado:vetorDados[i].sexo, freq:1});
		} else {
			vetorSexo[j].freq++;
		}
				
		//Para numero de calcados
		var j=encontraElementoArray(vetorDados[i].calcado, vetorCalcado, compara_dados);
		if (j == -1) {
			vetorCalcado.push({dado:vetorDados[i].calcado, freq:1});
		} else {
			vetorCalcado[j].freq++;
		}
		
		
		//Para altura
		var j=encontraElementoArray(vetorDados[i].altura, vetorAltura, compara_dados);
		if (j == -1) {
			vetorAltura.push({dado:vetorDados[i].altura, freq:1});
		} else {
			vetorAltura[j].freq++;
		}
	}
	
	if (vetorSexo[0].freq == vetorDados.length) {
		var sex="M";
		if (vetorSexo[0].dado == "M"){
			sex = "F";
		}		
		vetorSexo.push({dado:sex, freq:0});
	}
	
	
	// Cria as barras que nao apresentaram dados
	vetorCalcado.sort(ordenaDados);
	var min_calcado = vetorCalcado[0].dado;
	var max_calcado = vetorCalcado[vetorCalcado.length-1].dado;
	
	var k = min_calcado;
	for (var k=min_calcado; k <=max_calcado; k++) {
		if (encontraElementoArray(k, vetorCalcado, compara_dados) == -1) {
			vetorCalcado.push({dado:k, freq:0});
		}
	}	
	
	vetorCalcado.sort(ordenaDados);
	vetorAltura.sort(ordenaDados);
	
	//Salva os vetores de forma crua
	setResp('vetorCalcado', vetorCalcado.toJSON());
	setResp('vetorAltura', vetorAltura.toJSON());
	setResp('vetorSexo', vetorSexo.toJSON());
	
	//Salva os vetores de forma a se inserir nos graficos
	montaDadosParaGrafico(vetorSexo, vetorCalcado, vetorAltura);
}

// Cria um vetor bi-dimensional com titulos em array[0] e frequencias em array[1]
function montaDadosParaGrafico(vetorS, vetorC, vetorA) {
	var dadosSexo = new Array();
	var freqSexo = new Array();
	
	var dadosAltura = new Array();
	var freqAltura = new Array();
	
	var dadosCalcado = new Array();
	var freqCalcado = new Array();
	
	for (var i=0; i < vetorS.length; i++) {
		dadosSexo.push(vetorS[i].dado);
		freqSexo.push(vetorS[i].freq);
	}
	
	for (var i=0; i < vetorA.length; i++) {
		dadosAltura.push(vetorA[i].dado);
		freqAltura.push(vetorA[i].freq);
	}
	
	for (var i=0; i < vetorC.length; i++) {
		dadosCalcado.push(vetorC[i].dado);
		freqCalcado.push(vetorC[i].freq);
	}
	
	var aux = new Array();
	
	aux = [ dadosSexo, freqSexo ];	
	setResp('dados_sexo_grafico', aux.toJSON());

	aux = [ dadosAltura, freqAltura ];	
	setResp('dados_altura_grafico', aux.toJSON());

	aux = [ dadosCalcado, freqCalcado ];	
	setResp('dados_calcado_grafico', aux.toJSON());
	
}

/**
	Funcao que valida a tabela
	return 	1 - Menos de 10 dados validos
			2 - Falta um dos generos
			3 - Tabela valida
			4 - Tabela sem dados
*/
function validaTabela() {
	var dados = getRespSoft('tabela_principal', 'estat-dados');
	if(dados=='') {
		return 4;
	}
	dados = eval(dados);

	var feminino = false;
	var masculino = false;
	
	if(dados.length < 10) {
		return 1;
	}

	/* Cria os vetores das calcados F e M. */
	for (var i=0; i < dados.length; i++) {
		if(dados[i].sexo == 'F') {
			feminino = true;
		} else {
			masculino = true;
		}
	}
	
	if(!feminino || !masculino) {
		return 2;
	}
	
	return 3;
	
}

/******************************
	FUNCOES AUXILIARES
******************************/
//Funcao que irah como parametro para o sort().
function sortNumber(a,b) {
	return a - b;
}

// a:item do vetor, b: parametro de comparacao
function compara_dados(a,b) {
	return (a.dado == b);
}

function ordenaDados(a,b) {
	var i,j;
	
	i = Number(a.dado);
	j = Number(b.dado);
	
	return (i-j);
}
