/**
 * Copyright 2011 - PT. Perusahaan Gas Negara Tbk.
 *
 * Author(s):
 * + PT. Awakami
 *   - m.shulhan (ms@kilabit.org)
 */

Ext.Ajax.timeout = 300000;

var k3pl = {
	pageSize	: 50
};

var k3pl_months_wall = [
	['0', 'Semua bulan']
,	['1', 'Januari']
,	['2', 'Februari']
,	['3', 'Maret']
,	['4', 'April']
,	['5', 'Mei']
,	['6', 'Juni']
,	['7', 'Juli']
,	['8', 'Agustus']
,	['9', 'September']
,	['10', 'Oktober']
,	['11', 'November']
,	['12', 'Desember']
];

var k3pl_months = [
	[1, 'Januari']
,	[2, 'Februari']
,	[3, 'Maret']
,	[4, 'April']
,	[5, 'Mei']
,	[6, 'Juni']
,	[7, 'Juli']
,	[8, 'Agustus']
,	[9, 'September']
,	[10, 'Oktober']
,	[11, 'November']
,	[12, 'Desember']
];

/**
 *  fix for missing horizontal scroll when autoHeight is set
 */
Ext.override (Ext.grid.GridView,{
refresh: Ext.grid.GridView.prototype.refresh.createSequence(function(){
		if (this.grid.autoHeight){
			var body = this.grid.el.select('.x-grid3-body').first();
			var height = this.grid.getGridEl().getHeight()-this.scroller.getHeight()+body.getHeight() + 30;
			this.grid.getGridEl().setHeight(height);
			this.scroller.setStyle({
				overflow: 'auto'
			});
			this.grid.autoHeight = false;
			this.layout();
			this.grid.autoHeight = true;
		}
	})
});

/* fix for hidden button in RowEditor when grid height is set to auto */
Ext.override(Ext.grid.GridView, {
	getEditorParent: function() {
		return document.body;
	}
});

function MyRowEditor(obj) {
	return new Ext.ux.grid.RowEditor({
		saveText	: 'Simpan'
	,	cancelText	: 'Batal'
	,	clicksToEdit: 2
	,	listeners	: {
			canceledit: function(roweditor, state) {
				if (state === true) {
					obj.do_cancel();
				}
			}
		,	afteredit: function(roweditor, object, record, idx) {
				obj.do_save(record);
			}
		}
	});
}

function combo_renderer(combo)
{
        return function(value) {
                var idx = combo.store.find(combo.valueField, value);
                if (idx < 0) {
                        return value;
                }
                var rec = combo.store.getAt(idx);
                return rec ? rec.get(combo.displayField) : "";
        }
}

function store_renderer(valueField, displayField, store)
{
	return function(v) {
		var i = store.find(valueField, v);
		if (i < 0) {
			return v;
		}
		var rec = store.getAt(i);
		return rec ? rec.get(displayField) : "";
	}
}

function checkbox_renderer(checkbox, str_true, str_false)
{
	return function(value) {
		if (value == '1' || value == 'true' || value == true) {
			return str_true;
		} else {
			return str_false;
		}
	}
}

/**
 * @params:
 *	> n_last_year	: number of list.
 * @desc:
 *	create array of year from current year to
 *	(current_year - n_last_year).
 *
 *  if current month == 12 then add next year to the list.
 */
function k3pl_create_form_year_data (n_last_year)
{
	var d		= new Date ();
	var y		= d.getFullYear();
	var m		= d.getMonth ();
	var years	= [];

	if (m == 11) {
		y++;
	}

	for (var i = 0; i < n_last_year; i++) {
		var a = [];
		a.push ((y - i));
		years.push (a);
	}

	return years;
}

/*
 * Add filtering on Ext.form.ComboBox
 */
Ext.form.ComboBox.prototype.filterBy = function(fn, scope) {
	var ds = this.store;

	ds.filterBy(fn, scope);
	ds.realSnapshot = ds.snapshot;
	ds.snapshot = ds.data;
};

Ext.form.ComboBox.prototype.clearFilter = function(suppressEvent) {
	var ds = this.store;

	if (ds.realSnapshot && ds.realSnapshot != ds.snapshot) {
		ds.snapshot = ds.realSnapshot;
		delete ds.realSnapshot;
	}
	ds.clearFilter(suppressEvent);
};

/*
 * Add some space between label and form.
 */
Ext.form.FormPanel.prototype.labelSeparator	=' : ';
Ext.form.FieldSet.prototype.labelSeparator	=' : ';

/*
 * show warning 'allowBlank:false' in the right side of the form.
 */
Ext.form.Field.prototype.msgTarget = 'side';

/*
 * Hiding series in Chart.
 * @ref: http://technopaper.blogspot.com/2010/06/hiding-series-in-extjs-charts.html
 */
Ext.override(Ext.chart.Chart, {
    setSeriesStylesByIndex: function(index, styles){
        this.swf.setSeriesStylesByIndex(index, Ext.encode(styles));
    }
});

