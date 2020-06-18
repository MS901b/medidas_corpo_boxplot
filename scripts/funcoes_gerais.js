/*********************************************
			SALVA LOCAL
*********************************************/

function getFlashMovie(movieName) {
    var isIE = navigator.appName.indexOf("Microsoft") != -1;
    return (isIE) ? window[movieName] : document[movieName];

}

function getResp(id) {
    return ($('SalvaLocal').Pega(nomeSoft, id) == 'undefined' ? '' : $('SalvaLocal').Pega(nomeSoft, id));
}

function getRespSoft(id, soft) {
    return ($('SalvaLocal').Pega(soft, id) == 'undefined' ? '' : $('SalvaLocal').Pega(soft, id));
}

function setResp(id, valor) {
    $('SalvaLocal').Salva(nomeSoft, id, valor);
}

function setRespSoft(id, valor, soft) {
    $('SalvaLocal').Salva(soft, id, valor);
}

function apagaTodasResp() {
    return ($('SalvaLocal').ApagaTudo(nomeSoft));
}


// Retorna um valor nao fracionario de um numero
function processaNumero(respStr) {
    var respStrSplited = respStr.split('/');

    var respostaValida = true;
    if (respStrSplited.length > 1) {

        for (var i = 0; i < respStrSplited.length; i++) {
            respStrSplited[i] = processaNumero(respStrSplited[i]);
            if (respStrSplited[i] == null) respostaValida = false;
            if (respostaValida) {
                if (i == 0) {
                    var resp = respStrSplited[i];
                } else {
                    resp = resp / respStrSplited[i];
                }

            }
        }
        if (respostaValida) return resp;
        else return null;
    } else {
        if (respStr.indexOf('%') > -1) {
            respStr = respStr.replace(/%/, '');
            var porcento = true;
        } else var procento = false;

        respStr = respStr.replace(/,/g, '.');
        if (!isNaN(respStr) && (respStr.length > 0)) {
            if (porcento) respStr = respStr / 100;
        } else respStr = null;
        return respStr;
    }

}



// Funcao de controle do evento de arraste do ponto de controle (linha vertical)
function updateListenerPontoControleSemPoly(objName) {
    /*
    var applet = document.ggbApplet;
    var xCoord = applet.getXCoord(objName);
    if (yCoordPontoControle==null) yCoordPontoControle = applet.getYCoord(objName);	

    applet.unregisterObjectUpdateListener('PontoControle');
    if (xCoord > (eixoX[1]-1)) applet.setCoords(objName, (eixoX[1]-1),yCoordPontoControle);
    if (xCoord < (eixoX[0]+1)) applet.setCoords(objName, (eixoX[0]+1),yCoordPontoControle);

    var novoControle=0;
    for (var i=1;i<coordsTopo.length;i++) 
    {
    	if (xCoord >= coordsTopo[i][0]) novoControle=i;
    }

    	if (novoControle!=controleXatual) 
    {
    	controleXatual = novoControle;
    }
    applet.registerObjectUpdateListener('PontoControle','updateListenerPontoControleSemPoly');
    */
    var applet = document.ggbApplet;
    var xCoord = applet.getXcoord(objName);
    if (yCoordPontoControle == null) yCoordPontoControle = applet.getYcoord(objName);

    applet.setVisible('polyCover', false);

    applet.unregisterObjectUpdateListener('PontoControle');
    if (xCoord > (eixoX[1] - 1)) applet.setCoords(objName, (eixoX[1] - 1), yCoordPontoControle);
    if (xCoord < (eixoX[0] + 1)) applet.setCoords(objName, (eixoX[0] + 1), yCoordPontoControle);

    var novoControle = 0;
    for (var i = 1; i < coordsTopo.length; i++) {
        if (xCoord >= coordsTopo[i][0]) novoControle = i;
    }

    if (novoControle != controleXatual) {
        controleXatual = novoControle;
        geraPoligonoCobrindo_invisivel();
    }
    applet.setVisible('polyCover', false);
    applet.registerObjectUpdateListener('PontoControle', 'updateListenerPontoControle');


}

// O poligono é criado com base nos pontos dos topos da barras.
function geraPoligonoCobrindo_invisivel() {

    var applet = document.ggbApplet;

    var pontosPoligono = new Array();
    for (var i = 0; i < controleXatual + 1; i++) {
        pontosPoligono.push(pontosTopo[i * 2]);
        pontosPoligono.push(pontosTopo[(i * 2) + 1]);
    }

    pontosPoligono.pop();
    pontosPoligono.push('PontoTopoValido');
    pontosPoligono.push('PontoBaseValido');
    pontosPoligono.push('(0,0)');

    applet.setOnTheFlyPointCreationActive(false);
    applet.deleteObject('polyCover');
    applet.evalCommand('polyCover=Polygon[' + pontosPoligono.concat() + ']');
    applet.setFilling('polyCover', 0);
    applet.setVisible('polyCover', false);
    applet.evalCommand('polyCoverLabel=Text[polyCover/(10/' + coordsTopo.length + '),(x(PontoControle)-0.8,1.025)]');
    applet.setFixed('polyCover', true);
    applet.setFixed('polyCoverLabel', true);
    applet.setOnTheFlyPointCreationActive(true);
}

