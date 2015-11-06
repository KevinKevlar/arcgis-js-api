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

define(["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/has","../kernel","../lang","../symbols/jsonUtils","./Renderer"],function(e,a,i,s,t,l,o,n){var r=e(n,{declaredClass:"esri.renderer.ClassBreaksRenderer",constructor:function(e,i){if(this.breaks=[],this._symbols={},this.infos=[],this.isMaxInclusive=!0,e&&!e.declaredClass){var s=e;this.attributeField=s.field,e=s.defaultSymbol,this.defaultSymbol=e&&(e.declaredClass?e:o.fromJson(e)),e=s.backgroundFillSymbol,this.backgroundFillSymbol=e&&(e.declaredClass?e:o.fromJson(e)),this._copy(["defaultLabel","classificationMethod:rest","normalizationType:rest","normalizationField","normalizationTotal"],s,this);var t=s.minValue,n=s.classBreakInfos;n&&n[0]&&l.isDefined(n[0].classMaxValue)&&a.forEach(n,function(e){var a=e.classMaxValue;e.minValue=t,e.maxValue=a,t=a},this),a.forEach(n,this._addBreakInfo,this)}else this.defaultSymbol=e,this.attributeField=i},addBreak:function(e,a,s){var t=i.isObject(e)?e:{minValue:e,maxValue:a,symbol:s};this._addBreakInfo(t)},removeBreak:function(e,a){var i,s,t=this.breaks,l=t.length,o=this._symbols;for(s=0;l>s;s++)if(i=t[s],i[0]==e&&i[1]==a){t.splice(s,1),delete o[e+"-"+a],this.infos.splice(s,1);break}},clearBreaks:function(){this.breaks=[],this._symbols={},this.infos=[]},getBreakIndex:function(e){var a,s,t,l=this.attributeField,o=e.attributes,n=this.breaks,r=n.length,d=this.isMaxInclusive;if(i.isFunction(l))a=l(e);else{a=parseFloat(o[l]);var u,f,m=this.normalizationType;m&&(u=parseFloat(this.normalizationTotal),f=parseFloat(o[this.normalizationField]),"log"===m?a=Math.log(a)*Math.LOG10E:"percent-of-total"!==m||isNaN(u)?"field"!==m||isNaN(f)||(a/=f):a=a/u*100)}for(s=0;r>s;s++)if(t=n[s],t[0]<=a&&(d?a<=t[1]:a<t[1]))return s;return-1},getBreakInfo:function(e){var a=this.getBreakIndex(e);return-1!==a?this.infos[a]:null},getSymbol:function(e){var a=this.breaks[this.getBreakIndex(e)];return a?this._symbols[a[0]+"-"+a[1]]:this.defaultSymbol},setMaxInclusive:function(e){this.isMaxInclusive=e},_normalizationTypeEnums:[["field","esriNormalizeByField"],["log","esriNormalizeByLog"],["percent-of-total","esriNormalizeByPercentOfTotal"]],_classificationMethodEnums:[["natural-breaks","esriClassifyNaturalBreaks"],["equal-interval","esriClassifyEqualInterval"],["quantile","esriClassifyQuantile"],["standard-deviation","esriClassifyStandardDeviation"],["geometrical-interval","esriClassifyGeometricalInterval"]],_copy:function(e,i,s){a.forEach(e,function(e){var a,t,l,o,n=e.split(":");if(n.length>1&&(e=n[0],a=this["_"+e+"Enums"],"rest"===n[1]?(t="1",l="0"):"sdk"===n[1]&&(t="0",l="1")),o=i[e],void 0!==o&&(s[e]=o,a&&t)){var r,d=a.length;for(r=0;d>r;r++)if(a[r][t]===o){s[e]=a[r][l];break}}},this)},_addBreakInfo:function(e){var a=e.minValue,i=e.maxValue;this.breaks.push([a,i]),this.infos.push(e);var s=e.symbol;s&&(s.declaredClass||(e.symbol=o.fromJson(s))),this._symbols[a+"-"+i]=e.symbol},toJson:function(){var e=this.infos||[],s=l.fixJson,t=e[0]&&e[0].minValue,o=this.backgroundFillSymbol,n=i.mixin(this.inherited(arguments),{type:"classBreaks",field:this.attributeField,defaultSymbol:this.defaultSymbol&&this.defaultSymbol.toJson(),backgroundFillSymbol:o&&o.toJson(),minValue:t===-1/0?-Number.MAX_VALUE:t,classBreakInfos:a.map(e,function(e){return e=i.mixin({},e),e.symbol=e.symbol&&e.symbol.toJson(),e.classMaxValue=1/0===e.maxValue?Number.MAX_VALUE:e.maxValue,delete e.minValue,delete e.maxValue,s(e)})});return this._copy(["defaultLabel","classificationMethod:sdk","normalizationType:sdk","normalizationField","normalizationTotal"],this,n),n.hasOwnProperty("normalizationType")&&!n.normalizationType&&delete n.normalizationType,n.hasOwnProperty("classificationMethod")&&!n.classificationMethod&&delete n.classificationMethod,s(n)}});return s("extend-esri")&&i.setObject("renderer.ClassBreaksRenderer",r,t),r});