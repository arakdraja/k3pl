/**
 * Copyright 2011 - PT. Perusahaan Gas Negara Tbk.
 *
 * Author(s):
 * + PT. Awakami
 *   - m.shulhan (ms@kilabit.org)
 */

var m_csm_project;
var m_csm_project_list;
var m_csm_project_kont;
var m_csm_project_and_contractor;
var m_csm_project_form;
var m_csm_project_penilaian;
var m_csm_project_d = _g_root +"/module/csm_project/";
var m_csm_id_proyek;
var m_csm_pg;
var m_csm_id_kontraktor;
var m_ref_csm_d				= _g_root +"/module/ref_csm/";

var	m_csm_fields_kontraktor = new Ext.data.Record.create([
		"id_project"
	,	"nama_project"
	,	"id_kontraktor"
	,	"nama_kontraktor"
	,	"tanggal"
	,	"jenis_pekerjaan"
	,	"tempat_konstruksi"
	,	"total_nilai"
	,	"keterangan"
	]);

var	m_csm_store_kontraktor	= new Ext.data.ArrayStore ({
		url					:m_csm_project_d +"data_kontraktor.jsp"
	,	fields				:m_csm_fields_kontraktor
	,	autoLoad			:false
	});

var m_csm_store_si	= new Ext.data.ArrayStore ({
		url				: m_ref_csm_d +"data_perf_eval_SI.jsp"
	,	fields			:["id","min","max","keterangan"]
	,	idIndex			:0
	,	autoLoad		:false
	,	get_keterangan	: function (v)
		{
			var min;
			var max;
			var r = this.getRange ();
			for (var i = 0; i < r.length; i++) {
				min = parseFloat (r[i].get ("min"));
				max = parseFloat (r[i].get ("max"));

				if (v > min && v <= max) {
					return r[i].get ("keterangan");
				}
			}
		}
	});

function m_csm_store_kontraktor_load ()
{
	m_csm_store_kontraktor.load ({
		params	:{
			id_proyek	:m_csm_id_proyek
		}
	});
}

