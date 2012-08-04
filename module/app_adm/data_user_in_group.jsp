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
	JSONArray	user	= null;
	String		id_grup	= request.getParameter("id_grup");

	db_stmt	= db_con.createStatement();
	db_q	=" select	A.nipg"
			+" ,		B.nama_pegawai"
			+" ,		A.status_user"
			+" from		__user		A"
			+" ,		r_pegawai	B"
			+" ,		__user_grup	C"
			+" where	A.nipg		= B.nipg"
			+" and		A.nipg		= C.nipg"
			+" and		C.id_grup	= "+ id_grup;

	if (! "1".equals (user_group)) {
		db_q	+=" and	B.id_direktorat	= "+ user_dir
				+ " and B.id_divprosbu	= "+ user_div;
	}

	db_q	+=" order by	B.nama_pegawai";

	db_rs	= db_stmt.executeQuery (db_q);

	json_a	= new JSONArray ();
	while (db_rs.next()) {
		user = new JSONArray ();
		user.put (db_rs.getString ("nipg"));
		user.put (db_rs.getString ("nama_pegawai"));
		user.put (db_rs.getString ("status_user"));

		json_a.put (user);
	}

	out.print (json_a);

	db_rs.close();
} catch (Exception e) {
	_return.put ("success", false);
	_return.put ("info", e);
	out.print (_return);
}
%>