/*
 * Dynamically add/remove field in grid.
 * @ref: http://www.sencha.com/forum/showthread.php?53009-Adding-removing-fields-and-columns
 */
Ext.override(Ext.data.Store,{
	pruneModifiedRecords	: true
,	addField: function(field){
		field = new Ext.data.Field(field);
		this.recordType.prototype.fields.replace(field);
		if(typeof field.defaultValue != 'undefined'){
			this.each(function(r){
				if(typeof r.data[field.name] == 'undefined'){
					r.data[field.name] = field.defaultValue;
				}
			});
		}
		delete this.reader.ef;
		this.reader.buildExtractors();
	}
,	removeField: function(name){
		this.recordType.prototype.fields.removeKey(name);
		this.each(function(r){
			delete r.data[name];
			if(r.modified){
				delete r.modified[name];
			}
		});
		delete this.reader.ef;
		this.reader.buildExtractors();
	}
});

Ext.override(Ext.grid.ColumnModel,{
	addColumn: function(column, colIndex){
		if(typeof column == 'string'){
			column = {header: column, dataIndex: column};
		}
		var config = this.config;
		this.config = [];
		if(typeof colIndex == 'number'){
			config.splice(colIndex, 0, column);
		}else{
			colIndex = config.push(column);
		}
		this.setConfig(config);
		return colIndex;
	},
	removeColumn: function(colIndex){
		var config = this.config;
		this.config = [config[colIndex]];
		config.splice(colIndex, 1);
		this.setConfig(config);
	}
});

Ext.override(Ext.grid.GridPanel,{
	addColumn: function(field, column, colIndex){
		if(!column){
			if(field.dataIndex){
				column = field;
				field = field.dataIndex;
			} else{
				column = field.name || field;
			}
		}
		this.store.addField(field);
		return this.colModel.addColumn(column, colIndex);
	}
,	removeColumn: function(name, colIndex){
		this.store.removeField(name);
		if(typeof colIndex != 'number'){
			colIndex = this.colModel.findColumnIndex(name);
		}
		if(colIndex >= 0){
			this.colModel.removeColumn(colIndex);
		}
	}
,	loadMask: true
});

/**
 * Fix for horizontal scroll in hbox layout
 */
Ext.override (Ext.layout.BoxLayout, {
	updateInnerCtSize: function(tSize, calcs) {
		var align   = this.align
		,	padding = this.padding
		,	width   = tSize.width
		,	height  = tSize.height;

		if (this.type == 'hbox') {
			var innerCtWidth  = Math.max(width, calcs.meta.minimumWidth)
			,	innerCtHeight = calcs.meta.maxHeight + padding.top + padding.bottom;

			if (align == 'stretch') {
				innerCtHeight = height;
			} else if (align == 'middle') {
				innerCtHeight = Math.max(height, innerCtHeight);
			}
		} else {
			var innerCtHeight = height
			,	innerCtWidth  = calcs.meta.maxWidth + padding.left + padding.right;

			if (align == 'stretch') {
				innerCtWidth = width;
			} else if (align == 'center') {
				innerCtWidth = Math.max(width, innerCtWidth);
			}
		}

		this.innerCt.setSize(innerCtWidth || undefined, innerCtHeight || undefined);
	}
});

/**
 * Add isChecked method to FieldSet
 */
Ext.override( Ext.form.FieldSet, {
	isChecked: function() {
		return this.getEl().child('legend').child('input').dom.checked;
	}
});

/**
 * Highchart
 * - set default export url.
 * - disabled print button and credits.
 */
Highcharts.setOptions ({
	credits		: {
		enabled	: false
	}
,	exporting	: {
		url			: '/highcharts-export'
	,	buttons		: {
			printButton	: {
				enabled		: false
			}
		}
	}
});

/*
 * common record, store and combobox with functions
 */
Ext.ns('k3pl.record');

k3pl.record.Direktorat = new Ext.data.Record.create ([
		{name:'id'}
	,	{name:'name'}
	]);

k3pl.record.DivProSBU = new Ext.data.Record.create ([
		{name:'id_direktorat'}
	,	{name:'id'}
	,	{name:'name'}
	,	{name:'status'}
	]);

k3pl.record.Departemen = new Ext.data.Record.create([
		{name:'id_direktorat'}
	,	{name:'id_divprosbu'}
	,	{name:'id'}
	,	{name:'name'}
	]);

k3pl.record.Dinas = new Ext.data.Record.create([
		{name:'id_direktorat'}
	,	{name:'id_divprosbu'}
	,	{name:'id_departemen'}
	,	{name:'id'}
	,	{name:'name'}
	]);

k3pl.record.Seksi = new Ext.data.Record.create([
		{name:'id_direktorat'}
	,	{name:'id_divprosbu'}
	,	{name:'id_departemen'}
	,	{name:'id_dinas'}
	,	{name:'id'}
	,	{name:'name'}
	]);