function CSMProject()
{
	this.fields = new Ext.data.Record.create ([
		"id"
	,	"name"
	,	"id_kontraktor"
	,	"nama_kontraktor"
	,	"koefisien_utama"
	,	"koefisien_tambah"
	,	"passing_grade"
	]);

	this.store	= new Ext.data.ArrayStore ({
		url		:m_csm_project_d +"data_project.jsp"
	,	fields	:this.fields
	,	autoLoad:false
	});

	this.store_projects	= new Ext.data.ArrayStore ({
		url				:m_csm_project_d +"data_unlisted_project.jsp"
	,	fields			:["id","name"]
	,	autoLoad		:false
	});

	this.form_name		= new Ext.form.ComboBox ({
		store			:this.store_projects
	,	allowBlank		:false
	,	valueField		:"id"
	,	displayField	:"name"
	,	triggerAction	:"all"
	,	mode			:"local"
	});

	this.form_koef_utama	= new Ext.form.NumberField ({
		allowBlank			:false
	,	allowNegative		:false
	,	allowDecimals		:true
	,	maxValue			:1
	});

	this.form_koef_tambah	= new Ext.form.NumberField ({
		allowBlank			:false
	,	allowNegative		:false
	,	allowDecimals		:true
	,	maxValue			:1
	});

	this.form_pg	= new Ext.form.NumberField ({
		allowBlank			:false
	,	allowNegative		:false
	,	allowDecimals		:true
	,	minValue			:1
	,	maxValue			:100
	});

	this.cm		= new Ext.grid.ColumnModel ({
		columns	:[{
			header		:"Nama Proyek"
		,	id			:"name"
		,	dataIndex	:"name"
		,	editor		:this.form_name
		},{
			header		:"Passing Grade"
		,	dataIndex	:"passing_grade"
		,	align		:"center"
		,	editor		:this.form_pg
		},{
			header		:"Koefisien Faktor Utama"
		,	dataIndex	:"koefisien_utama"
		,	align		:"center"
		,	editor		:this.form_koef_utama
		},{
			header		:"Koefisien Faktor Penambah"
		,	dataIndex	:"koefisien_tambah"
		,	align		:"center"
		,	editor		:this.form_koef_tambah
		},{
			header		:"Kontraktor Terpilih"
		,	dataIndex	:"nama_kontraktor"
		,	width		:200
		}]
	});

	this.sm				= new Ext.grid.RowSelectionModel ({
		singleSelect	:true
	});

	this.editor		= MyRowEditor (this);
	this.btn_del	= k3pl.button.Delete (this);
	this.btn_ref	= k3pl.button.Refresh (this);
	this.btn_add	= k3pl.button.Add (this);

	this.btn_close	= new Ext.Button({
		text		:"Tutup Penilaian"
	,	iconCls		:"save16"
	,	scope		:this
	,	disabled	:true
	,	handler		:function () {
			this.store_kont_lulus.load({
				params	: {
					id_proyek	:m_csm_id_proyek
				}
			});

			this.win_tutup.show ();
		}
	});

	this.btn_close_ok	= new Ext.Button({
		text			:"Tutup Penilaian"
	,	iconCls			:"save16"
	,	scope			:this
	,	handler			:function () {
			this.do_tutup ();
		}
	});

	this.store_kont_lulus	= new Ext.data.ArrayStore ({
		url					:m_csm_project_d +"data_kontraktor_lulus.jsp"
	,	fields				:["id", "name"]
	,	autoLoad			:false
	});

	this.form_kontraktor	= new Ext.form.ComboBox ({
		fieldLabel			:"Kontraktor Terpilih"
	,	store				:this.store_kont_lulus
	,	valueField			:"id"
	,	displayField		:"name"
	,	triggerAction		:"all"
	,	mode				:"local"
	});

	this.win_tutup	= new Ext.Window ({
		title		:"Penutupan Penilaian"
	,	plain		:true
	,	modal		:true
	,	closeable	:false
	,	closeAction	:"hide"
	,	layout		:"form"
	,	labelAlign	:"right"
	,	labelWidth	:140
	,	width		:420
	,	items		:[
			this.form_kontraktor
		]
	,	bbar		:[
			"->", this.btn_close_ok
		]
	});

	this.panel				= new Ext.grid.GridPanel ({
		region				:"center"
	,	split				:true
	,	autoExpandColumn	:"name"
	,	height				:"30%"
	,	cm					:this.cm
	,	sm					:this.sm
	,	store				:this.store
	,	plugins				:[this.editor]
	,	tbar				:[
			this.btn_del	,"-"
		,	this.btn_ref	,"-"
		,	this.btn_add	,"->"
		,	this.btn_close
		]
	,	listeners			:{
			scope		:this
		,	rowclick	:function (grid, idx, e) {
				var r = this.store.getAt(idx);
				this.do_load_contractor (r);
			}
		,	rowdblclick	:function (grid, idx, e) {
				this.do_edit (idx);
			}
		}
	});

	this.do_edit = function ()
	{
		this.dml = 3;
		this.form_name.setDisabled(true);
	}

	this.do_tutup = function ()
	{
		var r = this.form_kontraktor.getValue();
		if (!r) {
			return true;
		}

		Ext.Ajax.request({
			params  :{
				id_proyek		:m_csm_id_proyek
			,	id_kontraktor	:this.form_kontraktor.getValue()
			}
		,	url		:m_csm_project_d +'submit_tutup_penilaian.jsp'
		,	waitMsg	:'Mohon Tunggu ...'
		,	scope	:this
		,	failure	:function (resp) {
				this.win_tutup.hide();
			}
		,	success :function (resp) {
				var msg = Ext.util.JSON.decode(resp.responseText);

				if (msg.success == false) {
					Ext.Msg.alert('Pesan', msg.info);
				}

				this.store.load();
				this.win_tutup.hide();
			}
		});
	}

	this.do_load_contractor = function (row)
	{
		if (m_csm_project_kont == undefined) {
			return;
		}

		m_csm_id_proyek			= row.data["id"];
		m_csm_pg				= row.data["passing_grade"];

		m_csm_project_kont.do_refresh ();

		var id_kont = row.data["id_kontraktor"];

		if (id_kont == '' || id_kont == '0' || _g_ha == 4) {
			this.btn_close.setDisabled(false);
		} else {
			this.btn_close.setDisabled(true);
		}
	}

	this.do_refresh = function ()
	{
		m_csm_store_si.load ();
		this.store.load();
	}

	this.do_add = function ()
	{
		this.store_projects.load();

		this.record_new = new this.fields({
			id			:0
		,	name		:""
		});

		this.editor.stopEditing();
		this.store.insert(0, this.record_new);
		this.sm.selectRow(0);
		this.form_name.setDisabled(false);
		this.editor.startEditing(0);

		this.dml = 2;
	}

	this.do_cancel = function ()
	{
		if (this.dml == 2) {
			this.store.remove(this.record_new);
			this.sm.selectRow(0);
		}
	}

	this.do_del = function ()
	{
		var r = this.sm.getSelected();
		if (!r) {
			return;
		}

		this.dml = 4;
		this.do_save (r);
	}

	this.do_save = function (r)
	{
		var id = r.data["id"];

		if (this.dml == 2) {
			id = this.form_name.getValue();
		}

		Ext.Ajax.request({
			params  :{
				id			:id
			,	dml			:this.dml
			,	koefisien_utama		:r.data["koefisien_utama"]
			,	koefisien_tambah	:r.data["koefisien_tambah"]
			,	passing_grade		:r.data["passing_grade"]
			}
		,	url		:m_csm_project_d +'submit_project.jsp'
		,	waitMsg	:'Mohon Tunggu ...'
		,	scope	:this
		,	success :function (resp) {
				var msg = Ext.util.JSON.decode(resp.responseText);

				if (msg.success == false) {
					Ext.Msg.alert('Pesan', msg.info);
				}

				this.store.load();
			}
		});
	}
}

