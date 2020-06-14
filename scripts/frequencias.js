var _dadosLabelValue = -1;

//Varivaveis globais, valores não permanentes
var eixoX = [0, 10];
var eixoY = [0, 1];
var margemY = 0;
var controleXatual = 0;
var coordsTopo = new Array();
var pontosTopo = new Array();
var yCoordPontoControle = null;

// Configurações 
var distanciaLabelsEscolhida = 0.05;
var raioPizza = 0.5;
var alturaFonte = 18;
var pizza_deslocamentoLegenda = 1.1;
var pizzaFilling = 1;
var barraFilling = 1;
var barrasLarguraMaxima = 1;
var exibeValorDadosHistograma = false;

var cores = new Array();
cores.push([185, 42, 48]);
cores.push([182, 213, 84]);
cores.push([93, 127, 173]);
cores.push([255, 218, 59]);
cores.push([242, 97, 110]);
cores.push([255, 247, 154]);
cores.push([197, 77, 87]);
cores.push([224, 67, 96]);
cores.push([231, 163, 160]);
cores.push([180, 209, 101]);
cores.push([175, 251, 163]);
cores.push([146, 186, 90]);
cores.push([255, 204, 17]);
cores.push([8, 182, 172]);
cores.push([240, 115, 35]);
cores.push([176, 215, 126]);
cores.push([100, 96, 172]);
cores.push([238, 28, 37]);
cores.push([247, 148, 31]);
cores.push([255, 243, 1]);
cores.push([58, 181, 75]);


Array.prototype.sum = function() {
    var s = 0;
    for (var i = 0; i < this.length; i++) {
        s += (isNaN(this[i])) ? 0 : parseFloat(this[i]);
    }
    return s;
};

Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++)
        if (parseFloat(this[i]) > max) max = parseFloat(this[i]);
    return max;
}
Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++)
        if (parseFloat(this[i]) < min) min = parseFloat(this[i]);
    return min;
}

/*
function ggbOnInit(){

	var applet = document.ggbApplet;
	console.log("aaaaaaaaa");
}
*/

