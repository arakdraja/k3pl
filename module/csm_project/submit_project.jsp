<%--
 % Copyright 2012 - PT. Perusahaan Gas Negara Tbk.
 %
 % Author(s):
 % + PT. Awakami
 %   - m.shulhan (ms@kilabit.org)
 %   - agus sugianto (agus.delonge@gmail.com)
--%>
<%@ include file="../modinit.jsp" %>
<%
try {

	int		dml 	= Integer.parseInt(request.getParameter("dml"));
	String	id		= request.getParameter("id");
	String	k_utama	= request.getParameter("koefisien_utama");
	String	k_tambah= request.getParameter("koefisien_tambah");
	String	pg		= request.getParameter ("passing_grade");

	db_stmt = db_con.createStatement();

	switch (dml) {
	case 2:
		db_q=" insert into t_csm_proyek ("
			+"		id_project"
			+" ,	id_kontraktor"
			+" ,	eval_score"
			+" ,	penghargaan_sanksi"
			+" ,	koefisien_utama"
			+" ,	koefisien_tambah"
			+" ,	id_divprosbu"
			+" ,	id_direktorat"
			+" ,	passing_grade"
			+" ) values ("
			+ id
			+", null"
			+", 0.0"
			+", 1"
			+","+ k_utama
			+","+ k_tambah
			+","+ user_div
			+","+ user_dir
			+","+ pg
			+")";
		break;
	case 3:
		db_q=" update	t_csm_proyek"
			+" set		koefisien_utama	= "+ k_utama
			+" ,		koefisien_tambah= "+ k_tambah
			+" ,		id_divprosbu	= "+ user_div
			+" ,		id_direktorat	= "+ user_dir
			+" ,		passing_grade	= "+ pg
			+" where	id_project		= "+ id +";";

		db_q+=" update	t_csm_proyek_kontraktor2"
			+ " set		keterangan		= 'Lulus'"
			+ " where	total_nilai		> "+ pg +";";

		db_q+=" update	t_csm_proyek_kontraktor2"
			+ " set		keterangan		= 'Tidak Lulus'"
			+ " where	total_nilai		<= "+ pg +";";

		break;
	case 4:
		db_q="	delete from t_csm_proyek_kont_eval_nilai where id_project = "+ id
			+";	delete from t_csm_proyek_kont_eval where id_project = "+ id
			+";	delete from t_csm_proyek_kont_nilai where id_project = "+ id
			+";	delete from t_csm_proyek_kontraktor where id_project = "+ id
			+";	delete from t_csm_proyek where id_project = "+ id;
		break;
	default:
		_return.put ("success", false);
		_return.put ("info", "DML tipe tidak diketahui ("+dml+")!");
		out.print (_return);
		return;
	}

	db_q+="; insert into __log (nipg, nama_menu, status_akses) values ('"
		+ user_nipg +"','"+ session.getAttribute("menu.id") +"','"+ dml +"')";

	db_stmt.executeUpdate (db_q);

	_return.put ("success", true);
	_return.put ("info", "Data telah tersimpan.");
} catch (Exception e) {
	_return.put ("success", false);
	_return.put ("info", e);
}
out.print (_return);
%>
