/**************************************
		INICIALIZACAO
**************************************/
var SalvaLocalLoaded = true;
var GGBLoaded = false;
var HTMLLoaded = false;

document.observe('dom:safeLoaded', function(ev) {
    HTMLLoaded = true;
    SalvaLocalLoaded = true;
    checkInits();
});


function ggbOnInit() {
    GGBLoaded = true;
    checkInits();
}

function checkInits() {
    GGBLoaded = true;
    // Checagem se tanto SalvaLocal e Geogebra foram carregados.
    if (SalvaLocalLoaded && GGBLoaded && HTMLLoaded) InitOnLoad();
}

function InitOnLoad() {
    /* exemplo de como habilitar as partes 
       tem que lembrar de apagar este trecho pro software oficial */

    setAtividade('atividade_3', 2, false); //Comecou a fazer a atividade_3

    BlocoNotas = new Blocao();

    MeuBloco[0] = 'Tabela da Altura';
    MeuBloco[1] = [
        [{ value: ' ', largura: 4 }, { value: 'Gênero Feminino', largura: 4 }, { value: 'Gênero Masculino', largura: 4 }], //header
        [{ value: 'Mínimo', tipo: 'texto' }, { value: getResp('minF'), tipo: 'texto' }, { value: getResp('minM'), tipo: 'texto' }],
        [{ value: 'Màximo', tipo: 'texto' }, { value: getResp('maxF'), tipo: 'texto' }, { value: getResp('maxM'), tipo: 'texto' }],
        [{ value: 'Média', tipo: 'texto' }, { value: getResp('mediaF'), tipo: 'texto' }, { value: getResp('mediaM'), tipo: 'texto' }],
        [{ value: 'Mediana', tipo: 'texto' }, { value: getResp('medianaF'), tipo: 'texto' }, { value: getResp('medianaM'), tipo: 'texto' }],
        [{ value: 'Quantil 25%', tipo: 'texto' }, { value: getResp('Q25F'), tipo: 'texto' }, { value: getResp('Q25M'), tipo: 'texto' }],
        [{ value: 'Quantil 75%', tipo: 'texto' }, { value: getResp('Q75F'), tipo: 'texto' }, { value: getResp('Q75M'), tipo: 'texto' }]
    ];

    //MeuBloco[2] = '<br>';
    //MeuBloco[3] = '<br>';
    //MeuBloco[4] = '<br>';
    MeuBloco[2] = 'Tabela do Numero do Calçado';
    MeuBloco[3] = [
        [{ value: ' ', largura: 4 }, { value: 'Gênero Feminino', largura: 4 }, { value: 'Gênero Masculino', largura: 4 }], //header
        [{ value: 'Mínimo', tipo: 'texto' }, { value: getResp('minCalcadoF'), tipo: 'texto' }, { value: getResp('minCalcadoM'), tipo: 'texto' }],
        [{ value: 'Màximo', tipo: 'texto' }, { value: getResp('maxCalcadoF'), tipo: 'texto' }, { value: getResp('maxCalcadoM'), tipo: 'texto' }],
        [{ value: 'Média', tipo: 'texto' }, { value: getResp('mediaCalcadoF'), tipo: 'texto' }, { value: getResp('mediaCalcadoM'), tipo: 'texto' }],
        [{ value: 'Mediana', tipo: 'texto' }, { value: getResp('medianaCalcadoF'), tipo: 'texto' }, { value: getResp('medianaCalcadoM'), tipo: 'texto' }],
        [{ value: 'Quantil 25%', tipo: 'texto' }, { value: getResp('Q25CalcadoF'), tipo: 'texto' }, { value: getResp('Q25CalcadoM'), tipo: 'texto' }],
        [{ value: 'Quantil 75%', tipo: 'texto' }, { value: getResp('Q75CalcadoF'), tipo: 'texto' }, { value: getResp('Q75CalcadoM'), tipo: 'texto' }]
    ];

    if (PosicaoAtual.Parte == 2) {
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

        var ids = ['questao_4_b_1', 'questao_4_b_2', 'parte3_q3_c', 'parte3_q4_d'];

        ids.each(function(s) {
            $(s).value = getResp('atividade3_' + s);
            Event.observe(s, 'change', function(evento) {
                setResp('atividade3_' + this.id, this.value);
            });
        });

        var ids_multi_escolha = ['parte3_q3_a', 'parte3_q3_b', 'parte3_q4_a', 'parte3_q4_c'];
        ids_multi_escolha.each(function(item) {
            for (var i = 1; i < 4; i++) {
                Event.observe(item + '_' + i, 'change', function(evento) {

                    setResp('atividade3_' + item, $(this.id).value);
                });
            }
            switch (getResp('atividade3_' + item)) {
                case 'm':
                    $(item + '_' + 1).setChecked(true);
                    break
                case 'f':
                    $(item + '_' + 2).setChecked(true);
                    break;
                case 'i':
                    $(item + '_' + 3).setChecked(true);
                    break;
            }

        });
    };

    var maxF = getResp('maxCalcadoF');
    var minF = getResp('minCalcadoF');
    var alturaF = maxF - minF;

    var maxM = getResp('maxCalcadoM');
    var minM = getResp('minCalcadoM');
    var alturaM = maxM - minM;

    if (alturaM > alturaF) {
        setResp('maiorVariabilidadeCalcado', alturaM);
    } else if (alturaM < alturaF) {
        setResp('maiorVariabilidadeCalcado', alturaF);
    } else {
        setResp('maiorVariabilidadeCalcado', alturaF);
    }

    //Calcula o zoom da coordenada Y
    var minGeral = (Number(getResp('minCalcadoF')) < Number(getResp('minCalcadoM'))) ? Number(getResp('minCalcadoF')) : Number(getResp('minCalcadoM'));
    var maxGeral = (Number(getResp('maxCalcadoF')) > Number(getResp('maxCalcadoM'))) ? Number(getResp('maxCalcadoF')) : Number(getResp('maxCalcadoM'));
    var margemVertical = 3;
    var deltaAltura = (maxGeral - minGeral) + margemVertical * 2;
    var alturaQuadro = deltaAltura / 15;

    var applet = document.ggbApplet;
    if (PosicaoAtual.Parte == 2) {
        // Parte 3
        //Usando uma solução por XML devido a bug do geogebra
        //applet.setCoordSystem(-35,115,minGeral-3,maxGeral+3);
        mudarEscala(-35, 115, minGeral - margemVertical, maxGeral + margemVertical);
        applet.setCoords('Min', 35, Number(getResp('minCalcadoAlunoF')));
        applet.setCoords('Max', 35, Number(getResp('maxCalcadoAlunoF')));
        applet.setCoords('Q25', 35, Number(getResp('Q25CalcadoAlunoF')));
        applet.setCoords('Q75', 35, Number(getResp('Q75CalcadoAlunoF')));
        applet.setCoords('Medi', 35, Number(getResp('medianaCalcadoAlunoF')));

        applet.setCoords('Min_2', 75, Number(getResp('minCalcadoAlunoM')));
        applet.setCoords('Max_2', 75, Number(getResp('maxCalcadoAlunoM')));
        applet.setCoords('Q25_2', 75, Number(getResp('Q25CalcadoAlunoM')));
        applet.setCoords('Q75_2', 75, Number(getResp('Q75CalcadoAlunoM')));
        applet.setCoords('Medi_2', 75, Number(getResp('medianaCalcadoAlunoM')));


        applet.setVisible('Min', false);
        applet.setVisible('Max', false);
        applet.setVisible('Q25', false);
        applet.setVisible('Q75', false);
        applet.setVisible('Medi', false);
        applet.setVisible('Min_2', false);
        applet.setVisible('Max_2', false);
        applet.setVisible('Q25_2', false);
        applet.setVisible('Q75_2', false);
        applet.setVisible('Medi_2', false);


        //Coloca quadrado branco nos cantos
        applet.evalCommand('branco = Polygon[(-35,' + (maxGeral + margemVertical) + '),(-17,' + (maxGeral + margemVertical) + '),(-17,' + (maxGeral + margemVertical - alturaQuadro) + '),(-35,+' + (maxGeral + margemVertical - alturaQuadro) + ')]');
        applet.setColor('branco', 255, 255, 255);
        applet.setFilling('branco', 1);
        applet.setFixed('branco', 1);

        //Canto inferior
        applet.evalCommand('branco2 = Polygon[(100,' + (minGeral - 3 + alturaQuadro) + '),(115,' + (minGeral - 3 + alturaQuadro) + '),(115,' + (minGeral - 3) + '),(100,+' + (minGeral - 3) + ')]');
        applet.setColor('branco2', 255, 255, 255);
        applet.setFilling('branco2', 1);
        applet.setFixed('branco2', 1);

        //Fim colca quadrado branco nos cantos
    } else {
        // Partes 1 e 2
        //Usando uma solução por XML devido a bug do geogebra
        //applet.setCoordSystem(-30,110,minGeral-3,maxGeral+3);
        mudarEscala(-30, 110, minGeral - margemVertical, maxGeral + margemVertical);

        // Seta coordenadas dos pontos:
        applet.setCoords('Min', 35, roundNumber(Number(minGeral - margemVertical + (deltaAltura / 6)), 0));
        applet.setCoords('Max', 35, roundNumber(Number(minGeral - margemVertical + (5 * deltaAltura / 6)), 0));
        applet.setCoords('Q25', 35, roundNumber(Number(minGeral - margemVertical + (2 * deltaAltura / 6)), 0));
        applet.setCoords('Q75', 35, roundNumber(Number(minGeral - margemVertical + (4 * deltaAltura / 6)), 0));
        applet.setCoords('Medi', 35, roundNumber(Number(minGeral - margemVertical + (3 * deltaAltura / 6)), 0));

        //Coloca quadrado branco nos cantos
        applet.evalCommand('branco = Polygon[(-30,' + (maxGeral + 3) + '),(-17,' + (maxGeral + 3) + '),(-17,' + (maxGeral + 3 - alturaQuadro) + '),(-30,+' + (maxGeral + 3 - alturaQuadro) + ')]');
        applet.setColor('branco', 255, 255, 255);
        applet.setFilling('branco', 1);
        applet.setFixed('branco', 1);

        //Canto inferior
        applet.evalCommand('branco2 = Polygon[(87,' + (minGeral - 3 + alturaQuadro) + '),(110,' + (minGeral - 3 + alturaQuadro) + '),(110,' + (minGeral - 3) + '),(87,+' + (minGeral - 3) + ')]');
        applet.setColor('branco2', 255, 255, 255);
        applet.setFilling('branco2', 1);
        applet.setFixed('branco', 2);

        //Fim colca quadrado branco nos cantos
    }
    //Fim calculo do zoom

}

