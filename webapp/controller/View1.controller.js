sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/fsBioenergiaZNOVO_LES_LOG/model/formatter"
], function(Controller, JSONModel, formatter) {
	"use strict";

	return Controller.extend("com.fsBioenergiaZNOVO_LES_LOG.controller.View1", {
		
		formatter: formatter,
		
		onInit: function() {

			var oModel = new JSONModel({
				resumoTransp: [],
				tabTranspDisp: [],
				tabRelatTransp: [],
				dadosGrafico: [],
				testeSemana: [],

				indiceSemana: 0,
				numSemanaBind: "",
				dadosGerais: []

			});
			this.getView().setModel(oModel, "gestaoPatView");
			this.getDadosTransporte();
		},

		getDadosTransporte: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("gestaoPatView");
			var usuario = sap.ushell.Container.getService("UserInfo").getId();

			var sURL = "/GET_DADOS_TRANSPORTESet(USUARIO='" + usuario + "')";

			sap.ui.core.BusyIndicator.show();
			oModel.read(sURL, {
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();

					if (oData.TAB_DADOS) {
						var oTabGeral = JSON.parse(oData.TAB_DADOS);

						for (var i in oTabGeral) {
							if (oTabGeral[i].DADOS_GRAFICO) {
								oTabGeral[i].DADOS_GRAFICO = JSON.parse(oTabGeral[i].DADOS_GRAFICO);
							}
							if (oTabGeral[i].RELAT_TRANSP) {
								oTabGeral[i].RELAT_TRANSP = JSON.parse(oTabGeral[i].RELAT_TRANSP);
							}
							if (oTabGeral[i].RESUMO_TRANSP) {
								oTabGeral[i].RESUMO_TRANSP = JSON.parse(oTabGeral[i].RESUMO_TRANSP);
							}
							if (oTabGeral[i].RESUMO_TRANSP) {
								oTabGeral[i].TRANSP_DISPONIVEIS = JSON.parse(oTabGeral[i].TRANSP_DISPONIVEIS);
							}
						}

						oViewModel.setProperty("/dadosGerais", oTabGeral)

						this.setTableBind();
					}

				}.bind(this),
				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
				}.bind(this)
			});
		},

		moveSemana: function(NextPrev) {
			var oViewModel = this.getView().getModel("gestaoPatView");

			var indiceSemana = oViewModel.getProperty("/indiceSemana");
			//this.limpaTabSelections("table2");

			if (NextPrev == "proximo") {
				indiceSemana = indiceSemana + 1;
				oViewModel.setProperty("/indiceSemana", indiceSemana);
				this.setTableBind(NextPrev);
			} else {
				indiceSemana = indiceSemana - 1;
				oViewModel.setProperty("/indiceSemana", indiceSemana);
				this.setTableBind(NextPrev);
			}
		},

		setTableBind: function(NextPrev) {
			var oViewModel = this.getView().getModel("gestaoPatView");
			var indiceSemana = oViewModel.getProperty("/indiceSemana");
			var dadosGerais = oViewModel.getProperty("/dadosGerais");
			var tabBind, tabCheckProxAntSemana;
			var semana = dadosGerais[indiceSemana].SEMANA;

			if (NextPrev == "proximo") {
				if (typeof(dadosGerais[indiceSemana + 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnProxEnable", false);
				}

				if (oViewModel.getProperty("/btnAntEnable") === false) {
					oViewModel.setProperty("/btnAntEnable", true);
				}

				tabBind = dadosGerais.filter(indice => indice.SEMANA == semana);

				oViewModel.setProperty("/resumoTransp", tabBind[0].RESUMO_TRANSP);
				oViewModel.setProperty("/tabTranspDisp", tabBind[0].TRANSP_DISPONIVEIS);
				oViewModel.setProperty("/tabRelatTransp", tabBind[0].RELAT_TRANSP);
				oViewModel.setProperty("/dadosGrafico", tabBind[0].DADOS_GRAFICO);
				//oViewModel.setProperty("/listaOvCount", tabBind[0].DADOS_OVS.length);
				oViewModel.setProperty("/numSemanaBind", tabBind[0].SEMANA);

			} else if (NextPrev == "anterior") {
				if (typeof(dadosGerais[indiceSemana - 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnAntEnable", false);
				}

				if (oViewModel.getProperty("/btnProxEnable") === false) {
					oViewModel.setProperty("/btnProxEnable", true);
				}

				tabBind = dadosGerais.filter(indice => indice.SEMANA == semana);

				if (oViewModel.getProperty("/btnProxEnable") == false) {
					oViewModel.setProperty("/btnProxEnable", true);
				}
				oViewModel.setProperty("/resumoTransp", tabBind[0].RESUMO_TRANSP);
				oViewModel.setProperty("/tabTranspDisp", tabBind[0].TRANSP_DISPONIVEIS);
				oViewModel.setProperty("/tabRelatTransp", tabBind[0].RELAT_TRANSP);
				oViewModel.setProperty("/dadosGrafico", tabBind[0].DADOS_GRAFICO);
				//oViewModel.setProperty("/listaOvCount", tabBind[0].DADOS_OVS.length);
				oViewModel.setProperty("/numSemanaBind", tabBind[0].SEMANA);

			} else {
				if (typeof(dadosGerais[indiceSemana - 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnAntEnable", false);
				}

				tabCheckProxAntSemana = true

				if (typeof(dadosGerais[indiceSemana + 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnProxEnable", false);
				}

				indiceSemana = dadosGerais.findIndex(indice => indice.SEMANA == semana)

				tabBind = dadosGerais.filter(indice => indice.SEMANA == semana);

				if (tabBind.length == 0) {
					MessageBox.error("Ocorreu um erro, recarregue a pagina e tente novamente.");
					return;
				}
				oViewModel.setProperty("/resumoTransp", tabBind[0].RESUMO_TRANSP);
				oViewModel.setProperty("/tabTranspDisp", tabBind[0].TRANSP_DISPONIVEIS);
				oViewModel.setProperty("/tabRelatTransp", tabBind[0].RELAT_TRANSP);
				oViewModel.setProperty("/dadosGrafico", tabBind[0].DADOS_GRAFICO);
				//oViewModel.setProperty("/listaOvCount", tabBind[0].DADOS_OVS.length);
				oViewModel.setProperty("/numSemanaBind", tabBind[0].SEMANA);
				oViewModel.setProperty("/indiceSemana", indiceSemana);
			}

		},

	});
});