// Grafico tipo Pizza (setores)
function pizza(labels, valores, totalDados) {

    if (valores.length == 0) return;
    var applet = document.ggbApplet;
    applet.unregisterObjectUpdateListener('PontoControle');

    applet.setRepaintingActive(false);
    applet.reset();
    applet.setAxesVisible(false, false)
    applet.setGridVisible(false);

    var appletWidth = Number(getAppletWidth());
    var appletHeight = Number(getAppletHeight());

    // Desloamento no eixo X. Gráifo fica sempre centrado no (0,0)
    var deslocamentoX = 0.5;

    // Escalas dos eixos X e Y. Baseados na altura e larguda do applet, para garantir que fique 1:1 e o gráfico, portanto, circular.
    if (appletWidth >= appletHeight) {
        var razao = appletWidth / appletHeight;
        eixoX = [-1 * razao + deslocamentoX, 1 * razao + deslocamentoX];
        eixoY = [-1, 1];
    } else {
        var razao = appletHeight / appletWidth;
        eixoX = [-1 + deslocamentoX, 1 + deslocamentoX];
        eixoY = [-1 * razao, 1 * razao];

    };
    applet.setCoordSystem(eixoX[0], eixoX[1], eixoY[0], eixoY[1]);
    var alturaApplet = appletHeight;
    var alturaGgb = eixoY[1] - eixoY[0];
    var relacaoAltura = relacaoAltura = alturaGgb / alturaApplet;


    // Criação do array com as cores a serem utilziadas
    /* TODO: Colocar cores pré-definidas e não geradas aleatoriamente.
    var cores = Array(valores.length);
    for (var i=0;i<valores.length;i++) {
    	cores[i] = [ (Math.ceil(Math.random()*256)-1),(Math.ceil(Math.random()*256)-1),(Math.ceil(Math.random()*256)-1)];
    }
    */

    var soma = valores.sum();

    // Inicia contrução
    applet.evalCommand('Centro=(0,0)');
    applet.evalCommand('P0=(' + raioPizza + ',0)');
    applet.setVisible('Centro', false);
    applet.setVisible('P0', false);

    var angulo = 0;
    var anguloanterior = 0;

    if (valores.length > 1) {
        // Caso tenha MAIS que um valor
        for (var i = 1; i <= valores.length; i++) {

            // Criação setor ciruclar
            angulo_anterior = angulo;
            angulo += valores[i - 1] / soma;
            applet.evalCommand('P' + i + '=(' + raioPizza + ';' + angulo + '*2*Pi)');
            applet.setFixed('P' + i, true);
            applet.setVisible('P' + i, false);
            applet.evalCommand('C' + i + '=CircularSector[Centro,P' + (i - 1) + ',P' + i + ']');
            applet.setFixed('C' + i, true);
            applet.setLayer('C' + i, i);
            applet.setFilling('C' + i, pizzaFilling);
            applet.setColor('C' + i, cores[(i - 1) % cores.length][0], cores[(i - 1) % cores.length][1], cores[(i - 1) % cores.length][2]);

            // Label com valor ao redor do circulo
            // Usando o tamanho estimado do label para tentar manter uma distância constante do circulo.	

            var angulo_label = angulo_anterior + (angulo - angulo_anterior) / 2;
            var label = roundNumber(100 * valores[i - 1] / soma, 2) + "%"
            var tamanhoLabel = larguraLabel(label);

            var xCord = Math.cos(angulo_label * 2 * Math.PI) * (raioPizza + distanciaLabelsEscolhida * 2.5);
            var yCord = Math.sin(angulo_label * 2 * Math.PI) * (raioPizza + distanciaLabelsEscolhida * 2.5);
            xCord += -tamanhoLabel / 2 + Math.cos(angulo_label * 2 * Math.PI) * tamanhoLabel / 2;
            yCord += -alturaFonte / 2 * relacaoAltura; + Math.sin(angulo_label * 2 * Math.PI) * alturaFonte / 2 * relacaoAltura;
            xCord = roundNumber(xCord, 10);
            yCord = roundNumber(yCord, 10);
            applet.evalCommand('dado' + i + 'Label=Text["' + label + '",(' + xCord + ',' + yCord + ')]');
            applet.setFixed('dado' + i + 'Label', true);

            if (label != "0%")
                applet.setVisible('dado' + i + 'Label', true)
            else
                applet.setVisible('dado' + i + 'Label', false);

            applet.setColor('dado' + i + 'Label', 0, 150, 0);

        }
    } else {
        // Caso só tenha um valor. Cria circulo.
        applet.evalCommand('C1=Circle[(0,0),' + raioPizza + ']');
        applet.setFixed('C1', true);
        applet.setColor('C1', cores[0][0], cores[0][1], cores[0][2]);
        applet.setFilling('C1', pizzaFilling);

        var xCord = (raioPizza + distanciaLabelsEscolhida * 2.5);
        var yCord = 0;
        var label = "100%";
        applet.evalCommand('dado1Label=Text["' + label + '",(' + xCord + ',' + yCord + ')]');
        applet.setFixed('dado1Label', true);
        //applet.setColor('dado1Label',cores[0][0],cores[0][1],cores[0][2]);
        applet.setColor('dado1Label', 0, 150, 0);
    }

    // Legenda
    var tamanhoQuadradoLegenda = 0.05;
    for (var i = 1; i <= valores.length; i++) {
        var xCord = pizza_deslocamentoLegenda;
        var yCord = (alturaFonte + 5) * relacaoAltura * (valores.length / 2 - i);
        applet.evalCommand('dado' + i + 'PolyLegenda=Polygon[(' +
            (xCord) + ',' + (yCord) + '),(' +
            (xCord) + ',' + (yCord + tamanhoQuadradoLegenda) + '),(' +
            (xCord + tamanhoQuadradoLegenda * 2) + ',' + (yCord + tamanhoQuadradoLegenda) + '),(' +
            (xCord + tamanhoQuadradoLegenda * 2) + ',' + (yCord) + ')]');
        applet.setColor('dado' + i + 'PolyLegenda', cores[(i - 1) % cores.length][0], cores[(i - 1) % cores.length][1], cores[(i - 1) % cores.length][2]);
        //applet.setColor('dado'+i+'PolyLegenda',cores[i-1][0],cores[i-1][1],cores[i-1][2]);
        applet.setFixed('dado' + i + 'PolyLegenda', true);
        applet.setFilling('dado' + i + 'PolyLegenda', pizzaFilling);
        applet.evalCommand('dado' + i + 'LabelLegenda=Text["' + labels[i - 1] + '",(' + (xCord + tamanhoQuadradoLegenda * 2 + 0.04) + ',' + (yCord + 0.007) + ')]');
        applet.setFixed('dado' + i + 'LabelLegenda', true);
    }

    // Total de dados
    applet.evalCommand('labelTotalDados=Text["Total de dados: ' + totalDados + '",(' + (eixoX[0] * 0.92) + ',' + (eixoY[0] * 0.92) + ')]');

    applet.setRepaintingActive(true);
}