k3pl.record.Wilayah = new Ext.data.Record.create([
		{name:'id'}
	,	{name:'name'}
	]);

k3pl.record.Area = new Ext.data.Record.create([
		{name:'id_direktorat'}
	,	{name:'id_divprosbu'}
	,	{name:'id_departemen'}
	,	{name:'id_dinas'}
	,	{name:'id_wilayah'}
	,	{name:'id'}
	,	{name:'name'}
	]);

Ext.ns('k3pl.store');

k3pl.store.Direktorat = new Ext.data.ArrayStore ({
		fields		: k3pl.record.Direktorat
	,	url			: _g_root +'/module/ref_organisasi/data_direktorat.jsp'
	,	autoLoad	: false
	,	idIndex		: 0
	});

k3pl.store.DivProSBU = new Ext.data.ArrayStore ({
		fields		: k3pl.record.DivProSBU
	,	url			: _g_root +'/module/ref_organisasi/data_divprosbu.jsp'
	,	autoLoad	: false
	,	idIndex		: 1
	});

k3pl.store.Departemen = new Ext.data.ArrayStore({
		fields		: k3pl.record.Departemen
	,	url			: _g_root +'/module/ref_organisasi/data_departemen.jsp'
	,	autoLoad	: false
	,	idIndex		: 2
	});

k3pl.store.Dinas = new Ext.data.ArrayStore({
		fields		: k3pl.record.Dinas
	,	url			: _g_root +'/module/ref_organisasi/data_dinas.jsp'
	,	autoLoad	: false
	,	idIndex		: 3
	});

k3pl.store.Seksi = new Ext.data.ArrayStore({
		fields		: k3pl.record.Seksi
	,	url			: _g_root +'/module/ref_organisasi/data_seksi.jsp'
	,	autoLoad	: false
	,	idIndex		: 4
	});

k3pl.store.Wilayah = new Ext.data.ArrayStore({
		fields		: k3pl.record.Wilayah
	,	url			: _g_root +'/module/ref_area/data_wilayah.jsp'
	,	autoLoad	: false
	,	idIndex		: 0
	});

k3pl.store.Area = new Ext.data.ArrayStore({
		fields		: k3pl.record.Area
	,	url			: _g_root +'/module/ref_area/data_area.jsp'
	,	autoLoad	: false
	,	idIndex		: 5
	});

Ext.ns('k3pl.form');

k3pl.form.Seksi = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel		:'Seksi'
			,	store			:k3pl.store.Seksi
			,	width			:300
			,	listWidth		:400
			,	valueField		:'id'
			,	displayField	:'name'
			,	emptyText		:'Nama Seksi'
			,	allowBlank		:false
			,	triggerAction	:'all'
			,	mode			:'local'
			,	typeAhead		:true
			,	itemAll			:false
			,	itemAllText		:'Semua Seksi'
			,	itemAllRecord	:undefined
			}
		);

		k3pl.form.Seksi.superclass.constructor.apply(this, arguments);
	}

,	do_load: function()
	{
		this.store.load({
			scope	:this
		,	callback:function (r, options, success) {
				if (!success) {
					return;
				}

				if (this.itemAll) {
					this.itemAllRecord = new k3pl.record.Seksi({
						id_direktorat	:0
					,	id_divprosbu	:0
					,	id_departemen	:0
					,	id_dinas		:0
					,	id				:0
					,	name			:this.itemAllText
					});

					this.store.insert(0, this.itemAllRecord);
				}

				if (this.store.getTotalCount() > 0) {
					var id_dir		= Ext.util.Cookies.get ('user.direktorat');
					var id_div		= Ext.util.Cookies.get ('user.divprosbu');
					var id_dep		= Ext.util.Cookies.get ('user.departemen');
					var id_dinas	= Ext.util.Cookies.get ('user.dinas');
					var id_seksi	= Ext.util.Cookies.get ('user.seksi');

					this.do_filter (id_dir, id_div, id_dep, id_dinas);

					this.setValue (id_seksi == null ? this.store.getAt(0).get('id') : id_seksi);
				}
			}
		});
	}

,	do_filter: function (id_dir, id_div, id_dep, id_dinas)
	{
		this.clearFilter (true);

		this.filterBy (function (r, id)
		{
			var dir		= r.get('id_direktorat');
			var div		= r.get('id_divprosbu');
			var dep		= r.get('id_departemen');
			var dinas	= r.get('id_dinas');
			var seksi	= r.get('id');

			if (seksi == 0) {
				return true;
			} else if (id_dinas == 0) {
				if (id_dep == 0) {
					if (dir == id_dir && div == id_div) {
						return true;
					}
				} else if (dir == id_dir && div == id_div && dep == id_dep) {
					return true;
				}
			} else if (dir == id_dir && div == id_div && dep == id_dep && dinas == id_dinas) {
				return true;
			}
			return false;
		}
		, this);
	}
});