/**************************************
		FUNCOES DE USO GERAL
**************************************/
function tudoCerto() {
    if (PosicaoAtual.Parte == 2) { //Ultima parte
        setAtividade('atividade_3', 3, true); //atividade_3 estah feita
    }
}


/**************************************
		FUNCOES DE CORRECAO
**************************************/
function corrige_q_1_a(valor) {
    var applet = document.ggbApplet;
    var minimo = applet.getYcoord('Min');

    if (Math.abs(Number(getResp('minCalcadoF')) - minimo) < 0.25) {
        setResp('minCalcadoAlunoF', minimo);
        return [true];
    } else return [false];
}

function corrige_q_1_b(valor) {
    var applet = document.ggbApplet;
    var maximo = applet.getYcoord('Max');

    if (Math.abs(Number(getResp('maxCalcadoF')) - maximo) < 0.25) {
        setResp('maxCalcadoAlunoF', maximo);
        return [true];
    } else return [false];
}

function corrige_q_1_c(valor) {
    var applet = document.ggbApplet;
    var q25 = applet.getYcoord('Q25');

    if (Math.abs(Number(getResp('Q25CalcadoF')) - q25) < 0.25) {
        setResp('Q25CalcadoAlunoF', q25);
        return [true];
    } else return [false];
}

