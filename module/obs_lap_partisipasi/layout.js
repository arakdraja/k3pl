/**
 * Copyright 2011 - PT. Perusahaan Gas Negara Tbk.
 *
 * Author(s):
 * + PT. Awakami
 *   - m.shulhan (ms@kilabit.org)
 */

var m_obs_lap_partisipasi;
var m_obs_lap_partisipasi_d	= _g_root +'/module/obs_lap_partisipasi/';

/*
 * Form Panel: display user interface to filter performance data.
 */
function M_ObsLapPartForm(grid, displayBulan)
{
	this.ref_grid = grid;

	this.set_org = new k3pl.form.SetOrganisasi({
			itemAll		:true
		,	scope		:this
		,	onCheckClick	:function() {
				this.scope.set_checked()
			}
		});

	this.set_wil = new k3pl.form.SetWilayah({
			itemAll		:true
		,	scope		:this
		,	onCheckClick	:function() {
				this.scope.set_checked()
			}
		});

	this.set_waktu = new k3pl.form.SetWaktu({
			itemAll		:displayBulan
		,	displayBulan	:displayBulan
		});

	this.btn_submit = new Ext.Button({
		text		: 'OK'
	,	listeners	: {
			scope	: this
		,	click	: function(btn, e) {
				this.ref_grid.do_load (
						this.set_org.formDirektorat.getValue ()
					,	this.set_org.formDivProSBU.getValue ()
					,	this.set_org.formDepartemen.getValue()
					,	this.set_org.formDinas.getValue()
					,	this.set_org.formSeksi.getValue()
					,	this.set_wil.formWilayah.getValue()
					,	this.set_wil.formArea.getValue()
					,	this.set_waktu.formTahun.getValue()
					,	displayBulan ? this.set_waktu.formBulan.getValue() : 0
					,	this.set_org.collapsed ? 0 : 1
				);
			}
		}
	});

	this.panel = new Ext.form.FormPanel({
		frame		: true
	,	width		: 500
	,	labelAlign	: 'right'
	,	labelWidth	: 150
	,	buttonAlign	: 'center'
	,	buttons		: [
			this.btn_submit
		]
	,	items		: [
			this.set_org
		,	this.set_wil
		,	this.set_waktu
		]
	});

	this.set_checked = function()
	{
		this.set_org.toggleCollapse(true);
		this.set_wil.toggleCollapse(true);
	}

	this.do_refresh = function(ha_level)
	{
		this.set_org.do_load();
		this.set_wil.do_load();
		this.set_waktu.do_load();
	}
}

function cell_renderer(value, metaData, record, rowIndex, colIndex, store)
{
	var target = record.get(this.id);

	if (target == undefined) {
		target = record.get(metaData.id);
	}

	if (target <= 0) {
		metaData.css = 'safe';
	} else {
		var v = (value / target) * 10;

		if (v < 5) {
			metaData.css = 'unsafe';
		} else if (v == 5) {
			metaData.css = 'midsafe';
		} else {
			metaData.css = 'safe';
		}
	}

	return value;
}