k3pl.form.Dinas = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel		:'Dinas'
			,	store			:k3pl.store.Dinas
			,	valueField		:'id'
			,	displayField	:'name'
			,	emptyText		:'Nama Dinas'
			,	allowBlank		:false
			,	triggerAction	:'all'
			,	mode			:'local'
			,	width			:300
			,	listWidth		:400
			,	formSeksi		:undefined
			,	itemAll			:false
			,	itemAllText		:'Semua Dinas'
			,	itemAllRecord	:undefined
			}
		);

		k3pl.form.Dinas.superclass.constructor.apply(this, arguments);

		this.on('select', function(cb, record, id) {
			if (this.formSeksi == undefined) {
				return;
			}

			var id_dir		= record.get('id_direktorat');
			var id_div		= record.get('id_divprosbu');
			var id_dep		= record.get('id_departemen');
			var id_dinas	= record.get('id');
			var id_seksi	= 0;

			if (id_dinas == 0) {
				id_dep = this.ownerCt.formDepartemen.getValue ();
				id_div = this.ownerCt.formDivProSBU.getValue ();
				id_dir = this.ownerCt.formDirektorat.getValue ();
			}

			if (this.formSeksi != undefined) {
				this.formSeksi.do_filter (id_dir, id_div, id_dep, id_dinas);
				id_seksi = this.formSeksi.store.getAt (0).get ('id');
				this.formSeksi.setValue (id_seksi);
			}
		});
	}

,	do_load: function()
	{
		this.store.load({
			scope	:this
		,	callback:function (r, options, success) {
				if (!success) {
					return;
				}

				if (this.itemAll) {
					this.itemAllRecord = new k3pl.record.Dinas ({
						id_direktorat	:0
					,	id_divprosbu	:0
					,	id_departemen	:0
					,	id				:0
					,	name			:this.itemAllText
					});

					this.store.insert(0, this.itemAllRecord);
				}

				if (this.formSeksi != undefined) {
					this.formSeksi.do_load();
				}

				if (this.store.getTotalCount() > 0) {
					var id_dir		= Ext.util.Cookies.get ('user.direktorat');
					var id_div		= Ext.util.Cookies.get ('user.divprosbu');
					var id_dep		= Ext.util.Cookies.get ('user.departemen');
					var id_dinas	= Ext.util.Cookies.get ('user.dinas');

					this.do_filter (id_dir, id_div, id_dep);

					this.setValue (id_dinas == null ? this.store.getAt(0).get('id') : id_dinas);
				}
			}
		});
	}

,	do_filter: function (id_dir, id_div, id_dep)
	{
		this.clearFilter (true);

		this.filterBy(function (r, id)
		{
			var dinas	= r.get('id');
			var dep		= r.get('id_departemen');
			var div		= r.get('id_divprosbu');
			var dir		= r.get('id_direktorat');

			if (dinas == 0) {
				return true;
			} else if (id_dep == 0) {
				if (dir	== id_dir && div == id_div) {
					return true;
				}
			} else if (dir == id_dir && div == id_div && dep == id_dep) {
				return true;
			}
			return false;
		}
		, this);
	}
});

k3pl.form.Departemen = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel		:'Departemen'
			,	store			:k3pl.store.Departemen
			,	valueField		:'id'
			,	displayField	:'name'
			,	emptyText		:'Nama Departemen'
			,	allowBlank		:false
			,	triggerAction	:'all'
			,	mode			:'local'
			,	typeAhead		:true
			,	width			:300
			,	listWidth		:400
			,	formSeksi		:undefined
			,	formDinas		:undefined
			,	itemAll			:false
			,	itemAllText		:'Semua Departemen'
			,	itemAllRecord	:undefined
			}
		);

		k3pl.form.Departemen.superclass.constructor.apply(this, arguments);

		this.on('select', function(cb, record, id) {
			if (this.formSeksi != undefined) {
				this.formSeksi.clearFilter(true);
				this.formSeksi.setValue(this.formSeksi.store.getAt(0).get('id'));
			}

			if (this.formDinas == undefined) {
				return;
			}

			var id_dir		= record.get ('id_direktorat');
			var id_div		= record.get ('id_divprosbu');
			var id_dep		= record.get ('id');
			var id_dinas	= 0;
			var id_seksi	= 0;

			if (id_dep == 0) {
				id_dir = this.ownerCt.formDirektorat.getValue ();
				id_div = this.ownerCt.formDivProSBU.getValue ();
			}

			if (this.formDinas != undefined) {
				this.formDinas.do_filter (id_dir, id_div, id_dep);
				id_dinas = this.formDinas.store.getAt (0).get ('id');
				this.formDinas.setValue (id_dinas);
			}
			if (this.formSeksi != undefined) {
				this.formSeksi.do_filter (id_dir, id_div, id_dep, id_dinas);
				id_seksi = this.formSeksi.store.getAt (0).get ("id");
				this.formSeksi.setValue (id_seksi);
			}
		});
	}

