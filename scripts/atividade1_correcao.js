var SalvaLocalLoaded = true;
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
	//Atividade sem applet
	GGBLoaded = true;
	
	// Checagem se tanto SalvaLocal e Geogebra foram carregados.
	if  (SalvaLocalLoaded && GGBLoaded && HTMLLoaded) InitOnLoad();
}

function InitOnLoad(){

	// Bloco
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

	// ----
	   
	
	setAtividade('atividade_1',2,false);	//Comecou a fazer a atividade_1
	switch (PosicaoAtual.Parte) {
		case 0:
			Event.observe('add5row', 'click', function(evento){
				adicionarLinhas(5);
			});		
			
			var existeTabela = eval(getRespSoft("tabela_principal", "estat-dados"));
			
			if (existeTabela != null) {
				
				$('msg_alerta_tabela').update("<strong>Atenção: </strong> A tabela já está preenchida com dados digitados anteriormente. Você pode aproveitá-los ou então clicar o “limpar dados” para preencher com novas informações. Lembre de registrar seus próprios dados.<br><br>");
				carregarDadosTabela();
				verificaRestricoesTabela();
				//permiteContinuar(true);
			} else {
				idTabela = 0;
				adicionarLinhas(10);
				permiteContinuar(false);
				setResp('automacao_atividade_1_parte_1',0);
				gerencia_partes();						
			}
			
			var tbody = document.getElementById("tabelaDados").getElementsByTagName("TBODY")[0];
			adicionaInputListener(tbody.rows.length);	
	
			break;
		case 1:
		
			var ids = [ 'parte2_q1_a', 'parte2_q1_b' ];

			ids.each(function(s) 
			{
				$(s).value=getResp('atividade1_'+s);
				Event.observe(s, 'change', function(evento){
				setResp('atividade1_'+this.id,this.value);
				});
			});
			break;
				
		case 2:
			initA1_P3();
			setAtividade('atividade_1',3,true);		//atividade_1 estah feita
			setAtividade('atividade_2',1,false);	//atividade_2 estah liberada
			setAtividade('atividade_3',1,false);	//atividade_3 estah liberada
	
			break;
	}
}			

function verificaRestricoesTabela() {
	
	var array_dados = criaArrayDados();
	
	if (array_dados.length == 0) {
		var err_msg = "";
		
		err_msg = "O seu conjunto de dados não contém dez linhas válidas. Preencha a tabela até atingir esse valor mínimo.<br>";
		$('confirma_gravacao').update(err_msg);		
		return false;
	} else {
		//Busca ao menos 1 elemento por sexo
		var contM=0;
		var contF=0;
		var sexoOK = false;
		
		for (var i=0; ((i<array_dados.length) && !sexoOK); i++) {
			if (array_dados[i].sexo == "M") {
				contM++;
			}else {
				contF++;
			}
			
			sexoOK = ((contM!=0) && (contF!=0));
		}
		
		var maisQueDez=false;
		if ( array_dados.length >= 10) maisQueDez=true;
		
		var err = sexoOK && maisQueDez;
		var err_msg = "";
		
		if (!maisQueDez) err_msg = "O seu conjunto de dados não contém dez linhas válidas. Preencha a tabela até atingir esse valor mínimo.<br>";
		if (!sexoOK) err_msg = err_msg + "A tabela deve conter pelo menos um indivíduo de cada gênero. Preencha, no mínimo, mais uma linha com o gênero que ainda não apareceu.<br>";			
		
		$('confirma_gravacao').update(err_msg);		
		permiteContinuar(err);		
			
		return err;
	}
}


function tudoCerto() {
}

var idTabela=0;
var nCorretos=0;
var vetorSexo = new Array();
var vetorCalcado = new Array();
var vetorAltura = new Array();


function adicionaInputListener(nListeners) {
	
	for (i=0; i < nListeners; i++) {
		
		// Inputs de sexo
		Event.observe('sexo_'+ i, 'change', function(evento) {
			validaInput_linha(this);
		});

		// Inputs de altura
		Event.observe('altura_'+ i, 'change', function(evento) {
			validaInput_linha(this);
		});
		
		// Inputs de calcado
		Event.observe('calcado_'+ i, 'change', function(evento) {
			validaInput_linha(this);
		});		
		
	}
}