function M_ObsLapPartPegGrid()
{
	this.ha_level = 0;

	this.records = new Ext.data.Record.create([
		{name: 'name'}
	,	{name: 'id_dir'}
	,	{name: 'id_div'}
	,	{name: 'id_dep'}
	,	{name: 'id_dep'}
	,	{name: 'id_dinas'}
	,	{name: 'id_seksi'}
	,	{name: 'jan_target'}
	,	{name: 'feb_target'}
	,	{name: 'mar_target'}
	,	{name: 'apr_target'}
	,	{name: 'may_target'}
	,	{name: 'jun_target'}
	,	{name: 'jul_target'}
	,	{name: 'aug_target'}
	,	{name: 'sep_target'}
	,	{name: 'oct_target'}
	,	{name: 'nov_target'}
	,	{name: 'dec_target'}
	,	{name: 'jan_n'}
	,	{name: 'feb_n'}
	,	{name: 'mar_n'}
	,	{name: 'apr_n'}
	,	{name: 'may_n'}
	,	{name: 'jun_n'}
	,	{name: 'jul_n'}
	,	{name: 'aug_n'}
	,	{name: 'sep_n'}
	,	{name: 'oct_n'}
	,	{name: 'nov_n'}
	,	{name: 'dec_n'}
	,	{name: 'total_target'}
	,	{name: 'total_n'}
	]);

	this.store = new Ext.data.ArrayStore({
		url			: m_obs_lap_partisipasi_d +'data_part_peg.jsp'
	,	fields		: this.records
	,	autoLoad	: false
	});

	this.columns	= [
			new Ext.grid.RowNumberer({locked: true})
		,{
			header		:'Nama'
		,	dataIndex	:'name'
		,	align		:'left'
		,	width		:200
		},{
			header		:'Jan<br/><hr/>Target'
		,	dataIndex	:'jan_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Jan<br/><hr/>#'
		,	dataIndex	:'jan_n'
		,	id			:'jan_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Feb<br/><hr/>Target'
		,	dataIndex	:'feb_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Feb<br/><hr/>#'
		,	dataIndex	:'feb_n'
		,	id			:'feb_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Mar<br/><hr/>Target'
		,	dataIndex	:'mar_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Mar<br/><hr/>#'
		,	dataIndex	:'mar_n'
		,	id			:'mar_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Apr<br/><hr/>Target'
		,	dataIndex	:'apr_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Apr<br/><hr/>#'
		,	dataIndex	:'apr_n'
		,	id			:'apr_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'May<br/><hr/>Target'
		,	dataIndex	:'may_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'May<br/><hr/>#'
		,	dataIndex	:'may_n'
		,	id			:'may_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Jun<br/><hr/>Target'
		,	dataIndex	:'jun_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Jun<br/><hr/>#'
		,	dataIndex	:'jun_n'
		,	id			:'jun_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Jul<br/><hr/>Target'
		,	dataIndex	:'jul_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Jul<br/><hr/>#'
		,	dataIndex	:'jul_n'
		,	id			:'jul_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Aug<br/><hr/>Target'
		,	dataIndex	:'aug_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Aug<br/><hr/>#'
		,	dataIndex	:'aug_n'
		,	id			:'aug_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Sep<br/><hr/>Target'
		,	dataIndex	:'sep_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Sep<br/><hr/>#'
		,	dataIndex	:'sep_n'
		,	id			:'sep_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Oct<br/><hr/>Target'
		,	dataIndex	:'oct_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Oct<br/><hr/>#'
		,	dataIndex	:'oct_n'
		,	id			:'oct_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Nov<br/><hr/>Target'
		,	dataIndex	:'nov_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Nov<br/><hr/>#'
		,	dataIndex	:'nov_n'
		,	id			:'nov_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Dec<br/><hr/>Target'
		,	dataIndex	:'dec_target'
		,	hidden		:true
		,	align		:'center'
		},{
			header		:'Dec<br/><hr/>#'
		,	dataIndex	:'dec_n'
		,	id			:'dec_target'
		,	renderer	: cell_renderer
		,	width		:50
		,	align		:'center'
		},{
			header		:'Total<br/><hr/>Target'
		,	dataIndex	:'total_target'
		,	hidden		:true
		,	css			:'background-color: #C9DBFF;'
		,	align		:'center'
		},{
			header		:'Total<br/><hr/>#'
		,	dataIndex	:'total_n'
		,	css			:'background-color: #C9DBFF;'
		,	width		: 75
		,	align		:'center'
	}];

	this.btn_print = new Ext.Button({
			text		: 'Print'
		,	iconCls		: 'print16'
		,	scope		: this
		,	handler		: function() {
				this.do_print();
			}
	});

	this.panel = new Ext.grid.GridPanel({
			columns		: this.columns
		,	store		: this.store
		,	autoScroll	: true
		,	height		: 500
		,	tbar		: [ this.btn_print ]
	});

	this.do_print = function()
	{
		var form;
		var id_report	= '27';
		var tipe_report	= 'xls';
		var isinorg		= m_obs_lap_partisipasi.part_peg.form.set_org.isChecked();
		
		if (isinorg){
			is_in_org	= '1'
		} else {
			is_in_org	= '0'
		}
		
		form = document.createElement('form');

		form.setAttribute('method', 'post');
		form.setAttribute('target', '_blank');		
		form.setAttribute('action', _g_root +'/report');
		
		var hiddenField1 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
        hiddenField1.setAttribute('name', 'id');
        hiddenField1.setAttribute('value', id_report);
		
		var hiddenField2 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField2.setAttribute('name', 'type');
        hiddenField2.setAttribute('value', tipe_report);

		var hiddenField3 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField3.setAttribute('name', 'is_in_org');
        hiddenField3.setAttribute('value', is_in_org);
		
		var hiddenField4 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField4.setAttribute('name', 'id_dir');
        hiddenField4.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_org.formDirektorat.getValue ());
		
		var hiddenField5 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField5.setAttribute('name', 'id_div');
        hiddenField5.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_org.formDivProSBU.getValue ());
		
		var hiddenField6 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField6.setAttribute('name', 'id_dep');
        hiddenField6.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_org.formDepartemen.getValue());
		
		var hiddenField7 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField7.setAttribute('name', 'id_dinas');
        hiddenField7.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_org.formDinas.getValue());
		
		var hiddenField8 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField8.setAttribute('name', 'id_seksi');
        hiddenField8.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_org.formSeksi.getValue());
		
		var hiddenField9 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField9.setAttribute('name', 'id_wilayah');
        hiddenField9.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_wil.formWilayah.getValue());
		
		var hiddenField10 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField10.setAttribute('name', 'id_area');
        hiddenField10.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_wil.formArea.getValue());
		
		var hiddenField11 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField11.setAttribute('name', 'year');
        hiddenField11.setAttribute('value', m_obs_lap_partisipasi.part_peg.form.set_waktu.formTahun.getValue());
		
		form.appendChild(hiddenField1);
		form.appendChild(hiddenField2);
		form.appendChild(hiddenField3);
		form.appendChild(hiddenField4);
		form.appendChild(hiddenField5);
		form.appendChild(hiddenField6);
		form.appendChild(hiddenField7);
		form.appendChild(hiddenField8);
		form.appendChild(hiddenField9);
		form.appendChild(hiddenField10);
		form.appendChild(hiddenField11);
		document.body.appendChild(form);
		form.submit();
	}
	
	this.count_total = function(records)
	{
		var i;

		for (i = 0; i < records.length; i++) {
			total_target	= records[i].get('jan_target')
					+ records[i].get('feb_target')
					+ records[i].get('mar_target')
					+ records[i].get('apr_target')
					+ records[i].get('may_target')
					+ records[i].get('jun_target')
					+ records[i].get('jul_target')
					+ records[i].get('aug_target')
					+ records[i].get('sep_target')
					+ records[i].get('oct_target')
					+ records[i].get('nov_target')
					+ records[i].get('dec_target');

			total_n		= records[i].get('jan_n')
					+ records[i].get('feb_n')
					+ records[i].get('mar_n')
					+ records[i].get('apr_n')
					+ records[i].get('may_n')
					+ records[i].get('jun_n')
					+ records[i].get('jul_n')
					+ records[i].get('aug_n')
					+ records[i].get('sep_n')
					+ records[i].get('oct_n')
					+ records[i].get('nov_n')
					+ records[i].get('dec_n');

			records[i].set('total_target', total_target);
			records[i].set('total_n', total_n);
		}

		var sum = new this.records;

		sum.set('name', '<center><b>Total :</b></center>');

		var name, keys, k;

		for (i = 0; i < records.length; i++) {
			keys = records[i].fields.keys;
			for (k = 0; k < keys.length; k++) {
				name = keys[k];

				if (name == 'name' || name == 'id_dep'
				||  name == 'id_dinas' || name == 'id_seksi') {
					continue;
				}
				if (sum.get(name) == undefined) {
					sum.set(name, records[i].get(name));
				} else {
					sum.set(name, sum.get(name) + records[i].get(name));
				}
			}
		}

		this.store.add(sum);
	}

	this.do_load = function(id_dir, id_div, id_dep, id_dinas, id_seksi, id_wilayah
				, id_area, year)
	{
		this.store.load({
			scope		: this
		,	params		: {
				id_dir		: id_dir
			,	id_div		: id_div
			,	id_dep		: id_dep
			,	id_dinas	: id_dinas
			,	id_seksi	: id_seksi
			,	id_wilayah	: id_wilayah
			,	id_area		: id_area
			,	year		: year
			}
		,	callback	: function(records,options,success) {
				if (!success) {
					return;
				}
				this.count_total(records);
			}
		});
	}
}