// Função de histograma
function histograma(labels, valores) {

    if (valores.length == 0) return;

    // Copia dos valores originais caso sejam alterados
    // (Javascript copia por referencia se usar apenas =)
    var valoresOriginais = valores.slice();

    var applet = document.ggbApplet;
    applet.unregisterObjectUpdateListener('PontoControle');

    // para fazer normalizado
    var soma = valores.sum();
    for (var i = 0; i < valores.length; i++) {
        valores[i] = valores[i] / soma;
    }

    eixoY[0] = 0;
    eixoY[1] = 1;

    // para fazer com eixo x em valores originais, recalcular distancias 
    //eixoY[0]=0;
    //eixoY[1]=valores.max();

    var margemY = (eixoY[1] - eixoY[0]) / 10;
    var distanciaLabels = distanciaLabelsEscolhida * (eixoY[1] - eixoY[0]);
    applet.setRepaintingActive(false);
    applet.reset();
    controleXatual = 0;

    applet.setAxesVisible(true, true)

    // Define valores dos eixos e inicializa applets e valores
    eixoX[0] = -1;
    eixoX[1] = 11;


    /*eixoX[0] = -1;
    eixoX[1] = 11;
    */
    mudarEscala(eixoX[0], eixoX[1], eixoY[0] - margemY, eixoY[1] + margemY);
    //applet.setCoordSystem(eixoX[0],eixoX[1],eixoY[0]-margemY,eixoY[1]+margemY);

    /*
    applet.evalCommand('coord0=0');
    applet.evalCommand('linhaeixoX=Ray[(coord0,coord0),(1,0)]');
    applet.setFixed('linhaeixoX',true);
    applet.setLabelVisible('linhaeixoX',false);
    applet.setFixed('linhaeixoX',false);
    applet.setLayer('linhaeixoX', 9);
    */
    var deltaX = ((eixoX[1] - eixoX[0]) - 2) / valores.length;

    pontosTopo = new Array();
    coordsTopo = new Array();
    var segmentosTopo = new Array();

    applet.setOnTheFlyPointCreationActive(false);

    // Criação das barras
    for (var i = 0; i < valores.length; i++) {

        // pontos usado para a criação local das barras
        // coordsTopo usado pela rotina de mover a barra do histograma (global)
        var pontos = new Array();
        coordsTopo.push([i * deltaX, valores[i]]);


        pontos.push([i * deltaX, valores[i]]);
        pontos.push([(i + 1) * deltaX, valores[i]]);
        pontos.push([(i + 1) * deltaX, 0]);
        pontos.push([i * deltaX, 0]);

        var nomesPontos = new Array();
        // Cria os pontos das barras e as linhas divisórias no eixo X

        for (var k = 0; k < pontos.length; k++) {
            var nome = 'Dado' + i + 'P_' + k;

            if (k <= 1) pontosTopo.push(nome);
            nomesPontos.push(nome);
            applet.evalCommand(nome + '=(' + pontos[k][0] + ',' + pontos[k][1] + ')');
            applet.setLabelVisible(nome, false);
            applet.setVisible(nome, false);
            if (k == 2) applet.evalCommand('linhaDivisoria' + i + '=Segment[' + nome + ',(x(' + nome + '),' + (distanciaLabels * -1) / 2 + ')]');
        }


        // Label dos eixos		
        var pontoMedio = ((i * deltaX) + ((i + 1) * deltaX)) / 2;
        var tamanhoLabel = 0;
        var label = labels[i];
        tamanhoLabel = larguraLabel(label);
        applet.evalCommand('dado' + i + 'Label=Text["' + label + '",(' + (pontoMedio - tamanhoLabel / 2) + ',' + (distanciaLabels * -1) + ')]');
        applet.setFixed('dado' + i + 'Label', true);

        //Label com valor no topo
        var tamanhoLabelTopo = 0;
        var labelTopo = valoresOriginais[i].toString();
        tamanhoLabelTopo = larguraLabel(labelTopo);
        applet.evalCommand('dado' + i + 'LabelTopo=Text["' + labelTopo + '",(' + (pontoMedio - tamanhoLabelTopo / 2) + ',y(' + nomesPontos[0] + ')+' + distanciaLabels / 2 + ')]');
        applet.setColor('dado' + i + 'LabelTopo', 0, 150, 0);
        applet.setFixed('dado' + i + 'LabelTopo', true);

        // Barras
        applet.deleteObject('dado' + i + 'Poly');
        applet.evalCommand('dado' + i + 'Poly=Polygon[' + nomesPontos[0] + ',' + nomesPontos[1] + ',' + nomesPontos[2] + ',' + nomesPontos[3] + ']');
        //FFB47F
        applet.setColor('dado' + i + 'Poly', 255, 180, 127)
        applet.setFilling('dado' + i + 'Poly', 0.8);
        applet.setFixed('dado' + i + 'Poly', true);
        applet.setLayer('dado' + i + 'Poly', 3);



        for (var k = 0; k < pontos.length; k++) {
            var nome = 'dado' + i + 'p_' + k;
            if (k == 0) segmentosTopo.push(nome);
            applet.setLayer(nome, 2);
            applet.setLabelVisible(nome, false);
        }

    }

    //Contruçãoo da linha vertical móvel
    applet.evalCommand('listasegmentos={' + segmentosTopo.concat() + '}');

    applet.evalCommand('linhareferencia=Line[(0,' + (eixoY[1] + 0.05) + '),Vector[(1,0)]]');
    applet.setVisible('linhareferencia', false);

    applet.evalCommand('PontoControle=Point[linhareferencia]');
    applet.setLabelVisible('PontoControle', false);

    applet.evalCommand('a=PerpendicularLine[PontoControle, xAxis]');
    applet.setLabelVisible('PontoTopo', false);
    applet.evalCommand('PontoTopo=Element[RemoveUndefined[Sequence[Intersect[a,Element[listasegmentos,i]],i,0,Length[listasegmentos]]],1]');
    applet.setVisible('PontoTopo', false);
    applet.evalCommand('PontoTopoValido=If[IsDefined[PontoTopo], PontoTopo, 0]');
    applet.setVisible('PontoTopoValido', false);
    applet.evalCommand('PontoBaseValido=(x(PontoTopoValido),0)');
    applet.setVisible('PontoBaseValido', false);


    applet.registerObjectUpdateListener('PontoControle', 'updateListenerPontoControle');


    applet.setOnTheFlyPointCreationActive(true);

    geraPoligonoCobrindo();
    applet.setRepaintingActive(true);

}