function CSMProjectContractor ()
{
	this.store_unlisted		= new Ext.data.ArrayStore ({
		url					:m_csm_project_d +"data_list_kontraktor.jsp"
	,	fields				:["id",	"name"]
	,	autoLoad			:false
	});

	this.form_unlisted		= new Ext.form.ComboBox({
		store				:this.store_unlisted
	,	valueField			:"id"
	,	displayField		:"name"
	,	triggerAction		:"all"
	,	mode				:"local"
	,	editable			:false
	});

	this.cm		= new Ext.grid.ColumnModel ({
		columns	:[{
			header		:"Kontraktor"
		,	dataIndex	:"nama_kontraktor"
		,	id			:"nama_kontraktor"
		,	editor		:this.form_unlisted
		},{
			header		:"Total Nilai"
		,	dataIndex	:"total_nilai"
		,	align		:"center"
		,	sortable	:true
		},{
			header		:"Status Penilaian"
		,	dataIndex	:"keterangan"
		,	width		:200
		}]
	});

	this.sm				= new Ext.grid.RowSelectionModel ({
		singleSelect	:true
	});

	this.editor		= MyRowEditor (this);
	this.btn_del	= k3pl.button.Delete (this);
	this.btn_ref	= k3pl.button.Refresh (this);
	this.btn_add	= k3pl.button.Add (this);

	this.btn_nilai	= new Ext.Button ({
		text		:"Penilaian"
	,	iconCls		:"edit16"
	,	scope		:this
	,	handler		:function () {
			var r = this.sm.getSelected();
			if (!r) {
				return;
			}

			m_csm_project.panel.getLayout().setActiveItem (1);
			m_csm_project_penilaian.do_refresh();
		}
	});

	this.panel				= new Ext.grid.GridPanel ({
		region				:"south"
	,	split				:true
	,	autoExpandColumn	:"nama_kontraktor"
	,	height				:300
	,	cm					:this.cm
	,	sm					:this.sm
	,	store				:m_csm_store_kontraktor
	,	plugins				:this.editor
	,	tbar				:[
			this.btn_del	,"-"
		,	this.btn_ref	,"-"
		,	this.btn_add	,"->"
		,	this.btn_nilai
		]
	,	listeners			:{
			scope		:this
		,	rowclick	:function (grid, idx, e) {
				this.set_kontraktor (idx);
			}
		,	rowdblclick	:function (grid, idx, e) {
				return false;
			}
		}
	});

	this.set_kontraktor = function (rowidx)
	{
		var r = m_csm_store_kontraktor.getAt(rowidx);
		if (!r) {
			return;
		}

		m_csm_id_kontraktor	= r.data["id_kontraktor"];

		m_csm_project_form.panel.getForm ().loadRecord (r);
	}

	this.do_refresh = function ()
	{
		this.store_unlisted.load ({
			params	:{
				id_proyek	:m_csm_id_proyek
			}
		,	callback	:function(records, options, success) {
				if (!success) {
					return;
				}
				m_csm_store_kontraktor_load();
			}
		});
	}

	this.do_del = function ()
	{
		var r = this.sm.getSelected ();
		if (!r) {
			return;
		}

		this.dml = 4;
		this.do_save (r);
	}

	this.do_add = function ()
	{
		this.store_unlisted.load ();

		this.record_new = new m_csm_fields_kontraktor ({
			id_project			:m_csm_id_proyek
		,	id_kontraktor		:''
		,	nama_kontraktor		:''
		,	tanggal				:''
		,	jenis_pekerjaan		:''
		,	tempat_konstruksi	:''
		,	total_nilai			:0
		,	keterangan			:''
		});

		this.editor.stopEditing ();
		m_csm_store_kontraktor.insert(0, this.record_new);
		this.sm.selectRow(0);
		this.editor.startEditing(0);

		this.dml = 2;
	}

	this.do_cancel = function ()
	{
		if (this.dml == 2) {
			m_csm_store_kontraktor.remove (this.record_new);
			this.sm.selectRow (0);
		}
	}

	this.do_save = function (r)
	{
		var id_kontraktor = r.data["id_kontraktor"]

		if (this.dml == 2) {
			id_kontraktor = this.form_unlisted.getValue();
		}

		Ext.Ajax.request({
			params  :{
				id_proyek		:m_csm_id_proyek
			,	id_kontraktor	:id_kontraktor
			,	dml				:this.dml
			}
		,	url		:m_csm_project_d +'submit_kontraktor.jsp'
		,	waitMsg	:'Mohon Tunggu ...'
		,	scope	:this
		,	success :function (resp) {
				var msg = Ext.util.JSON.decode(resp.responseText);

				if (msg.success == false) {
					Ext.Msg.alert('Pesan', msg.info);
				}

				this.do_refresh ();
			}
		});
	}
}

