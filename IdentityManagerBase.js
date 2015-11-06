// COPYRIGHT © 2015 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/3.15/esri/copyright.txt for details.

define(["dojo/_base/declare","dojo/_base/config","dojo/_base/lang","dojo/_base/array","dojo/_base/Deferred","dojo/_base/json","dojo/_base/url","dojo/sniff","dojo/cookie","dojo/io-query","dojo/regexp","./kernel","./config","./lang","./ServerInfo","./urlUtils","./deferredUtils","./request","./Evented","./OAuthCredential","./arcgis/OAuthInfo"],function(e,r,s,t,i,n,o,a,l,h,c,u,d,f,_,v,g,p,m,S,I){var k,w={},U=function(e){var r=new o(e.owningSystemUrl).host,s=new o(e.server).host,t=/.+\.arcgis\.com$/i;return t.test(r)&&t.test(s)},x=function(e,r){return!!(U(e)&&r&&t.some(r,function(r){return r.test(e.server)}))},T=e(m,{declaredClass:"esri.IdentityManagerBase",constructor:function(){this._portalConfig=s.getObject("esriGeowConfig"),this.serverInfos=[],this.oAuthInfos=[],this.credentials=[],this._soReqs=[],this._xoReqs=[],this._portals=[],this._getOAuthHash()},defaultTokenValidity:60,tokenValidity:null,signInPage:null,useSignInPage:!0,normalizeWebTierAuth:!1,_busy:null,_oAuthHash:null,_gwTokenUrl:"/sharing/generateToken",_agsRest:"/rest/services",_agsPortal:/\/sharing(\/|$)/i,_agsAdmin:/https?:\/\/[^\/]+\/[^\/]+\/admin\/?(\/.*)?$/i,_adminSvcs:/\/admin\/services(\/|$)/i,_agolSuffix:".arcgis.com",_gwDomains:[{regex:/https?:\/\/www\.arcgis\.com/i,tokenServiceUrl:"https://www.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/dev\.arcgis\.com/i,tokenServiceUrl:"https://dev.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/.*dev[^.]*\.arcgis\.com/i,tokenServiceUrl:"https://devext.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/.*qa[^.]*\.arcgis\.com/i,tokenServiceUrl:"https://qaext.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/.*.arcgis\.com/i,tokenServiceUrl:"https://www.arcgis.com/sharing/generateToken"}],_legacyFed:[],_regexSDirUrl:/http.+\/rest\/services\/?/gi,_regexServerType:/(\/(MapServer|GeocodeServer|GPServer|GeometryServer|ImageServer|NAServer|FeatureServer|GeoDataServer|GlobeServer|MobileServer|GeoenrichmentServer)).*/gi,_gwUser:/http.+\/users\/([^\/]+)\/?.*/i,_gwItem:/http.+\/items\/([^\/]+)\/?.*/i,_gwGroup:/http.+\/groups\/([^\/]+)\/?.*/i,_errorCodes:[499,498,403,401],_rePortalTokenSvc:/\/sharing(\/rest)?\/generatetoken/i,_publicUrls:[/\/arcgis\/tokens/i,/\/sharing(\/rest)?\/generatetoken/i,/\/rest\/info/i],registerServers:function(e){var r=this.serverInfos;r?(e=t.filter(e,function(e){return!this.findServerInfo(e.server)},this),this.serverInfos=r.concat(e)):this.serverInfos=e,t.forEach(e,function(e){if(e.owningSystemUrl&&this._portals.push(e.owningSystemUrl),e.hasPortal){this._portals.push(e.server);var r=d.defaults.io.corsEnabledServers,s=this._getOrigin(e.tokenServiceUrl);v.canUseXhr(e.server)||r.push(e.server.replace(/^https?:\/\//i,"")),v.canUseXhr(s)||r.push(s.replace(/^https?:\/\//i,""))}},this)},registerOAuthInfos:function(e){var r=this.oAuthInfos;r?(e=t.filter(e,function(e){return!this.findOAuthInfo(e.portalUrl)},this),this.oAuthInfos=r.concat(e)):this.oAuthInfos=e},registerToken:function(e){var r,t=this._sanitizeUrl(e.server),i=this.findServerInfo(t),n=!0;i||(i=new _,i.server=this._getServerInstanceRoot(t),i.tokenServiceUrl=this._getTokenSvcUrl(t),i.hasPortal=!0,this.registerServers([i])),r=this.findCredential(t,e.userId),r?(s.mixin(r,e),n=!1):(r=new k({userId:e.userId,server:i.server,token:e.token,expires:e.expires,ssl:e.ssl,scope:this._isServerRsrc(t)?"server":"portal"}),r.resources=[t],this.credentials.push(r)),r.onTokenChange(!1),n||r.refreshServerTokens()},toJson:function(){return f.fixJson({serverInfos:t.map(this.serverInfos,function(e){return e.toJson()}),oAuthInfos:t.map(this.oAuthInfos,function(e){return e.toJson()}),credentials:t.map(this.credentials,function(e){return e.toJson()})})},initialize:function(e){if(e){s.isString(e)&&(e=n.fromJson(e));var r=e.serverInfos,i=e.oAuthInfos,o=e.credentials;if(r){var a=[];t.forEach(r,function(e){e.server&&e.tokenServiceUrl&&a.push(e.declaredClass?e:new _(e))}),a.length&&this.registerServers(a)}if(i){var l=[];t.forEach(i,function(e){e.appId&&l.push(e.declaredClass?e:new I(e))}),l.length&&this.registerOAuthInfos(l)}o&&t.forEach(o,function(e){e.userId&&e.server&&e.token&&e.expires&&e.expires>(new Date).getTime()&&(e=e.declaredClass?e:new k(e),e.onTokenChange(),this.credentials.push(e))},this)}},findServerInfo:function(e){var r;return e=this._sanitizeUrl(e),t.some(this.serverInfos,function(s){return this._hasSameServerInstance(s.server,e)&&(r=s),!!r},this),r},findOAuthInfo:function(e){var r;return e=this._sanitizeUrl(e),t.some(this.oAuthInfos,function(s){return this._hasSameServerInstance(s.portalUrl,e)&&(r=s),!!r},this),r},findCredential:function(e,r){var s,i;return e=this._sanitizeUrl(e),i=this._isServerRsrc(e)?"server":"portal",r?t.some(this.credentials,function(t){return this._hasSameServerInstance(t.server,e)&&r===t.userId&&t.scope===i&&(s=t),!!s},this):t.some(this.credentials,function(r){return this._hasSameServerInstance(r.server,e)&&-1!==this._getIdenticalSvcIdx(e,r)&&r.scope===i&&(s=r),!!s},this),s},getCredential:function(e,t){var n,o,a=!0;f.isDefined(t)&&(s.isObject(t)?(n=!!t.token,o=t.error,a=t.prompt!==!1):n=t),e=this._sanitizeUrl(e);var l,h=new i(g._dfdCanceller),c=this._isAdminResource(e),u=n&&this._doPortalSignIn(e)?this._getEsriAuthCookie():null,d=n?this.findCredential(e):null;if(u||d){var v=u&&u.email||d&&d.userId;return l=new Error("You are currently signed in as: '"+v+"'. You do not have access to this resource: "+e),l.code="IdentityManagerBase.1",l.httpCode=o&&o.httpCode,l.messageCode=o?o.messageCode:null,l.subcode=o?o.subcode:null,l.details=o?o.details:null,l.log=r.isDebug,h.errback(l),h}var p=this._findCredential(e,t);if(p)return h.callback(p),h;var m=this.findServerInfo(e);if(m)!m.hasServer&&this._isServerRsrc(e)&&(m._restInfoDfd=this._getTokenSvcUrl(e,!0),m.hasServer=!0);else{var S=this._getTokenSvcUrl(e);if(!S)return l=new Error("Unknown resource - could not find token service endpoint."),l.code="IdentityManagerBase.2",l.log=r.isDebug,h.errback(l),h;m=new _,m.server=this._getServerInstanceRoot(e),s.isString(S)?(m.tokenServiceUrl=S,a&&!this._findOAuthInfo(e)&&(m._selfDfd=this._getPortalSelf(S.replace(this._rePortalTokenSvc,"/sharing/rest/portals/self"),e)),m.hasPortal=!0):(m._restInfoDfd=S,m.hasServer=!0),this.registerServers([m])}return this._enqueue(e,m,t,h,c)},getResourceName:function(e){return this._isRESTService(e)?e.replace(this._regexSDirUrl,"").replace(this._regexServerType,"")||"":this._gwUser.test(e)&&e.replace(this._gwUser,"$1")||this._gwItem.test(e)&&e.replace(this._gwItem,"$1")||this._gwGroup.test(e)&&e.replace(this._gwGroup,"$1")||""},generateToken:function(e,t,i){var n,a,l,h,c,d,f,_,g=new o(window.location.href.toLowerCase()),m=this._getEsriAuthCookie(),S=!t,I=e.shortLivedTokenValidity;t&&(_=u.id.tokenValidity||I||u.id.defaultTokenValidity,_>I&&(_=I)),i&&(n=i.isAdmin,a=i.serverUrl,l=i.token,d=i.ssl,e.customParameters=i.customParameters),n?h=e.adminTokenServiceUrl:(h=e.tokenServiceUrl,c=new o(h.toLowerCase()),m&&(f=m.auth_tier,f=f&&f.toLowerCase()),("web"===f||e.webTierAuth)&&i&&i.serverUrl&&!d&&"http"===g.scheme&&(v.hasSameOrigin(g.uri,h,!0)||"https"===c.scheme&&g.host===c.host&&"7080"===g.port&&"7443"===c.port)&&(h=h.replace(/^https:/i,"http:").replace(/:7443/i,":7080")),S&&this._rePortalTokenSvc.test(e.tokenServiceUrl)&&(h=h.replace(/\/rest/i,"")));var k=p(s.mixin({url:h,content:s.mixin({request:"getToken",username:t&&t.username,password:t&&t.password,serverUrl:a,token:l,expiration:_,referer:n||this._rePortalTokenSvc.test(e.tokenServiceUrl)?window.location.host:null,client:n?"referer":null,f:"json"},e.customParameters),handleAs:"json",callbackParamName:S?"callback":void 0},i&&i.ioArgs),{usePost:!S,disableIdentityLookup:!0,useProxy:this._useProxy(e,i)});return k.addCallback(function(s){if(!s||!s.token){var i=new Error("Unable to generate token");return i.code="IdentityManagerBase.3",i.log=r.isDebug,i}var n=e.server;return w[n]||(w[n]={}),t&&(w[n][t.username]=t.password),s.validity=_,s}),k.addErrback(function(){}),k},isBusy:function(){return!!this._busy},checkSignInStatus:function(e){return this.getCredential(e,{prompt:!1})},setRedirectionHandler:function(e){this._redirectFunc=e},setProtocolErrorHandler:function(e){this._protocolFunc=e},signIn:function(){},oAuthSignIn:function(){},onCredentialCreate:function(){},onCredentialsDestroy:function(){},destroyCredentials:function(){if(this.credentials){var e=this.credentials.slice();t.forEach(e,function(e){e.destroy()})}this.onCredentialsDestroy()},_getOAuthHash:function(){var e=window.location.hash;if(e){"#"===e.charAt(0)&&(e=e.substring(1));var r=h.queryToObject(e),s=!1;r.access_token&&r.expires_in&&r.state&&r.hasOwnProperty("username")?(r.state=n.fromJson(r.state),this._oAuthHash=r,s=!0):r.error&&r.error_description&&(console.log("IdentityManager OAuth Error: ",r.error," - ",r.error_description),"access_denied"===r.error&&(s=!0)),s&&(!a("ie")||a("ie")>8)&&(window.location.hash="")}},_findCredential:function(e,r){var s,i,n,o,a=-1,l=r&&r.token,h=r&&r.resource,c=this._isServerRsrc(e)?"server":"portal",u=t.filter(this.credentials,function(r){return this._hasSameServerInstance(r.server,e)&&r.scope===c},this);if(e=h||e,u.length)if(1===u.length){if(s=u[0],o=this.findServerInfo(s.server),i=o&&o.owningSystemUrl,n=i&&this.findCredential(i,s.userId),a=this._getIdenticalSvcIdx(e,s),!l)return-1===a&&s.resources.push(e),this._addResource(e,n),s;-1!==a&&(s.resources.splice(a,1),this._removeResource(e,n))}else{var d,f;if(t.some(u,function(r){return f=this._getIdenticalSvcIdx(e,r),-1!==f?(d=r,o=this.findServerInfo(d.server),i=o&&o.owningSystemUrl,n=i&&this.findCredential(i,d.userId),a=f,!0):!1},this),l)d&&(d.resources.splice(a,1),this._removeResource(e,n));else if(d)return this._addResource(e,n),d}},_findOAuthInfo:function(e){var r=this.findOAuthInfo(e);return r||t.some(this.oAuthInfos,function(s){return this._isIdProvider(s.portalUrl,e)&&(r=s),!!r},this),r},_addResource:function(e,r){r&&-1===this._getIdenticalSvcIdx(e,r)&&r.resources.push(e)},_removeResource:function(e,r){var s=-1;r&&(s=this._getIdenticalSvcIdx(e,r),s>-1&&r.resources.splice(s,1))},_useProxy:function(e,r){return r&&r.isAdmin&&!v.hasSameOrigin(e.adminTokenServiceUrl,window.location.href)||!this._isPortalDomain(e.tokenServiceUrl)&&10.1==e.currentVersion&&!v.hasSameOrigin(e.tokenServiceUrl,window.location.href)},_getOrigin:function(e){var r=new o(e);return r.scheme+"://"+r.host+(f.isDefined(r.port)?":"+r.port:"")},_getServerInstanceRoot:function(e){var r=e.toLowerCase(),s=r.indexOf(this._agsRest);return-1===s&&this._isAdminResource(e)&&(s=r.indexOf("/admin")),-1===s&&(s=r.indexOf("/sharing")),-1===s&&"/"===r.substr(-1)&&(s=r.length-1),s>-1?e.substring(0,s):e},_hasSameServerInstance:function(e,r){return e=e.toLowerCase(),r=this._getServerInstanceRoot(r).toLowerCase(),e=e.substr(e.indexOf(":")),r=r.substr(r.indexOf(":")),e===r},_sanitizeUrl:function(e){e=v.fixUrl(s.trim(e));var r=(d.defaults.io.proxyUrl||"").toLowerCase(),t=r?e.toLowerCase().indexOf(r+"?"):-1;return-1!==t&&(e=e.substring(t+r.length+1)),v.urlToObject(e).path},_isRESTService:function(e){return e.indexOf(this._agsRest)>-1},_isAdminResource:function(e){return this._agsAdmin.test(e)||this._adminSvcs.test(e)},_isServerRsrc:function(e){return this._isRESTService(e)||this._isAdminResource(e)},_isIdenticalService:function(e,r){var s;if(this._isRESTService(e)&&this._isRESTService(r)){var t=this._getSuffix(e).toLowerCase(),i=this._getSuffix(r).toLowerCase();if(s=t===i,!s){var n=/(.*)\/(MapServer|FeatureServer).*/gi;s=t.replace(n,"$1")===i.replace(n,"$1")}}else this._isAdminResource(e)&&this._isAdminResource(r)?s=!0:this._isServerRsrc(e)||this._isServerRsrc(r)||!this._isPortalDomain(e)||(s=!0);return s},_isPortalDomain:function(e){e=e.toLowerCase();var r=new o(e).authority,i=this._portalConfig,n=-1!==r.indexOf(this._agolSuffix);if(!n&&i&&(n=this._hasSameServerInstance(this._getServerInstanceRoot(i.restBaseUrl),e)),!n){if(!this._arcgisUrl){var a=s.getObject("esri.arcgis.utils.arcgisUrl");a&&(this._arcgisUrl=new o(a).authority)}this._arcgisUrl&&(n=this._arcgisUrl.toLowerCase()===r)}return n||(n=t.some(this._portals,function(r){return this._hasSameServerInstance(r,e)},this)),n=n||this._agsPortal.test(e)},_isIdProvider:function(e,r){var s=-1,i=-1;t.forEach(this._gwDomains,function(t,n){-1===s&&t.regex.test(e)&&(s=n),-1===i&&t.regex.test(r)&&(i=n)});var n=!1;if(s>-1&&i>-1&&(0===s||4===s?(0===i||4===i)&&(n=!0):1===s?(1===i||2===i)&&(n=!0):2===s?2===i&&(n=!0):3===s&&3===i&&(n=!0)),!n){var o=this.findServerInfo(r),a=o&&o.owningSystemUrl;a&&U(o)&&this._isPortalDomain(a)&&this._isIdProvider(e,a)&&(n=!0)}return n},_isPublic:function(e){return e=this._sanitizeUrl(e),t.some(this._publicUrls,function(r){return r.test(e)})},_getIdenticalSvcIdx:function(e,r){var s=-1;return t.some(r.resources,function(r,t){return this._isIdenticalService(e,r)?(s=t,!0):!1},this),s},_getSuffix:function(e){return e.replace(this._regexSDirUrl,"").replace(this._regexServerType,"$1")},_getTokenSvcUrl:function(e){var r,s,i,n=this._isRESTService(e);if(n||this._isAdminResource(e))return i=e.toLowerCase().indexOf(n?this._agsRest:"/admin/"),r=e.substring(0,i)+"/admin/generateToken",e=e.substring(0,i)+"/rest/info",s=p({url:e,content:{f:"json"},handleAs:"json",callbackParamName:"callback"}),s.adminUrl_=r,s;if(this._isPortalDomain(e)){var a="";if(t.some(this._gwDomains,function(r){return r.regex.test(e)&&(a=r.tokenServiceUrl),!!a}),a||t.some(this._portals,function(r){return this._hasSameServerInstance(r,e)&&(a=r+this._gwTokenUrl),!!a},this),a||(i=e.toLowerCase().indexOf("/sharing"),-1!==i&&(a=e.substring(0,i)+this._gwTokenUrl)),a||(a=this._getOrigin(e)+this._gwTokenUrl),a){var l=new o(e).port;/^http:\/\//i.test(e)&&"7080"===l&&(a=a.replace(/:7080/i,":7443")),a=a.replace(/http:/i,"https:")}return a}return-1!==e.toLowerCase().indexOf("premium.arcgisonline.com")?"https://premium.arcgisonline.com/server/tokens":void 0},_getPortalSelf:function(e,r){var s=window.location.protocol;return"https:"===s?e=e.replace(/^http:/i,"https:").replace(/:7080/i,":7443"):/^http:/i.test(r)&&(e=e.replace(/^https:/i,"http:").replace(/:7443/i,":7080")),p({url:e,content:{f:"json"},handleAs:"json",callbackParamName:"callback"},{crossOrigin:!1,disableIdentityLookup:!0})},_hasPortalSession:function(){return!!this._getEsriAuthCookie()},_getEsriAuthCookie:function(){var e;if(l.isSupported()){var r,s=this._getAllCookies("esri_auth");for(r=0;r<s.length;r++){var t=n.fromJson(s[r]);if(t.portalApp){e=t;break}}}return e},_getAllCookies:function(e){var r,s=[],t=document.cookie,i=t.match(new RegExp("(?:^|; )"+c.escapeString(e)+"=([^;]*)","g"));if(i)for(r=0;r<i.length;r++){var n=i[r],o=n.indexOf("=");o>-1&&(n=n.substring(o+1),s.push(decodeURIComponent(n)))}return s},_doPortalSignIn:function(e){if(l.isSupported()){var r=this._getEsriAuthCookie(),s=this._portalConfig,t=window.location.href,i=this.findServerInfo(e);if(this.useSignInPage&&(s||this._isPortalDomain(t)||r)&&(i?i.hasPortal||i.owningSystemUrl&&this._isPortalDomain(i.owningSystemUrl):this._isPortalDomain(e))&&(this._isIdProvider(t,e)||s&&(this._hasSameServerInstance(this._getServerInstanceRoot(s.restBaseUrl),e)||this._isIdProvider(s.restBaseUrl,e))||v.hasSameOrigin(t,e,!0)))return!0}return!1},_checkProtocol:function(e,t,i,n){var o=!0,a=n?t.adminTokenServiceUrl:t.tokenServiceUrl;if(!(0!==s.trim(a).toLowerCase().indexOf("https:")||0===window.location.href.toLowerCase().indexOf("https:")||d.defaults.io.useCors&&(v.canUseXhr(a)||v.canUseXhr(v.getProxyUrl(!0).path))||(o=this._protocolFunc?!!this._protocolFunc({resourceUrl:e,serverInfo:t}):!1))){var l=new Error("Aborted the Sign-In process to avoid sending password over insecure connection.");l.code="IdentityManagerBase.4",l.log=r.isDebug,console.log(l.message),i(l)}return o},_enqueue:function(e,r,s,t,n,o){return t||(t=new i(g._dfdCanceller)),t.resUrl_=e,t.sinfo_=r,t.options_=s,t.admin_=n,t.refresh_=o,this._busy?this._hasSameServerInstance(this._getServerInstanceRoot(e),this._busy.resUrl_)?(this._oAuthDfd&&this._oAuthDfd.oAuthWin_&&this._oAuthDfd.oAuthWin_.focus(),this._soReqs.push(t)):this._xoReqs.push(t):this._doSignIn(t),t},_doSignIn:function(e){this._busy=e;var i=this,n=function(r){var s=e.options_&&e.options_.resource,n=e.resUrl_,o=e.refresh_,a=!1;-1===t.indexOf(i.credentials,r)&&(o&&-1!==t.indexOf(i.credentials,o)?(o.userId=r.userId,o.token=r.token,o.expires=r.expires,o.validity=r.validity,o.ssl=r.ssl,o.creationTime=r.creationTime,a=!0,r=o):i.credentials.push(r)),r.resources||(r.resources=[]),r.resources.push(s||n),r.scope=i._isServerRsrc(n)?"server":"portal",r.onTokenChange();var l=i._soReqs,h={};i._soReqs=[],t.forEach(l,function(e){if(!this._isIdenticalService(n,e.resUrl_)){var s=this._getSuffix(e.resUrl_);h[s]||(h[s]=!0,r.resources.push(e.resUrl_))}},i),e.callback(r),t.forEach(l,function(e){e.callback(r)}),i._busy=e.resUrl_=e.sinfo_=e.refresh_=null,a||i.onCredentialCreate({credential:r}),i._soReqs.length&&i._doSignIn(i._soReqs.shift()),i._xoReqs.length&&i._doSignIn(i._xoReqs.shift())},o=function(r){e.errback(r),i._busy=e.resUrl_=e.sinfo_=e.refresh_=null,i._soReqs.length&&i._doSignIn(i._soReqs.shift()),i._xoReqs.length&&i._doSignIn(i._xoReqs.shift())},a=function(s,t,a,l){var h,c,u=e.sinfo_,_=!e.options_||e.options_.prompt!==!1;if(i._doPortalSignIn(e.resUrl_)){var v=i._getEsriAuthCookie(),g=i._portalConfig;if(v)return void n(new k({userId:v.email,server:u.server,token:v.token,expires:null}));if(_){var p="",m=window.location.href;return p=i.signInPage?i.signInPage:g?g.baseUrl+g.signin:i._isIdProvider(m,e.resUrl_)?i._getOrigin(m)+"/home/signin.html":u.tokenServiceUrl.replace(i._rePortalTokenSvc,"")+"/home/signin.html",p=p.replace(/http:/i,"https:"),g&&g.useSSL===!1&&(p=p.replace(/https:/i,"http:")),void(0===m.toLowerCase().replace("https","http").indexOf(p.toLowerCase().replace("https","http"))?(c=new Error("Cannot redirect to Sign-In page from within Sign-In page. URL of the resource that triggered this workflow: "+e.resUrl_),c.code="IdentityManagerBase.5",c.log=r.isDebug,o(c)):i._redirectFunc?i._redirectFunc({signInPage:p,returnUrlParamName:"returnUrl",returnUrl:m,resourceUrl:e.resUrl_,serverInfo:u}):window.location=p+"?returnUrl="+window.escape(m))}c=new Error("User is not signed in."),c.code="IdentityManagerBase.6",c.log=r.isDebug,o(c)}else if(s)n(new k({userId:s,server:u.server,token:a,expires:f.isDefined(l)?Number(l):null,ssl:!!t}));else if(d){var I=d._oAuthCred;if(!I){var w=new S(d,window.localStorage),U=new S(d,window.sessionStorage);w.isValid()&&U.isValid()?w.expires>U.expires?(I=w,U.destroy()):(I=U,w.destroy()):I=w.isValid()?w:U,d._oAuthCred=I}if(I.isValid())n(new k({userId:I.userId,server:u.server,token:I.token,expires:I.expires,ssl:I.ssl,_oAuthCred:I}));else if(i._oAuthHash&&i._oAuthHash.state.portalUrl===d.portalUrl){var x=i._oAuthHash;h=new k({userId:x.username,server:u.server,token:x.access_token,expires:(new Date).getTime()+1e3*Number(x.expires_in),ssl:"true"===x.ssl,oAuthState:x.state,_oAuthCred:I}),I.storage=x.persist?window.localStorage:window.sessionStorage,I.token=h.token,I.expires=h.expires,I.userId=h.userId,I.ssl=h.ssl,I.save(),i._oAuthHash=null,n(h)}else _?e._pendingDfd=i.oAuthSignIn(e.resUrl_,u,d,e.options_).addCallbacks(n,o):(c=new Error("User is not signed in."),c.code="IdentityManagerBase.6",c.log=r.isDebug,o(c))}else if(_){if(i._checkProtocol(e.resUrl_,u,o,e.admin_)){var T=e.options_;e.admin_&&(T=T||{},T.isAdmin=!0),e._pendingDfd=i.signIn(e.resUrl_,u,T).addCallbacks(n,o)}}else c=new Error("User is not signed in."),c.code="IdentityManagerBase.6",c.log=r.isDebug,o(c)},l=function(){var r,s,a,l=e.sinfo_,h=l.owningSystemUrl,c=e.options_;if(c&&(r=c.token,s=c.error),a=i._findCredential(h,{token:r,resource:e.resUrl_}),!a&&U(l)&&t.some(i.credentials,function(e){return this._isIdProvider(h,e.server)&&(a=e),!!a},i),a){var u=i.findCredential(e.resUrl_,a.userId);if(u)n(u);else if(x(l,i._legacyFed)){var d=a.toJson();d.server=l.server,d.resources=null,n(new k(d))}else{var _=e._pendingDfd=i.generateToken(i.findServerInfo(a.server),null,{serverUrl:e.resUrl_,token:a.token,ssl:a.ssl});_.addCallbacks(function(r){n(new k({userId:a.userId,server:l.server,token:r.token,expires:f.isDefined(r.expires)?Number(r.expires):null,ssl:!!r.ssl,isAdmin:e.admin_,validity:r.validity}))},o)}}else{i._busy=null,r&&(e.options_.token=null);var v=e._pendingDfd=i.getCredential(h.replace(/\/?$/,"/sharing"),{resource:e.resUrl_,token:r,error:s});v.addCallbacks(function(){i._enqueue(e.resUrl_,e.sinfo_,e.options_,e,e.admin_)},function(e){o(e)})}},h=e.sinfo_.owningSystemUrl,c=this._isServerRsrc(e.resUrl_),u=e.sinfo_._restInfoDfd,d=this._findOAuthInfo(e.resUrl_);if(u)u.addCallbacks(function(r){var t=e.sinfo_;t.adminTokenServiceUrl=t._restInfoDfd.adminUrl_,t._restInfoDfd=null,t.tokenServiceUrl=s.getObject("authInfo.tokenServicesUrl",!1,r)||s.getObject("authInfo.tokenServiceUrl",!1,r)||s.getObject("tokenServiceUrl",!1,r),t.shortLivedTokenValidity=s.getObject("authInfo.shortLivedTokenValidity",!1,r),t.currentVersion=r.currentVersion,t.owningTenant=r.owningTenant;var n=t.owningSystemUrl=r.owningSystemUrl;n&&i._portals.push(n),c&&n?l():a()},function(){e.sinfo_._restInfoDfd=null;var s=new Error("Unknown resource - could not find token service endpoint.");s.code="IdentityManagerBase.2",s.log=r.isDebug,o(s)});else if(c&&h)l();else if(e.sinfo_._selfDfd){var _=function(r){e.sinfo_._selfDfd=null;var s=r&&r.user&&r.user.username,t=r&&r.allSSL;if(e.sinfo_.webTierAuth=!!s,s&&i.normalizeWebTierAuth){e.sinfo_._tokenDfd=i.generateToken(e.sinfo_,null,{ssl:t});var n=function(r){e.sinfo_._tokenDfd=null,a(s,t,r&&r.token,r&&r.expires)};e.sinfo_._tokenDfd.then(n,n)}else a(s,t)};e.sinfo_._selfDfd.then(_,_)}else a()}});return k=e(m,{declaredClass:"esri.Credential",tokenRefreshBuffer:2,constructor:function(e){s.mixin(this,e),this.resources=this.resources||[],f.isDefined(this.creationTime)||(this.creationTime=(new Date).getTime())},_oAuthCred:null,refreshToken:function(){var e,r,s=this,i=this.resources&&this.resources[0],n=u.id.findServerInfo(this.server),o=n&&n.owningSystemUrl,a=!!o&&"server"===this.scope,l=a&&x(n,u.id._legacyFed),h=a&&u.id.findServerInfo(o),c=n.webTierAuth,d=c&&u.id.normalizeWebTierAuth,_=w[this.server],v=_&&_[this.userId],g={username:this.userId,password:v};if((!c||d)&&(a&&!h&&t.some(u.id.serverInfos,function(e){return u.id._isIdProvider(o,e.server)&&(h=e),!!h}),e=h&&u.id.findCredential(h.server,this.userId),!a||e)){if(l)return void e.refreshToken();if(a)r={serverUrl:i,token:e&&e.token,ssl:e&&e.ssl};else if(d)g=null,r={ssl:this.ssl};else{if(!v){var p;return i&&(i=u.id._sanitizeUrl(i),this._enqueued=1,p=u.id._enqueue(i,n,null,null,this.isAdmin,this),p.addCallback(function(){s._enqueued=0,s.refreshServerTokens()}).addErrback(function(){s._enqueued=0})),p}this.isAdmin&&(r={isAdmin:!0})}return u.id.generateToken(a?h:n,a?null:g,r).addCallback(function(e){s.token=e.token,s.expires=f.isDefined(e.expires)?Number(e.expires):null,s.creationTime=(new Date).getTime(),s.validity=e.validity,s.onTokenChange(),s.refreshServerTokens()}).addErrback(function(){})}},refreshServerTokens:function(){"portal"===this.scope&&t.forEach(u.id.credentials,function(e){var r=u.id.findServerInfo(e.server),s=r&&r.owningSystemUrl;e!==this&&e.userId===this.userId&&s&&"server"===e.scope&&(u.id._hasSameServerInstance(this.server,s)||u.id._isIdProvider(s,this.server))&&(x(r,u.id._legacyFed)?(e.token=this.token,e.expires=this.expires,e.creationTime=this.creationTime,e.validity=this.validity,e.onTokenChange()):e.refreshToken())},this)},onTokenChange:function(e){clearTimeout(this._refreshTimer);var r=this.server&&u.id.findServerInfo(this.server),s=r&&r.owningSystemUrl,t=s&&u.id.findServerInfo(s);e!==!1&&(!s||"portal"===this.scope||t&&t.webTierAuth&&!u.id.normalizeWebTierAuth)&&(f.isDefined(this.expires)||f.isDefined(this.validity))&&this._startRefreshTimer()},onDestroy:function(){},destroy:function(){this.userId=this.server=this.token=this.expires=this.validity=this.resources=this.creationTime=null,this._oAuthCred&&(this._oAuthCred.destroy(),this._oAuthCred=null);var e=t.indexOf(u.id.credentials,this);e>-1&&u.id.credentials.splice(e,1),this.onTokenChange(),this.onDestroy()},toJson:function(){return this._toJson()},_toJson:function(){var e=f.fixJson({userId:this.userId,server:this.server,token:this.token,expires:this.expires,validity:this.validity,ssl:this.ssl,isAdmin:this.isAdmin,creationTime:this.creationTime,scope:this.scope}),r=this.resources;return r&&r.length>0&&(e.resources=r),e},_startRefreshTimer:function(){clearTimeout(this._refreshTimer);var e=6e4*this.tokenRefreshBuffer,r=this.validity?this.creationTime+6e4*this.validity:this.expires,t=r-(new Date).getTime();0>t&&(t=0),this._refreshTimer=setTimeout(s.hitch(this,this.refreshToken),t>e?t-e:t)}}),T.Credential=k,a("extend-esri")&&(u.IdentityManagerBase=T),T});