// Função para gerar o poligono cobrindo o histograma, de acordo com a movimentaÃ§Ã£o da barra vertical.
// O poligono é criado com base nos pontos dos topos da barras.
function geraPoligonoCobrindo() {

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
    applet.evalCommand('polyCoverLabel=Text[polyCover/(10/' + coordsTopo.length + '),(x(PontoControle)-0.8,1.025)]');
    applet.evalCommand('polyCoverLabelValue=polyCover/(10/' + coordsTopo.length + ')');

    applet.setFixed('polyCover', true);
    applet.setColor('polyCover', 255, 0, 0)
    applet.setFilling('polyCover', 1);
    applet.setFixed('polyCoverLabel', true);
    applet.setOnTheFlyPointCreationActive(true);
}

// Funcao de controle do evento de arraste do ponto de controle (linha vertical)
function updateListenerPontoControle(objName) {
    var applet = document.ggbApplet;
    var xCoord = applet.getXcoord(objName);
    var yCoord = applet.getYcoord(objName);

    if (yCoordPontoControle == null) yCoordPontoControle = applet.getYcoord(objName);

    applet.unregisterObjectUpdateListener('PontoControle');
    if (xCoord > (eixoX[1] - 1)) applet.setCoords(objName, (eixoX[1] - 1), yCoordPontoControle);
    if (xCoord < (eixoX[0] + 1)) applet.setCoords(objName, (eixoX[0] + 1), yCoordPontoControle);

    //Controla o andar em "trancos" do ponto
    /*
        var resto = xCoord % passo;
        if (resto>0)
            if (resto<passoMetade) applet.setCoords(objName,xCoord - resto ,yCoord);
            else applet.setCoords(objName,xCoord + (passo - resto) ,yCoord);		
		*/

    var novoControle = 0;
    for (var i = 1; i < coordsTopo.length; i++) {
        if (xCoord >= coordsTopo[i][0]) novoControle = i;
    }

    if (novoControle != controleXatual) {
        controleXatual = novoControle;
        geraPoligonoCobrindo();
    }

    if (exibeValorDadosHistograma == true) {

        var minhaTemporaria = applet.getValue('polyCover') / (10 / coordsTopo.length);
        var posXPonto = applet.getXcoord('PontoControle');

        var _k = (posXPonto / 10);
        //*CENTIMETROS var novo_valor = (1 - _k)*_min_valor +  _k*_max_valor;			
        var novo_valor = ((1 - _k) * _min_valor + _k * _max_valor);


        applet.evalCommand('dadosLabel=Text[(' + novo_valor + '),(x(PontoControle)+0.2,-0.09)]');
        _dadosLabelValue = novo_valor;
        applet.setFixed('dadosLabel', true);

    }
    applet.registerObjectUpdateListener('PontoControle', 'updateListenerPontoControle');

}