function CSMProjectAndContractor ()
{
	m_csm_project_list	= new CSMProject ();
	m_csm_project_kont	= new CSMProjectContractor ();

	this.panel	= new Ext.Panel ({
		layout	:"border"
	,	items	:[
			m_csm_project_list.panel
		,	m_csm_project_kont.panel
		]
	});

	this.do_refresh = function ()
	{
		m_csm_project_list.do_refresh ();
	}
}

function CSMFormPenilaian ()
{
	this.form_proyek	= new Ext.form.TextField ({
		fieldLabel		:"Nama Proyek"
	,	name			:"nama_project"
	,	readOnly		:true
	});

	this.form_tanggal	= new Ext.form.DateField ({
		fieldLabel		:"Tanggal"
	,	name			:"tanggal"
	,	format			:"Y-m-d"
	,	allowBlank		:false
	});

	this.form_kontraktor= new Ext.form.TextField ({
		fieldLabel		:"Nama Kontraktor"
	,	name			:"nama_kontraktor"
	,	readOnly		:true
	});

	this.form_jp		= new Ext.form.TextField ({
		fieldLabel		:"Jenis Pekerjaan"
	,	name			:"jenis_pekerjaan"
	,	allowBlank		:false
	});

	this.form_tk		= new Ext.form.TextField ({
		fieldLabel		:"Tempat Konstruksi"
	,	name			:"tempat_konstruksi"
	,	allowBlank		:false
	});

	this.form_total		= new Ext.form.NumberField ({
		fieldLabel		:"Total Nilai"
	,	name			:"total_nilai"
	,	readOnly		:true
	});

	this.form_total		= new Ext.form.NumberField ({
		fieldLabel	 	:"Passing Grade"
	,	name			:"passing_grade"
	,	readOnly		:true
	});

	this.form_keterangan= new Ext.form.TextField ({
		fieldLabel		:"Keterangan"
	,	name			:"keterangan"
	,	readOnly		:true
	});

	this.panel	= new Ext.form.FormPanel ({
		labelAlign	:"right"
	,	labelWidth	:200
	,	padding		:8
	,	defaults	:{
			width		: 200
		}
	,	items		:[
			this.form_proyek
		,	this.form_tanggal
		,	this.form_kontraktor
		,	this.form_jp
		,	this.form_tk
		,	this.form_total
		,	this.form_keterangan
		]
	});
}

