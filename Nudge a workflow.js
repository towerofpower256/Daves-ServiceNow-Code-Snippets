var gr = new GlideRecord("sc_req_item"); //Tablename
gr.get("48eee3784fa036c0de0cfd501310c77f"); //Sys_ID

new Workflow().broadcastEventToCurrentsContexts(gr, 'update', null);