,	do_load: function()
	{
		this.store.load({
			scope	:this
		,	callback:function (r, options, success) {
				if (!success) {
					return;
				}

				if (this.itemAll) {
					this.itemAllRecord = new k3pl.record.Departemen ({
						id_direktorat	:0
					,	id_divprosbu	:0
					,	id				:0
					,	name			:this.itemAllText
					});

					this.store.insert(0, this.itemAllRecord);
				}

				if (this.formDinas != undefined) {
					this.formDinas.do_load();
				}

				if (this.store.getTotalCount() > 0) {
					this.id_dir = Ext.util.Cookies.get ('user.direktorat');
					this.id_div = Ext.util.Cookies.get ('user.divprosbu');

					var id_dep = Ext.util.Cookies.get ('user.departemen');

					this.do_filter (this.id_dir, this.id_div);
					this.setValue (id_dep == null ? this.store.getAt(0).get('id') : id_dep);
				}
			}
		});
	}

,	do_filter: function (id_dir, id_div)
	{
		this.clearFilter (true);

		this.filterBy (function (r, id)
		{
			var dir	= r.get ('id_direktorat');
			var div	= r.get ('id_divprosbu');
			var dep = r.get ("id");

			if (dep == 0) {
				return true;
			} else if (id_div == 0) {
				if (dir == id_dir) {
					return true;
				}
			} else if (dir == id_dir && div == id_div) {
				return true;
			}
			return false;
		}
		, this);
	}
});

k3pl.form.DivProSBU = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel		:'Divisi/Proyek/SBU'
			,	store			:k3pl.store.DivProSBU
			,	valueField		:'id'
			,	displayField	:'name'
			,	emptyText		:'Nama Divisi/Proyek/SBU'
			,	allowBlank		:false
			,	triggerAction	:'all'
			,	mode			:'local'
			,	typeAhead		:true
			,	width			:300
			,	listWidth		:400
			,	formSeksi		:undefined
			,	formDinas		:undefined
			,	formDepartemen	:undefined
			,	itemAll			:false
			,	itemAllText		:'Semua Divisi/Proyek/SBU'
			,	itemAllRecord	:undefined
			}
		);

		k3pl.form.DivProSBU.superclass.constructor.apply(this, arguments);

		this.on('select', function(cb, record, id) {
			if (this.formSeksi != undefined) {
				this.formSeksi.clearFilter(true);
				this.formSeksi.setValue(this.formSeksi.store.getAt(0).get('id'));
			}

			if (this.formDinas != undefined) {
				this.formDinas.clearFilter(true);
				this.formDinas.setValue(this.formDinas.store.getAt(0).get('id'));
			}

			var id_dir		= record.get('id_direktorat');
			var id_div		= record.get('id');
			var id_dep		= 0;
			var id_dinas	= 0;
			var id_seksi	= 0;

			if (id_div == 0) {
				id_dir = this.ownerCt.formDirektorat.getValue ();
			}

			if (this.formDepartemen != undefined) {
				this.formDepartemen.do_filter (id_dir, id_div);
				id_dep = this.formDepartemen.store.getAt (0).get ('id');
				this.formDepartemen.setValue (id_dep);
			}
			if (this.formDinas != undefined) {
				this.formDinas.do_filter (id_dir, id_div, id_dep);
				id_dinas = this.formDinas.store.getAt (0).get ("id");
				this.formDinas.setValue (id_dinas);
			}
			if (this.formSeksi != undefined) {
				this.formSeksi.do_filter (id_dir, id_div, id_dep, id_dinas);
				id_seksi = this.formSeksi.store.getAt (0).get ("id");
				this.formSeksi.setValue (id_seksi);
			}
		});
	}

,	do_load: function()
	{
		this.store.load({
			scope	:this
		,	callback:function (r, options, success) {
				if (!success) {
					return;
				}

				if (this.itemAll) {
					this.itemAllRecord = new k3pl.record.DivProSBU ({
						id_direktorat	:Ext.util.Cookies.get ('user.direktorat')
					,	id				:0
					,	name			:this.itemAllText
					,	status			:0
					});

					this.store.insert(0, this.itemAllRecord);
				}

				if (this.formDepartemen != undefined) {
					this.formDepartemen.do_load();
				}

				if (this.store.getTotalCount() > 0) {
					var id_dir = Ext.util.Cookies.get ('user.direktorat');
					var id_div = Ext.util.Cookies.get ('user.divprosbu');

					this.do_filter (id_dir);

					this.setValue (id_div == null ? this.store.getAt(0).get('id') : id_div);
				}
			}
		});
	}

,	do_filter: function (id_dir)
	{
		this.clearFilter (true);

		this.filterBy (function (r, id)
		{
			var dir	= r.get('id_direktorat');
			var div	= r.get('id');

			if (div	== 0) {
				return true;
			} else if (dir == id_dir) {
				return true;
			}
			return false;
		}
		, this);
	}
});