// Função de barras
function barras(labels, valores) {

    if (valores.length == 0) return;

    // Copia dos valores originais caso sejam alterados
    // (Javascript copia por referencia se usar apenas =)
    var valoresOriginais = valores.slice();

    var applet = document.ggbApplet;

    // Criação do array com as cores a serem utilziadas
    /* TODO: Colocar cores pré-definidas e não geradas aleatoriamente.
	
    var cores = Array(valores.length);
    for (var i=0;i<valores.length;i++) {
    	cores[i] = [ (Math.ceil(Math.random()*256)-1),(Math.ceil(Math.random()*256)-1),(Math.ceil(Math.random()*256)-1)];
    }
    */
    // para fazer normalizado
    var soma = valores.sum();
    for (var i = 0; i < valores.length; i++) {
        valores[i] = valores[i] / soma;
    }


    // para fazer com eixo x em valores originais, recalcular distancias 
    eixoY[0] = 0;
    eixoY[1] = 1;

    eixoX[0] = -1;
    eixoX[1] = 11;

    //eixoY[1]=parseFloat(valores.max());	


    var margemY = (eixoY[1] - eixoY[0]) / 10;
    applet.setCoordSystem(eixoX[0], eixoX[1], eixoY[0] - margemY, eixoY[1] + margemY);

    var distanciaLabels = distanciaLabelsEscolhida * (eixoY[1] - eixoY[0]);
    applet.setRepaintingActive(false);
    applet.reset();
    controleXatual = 0;

    applet.setAxesVisible(true, true)

    // Define valores dos eixos e inicializa applets e valores
    //applet.setCoordSystem(eixoX[0],eixoX[1],eixoY[0]-margemY,eixoY[1]+margemY);
    //applet.setCoordSystem(eixoX[0],eixoX[1],0, 1);

    /*
    applet.evalCommand('coord0=0');
    applet.evalCommand('linhaeixoX=Ray[(coord0,coord0),(1,0)]');
    applet.setFixed('linhaeixoX',true);
    applet.setLabelVisible('linhaeixoX',false);
    applet.setFixed('linhaeixoX',false);
    applet.setLayer('linhaeixoX', 9);
    */

    var deltaX = ((eixoX[1] - eixoX[0]) - 2) / valores.length;


    applet.setOnTheFlyPointCreationActive(false);

    // Criação das barras
    for (var i = 0; i < valores.length; i++) {
        // pontos usado para a criação local das barras
        var pontos = new Array();


        var larguraBarra = Math.min(deltaX, barrasLarguraMaxima);
        var pontoMedio = ((i * deltaX) + ((i + 1) * deltaX)) / 2

        pontos.push([pontoMedio - larguraBarra / 2, valores[i]]);
        pontos.push([pontoMedio + larguraBarra / 2, valores[i]]);
        pontos.push([pontoMedio + larguraBarra / 2, 0]);
        pontos.push([pontoMedio - larguraBarra / 2, 0]);

        var nomesPontos = new Array();

        // Cria os pontos das barras e as linhas divisórias no eixo X
        for (var k = 0; k < pontos.length; k++) {
            var nome = 'Dado' + i + 'P_' + k;
            nomesPontos.push(nome);
            applet.evalCommand(nome + '=(' + pontos[k][0] + ',' + pontos[k][1] + ')');
            applet.setLabelVisible(nome, false);
            applet.setVisible(nome, false);
            //if (k==2) applet.evalCommand('linhaDivisoria'+i+'=Segment['+nome+',(x('+nome+'),'+(distanciaLabels*-1)/2+')]');
        }


        // Label dos eixos		

        var tamanhoLabel = 0;
        var label = labels[i];
        tamanhoLabel = larguraLabel(label);
        applet.evalCommand('dado' + i + 'Label=Text["' + label + '",(' + (pontoMedio - tamanhoLabel / 2) + ',' + (distanciaLabels * -1) + ')]');
        applet.setFixed('dado' + i + 'Label', true);

        //Label com valor no topo
        var tamanhoLabelTopo = 0;
        var labelTopo = valoresOriginais[i].toString();
        tamanhoLabelTopo = larguraLabel(labelTopo);
        applet.evalCommand('dado' + i + 'LabelTopo=Text["' + labelTopo + '",(' + (pontoMedio - tamanhoLabelTopo / 2) + ',y(' + nomesPontos[0] + ')+' + distanciaLabels / 2 + ')]');
        applet.setColor('dado' + i + 'LabelTopo', 0, 150, 0);
        applet.setFixed('dado' + i + 'LabelTopo', true);
        // Barras
        applet.deleteObject('dado' + i + 'Poly');
        applet.evalCommand('dado' + i + 'Poly=Polygon[' + nomesPontos[0] + ',' + nomesPontos[1] + ',' + nomesPontos[2] + ',' + nomesPontos[3] + ']');
        applet.setFixed('dado' + i + 'Poly', true);
        applet.setColor('dado' + i + 'Poly', cores[(i) % cores.length][0], cores[(i) % cores.length][1], cores[(i) % cores.length][2]);
        applet.setFilling('dado' + i + 'Poly', barraFilling);

        for (var k = 0; k < pontos.length; k++) {
            var nome = 'dado' + i + 'p_' + k;
            applet.setLayer(nome, 2);
            applet.setLabelVisible(nome, false);
        }

    }



    applet.setOnTheFlyPointCreationActive(true);
    //applet.setCoordSystem(eixoX[0],eixoX[1],eixoY[0]-margemY,eixoY[1]+margemY);
    mudarEscala(eixoX[0], eixoX[1], eixoY[0] - margemY, eixoY[1] + margemY);

    applet.setRepaintingActive(true);

}

