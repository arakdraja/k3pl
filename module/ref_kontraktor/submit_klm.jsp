<%--
 % Copyright 2011 - PT. Perusahaan Gas Negara Tbk.
 %
 % Author(s):
 % + PT. Awakami
 %   - m.shulhan (ms@kilabit.org)
--%>
<%@ page import="java.sql.*" %>
<%
String q = "";
try {
	Connection db_con = (Connection) session.getAttribute("db.con");
	if (db_con == null || (db_con != null && db_con.isClosed())) {
		response.sendRedirect(request.getContextPath());
		return;
	}

	Statement	db_stmt			= db_con.createStatement();
	int			dml				= Integer.parseInt(request.getParameter("dml"));
	String		id				= request.getParameter("id");
	String		id_kontraktor	= request.getParameter("id_kontraktor");
	String		id_repo			= request.getParameter("id_repo");

	switch (dml) {
	case 2:
		q	=" insert into r_kontraktor_klm ("
			+"		id_kontraktor"
			+" ,	id_repo"
			+" ) values ("
			+	id_kontraktor
			+" ,"+ id_repo
			+" )";
		break;

	case 3:
		q	=" update	r_kontraktor_klm"
			+" set		id_repo = "+ id_repo
			+" where	id	="+ id;
		break;

	case 4:
		q	=" delete from r_kontraktor_klm"
			+" where id = "+ id;
		break;

	default:
		out.print("{success:false,info:'DML tipe tidak diketahui ("+dml+")!'}");
		return;
	}

	q	+="; insert into __log (nipg, nama_menu, status_akses) values ('"
		+ session.getAttribute("user.nipg") +"','"
		+ session.getAttribute("menu.id") +"','"+ dml +"')";

	db_stmt.executeUpdate(q);

	out.print("{success:true,info:'Data telah tersimpan.'}");
} catch (Exception e) {
	out.print("{success:false,info:'"+ e.toString().replace("'","\\'") +"'}");
}
%>