k3pl.form.Direktorat = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel		:'Direktorat'
			,	store			:k3pl.store.Direktorat
			,	valueField		:'id'
			,	displayField	:'name'
			,	emptyText		:'Nama Direktorat'
			,	allowBlank		:false
			,	triggerAction	:'all'
			,	mode			:'local'
			,	typeAhead		:true
			,	width			:300
			,	listWidth		:400
			,	formSeksi		:undefined
			,	formDinas		:undefined
			,	itemAll			:false
			,	itemAllText		:'Semua Direktorat'
			,	itemAllRecord	:undefined
			}
		);

		k3pl.form.Direktorat.superclass.constructor.apply(this, arguments);

		this.on('select', function(cb, record, id) {
			if (this.formSeksi != undefined) {
				this.formSeksi.clearFilter(true);
				this.formSeksi.setValue(this.formSeksi.store.getAt(0).get('id'));
			}

			if (this.formDinas != undefined) {
				this.formDinas.clearFilter(true);
				this.formDinas.setValue(this.formDinas.store.getAt(0).get('id'));
			}

			if (this.formDepartemen != undefined) {
				this.formDepartemen.clearFilter(true);
				this.formDepartemen.setValue(this.formDepartemen.store.getAt(0).get('id'));
			}

			var id_dir	= record.get('id');

			this.formDivProSBU.do_filter (id_dir);
			this.formDivProSBU.setValue (this.formDivProSBU.store.getAt(0).get('id'));
		});
	}

,	do_load: function()
	{
		this.store.load({
			scope	:this
		,	callback:function (r, options, success) {
				if (!success) {
					return;
				}

				if (this.itemAll) {
					this.itemAllRecord = new k3pl.record.Direktorat ({
						id				:0
					,	name			:this.itemAllText
					});

					this.store.insert(0, this.itemAllRecord);
				}

				if (this.formDivProSBU != undefined) {
					this.formDivProSBU.do_load();
				}

				if (this.store.getTotalCount() > 0) {
					var id_dir = Ext.util.Cookies.get ('user.direktorat');
					this.setValue (id_dir == null ? this.store.getAt(0).get('id') : id_dir);
				}
			}
		});
	}
});

k3pl.form.Area = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel	:'Area'
			,	store		:k3pl.store.Area
			,	valueField	:'id'
			,	displayField	:'name'
			,	emptyText	:'Nama Area'
			,	allowBlank	:false
			,	triggerAction	:'all'
			,	mode		:'local'
			,	typeAhead	:true
			,	width		:300
			,	listWidth	:400
			,	itemAll		:false
			,	itemAllText	:'Semua Area'
			,	itemAllRecord	:undefined
			}
		);

		k3pl.form.Area.superclass.constructor.apply(this, arguments);
	}
,	do_load: function()
	{
		this.store.load({
			scope	:this
		,	callback:function (r, options, success) {
				if (!success) {
					return;
				}

				if (this.itemAll) {
					this.itemAllRecord = new k3pl.record.Area ({
						id_wilayah	:0
					,	id		:0
					,	name		:this.itemAllText
					});

					this.store.insert(0, this.itemAllRecord);
				}

				if (this.store.getTotalCount() > 0) {
					this.setValue(this.store.getAt(0).get('id'));
				}
			}
		});
	}
});

k3pl.form.Wilayah = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel	:'Wilayah'
			,	store		:k3pl.store.Wilayah
			,	valueField	:'id'
			,	displayField	:'name'
			,	emptyText	:'Nama Wilayah'
			,	allowBlank	:false
			,	triggerAction	:'all'
			,	mode		:'local'
			,	typeAhead	:true
			,	width		:300
			,	listWidth	:400
			,	formArea	:undefined
			,	itemAll		:false
			,	itemAllText	:'Semua Wilayah'
			,	itemAllRecord	:undefined
			}
		);

		k3pl.form.Wilayah.superclass.constructor.apply(this, arguments);

		this.on('select', function(cb, record, id) {
			if (this.formArea == undefined) {
				return;
			}

			this.id_wilayah = record.get('id');

			this.formArea.clearFilter(true);

			this.formArea.filterBy(function (r, id)
			{
				var id_wilayah	= r.get('id_wilayah');

				if (this.id_wilayah	== 0
				|| id_wilayah		== 0
				|| id_wilayah		== this.id_wilayah) {
					return true;
				}
				return false;
			}
			, this);

			this.formArea.setValue(this.formArea.store.getAt(0).get('id'));
		});
	}
,	do_load: function()
	{
		this.store.load({
			scope	:this
		,	callback:function (r, options, success) {
				if (!success) {
					return;
				}

				if (this.itemAll) {
					this.itemAllRecord = new k3pl.record.Wilayah ({
						id		:0
					,	name		:this.itemAllText
					});

					this.store.insert(0, this.itemAllRecord);
				}

				if (this.formArea != undefined) {
					this.formArea.do_load();
				}

				if (this.store.getTotalCount() > 0) {
					this.setValue(this.store.getAt(0).get('id'));
				}
			}
		});
	}
});

