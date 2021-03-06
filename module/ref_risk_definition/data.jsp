<%--
 % Copyright 2011 - PT. Perusahaan Gas Negara Tbk.
 %
 % Author(s):
 % + PT. Awakami
 %   - agus sugianto (agus.delonge@gmail.com)
--%>

<%@ page import="java.sql.*" %>
<%
try {
	Connection	db_con	= (Connection) session.getAttribute("db.con");
	if (db_con == null || (db_con != null && db_con.isClosed())) {
		response.sendRedirect(request.getContextPath());
		return;
	}

	Statement	db_stmt = db_con.createStatement();

	String q= " select   risk_score "
		+ " ,        risk_score as risk_score_old "
		+ " ,        description "
		+ " ,        note "
		+ " ,        action_required "
		+ " ,        pha_recommendation "
		+ " from     r_risk_definition "
		+ " order by risk_score ";

	ResultSet	rs	= db_stmt.executeQuery(q);
	int		i	= 0;
	String		data	= "[";

	while (rs.next()) {
		if (i > 0) {
			data += ",";
		} else {
			i++;
		}
		data	+= "[ '"+ rs.getString("risk_score") +"' "
			+  ",'"+ rs.getString("risk_score_old") +"' "
			+  ",'"+ rs.getString("description") +"' "
			+  ",'"+ rs.getString("note") +"' "
			+  ",'"+ rs.getString("action_required") +"' "
			+  ",'"+ rs.getString("pha_recommendation") +"' "
			+  "]";
	}

	data += "]";

	out.print(data);
} catch (Exception e) {
	out.print("{success:false,info:'"+ e.toString().replace("'","\\'") +"'}");
}
%>