function larguraChar(char) {

    // replace em acentos e cedilha... aparentemente a fonta sempre tem a mesma largura que o caracter normal
    char = char.replace(/[Á,Ã,À,Â]/, 'A');
    char = char.replace(/[á,ã,à,â]/, 'a');
    char = char.replace(/[É,È,Ê]/, 'E');
    char = char.replace(/[é,è,ê]/, 'e');
    char = char.replace(/[Í,Ì,Î]/, 'I');
    char = char.replace(/[í,ì,î]/, 'i');
    char = char.replace(/[Ó,Õ,Ò,Ô]/, 'O');
    char = char.replace(/[ó,õ,ò,ô]/, 'o');
    char = char.replace(/[Ú,Ù,Û]/, 'U');
    char = char.replace(/[ú,ù,û]/, 'u');
    char = char.replace(/[Ç]/, 'C');
    char = char.replace(/[ç]/, 'c');

    var chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "w", "v", "x", "y", "z"];
    var larg = [7, 7, 6, 7, 7, 3, 7, 7, 3, 3, 6, 3, 11, 7, 7, 7, 7, 4, 7, 3, 7, 9, 5, 5, 5, 5];

    var pos = chars.indexOf(char);

    if (pos > -1) return larg[pos] - 1;

    var chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "V", "X", "Y", "Z"];
    var larg = [7, 8, 9, 9, 8, 7, 9, 9, 3, 6, 8, 7, 9, 9, 9, 8, 9, 9, 8, 7, 9, 11, 7, 6, 6, 6];

    pos = chars.indexOf(char);

    if (pos > -1) return larg[pos] - 1;

    var chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "_", " "];
    var larg = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3];

    pos = chars.indexOf(char);
    if (pos > -1) return larg[pos] - 1;

    var chars = [".", ",", "/", ";", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "+"];
    var larg = [3, 3, 3, 3, 3, 12, 7, 7, 11, 5, 8, 5, 4, 4, 4, 7, 7];

    pos = chars.indexOf(char);
    if (pos > -1) return larg[pos] - 1;

    // um valor padrão para retornar quando não encontrou.
    // Debug: Loga no console
    return 7;
}