k3pl.form.Tahun = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel	: 'Tahun'
			,	store		: new Ext.data.ArrayStore({
					fields	: ['year']
				,	data	: k3pl_create_form_year_data(10)
				})
			,	width		:300
			,	valueField	:'year'
			,	displayField	:'year'
			,	allowBlank	:false
			,	editable	:false
			,	triggerAction	:'all'
			,	mode		:'local'
			}
		);

		k3pl.form.Tahun.superclass.constructor.apply(this, arguments);
	}

,	do_load: function()
	{
		this.setValue(this.store.getAt(0).get('year'));
	}
});

k3pl.form.Bulan = Ext.extend (Ext.form.ComboBox, {
	constructor: function (config) {
		Ext.apply (this
		,	config
		,	{
				fieldLabel	: 'Bulan'
			,	store		:new Ext.data.ArrayStore({
					fields	:['id','name']
				})
			,	width		:300
			,	valueField	:'id'
			,	displayField	:'name'
			,	allowBlank	:false
			,	editable	:false
			,	triggerAction	:'all'
			,	mode		:'local'
			}
		);

		k3pl.form.Bulan.superclass.constructor.apply(this, arguments);

		if (config && config.itemAll) {
			this.store.loadData(k3pl_months_wall);
		} else {
			this.store.loadData(k3pl_months);
		}
	}

,	do_load: function()
	{
		this.setValue(this.store.getAt(0).get('id'));
	}
});

k3pl.form.SetOrganisasi = Ext.extend (Ext.form.FieldSet, {
	constructor: function (config) {
		config.formSeksi		= new k3pl.form.Seksi (config);
		config.formDinas		= new k3pl.form.Dinas (config);
		config.formDepartemen	= new k3pl.form.Departemen (config);
		config.formDivProSBU	= new k3pl.form.DivProSBU (config);
		config.formDirektorat	= new k3pl.form.Direktorat (config);
		config.labelWidth		= 120;

		Ext.apply(this
		, config
		,	{
				title			:'Organisasi'
			,	checkboxToggle	:true
			,	autoHeight		:true
			,	collapsed		:false
			,	scope			:this
			,	formDirektorat	:undefined
			,	formDivProSBU	:undefined
			,	formDepartemen	:undefined
			,	formDinas		:undefined
			,	formSeksi		:undefined
			}
		);

		k3pl.form.SetOrganisasi.superclass.constructor.apply(this, arguments);

		this.add(config.formDirektorat);
		this.add(config.formDivProSBU);
		this.add(config.formDepartemen);
		this.add(config.formDinas);
		this.add(config.formSeksi);

		this.on('collapse', function(panel) {
			this.formDirektorat.setValue (0);
			this.formDivProSBU.clearFilter ();
			this.formDivProSBU.setValue (0);
			this.formDepartemen.clearFilter ();
			this.formDepartemen.setValue(0);
			this.formDinas.clearFilter();
			this.formDinas.setValue(0);
			this.formSeksi.clearFilter();
			this.formSeksi.setValue(0);
		});

		this.on ('expand', function (panel) {
			var id_dir		= Ext.util.Cookies.get ('user.direktorat');
			var id_div		= Ext.util.Cookies.get ('user.divprosbu');
			var id_dep		= Ext.util.Cookies.get ('user.departemen');
			var id_dinas	= Ext.util.Cookies.get ('user.dinas');
			var id_seksi	= Ext.util.Cookies.get ('user.seksi');

			this.formDirektorat.clearFilter ();
			this.formDirektorat.setValue (id_dir == null ? 0 : id_dir);
			this.formDivProSBU.clearFilter ();
			this.formDivProSBU.setValue (id_div == null ? 0 : id_div);
			this.formDepartemen.clearFilter ();
			this.formDepartemen.setValue (id_dep == null ? 0 : id_dep);
			this.formDinas.clearFilter ();
			this.formDinas.setValue (id_dinas == null ? 0 : id_dinas);
			this.formSeksi.clearFilter ();
			this.formSeksi.setValue (id_seksi == null ? 0 : id_seksi);
		});
	}

,	do_load: function()
	{
		this.formDirektorat.do_load();

		// disable form directorat and DivProSbu if group != 1
		var group	= parseInt (Ext.util.Cookies.get ('user.group'));
		var wilayah	= parseInt (Ext.util.Cookies.get ('user.wilayah'));

		if (group == 1) {
			this.formDirektorat.setDisabled (false);
			this.formDivProSBU.setDisabled (false);
		} else {
			this.formDirektorat.setDisabled (true);
			this.formDivProSBU.setDisabled (true);
		}

		/* Enable divisi only if wilayah is in "Kantor Pusat" */
		if (wilayah == 21) {
			this.formDivProSBU.setDisabled (false);
		}
	}
});