function corrige_q_1_d(valor) {
    var applet = document.ggbApplet;
    var q75 = applet.getYcoord('Q75');

    if (Math.abs(Number(getResp('Q75CalcadoF')) - q75) < 0.25) {
        setResp('Q75CalcadoAlunoF', q75);
        return [true];
    } else return [false];
}

function corrige_q_1_e(valor) {
    var applet = document.ggbApplet;
    var mediana = applet.getYcoord('Medi');

    if (Math.abs(Number(getResp('medianaCalcadoF')) - mediana) < 0.25) {
        setResp('medianaCalcadoAlunoF', mediana);
        return [true];
    } else return [false];
}

function corrige_q_2_a(valor) {
    var applet = document.ggbApplet;
    var minimo = applet.getYcoord('Min');

    if (Math.abs(Number(getResp('minCalcadoM')) - minimo) < 0.25) {
        setResp('minCalcadoAlunoM', minimo);
        return [true];
    } else return [false];
}

function corrige_q_2_b(valor) {
    var applet = document.ggbApplet;
    var maximo = applet.getYcoord('Max');

    if (Math.abs(Number(getResp('maxCalcadoM')) - maximo) < 0.25) {
        setResp('maxCalcadoAlunoM', maximo);
        return [true];
    } else return [false];
}

