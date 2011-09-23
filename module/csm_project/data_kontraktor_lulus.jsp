<%--
 % Copyright 2011 - PT. Perusahaan Gas Negara Tbk.
 %
 % Author(s):
 % + PT. Awakami
 %   - m.shulhan (ms@kilabit.org)
--%>
<%@ page import="java.sql.*"%>
<%@ page import="org.json.*"%>
<%
String q = "";
try {
	Connection db_con = (Connection) session.getAttribute("db.con");
	if (db_con == null || (db_con != null && db_con.isClosed())) {
		response.sendRedirect(request.getContextPath());
		return;
	}

	Statement	db_stmt		= db_con.createStatement();
	String		id_proyek	= request.getParameter("id_proyek");

q
=" select	A.id_kontraktor"
+" ,		B.nama"
+" from		t_csm_proyek_kontraktor		A"
+" ,		r_kontraktor				B"
+" ,		t_csm_proyek				C"
+" ,		r_csm_project_work_level	D"
+" where	A.id_project	= "+ id_proyek
+" and		A.id_kontraktor	= B.id"
+" and		A.id_project	= C.id_project"
+" and		C.work_level	= D.id"
+" and		A.total_nilai	>= D.nilai"
+" order by B.nama";

	ResultSet	rs		= db_stmt.executeQuery (q);
	JSONArray	data	= new JSONArray ();
	JSONArray	item	= null;

	while (rs.next()) {
		item = new JSONArray ();
		item.put (rs.getString ("id_kontraktor"));
		item.put (rs.getString ("nama"));

		data.put (item);
	}

	out.print (data.toString ());

	rs.close ();
} catch (Exception e) {
	out.print("{success:false,info:'"+ e.toString().replace("'","\\'") +"'}");
}
%>