function M_ObsLapPartPeg()
{
	this.grid = new M_ObsLapPartPegGrid();
	this.form = new M_ObsLapPartForm(this.grid, false);

	this.panel = new Ext.Panel({
		title		:'Partisipasi Pegawai'
	,	frame		:false
	,	padding		:'6'
	,	autoScroll	:true
	,	defaults	:{
			style		: {
				marginLeft	:'auto'
			,	marginRight	:'auto'
			,	marginBottom	:'8px'
			}
		}
	,	items		:[
			this.form.panel
		,	this.grid.panel
		]
	});

	this.do_refresh = function(ha_level)
	{
		this.ha_level = ha_level;
		this.form.do_refresh(ha_level);
	}
}

function M_ObsLapPartOrgGrid()
{
	this.record = new Ext.data.Record.create ([
		{name:'name'}
	,	{name:'target'}
	,	{name:'total_part'}
	,	{name:'target_percent'}
	,	{name:'total_part_percent'}
	]);

	this.store = new Ext.data.ArrayStore ({
		url	:m_obs_lap_partisipasi_d +'data_part_org.jsp'
	,	fields	:this.record
	,	autoLoad:false
	});

	this.columns = [{
		header		:'Nama'
	,	id		:'name'
	,	dataIndex	:'name'
	,	align		:'left'
	,	xtype		:'gridcolumn'
	,	summaryRenderer	:function() {
			return '<center><b>Total :</b></center>';
		}
	},{
		header		:'Target'
	,	dataIndex	:'target'
	,	summaryType	:'sum'
	},{
		header		:'Partisipasi'
	,	dataIndex	:'total_part'
	,	summaryType	:'sum'
	,	width		:100
	},{
		header		:'% Target'
	,	dataIndex	:'target_percent'
	,	format		:'000.00%'
	},{
		header			:'% Partisipasi'
	,	dataIndex		:'total_part_percent'
	,	format			:'000.00%'
	,	width			:100
	,	summaryRenderer	:function(v, params, data) {
			if (data.data.target <= 0) {
				return '0%';
			}
			return (Math.round((data.data.total_part / data.data.target)
					* 10000) / 100) + '%';
		}
	}];

	this.cm = new Ext.grid.ColumnModel({
		columns		:this.columns
	,	defaults	: {
			width		:60
		,	align		:'center'
		,	sortable	:true
		,	hideable	:false
		,	xtype		:'numbercolumn'
		,	format		:'0000'
		}
	});

	this.btn_print = new Ext.Button({
			text		: 'Print'
		,	iconCls		: 'print16'
		,	scope		: this
		,	handler		: function() {
				this.do_print();
			}
	});

	this.panel = new Ext.grid.GridPanel({
			store			: this.store
		,	cm				: this.cm
		,	width			: 600
		,	autoExpandColumn: 'name'
		,	autoHeight		: true
		,	autoScroll		: true
		,	plugins			: new Ext.ux.grid.GridSummary()
		,	tbar			: [ this.btn_print ]
	});
	
	this.do_print = function()
	{
		var form;
		var id_report	= '28';
		var tipe_report	= 'xls';
		var isinorg		= m_obs_lap_partisipasi.part_org.form.set_org.isChecked();
		
		if (isinorg){
			is_in_org	= '1'
		} else {
			is_in_org	= '0'
		}
		
		form = document.createElement('form');

		form.setAttribute('method', 'post');
		form.setAttribute('target', '_blank');		
		form.setAttribute('action', _g_root +'/report');
		
		var hiddenField1 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
        hiddenField1.setAttribute('name', 'id');
        hiddenField1.setAttribute('value', id_report);
		
		var hiddenField2 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField2.setAttribute('name', 'type');
        hiddenField2.setAttribute('value', tipe_report);

		var hiddenField3 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField3.setAttribute('name', 'is_in_org');
        hiddenField3.setAttribute('value', is_in_org);
		
		var hiddenField4 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField4.setAttribute('name', 'id_dir');
        hiddenField4.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_org.formDirektorat.getValue ());
		
		var hiddenField5 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField5.setAttribute('name', 'id_div');
        hiddenField5.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_org.formDivProSBU.getValue ());
		
		var hiddenField6 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField6.setAttribute('name', 'id_dep');
        hiddenField6.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_org.formDepartemen.getValue());
		
		var hiddenField7 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField7.setAttribute('name', 'id_dinas');
        hiddenField7.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_org.formDinas.getValue());
		
		var hiddenField8 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField8.setAttribute('name', 'id_seksi');
        hiddenField8.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_org.formSeksi.getValue());
		
		var hiddenField9 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField9.setAttribute('name', 'id_wilayah');
        hiddenField9.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_wil.formWilayah.getValue());
		
		var hiddenField10 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField10.setAttribute('name', 'id_area');
        hiddenField10.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_wil.formArea.getValue());
		
		var hiddenField11 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField11.setAttribute('name', 'year');
        hiddenField11.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_waktu.formTahun.getValue());
		
		var hiddenField12 = document.createElement ('input');
        hiddenField1.setAttribute('type', 'hidden');
		hiddenField12.setAttribute('name', 'month');
        hiddenField12.setAttribute('value', m_obs_lap_partisipasi.part_org.form.set_waktu.formBulan.getValue());
		
		form.appendChild(hiddenField1);
		form.appendChild(hiddenField2);
		form.appendChild(hiddenField3);
		form.appendChild(hiddenField4);
		form.appendChild(hiddenField5);
		form.appendChild(hiddenField6);
		form.appendChild(hiddenField7);
		form.appendChild(hiddenField8);
		form.appendChild(hiddenField9);
		form.appendChild(hiddenField10);
		form.appendChild(hiddenField11);
		form.appendChild(hiddenField12);
		document.body.appendChild(form);
		form.submit();
	}
}