function corrige_q_2_c(valor) {
    var applet = document.ggbApplet;
    var q25 = applet.getYcoord('Q25');

    if (Math.abs(Number(getResp('Q25CalcadoM')) - q25) < 0.25) {
        setResp('Q25CalcadoAlunoM', q25);
        return [true];
    } else return [false];
}

function corrige_q_2_d(valor) {
    var applet = document.ggbApplet;
    var q75 = applet.getYcoord('Q75');

    if (Math.abs(Number(getResp('Q75CalcadoM')) - q75) < 0.25) {
        setResp('Q75CalcadoAlunoM', q75);
        return [true];
    } else return [false];
}

function corrige_q_2_e(valor) {
    var applet = document.ggbApplet;
    var mediana = applet.getYcoord('Medi');

    if (Math.abs(Number(getResp('medianaCalcadoM')) - mediana) < 0.25) {
        setResp('medianaCalcadoAlunoM', mediana);
        return [true];
    } else return [false];
}

function corrige_q_3_a(valor) {
    var maxF = getResp('maxCalcadoF');
    var maxM = getResp('maxCalcadoM');
    if (maxM > maxF) {
        return [valor[0] ? true : null, valor[1] ? false : null, valor[2] ? false : null];
    } else if (maxM < maxF) {
        return [valor[0] ? false : null, valor[1] ? true : null, valor[1] ? false : null];
    } else {
        return [valor[0] ? false : null, valor[1] ? false : null, valor[2] ? true : null];
    }
}

function corrige_q_3_b(valor) {
    var minF = getResp('minCalcadoF');
    var minM = getResp('minCalcadoM');
    if (minM < minF) {
        return [valor[0] ? true : null, valor[1] ? false : null, valor[2] ? false : null];
    } else if (minM > minF) {
        return [valor[0] ? false : null, valor[1] ? true : null, valor[2] ? false : null];
    } else {
        return [valor[0] ? false : null, valor[1] ? false : null, valor[2] ? true : null];
    }
}

