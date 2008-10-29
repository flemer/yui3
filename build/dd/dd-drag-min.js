YUI.add("dd-drag",function(D){var E=D.DD.DDM,S="node",L="dragNode",C="offsetHeight",J="offsetWidth",Q="mouseup",N="mousedown",G="drag:mouseDown",B="drag:afterMouseDown",F="drag:removeHandle",K="drag:addHandle",P="drag:removeInvalid",R="drag:addInvalid",I="drag:start",H="drag:end",O="drag:beforeDrag",M="drag:drag";var A=function(){A.superclass.constructor.apply(this,arguments);E._regDrag(this);};A.NAME="drag";A.ATTRS={node:{set:function(T){var U=D.Node.get(T);if(!U){D.fail("DD.Drag: Invalid Node Given: "+T);}return U;}},dragNode:{set:function(T){var U=D.Node.get(T);if(!U){D.fail("DD.Drag: Invalid dragNode Given: "+T);}return U;}},offsetNode:{value:true},clickPixelThresh:{value:E.get("clickPixelThresh")},clickTimeThresh:{value:E.get("clickTimeThresh")},lock:{value:false,set:function(T){if(T){this.get(S).addClass(E.CSS_PREFIX+"-locked");}else{this.get(S).removeClass(E.CSS_PREFIX+"-locked");}}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,set:function(T){this._handleTarget(T);}},dragMode:{value:null,set:function(T){return E._setDragMode(T);}},groups:{value:["default"],get:function(){if(!this._groups){this._groups={};}var T=[];D.each(this._groups,function(V,U){T[T.length]=U;});return T;},set:function(T){this._groups={};D.each(T,function(V,U){this._groups[V]=true;},this);}},handles:{value:null,set:function(T){if(T){this._handles={};D.each(T,function(V,U){this._handles[V]=true;},this);}else{this._handles=null;}return T;}}};D.extend(A,D.Base,{addToGroup:function(T){this._groups[T]=true;E._activateTargets();return this;},removeFromGroup:function(T){delete this._groups[T];E._activateTargets();return this;},target:null,_handleTarget:function(T){if(D.DD.Drop){if(T===false){if(this.target){E._unregTarget(this.target);this.target=null;}return false;}else{if(!D.Lang.isObject(T)){T={};}T.node=this.get(S);this.target=new D.DD.Drop(T);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(G,{defaultFn:this._handleMouseDown,queuable:true,emitFacade:true,bubbles:true});var T=[B,F,K,P,R,I,H,O,M,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];D.each(T,function(V,U){this.publish(V,{type:V,emitFacade:true,bubbles:true,preventable:false,queuable:true});},this);this.addTarget(E);},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(T){this._fixIEMouseUp();if(E.activeDrag){E._end();}},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(D.UA.ie){this._ieSelectBack=D.config.doc.body.onselectstart;D.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(D.UA.ie){D.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(T){this.fire(G,{ev:T});},_handleMouseDown:function(V){var U=V.ev;this._dragThreshMet=false;this._ev_md=U;if(this.get("primaryButtonOnly")&&U.button>1){return false;}if(this.validClick(U)){this._fixIEMouseDown();U.halt();this._setStartPosition([U.pageX,U.pageY]);E.activeDrag=this;var T=this;this._clickTimeout=setTimeout(function(){T._timeoutCheck.call(T);},this.get("clickTimeThresh"));}this.fire(B,{ev:U});},validClick:function(X){var W=false,T=X.target,V=null;if(this._handles){D.each(this._handles,function(Z,a){if(D.Lang.isString(a)){if(T.test(a+", "+a+" *")&&!V){V=a;W=true;}}});}else{if(this.get(S).contains(T)||this.get(S).compareTo(T)){W=true;}}if(W){if(this._invalids){D.each(this._invalids,function(Z,a){if(D.Lang.isString(a)){if(T.test(a+", "+a+" *")){W=false;}}});}}if(W){if(V){var U=X.currentTarget.queryAll(V),Y=false;U.each(function(a,Z){if((a.contains(T)||a.compareTo(T))&&!Y){Y=true;this.set("activeHandle",U.item(Z));}},this);}else{this.set("activeHandle",this.get(S));}}return W;},_setStartPosition:function(T){this.startXY=T;this.nodeXY=this.get(S).getXY();this.lastXY=this.nodeXY;this.realXY=this.nodeXY;if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")){this._fromTimeout=true;this._dragThreshMet=true;this.start();this._moveNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(T){if(this._handles[T]){delete this._handles[T];this.fire(F,{handle:T});}return this;},addHandle:function(T){if(!this._handles){this._handles={};}if(D.Lang.isString(T)){this._handles[T]=true;this.fire(K,{handle:T});}return this;},removeInvalid:function(T){if(this._invalids[T]){this._invalids[T]=null;delete this._invalids[T];this.fire(P,{handle:T});}return this;},addInvalid:function(T){if(D.Lang.isString(T)){this._invalids[T]=true;this.fire(R,{handle:T});}else{}return this;},initializer:function(){if(!this.get(S).get("id")){var T=D.stamp(this.get(S));this.get(S).set("id",T);}this._invalids=D.clone(this._invalidsDefault,true);this._createEvents();if(!this.get(L)){this.set(L,this.get(S));}this._prep();this._dragThreshMet=false;},_prep:function(){var T=this.get(S);T.addClass(E.CSS_PREFIX+"-draggable");T.on(N,this._handleMouseDownEvent,this,true);T.on(Q,this._handleMouseUp,this,true);},_unprep:function(){var T=this.get(S);T.removeClass(E.CSS_PREFIX+"-draggable");T.detach(N,this._handleMouseDownEvent,this,true);T.detach(Q,this._handleMouseUp,this,true);},start:function(){if(!this.get("lock")&&!this.get("dragging")){this.set("dragging",true);E._start(this.deltaXY,[this.get(S).get(C),this.get(S).get(J)]);this.get(S).addClass(E.CSS_PREFIX+"-dragging");this.fire(I,{pageX:this.nodeXY[0],pageY:this.nodeXY[1]});this.get(L).on(Q,this._handleMouseUp,this,true);var T=this.nodeXY;this._startTime=(new Date()).getTime();this.region={"0":T[0],"1":T[1],area:0,top:T[1],right:T[0]+this.get(S).get(J),bottom:T[1]+this.get(S).get(C),left:T[0]};
}return this;},end:function(){this._endTime=(new Date()).getTime();clearTimeout(this._clickTimeout);this._dragThreshMet=false;this._fromTimeout=false;if(!this.get("lock")&&this.get("dragging")){this.fire(H,{pageX:this.lastXY[0],pageY:this.lastXY[1]});}this.get(S).removeClass(E.CSS_PREFIX+"-dragging");this.set("dragging",false);this.deltaXY=[0,0];this.get(L).detach(Q,this._handleMouseUp,this,true);return this;},_align:function(T){return[T[0]-this.deltaXY[0],T[1]-this.deltaXY[1]];},_moveNode:function(T,Y){this.fire(O);var X=this._align(T),U=[],V=[];U[0]=(X[0]-this.lastXY[0]);U[1]=(X[1]-this.lastXY[1]);V[0]=(X[0]-this.nodeXY[0]);V[1]=(X[1]-this.nodeXY[1]);if(this.get("move")){if(D.UA.opera){this.get(L).setXY(X);}else{E.setXY(this.get(L),U);}this.realXY=X;}this.region={"0":X[0],"1":X[1],area:0,top:X[1],right:X[0]+this.get(L).get(J),bottom:X[1]+this.get(L).get(C),left:X[0]};var W=this.nodeXY;if(!Y){this.fire(M,{pageX:X[0],pageY:X[1],info:{start:W,xy:X,delta:U,offset:V}});}this.lastXY=X;},_move:function(V){if(this.get("lock")){return false;}else{this.mouseXY=[V.pageX,V.pageY];if(!this._dragThreshMet){var U=Math.abs(this.startXY[0]-V.pageX);var T=Math.abs(this.startXY[1]-V.pageY);if(U>this.get("clickPixelThresh")||T>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._moveNode([V.pageX,V.pageY]);}}else{clearTimeout(this._clickTimeout);this._moveNode([V.pageX,V.pageY]);}}},stopDrag:function(){if(this.get("dragging")){E._end();}return this;},destructor:function(){E._unregDrag(this);this._unprep();if(this.target){this.target.destroy();}}});D.namespace("DD");D.DD.Drag=A;},"@VERSION@",{requires:["dd-ddm-base"],skinnable:false});