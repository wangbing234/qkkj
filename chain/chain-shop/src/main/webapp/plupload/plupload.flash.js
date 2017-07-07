(function(f, b, d, e) {
	var a = {}, g = {};
	function c() {
		var h;
		try {
			h = navigator.plugins["Shockwave Flash"];
			h = h.description
		} catch (j) {
			try {
				h = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
						.GetVariable("$version")
			} catch (i) {
				h = "0.0"
			}
		}
		h = h.match(/\d+/g);
		return parseFloat(h[0] + "." + h[1])
	}
	d.flash = {
		trigger : function(j, h, i) {
			setTimeout(function() {
				var m = a[j], l, k;
				if (m) {
					m.trigger("Flash:" + h, i)
				}
			}, 0)
		}
	};
	d.runtimes.Flash = d
			.addRuntime(
					"flash",
					{
						getFeatures : function() {
							return {
								jpgresize : true,
								pngresize : true,
								maxWidth : 8091,
								maxHeight : 8091,
								chunks : true,
								progress : true,
								multipart : true
							}
						},
						init : function(j, o) {
							var n, i, k, p = 0, h = b.body;
							if (c() < 10) {
								o( {
									success : false
								});
								return
							}
							g[j.id] = false;
							a[j.id] = j;
							n = b.getElementById(j.settings.browse_button);
							i = b.createElement("div");
							i.id = j.id + "_flash_container";
							d.extend(i.style, {
								position : "absolute",
								top : "0px",
								background : j.settings.shim_bgcolor
										|| "transparent",
								zIndex : 99999,
								width : "100%",
								height : "100%"
							});
							i.className = "plupload flash";
							if (j.settings.container) {
								h = b.getElementById(j.settings.container);
								if (d.getStyle(h, "position") === "static") {
									h.style.position = "relative"
								}
							}
							h.appendChild(i);
							k = "id=" + escape(j.id);
							i.innerHTML = '<object id="'
									+ j.id
									+ '_flash" width="100%" height="100%" style="outline:0" type="application/x-shockwave-flash" data="'
									+ j.settings.flash_swf_url
									+ '"><param name="movie" value="'
									+ j.settings.flash_swf_url
									+ '" /><param name="flashvars" value="'
									+ k
									+ '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';
							function m() {
								return b.getElementById(j.id + "_flash")
							}
							function l() {
								if (p++ > 5000) {
									o( {
										success : false
									});
									return
								}
								if (!g[j.id]) {
									setTimeout(l, 1)
								}
							}
							l();
							n = i = null;
							j
									.bind(
											"Flash:Init",
											function() {
												var r = {}, q;
												m()
														.setFileFilters(
																j.settings.filters,
																j.settings.multi_selection);
												if (g[j.id]) {
													return
												}
												g[j.id] = true;
												j
														.bind(
																"UploadFile",
																function(s, u) {
																	var v = s.settings, t = j.settings.resize
																			|| {};
																	m()
																			.uploadFile(
																					r[u.id],
																					v.url,
																					{
																						name : u.target_name
																								|| u.name,
																						mime : d.mimeTypes[u.name
																								.replace(
																										/^.+\.([^.]+)/,
																										"$1")
																								.toLowerCase()]
																								|| "application/octet-stream",
																						chunk_size : v.chunk_size,
																						width : t.width,
																						height : t.height,
																						quality : t.quality,
																						multipart : v.multipart,
																						multipart_params : v.multipart_params
																								|| {},
																						file_data_name : v.file_data_name,
																						format : /\.(jpg|jpeg)$/i
																								.test(u.name) ? "jpg"
																								: "png",
																						headers : v.headers,
																						urlstream_upload : v.urlstream_upload
																					})
																});
												j
														.bind(
																"Flash:UploadProcess",
																function(t, s) {
																	var u = t
																			.getFile(r[s.id]);
																	if (u.status != d.FAILED) {
																		u.loaded = s.loaded;
																		u.size = s.size;
																		t
																				.trigger(
																						"UploadProgress",
																						u)
																	}
														
																});
												j
														.bind(
																"Flash:UploadChunkComplete",function(s,u){var v,t=s.getFile(r[u.id]);v={chunk:u.chunk,chunks:u.chunks,response:u.text};s.trigger("ChunkUploaded",t,v);if(t.status!=d.FAILED){m().uploadNextChunk()}if(u.chunk==u.chunks-1){t.status=d.DONE;s.trigger("FileUploaded",t,{response:u.text})}});j.bind("Flash:SelectFiles",function(s,v){var u,t,w=[],x;for(t=0;t<v.length;t++){u=v[t];x=d.guid();r[x]=u.id;r[u.id]=x;w.push(new d.File(x,u.name,u.size))}if(w.length){j.trigger("FilesAdded",w)}});j.bind("Flash:SecurityError",function(s,t){j.trigger("Error",{code:d.SECURITY_ERROR,message:d.translate("Security error."),details:t.message,file:j.getFile(r[t.id])})});j.bind("Flash:GenericError",function(s,t){j.trigger("Error",{code:d.GENERIC_ERROR,message:d.translate("Generic error."),details:t.message,file:j.getFile(r[t.id])})});j.bind("Flash:IOError",function(s,t){j.trigger("Error",{code:d.IO_ERROR,message:d.translate("IO error."),details:t.message,file:j.getFile(r[t.id])})});j.bind("Flash:ImageError",function(s,t){j.trigger("Error",{code:parseInt(t.code,10),message:d.translate("Image error."),file:j.getFile(r[t.id])})});j.bind("Flash:StageEvent:rollOver",function(s){var t,u;t=b.getElementById(j.settings.browse_button);u=s.settings.browse_button_hover;if(t&&u){d.addClass(t,u)}});j.bind("Flash:StageEvent:rollOut",function(s){var t,u;t=b.getElementById(j.settings.browse_button);u=s.settings.browse_button_hover;if(t&&u){d.removeClass(t,u)}});j.bind("Flash:StageEvent:mouseDown",function(s){var t,u;t=b.getElementById(j.settings.browse_button);u=s.settings.browse_button_active;if(t&&u){d.addClass(t,u);d.addEvent(b.body,"mouseup",function(){d.removeClass(t,u)},s.id)}});j.bind("Flash:StageEvent:mouseUp",function(s){var t,u;t=b.getElementById(j.settings.browse_button);u=s.settings.browse_button_active;if(t&&u){d.removeClass(t,u)}});j.bind("Flash:ExifData",function(s,t){j.trigger("ExifData",j.getFile(r[t.id]),t.data)});j.bind("Flash:GpsData",function(s,t){j.trigger("GpsData",j.getFile(r[t.id]),t.data)});j.bind("QueueChanged",function(s){j.refresh()});j.bind("FilesRemoved",function(s,u){var t;for(t=0;t<u.length;t++){m().removeFile(r[u[t].id])}});j.bind("StateChanged",function(s){j.refresh()});j.bind("Refresh",function(s){var t,u,v;m().setFileFilters(j.settings.filters,j.settings.multi_selection);t=b.getElementById(s.settings.browse_button);if(t){u=d.getPos(t,b.getElementById(s.settings.container));v=d.getSize(t);d.extend(b.getElementById(s.id+"_flash_container").style,{top:u.y+"px",left:u.x+"px",width:v.w+"px",height:v.h+"px"})}});j.bind("Destroy",function(s){var t;d.removeAllEvents(b.body,s.id);delete g[s.id];delete a[s.id];t=b.getElementById(s.id+"_flash_container");if(t){h.removeChild(t)}});o({success:true})})}})})(window,document,plupload);