function corrige_q_3_c(valor) {
    if (valor[0] != "") {
        valor[0] = valor[0].replace(',', '.');
        var medianaF = getResp('medianaCalcadoF');
        var medianaM = getResp('medianaCalcadoM');
        if (medianaM > medianaF) {
            return [valor[0] == medianaM];
        }
        return [valor[0] == medianaF];
    } else {
        return [false];
    }
}

function corrige_q_4_a(valor) {
    var Q25F = getResp('Q25CalcadoF');
    var Q75F = getResp('Q75CalcadoF');
    var alturaF = Q75F - Q25F;

    var Q25M = getResp('Q25CalcadoM');
    var Q75M = getResp('Q75CalcadoM');
    var alturaM = Q75M - Q25M;

    if (alturaM < alturaF) {
        return [valor[0] ? true : null, valor[1] ? false : null, valor[2] ? false : null];
    } else if (alturaM > alturaF) {
        return [valor[0] ? false : null, valor[1] ? true : null, valor[2] ? false : null];
    } else {
        return [valor[0] ? false : null, valor[1] ? false : null, valor[2] ? true : null];
    }

}

function corrige_q_4_b(valor) {
    var Q25F = getResp('Q25CalcadoF');
    var Q75F = getResp('Q75CalcadoF');
    var alturaF = Q75F - Q25F;

    var Q25M = getResp('Q25CalcadoM');
    var Q75M = getResp('Q75CalcadoM');
    var alturaM = Q75M - Q25M;

    var primeiraCaixa = false;
    var segundaCaixa = false;

    var Q25R = ($('questao_4_b_1').value).replace(',', '.');
    var Q75R = ($('questao_4_b_2').value).replace(',', '.');

    if (alturaM < alturaF) {
        //Masculino
        primeiraCaixa = (Q25R == Q25M);
        segundaCaixa = (Q75R == Q75M);
    };
    if (alturaF < alturaM) {
        //Feminino
        primeiraCaixa = (Q25R == Q25F);
        segundaCaixa = (Q75R == Q75F);
    }
    if (alturaF == alturaM) {
        primeiraCaixa = (((Q25R == Q25F) && (Q75R != Q75M)) || (Q25R == Q25M) && (Q75R != Q75F));
        segundaCaixa = (((Q75R == Q75F) && (Q25R != Q25M)) || (Q75R == Q75M) && (Q25R != Q25F));
    }

    if (primeiraCaixa) {
        $('corretor_questao_4_b_1').removeClassName('incorreto');
        $('corretor_questao_4_b_1').addClassName('correto');
    } else {
        $('corretor_questao_4_b_1').removeClassName('correto');
        $('corretor_questao_4_b_1').addClassName('incorreto');
    }

    if (segundaCaixa) {
        $('corretor_questao_4_b_2').removeClassName('incorreto');
        $('corretor_questao_4_b_2').addClassName('correto');
    } else {
        $('corretor_questao_4_b_2').removeClassName('correto');
        $('corretor_questao_4_b_2').addClassName('incorreto');
    }

    return [(primeiraCaixa && segundaCaixa)];

}

function corrige_q_4_c(valor) {
    var maxF = getResp('maxCalcadoF');
    var minF = getResp('minCalcadoF');
    var alturaF = maxF - minF;

    var maxM = getResp('maxCalcadoM');
    var minM = getResp('minCalcadoM');
    var alturaM = maxM - minM;

    if (alturaM > alturaF) {
        return [valor[0] ? true : null, valor[1] ? false : null, valor[2] ? false : null];
    } else if (alturaM < alturaF) {
        return [valor[0] ? false : null, valor[1] ? true : null, valor[2] ? false : null];
    } else {
        return [valor[0] ? false : null, valor[1] ? false : null, valor[2] ? true : null];
    }
}

function corrige_q_4_d(valor) {
    valor[0] = valor[0].replace(',', '.');

    return [Math.abs(getResp('maiorVariabilidadeCalcado') - valor[0]) < 0.01];
}