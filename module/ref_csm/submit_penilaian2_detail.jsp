<%--
 % Copyright 2011 - PT. Perusahaan Gas Negara Tbk.
 %
 % Author(s):
 % + PT. Awakami
 %   - m.shulhan (ms@kilabit.org)
--%>

<%@ include file="../modinit.jsp" %>
<%
try {
	int		dml 			= Integer.parseInt (request.getParameter("dml"));
	String	id				= (String) request.getParameter ("id");
	String	id_penilaian	= (String) request.getParameter ("id_penilaian");
	String	elemen			= (String) request.getParameter ("elemen");

	db_stmt = db_con.createStatement();

	switch (dml) {
	case 2:
		db_q	=" insert into r_csm_penilaian2_detail ("
				+"		id_penilaian"
				+" ,	elemen"
				+" ) values ("
				+	id_penilaian
				+" , '"+ elemen +"'"
				+" );";
		break;
	case 3:
		db_q	=" update	r_csm_penilaian2_detail"
				+" set		elemen	= '"+ elemen +"'"
				+" where	id		= "+ id;
		break;
	case 4:
		db_q	=" delete from r_csm_penilaian2_detail"
				+" where  id = "+ id;
		break;
	default:
		_return.put ("success", false);
		_return.put ("info", "DML tipe tidak diketahui ("+dml+")!");
		out.print (_return);
		return;
	}

	db_q	+="; insert into __log (nipg, nama_menu, status_akses) values ('"
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