// Marca uma determinada reta de medidas de dispersao
/*
function applet_modoMostrarMedidas(mostra, vetor, num){
	var applet = document.ggbApplet;
	
	var posicionamento = encontraPosicaoMedida(vetor, num);
	//console.log(posicionamento);
	
	if (mostra == true) {
	
		applet.setFixed('retaMedida', false);	
		applet.evalCommand('retaMedida: x = ' + posicionamento);
		applet.setLineStyle('retaMedida', 2);
		applet.setLineThickness('retaMedida', 3);
		applet.setFixed('retaMedida', true);	
		
	} else {
		applet.delete('retaMedida');
	}
}
*/
// Encontra a posicao da reta no histograma
function encontraPosicaoMedida(vetor, valor) {
    var numElementos = Number(getResp('tabela_num_elementos'));
    var encontrado = false;
    var posicao = 0;
    var resultado = 0;
    var relativoAnterior = 0;

    var soma = 0;
    for (var i = 0;
        ((i < vetor.length) && !encontrado); i++) {
        if (((soma + vetor[i]) / numElementos) >= valor) {
            posicao = i;
            relativoAnterior = soma / numElementos;
            encontrado = true;
        } else {
            soma += vetor[i];
        }
    }

    //console.log(posicao + " + " + (valor - relativoAnterior)/(vetor[posicao]/numElementos) + " %");
    var tamanhoBarra = 10 / vetor.length;
    resultado = posicao * tamanhoBarra + tamanhoBarra * ((valor - relativoAnterior) / (vetor[posicao] / numElementos));

    return resultado;

}

//Encontra um elemento num array, dado uma funcao de comparacao
function encontraElementoArray(elemento, vetor, funcao_comp) {

    for (var i = 0; i < vetor.length; i++) {
        /*
        if (funcao_comp(vetor[i],elemento)) {
        	return i;
        }*/
        if (vetor[i].dado == elemento) {
            return i;
        }
    }
    return -1;
}

// Mostra o segmento movel sem o poligono mas com as marcacoes de estatistica
function applet_modoSemPoligono(liga) {
    var applet = document.ggbApplet;

    if (liga == true) {
        applet.unregisterObjectUpdateListener('PontoControle');
        applet.setVisible('polyCover', false);
        applet.setVisible('polyCoverLabel', true);
        applet.registerObjectUpdateListener('PontoControle', 'updateListenerPontoControleSemPoly');
    } else {
        applet.unregisterObjectUpdateListener('PontoControle');
        applet.setVisible('polyCover', true);
        applet.setVisible('polyCoverLabel', true);
        applet.registerObjectUpdateListener('PontoControle', 'updateListenerPontoControle');

    }
}

// Mostra o segmento movel sem o poligono e sem o label
function applet_modoSegmentoMovel(liga) {
    var applet = document.ggbApplet;

    if (liga == true) {
        applet.unregisterObjectUpdateListener('PontoControle');
        applet.setVisible('polyCover', false);
        applet.setVisible('polyCoverLabel', false);
        applet.registerObjectUpdateListener('PontoControle', 'updateListenerPontoControleSemPoly');
    } else {
        applet.unregisterObjectUpdateListener('PontoControle');
        applet.setVisible('polyCover', true);
        applet.setVisible('polyCoverLabel', true);
        applet.registerObjectUpdateListener('PontoControle', 'updateListenerPontoControle');
    }
}

/**
	Arredonda o valor para n casas decimais
*/
function arredonda(valor, n) {
    valor = valor * Math.pow(10, n);
    valor = Math.round(valor);
    valor = valor / Math.pow(10, n);
    return valor;
}

/**
 * Codigo pego do jogo do maximo.
 */
function setAtividade(nome, estado, forcar) {
    if (forcar == undefined) {
        forcar = false;
    }

    if (!forcar) {
        if ((getResp(nome) < estado) || getResp(nome) == '') {
            setResp(nome, estado);
        }
    } else {
        setResp(nome, estado);
    }
}

function valida(valor) {
    valor = valor.replace('.', ',');
    if ((valor == null) || (valor == 'undefined')) {
        return '';
    }
    return valor;
}