function getAppletWidth() {
    //document.ggbApplet.evalCommand('tamanhoP=Point[{Corner(5)}]');
    return Number(document.ggbApplet.getXcoord('tamanhoP'));
}

function getAppletHeight() {
    //document.ggbApplet.evalCommand('tamanhoP=Point[{Corner(5)}]');
    return Number(document.ggbApplet.getYcoord('tamanhoP'));
}


// Estima a largura do label, em pixels.
// TODO: Achar uma solução melhor para isso do que essa estimativa manual totalmente dependente da fonte.
function larguraLabel(label) {

    var applet = document.ggbApplet;


    //var larguraApplet = applet.width;
    var larguraApplet = getAppletWidth();
    var larguraGgb = (eixoX[1]) - (eixoX[0]);
    var relacaoLargura = larguraGgb / larguraApplet;

    var tamanhoLabel = 0;

    for (var iterLabel = 0; iterLabel < label.length; iterLabel++) {
        tamanhoLabel += larguraChar(label.charAt(iterLabel)) + 1;
    }
    tamanhoLabel *= relacaoLargura;
    return tamanhoLabel;
}


function roundNumber(num, dec) {
    var result = Math.round(Math.round(num * Math.pow(10, dec + 1)) / Math.pow(10, 1)) / Math.pow(10, dec);
    return result;
}

function xml2Str(xmlNode) {
    try {
        // Gecko-based browsers, Safari, Opera.
        return (new XMLSerializer()).serializeToString(xmlNode);
    } catch (e) {
        try {
            // Internet Explorer.
            return xmlNode.xml;
        } catch (e) {
            //Other browsers without XML Serializer
            alert('Xmlserializer not supported');
        }
    }
    return false;
}

function mudarEscala(xMin, xMax, yMin, yMax) {
    var applet = document.ggbApplet;

    var appletWidth = Number(getAppletWidth());
    var appletHeight = Number(getAppletHeight());


    stringXML = applet.getXML();

    // Converte a string para um documento XML
    try //Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(stringXML);
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(stringXML, "text/xml");
        } catch (e) { alert(e.message) }
    }



    x = xmlDoc.getElementsByTagName("euclidianView")[0];

    if (x.getElementsByTagName("size")[0] != undefined) {
        var sizeX = x.getElementsByTagName("size")[0].getAttribute('width');
        var sizeY = x.getElementsByTagName("size")[0].getAttribute('height');
        //		console.log('size do ggb',sizeX,sizeY);
    } else {
        var sizeX = Number(appletWidth) - 2;
        var sizeY = Number(appletHeight) - 2;
        //		console.log('size do applet',sizeX,sizeY);
    }


    var escalaX = sizeX / (xMax - xMin);
    var escalaY = sizeY / (yMax - yMin);
    var zeroX = -1 * xMin * escalaX;
    var zeroY = Number(sizeY) + Number(yMin * escalaY);


    x.getElementsByTagName("coordSystem")[0].setAttribute('scale', escalaX);
    x.getElementsByTagName("coordSystem")[0].setAttribute('yscale', escalaY);
    x.getElementsByTagName("coordSystem")[0].setAttribute('xZero', zeroX);
    x.getElementsByTagName("coordSystem")[0].setAttribute('yZero', zeroY);


    applet.setXML(xml2Str(xmlDoc));
    applet.refreshViews();

}