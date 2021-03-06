<%--
 % Copyright 2012 - PT. Perusahaan Gas Negara Tbk.
 %
 % Author(s):
 % + PT. Awakami
 %   - m.shulhan (ms@kilabit.org)
--%>
<%@ include file="../modinit.jsp" %>
<%
try {
	int dml					= Integer.parseInt(request.getParameter("dml_type"));
	String id_direktorat	= request.getParameter("id_direktorat");
	String id_divprosbu		= request.getParameter("id_divprosbu");
	String nama_divprosbu	= request.getParameter("nama_divprosbu");
	String status_divprosbu	= request.getParameter("status_divprosbu");

	db_stmt = db_con.createStatement();

	switch (dml) {
	case 2:
		db_q=" insert into	r_divprosbu (id_direktorat, nama_divprosbu, status_divprosbu, id_user) "
			+" values ("+ id_direktorat +",'"+ nama_divprosbu +"',"+ status_divprosbu +", '"+ user_nipg +"') ";
		break;
	case 3:
		db_q=" update	r_divprosbu"
			+" set		nama_divprosbu		= '"+ nama_divprosbu +"' "
			+" ,		status_divprosbu	=  "+ status_divprosbu
			+" ,		id_user				= '"+ user_nipg +"' "
			+" ,		tanggal_akses		= getdate() "
			+" where	id_divprosbu	= "+ id_divprosbu
			+" and		id_direktorat	= "+ id_direktorat;
		break;
	case 4:
		db_q=" delete from	r_divprosbu"
			+" where	id_divprosbu	= "+ id_divprosbu
			+" and		id_direktorat	= "+ id_direktorat;
		break;
	default:
		_return.put ("success", false);
		_return.put ("info", "DML tipe tidak diketahui ("+dml+")!");
		out.print (_return);
		return;
	}

	db_q+="; insert into __log (nipg, nama_menu, status_akses) values ('"
		+ user_nipg +"','"
		+ session.getAttribute("menu.id") +"','"+ dml +"');";

	db_stmt.executeUpdate (db_q);

	_return.put ("success", true);
	_return.put ("info", "Data telah tersimpan.");
} catch (Exception e) {
	_return.put ("success", false);
	_return.put ("info", e);
}
out.print (_return);
%>