k3pl.form.SetOrganisasiLess = Ext.extend (Ext.form.FieldSet, {
	constructor: function (config) {
		config.formDivProSBU	= new k3pl.form.DivProSBU (config);
		config.formDirektorat	= new k3pl.form.Direktorat (config);
		config.labelWidth		= 120;

		Ext.apply(this
		, config
		,	{
				title			:'Organisasi'
			,	checkboxToggle	:false
			,	autoHeight		:true
			,	collapsed		:false
			,	scope			:this
			,	formDirektorat	:undefined
			,	formDivProSBU	:undefined
			}
		);

		k3pl.form.SetOrganisasiLess.superclass.constructor.apply(this, arguments);

		this.add(config.formDirektorat);
		this.add(config.formDivProSBU);

		this.on('collapse', function(panel) {
			this.formDirektorat.setValue (0);
			this.formDivProSBU.clearFilter ();
			this.formDivProSBU.setValue (0);
		});

		this.on ('expand', function (panel) {
			var id_dir		= Ext.util.Cookies.get ('user.direktorat');
			var id_div		= Ext.util.Cookies.get ('user.divprosbu');

			this.formDirektorat.clearFilter ();
			this.formDirektorat.setValue (id_dir == null ? 0 : id_dir);
			this.formDivProSBU.clearFilter ();
			this.formDivProSBU.setValue (id_div == null ? 0 : id_div);
		});
	}

,	do_load: function()
	{
		this.formDirektorat.do_load();

		// disable form directorat and DivProSbu if group != 1
		var group	= parseInt (Ext.util.Cookies.get ('user.group'));

		if (group == 1) {
			this.formDirektorat.setDisabled (false);
			this.formDivProSBU.setDisabled (false);
		} else {
			this.formDirektorat.setDisabled (true);
			this.formDivProSBU.setDisabled (true);
		}
	}
});

k3pl.form.SetWilayah = Ext.extend (Ext.form.FieldSet, {
	constructor: function (config) {
		config.formArea		= new k3pl.form.Area(config);
		config.formWilayah	= new k3pl.form.Wilayah(config);

		Ext.apply(this
		, config
		,	{
				title		:'Wilayah'
			,	checkboxToggle	:true
			,	autoHeight	:true
			,	collapsed	:true
			,	scope		:this
			,	formArea	:undefined
			,	formWilayah	:undefined
			}
		);

		k3pl.form.SetWilayah.superclass.constructor.apply(this, arguments);

		this.add(config.formWilayah);
		this.add(config.formArea);

		this.on('collapse', function(panel) {
			this.formWilayah.setValue(0);
			this.formArea.clearFilter();
			this.formArea.setValue(0);
		});
	}

,	do_load: function()
	{
		this.formWilayah.do_load();
	}
});

k3pl.form.SetWaktu = Ext.extend (Ext.form.FieldSet, {
	constructor: function (config) {
		config.formTahun 	= new k3pl.form.Tahun(config);
		config.labelWidth	= 120;

		if (config != undefined && config.displayBulan) {
			config.formBulan = new k3pl.form.Bulan(config);
		}

		Ext.apply(this
		,	config
		,	{
				title		:'Waktu'
			,	autoHeight	:true
			}
		);

		k3pl.form.SetWaktu.superclass.constructor.apply(this, arguments);

		this.add(config.formTahun);

		if (config != undefined && config.displayBulan) {
			this.add(config.formBulan);
		}
	}

,	do_load: function()
	{
		this.formTahun.do_load();
		if (this.formBulan) {
			this.formBulan.do_load();
		}
	}
});

Ext.ns('k3pl.button');

k3pl.button.Add = function (scope) {
	return new Ext.Button({
		text	:"Tambah"
	,	iconCls	:"add16"
	,	handler	:function() {
			scope.do_add();
		}
	});
}

k3pl.button.Refresh = function (scope) {
	return new Ext.Button({
		text	:"Refresh"
	,	iconCls	:"refresh16"
	,	handler	:function() {
			scope.do_refresh();
		}
	});
}

k3pl.button.Delete = function (scope) {
	return new Ext.Button({
		text	:"Hapus"
	,	iconCls	:"del16"
	,	handler	:function() {
			scope.do_del();
		}
	});
}

k3pl.button.Save = function (scope) {
	return new Ext.Button({
		text	:"Simpan"
	,	iconCls	:"save16"
	,	handler	:function() {
			scope.do_save();
		}
	});
}

k3pl.button.Edit = function (scope) {
	return new Ext.Button({
		text	:"Ubah"
	,	iconCls	:"edit16"
	,	handler	:function() {
			scope.do_edit();
		}
	});
}

k3pl.button.Cancel = function (scope) {
	return new Ext.Button({
		text	:"Batal"
	,	iconCls	:"del16"
	,	handler	:function() {
			scope.do_cancel();
		}
	});
}

k3pl.button.Back = function (scope) {
	return new Ext.Button({
		text	:"Kembali"
	,	iconCls	:"back16"
	,	handler	:function() {
			scope.do_back();
		}
	});
}