function validaInput_linha(obj) {
	var nome = obj.id;
	var idLinha;
	
	idLinha = nome.split("_")[1];
	
	var aux_sexo = $('sexo_' + idLinha);
	var aux_calcado = $('calcado_' + idLinha);
	var aux_altura = $('altura_' + idLinha);

	// estado = ["0","1","2"] -> [ vazio, correto, incorreto  ]
	//var estado = $('status_'+idLinha).innerHTML;
	var estado = $('linha_'+idLinha).readAttribute("status");
	
	if ((aux_calcado.value.length == 0) || (aux_sexo.value.length == 0) || (aux_altura.value.length == 0)) {		
		$('valida_'+idLinha).update(' ');
		$('linha_'+idLinha).writeAttribute("status", "0");
		//$('status_'+idLinha).update("0");
	} else if ( validaInput_sexo(aux_sexo.value) && validaInput_altura(aux_altura.value) && validaInput_calcado(aux_calcado.value)) {
		
		if (estado != "1") {
			nCorretos++;
		}
		
		$('valida_'+idLinha).update('<img src="img_layout/certinho.gif"/>');
		$('linha_'+idLinha).writeAttribute("status", "1");
		//$('status_'+idLinha).update("1");
		
	} else {
		if (estado == "1") {
			nCorretos--;
		}	
	
		$('valida_'+idLinha).update('<img src="img_layout/erradinho.gif"/>');
		$('linha_'+idLinha).writeAttribute("status", "2");
		//$('status_'+idLinha).update("2");
	}
	
	$('nDadosValidos').update(nCorretos);	
	setResp('num_dados', nCorretos);
}

function validaInput_sexo (valor) {
	
	if ((valor.toUpperCase() == "M") || (valor.toUpperCase() == "F")) {
		return true;
	} else {
		return false;
	}
	
}

function validaInput_altura (valor) {

	if (valor.length == 0) {
		return false;
	} else { 
		var k = valor.replace(/[0-9]/g, "");
		if (k.length == 0)  {
			return true;
		} else {
			return false;
		}		
	}	
}

function validaInput_calcado (valor) {

	if (valor.length == 0) {
		return false;
	} else {
		var k = valor.replace(/[0-9]/g, "");
		if (k.length == 0)  {
			return true;
		} else {
			return false;
		}
	}		
}


function mostrarLegendaA1_P2() {
	var applet = document.ggbApplet;
	if (document.getElementById('checkBoxA1_P2').checked) {
		applet.setValue('h', 1);
	} else {
		applet.setValue('h', 0);
	}
}

function cb_limpar_tabela(){
	if (this.resultado == 'sim'){
		var tabela = $('tabelaDados');
		
		limparTabela();
		adicionarLinhas(10);
		$('confirma_gravacao').update('');		
	}
}

function limparTabela() {
	while ($('tabelaDados').rows.length>1) {
		$('tabelaDados').deleteRow(1);
	}
	idTabela=0;
	//adicionarLinhas(15);
	
	$('nDadosValidos').update("0");
	nCorretos = 0;
	
	vetorSexo = new Array();
	vetorCalcado = new Array();
	vetorAltura = new Array();
	
	permiteContinuar(false);
	setResp('automacao_atividade_1_parte_1',0);
	gerencia_partes();						

}

function cb_salvar_tabela(){
	if (this.resultado == 'sim') {
		salvaTabela();	
	}
}

function salvaTabela() {
	var array_dados = criaArrayDados();			
	var oldTabela = getRespSoft("tabela_principal", "estat-dados");					
	
	// Verifica se há dados a serem gravados
	if (array_dados.length  != 0) {
		// Como se fosse uma alteração de valor inicial
		
		var tabelaOK = verificaRestricoesTabela();
		
		if (tabelaOK) {
			if (oldTabela.toJSON() != array_dados.toJSON()) {
				$('SalvaLocal').ApagaTudo('estat2');						
			}
			
			//setResp('tabela_principal', array_dados.toJSON());
			setRespSoft("tabela_principal", array_dados.toJSON(), "estat-dados");	
			
			setResp('tabela_num_elementos', array_dados.length);

			montaVetoresDados();
		
			$('msg_ok').update("Seus dados foram salvos com sucesso.");
			setResp('atividade_1', 3);//Feito
			setResp('atividade_2', 1);//Liberado
			setResp('atividade_3', 1);//Liberado
			setRespSoft('tabela_definida', 1, 'estat-dados');
			calculaDadosAltura();
			calculaDadosCalcado();							
		} else {
			$('msg_ok').update(" ");
			setResp('atividade_2', 0);//Travado
			setResp('atividade_3', 0);//Travado
			setRespSoft('tabela_definida', 0, 'estat-dados');							
		}
	} else {
		verificaRestricoesTabela();
		
		setResp('tabela_principal', "");					
		setRespSoft("tabela_principal", "", 'estat-dados');	
		setRespSoft('tabela_definida', 0, 'estat-dados');				
		
		setResp('atividade_2', 0);//Travado
		setResp('atividade_3', 0);//Travado
	}
	

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
	
}

/********************************
 * Correção das questões        *
 ********************************/
function corrige_q_1_a(valor) {
	valor[0] = valor[0].replace(',','.');
	return [valor[0] == 1.71];
}

function corrige_q_1_b(valor) {
	valor[0] = valor[0].replace(',','.');
	return [valor[0] == 1.59];
}