function CSMFaktorPenilaian2 ()
{
	this.total_nilai = 0;

	this.fields = new Ext.data.Record.create ([
			{name: 'id_project'}
		,	{name: 'id_kontraktor'}
		,	{name: 'id_penilaian'}
		,	{name: 'nama_penilaian'}
		,	{name: 'nilai_maks'}
		,	{name: 'nilai'}
		]);

	this.store			= new Ext.data.ArrayStore ({
			url			: m_csm_project_d +"data_penilaian2.jsp"
		,	fields		: this.fields
		,	autoLoad	: false
		});

	this.form_nilai			= new Ext.form.NumberField ({
			allowDecimals	: true
		,	allowNegative	: false
		,	minValue		: 0.0
		});

	this.cm = new Ext.grid.ColumnModel ({
		columns	: [
				new Ext.grid.RowNumberer ()
			,{
				header			:"Elemen Penilaian"
			,	id				:"nama_penilaian"
			,	dataIndex		:"nama_penilaian"
			,	width			:300
			,	summaryRenderer	: function (v, p, o, scope) {
					return 'Total Nilai';
				}
			},{
				header		:"Maks"
			,	dataIndex	:"nilai_maks"
			,	align		:'center'
			,	summaryType	:'sum'
			},{
				header			:"Nilai Akhir"
			,	dataIndex		:"nilai"
			,	editor			:this.form_nilai
			,	align			:'center'
			,	scope			:this
			,	summaryType		:'sum'
			,	summaryRenderer	:function (v, p, o, scope) {
					var nilai = o.data.nilai;
					m_csm_project_form.form_total.setValue (nilai);

					if (nilai > m_csm_pg) {
						m_csm_project_form.form_keterangan.setValue ("Lulus");
					} else {
						m_csm_project_form.form_keterangan.setValue ("Tidak Lulus");
					}
					return nilai;
				}
			}]
		});

	this.sm				= new Ext.grid.RowSelectionModel({
		singleSelect	:true
	});

	this.summary	= new Ext.ux.grid.GridSummary ({scope:this});

	this.panel				= new Ext.grid.EditorGridPanel ({
		store				:this.store
	,	cm					:this.cm
	,	sm					:this.sm
	,	plugins				:[this.summary]
	,	autoHeight			:true
	,	autoExpandColumn	:"nama_penilaian"
	});

	this.get_data_penilaian = function()
	{
		var data	= [];
		var l		= this.store.getCount ();

		var x;
		for (var i = 0; i < l; i++) {
			x		= {};
			x.id	= this.store.getAt (i).data["id_penilaian"];
			x.nilai	= this.store.getAt (i).data["nilai"];

			data.push(x);
		}

		return data;
	}

	this.do_refresh = function ()
	{
		this.store.load ({
			params	: {
				id_proyek		: m_csm_id_proyek
			,	id_kontraktor	: m_csm_id_kontraktor
			}
		});
	}
}