function M_ObsLapPartOrgChart(store, title, xField, xTitle, y1)
{
	this.chart = new Ext.ux.HighChart({
		store		: store
	,	xField		: xField
	,	series		: [{
			name		: '% Partisipasi'
		,	dataIndex	: y1
		}]
	,	chartConfig	: {
			chart	: {
				defaultSeriesType : 'column'
			}
		,	title	: {
				text	: title
			}
		,	xAxis	: [{}]
		,	yAxis	: {
				title	: {
					text: '%'
				}
			}
		,	legend	: {
				display	: 'horizontal'
			}
		}
	});

	this.panel = new Ext.Panel({
		border		:true
	,	autoWidth	:true
	,	autoScroll	:true
	,	items		:[
			this.chart
		]
	});

	this.do_refresh = function() {
		this.chart.refresh();
	}
}

function M_ObsLapPartOrg()
{
	this.grid	= new M_ObsLapPartOrgGrid();
	this.form	= new M_ObsLapPartForm(this, true);
	this.chart	= new M_ObsLapPartOrgChart(
				  this.grid.store
				, 'Persentase Partisipasi STOP'
				, 'name'
				, ''
				, 'total_part_percent'
			);

	this.panel = new Ext.Panel({
		title		:'Partisipasi Organisasi/Wilayah'
	,	frame		:false
	,	padding		:'6'
	,	autoWidth	:true
	,	autoScroll	:true
	,	defaults	:{
			style		: {
				marginLeft	:'auto'
			,	marginRight	:'auto'
			,	marginBottom	:'8px'
			}
		}
	,	items		:[
			this.form.panel
		,	this.grid.panel
		,	this.chart.panel
		]
	});

	this.do_load = function(id_dir, id_div, id_dep, id_dinas, id_seksi
				, id_wilayah, id_area, year, month, is_in_org)
	{
		var sub		= '';
		var record;
		var combo;

		if (is_in_org) {
			if (id_seksi != 0) {
				combo	= this.form.set_org.formSeksi;
				record	= combo.findRecord(combo.valueField, id_seksi);
				sub		= 'Seksi '+ record.get(combo.displayField);
			} else if (id_dinas != 0) {
				combo	= this.form.set_org.formDinas;
				record	= combo.findRecord(combo.valueField, id_dinas);
				sub		= 'Dinas '+ record.get(combo.displayField);
			} else if (id_dep != 0) {
				combo	= this.form.set_org.formDepartemen;
				record	= combo.findRecord(combo.valueField, id_dep);
				sub		= 'Departemen '+ record.get(combo.displayField);
			} else if (id_div != 0) {
				combo	= this.form.set_org.formDivProSBU;
				record	= combo.findRecord (combo.valueField, id_div);
				sub		= 'Divisi/Proyek/SBU '+ record.get (combo.displayField);
			} else if (id_dir != 0) {
				combo	= this.form.set_org.formDirektorat;
				record	= combo.findRecord (combo.valueField, id_dir);
				sub		= 'Direktorat '+ record.get (combo.displayField);
			}
		} else {
			if (id_area != 0) {
				combo	= this.form.set_wil.formArea;
				record	= combo.findRecord(combo.valueField, id_area);
				sub	= 'Area '+ record.get(combo.displayField);
			} else if (id_wilayah != 0) {
				combo	= this.form.set_wil.formWilayah;
				record	= combo.findRecord(combo.valueField, id_wilayah);
				sub	= 'Wilayah '+ record.get(combo.displayField);
			}
		}

		if (month != 0) {
			combo	= this.form.set_waktu.formBulan;
			record	= combo.findRecord(combo.valueField, month);
			sub	+= ' - '+ record.get(combo.displayField);
		} else if (sub != '') {
			sub += ' - ';
		}

		sub += ' '+ year;

		this.chart.chart.setSubTitle(sub);

		this.grid.store.load({
			scope		: this
		,	params		: {
				is_in_org	: is_in_org
			,	id_dir		: id_dir
			,	id_div		: id_div
			,	id_dep		: id_dep
			,	id_dinas	: id_dinas
			,	id_seksi	: id_seksi
			,	id_wilayah	: id_wilayah
			,	id_area		: id_area
			,	year		: year
			,	month		: month
			}
		,	callback	:function(r, options, success) {
				if (!success) {
					return;
				}
			}
		});
	}

	this.do_refresh = function(ha_level)
	{
		this.ha_level = ha_level;
		this.form.do_refresh(ha_level);
	}
}

function M_ObsLapPart()
{
	this.part_peg = new M_ObsLapPartPeg();
	this.part_org = new M_ObsLapPartOrg();

	this.panel = new Ext.TabPanel({
		id		:'obs_lap_partisipasi_panel'
	,	activeTab	:0
	,	frame		:false
	,	items		:[
			this.part_peg.panel
		,	this.part_org.panel
		]
	});

	this.do_refresh = function(ha_level)
	{
		this.ha_level = ha_level;

		this.part_peg.do_refresh(ha_level);
		this.part_org.do_refresh(ha_level);
	}
}

m_obs_lap_partisipasi = new M_ObsLapPart()

//@ sourceURL=obs_lap_partisipasi.layout.js