function CSMPenilaian ()
{
	this.data_utama		= [];

	m_csm_project_form	= new CSMFormPenilaian ();
	this.penilaian		= new CSMFaktorPenilaian2 ();

	this.btn_back	= k3pl.button.Back (this);
	this.btn_ref	= k3pl.button.Refresh (this);
	this.btn_save	= k3pl.button.Save (this);

	this.panel		= new Ext.Panel ({
		title		:"Penilaian"
	,	autoScroll	:true
	,	defaults	:{
			width		:"94%"
		,	style		:{
				marginTop		:"10px"
			,	marginRight		:"auto"
			,	marginLeft		:"auto"
			,	marginBottom	:"10px"
			}
		}
	,	items		:[
			m_csm_project_form.panel
		,	this.penilaian.panel
		]
	,	tbar		:[
			this.btn_back
		,	this.btn_ref
		,	"->"
		,	this.btn_save
		]
	});

	this.do_back = function ()
	{
		m_csm_project_kont.do_refresh();
		m_csm_project.panel.getLayout().setActiveItem(0);
	}

	this.do_refresh = function ()
	{
		this.penilaian.do_refresh ();
	}

	this.do_save = function ()
	{
		var total = parseFloat(this.penilaian.total);

		this.data_utama = this.penilaian.get_data_penilaian ();

		if (this.data_utama.length <= 0) {
			return;
		}

		Ext.Ajax.request({
			url		: m_csm_project_d +'submit_penilaian2.jsp'
		,	params	: {
				id_proyek			: m_csm_id_proyek
			,	id_kontraktor		: m_csm_id_kontraktor
			,	tanggal				: m_csm_project_form.form_tanggal.getValue ()
			,	jenis_pekerjaan		: m_csm_project_form.form_jp.getValue ()
			,	tempat_konstruksi	: m_csm_project_form.form_tk.getValue ()
			,	total_nilai			: m_csm_project_form.form_total.getValue ()
			,	keterangan			: m_csm_project_form.form_keterangan.getValue ()
			,	data_utama			: Ext.encode(this.data_utama)
			}
		,	waitMsg	: 'Mohon Tunggu ...'
		,	scope	: this
		,	failure	: function(response) {
				Ext.Msg.alert('Gagal', response.responseText);
			}
		,	success : function (response) {
				var msg = Ext.util.JSON.decode(response.responseText);

				if (msg.success == false) {
					Ext.Msg.alert('Kesalahan', msg.info);
					return;
				}

				Ext.Msg.alert('Informasi', msg.info);
				this.do_refresh();
			}
		});
	}
}

function MCSMProject ()
{
	m_csm_project_and_contractor	= new CSMProjectAndContractor ();
	m_csm_project_penilaian			= new CSMPenilaian ();

	this.panel		= new Ext.Panel ({
		id			:"csm_project_panel"
	,	layout		:"card"
	,	activeItem	:0
	,	items		:[
			m_csm_project_and_contractor.panel
		,	m_csm_project_penilaian.panel
		]
	});

	this.do_refresh = function ()
	{
		m_csm_project_and_contractor.do_refresh ();
	}
}

m_csm_project = new MCSMProject ();

//@ sourceURL=csm_project.layout.js
