(window.webpackJsonp=window.webpackJsonp||[]).push([[2],[,,,function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=(n(6),n(2)),s=n.n(r);n(4);function i(e){const t=new Date;return e.getMonth()<11?(t.setFullYear(e.getFullYear()),t.setMonth(e.getMonth()+1)):(t.setMonth(0),t.setFullYear(e.getFullYear()+1)),t}const l={0:"January",1:"February",2:"March",3:"April",4:"May",5:"June",6:"July",7:"August",8:"September",9:"October",10:"November",11:"December"},c=["Su","M","Tu","W","Th","F","Sa"];const u={onbeforeremove({dom:e,state:t,attrs:{month:n,id:a}}){if(!((e,t)=>{const n=new Date(e);n.setMonth(e.getMonth()+6);const a=new Date(e);a.setMonth(e.getMonth()-6);const o=t<e?"right":"left";return t>n&&"left"===o||t<a&&"right"===o})(t.initialDate,n())){const a=n()<t.initialDate?"right":"left";return e.classList.add("out-"+a),e.parentElement.classList.add("in-"+a),new Promise(t=>{setTimeout(()=>{e.parentElement.classList.remove("in-"+a),t()},300)})}},oninit({state:e,attrs:{month:t,id:n}}){e.initialDate=t(),e.days=function(e,t){for(var n=new Date(t,e,1),a=[];n.getMonth()===e;){const e=new Date(n);e.setHours(12,0,0,0),a.push(e),n.setDate(n.getDate()+1)}return a}(t().getMonth(),t().getFullYear()),e.startDay=e.days[0].getDay(),e.empties=new Array(e.startDay).fill(0),e.id=n},view:({state:e,attrs:{month:t,id:n,firstDate:a,secondDate:r}})=>o()(`.month.month-${n}`,[o()("h5",l[t().getMonth()]),o()(".month-grid",[o()(".days",c.map(e=>o()(".day",e))),o()(".dates",[e.empties.map(()=>o()(".empty-date")),e.days.map(e=>o()(m,{date:e,firstDate:a,secondDate:r}))])])])},m={view:({attrs:{date:e,firstDate:t,secondDate:n}})=>o()(".date",{class:((e,t,n)=>{if(e&&t()&&!n()){if(t().getTime()==e.getTime()&&!n())return"initial-date"}else if(e&&t()&&n()){if(t().getTime()==e.getTime())return"first-date";if(n().getTime()==e.getTime())return"second-date";if(e<n()&&e>t())return"in-between"}})(e,t,n),onclick(){if(t())if(t()&&!n()){n(e);const a=t(),o=n();o.getTime()<a.getTime()&&(t(o),n(a))}else t()&&n()&&(n(null),t(e));else t(e)}},[o()(".shape"),o()(".bg"),o()(".number",e.getDate())])},d={view:({attrs:{date:e}})=>o()(".year-container",[o()("button.year-previous",{onclick(){const t=new Date(e());t.setFullYear(e().getFullYear()-1),e(t)}},"Prev"),o()(".year",e().getFullYear()),o()("button.year-next",{onclick(){const t=new Date(e());t.setFullYear(e().getFullYear()+1),e(t)}},"Next")])};var h={onremove({state:e}){document.removeEventListener("click",e.close)},oninit({state:e,attrs:{data:t,arrivalProp:n,departureProp:a}}){e.show=s()(!1),e.toggle=(t=>{document.activeElement.classList.contains("date-range-input")&&!e.show()&&(e.show(!e.show()),o.a.redraw())}),e.close=(()=>{e.show(!1),o.a.redraw()}),document.addEventListener("click",e.close);const r=new Date;e.monthOne=s()(r),e.monthTwo=e.monthOne.map(()=>i(e.monthOne())),e.months=e.monthTwo.map(()=>[{month:e.monthOne,id:"1",key:e.monthOne().getTime()},{month:e.monthTwo,id:"2",key:e.monthTwo().getTime()}]),e.firstDate=s()(),e.secondDate=s()(),e.secondDate.map(o=>{o?(t[n]=e.firstDate(),t[a]=e.secondDate()):(t[n]=null,t[a]=null)})},view:({state:{monthOne:e,monthTwo:t,months:n,show:a,toggle:r,movement:s,firstDate:l,secondDate:c},attrs:{placeholder:m}})=>o()(".date-range",{onclick:e=>e.stopPropagation()},[o()("input.date-range-input",{class:a()?"focus":"",placeholder:m,onclick:r,onfocus:r}),o()(".calendar-display",{onbeforeremove:({dom:e})=>(e.classList.add("fade-out"),new Promise(e=>{setTimeout(e,200)}))},[o()(".triangle"),o()("button.previous-month.month-navigation",{onclick(){e(function(e){const t=new Date;return e.getMonth()>0?(t.setFullYear(e.getFullYear()),t.setMonth(e.getMonth()-1)):(t.setMonth(11),t.setFullYear(e.getFullYear()-1)),t}(e()))}},"Prev"),o()("button.next-month.month-navigation",{onclick(){e(i(e()))}},"Next"),o()(d,{date:e}),o()(".months-container",n().map(e=>o()(u,{month:e.month,id:e.id,key:e.key,firstDate:l,secondDate:c})))])])},g={location:"Hull",arrivalDate:null,departureDate:null},p={view:function(e){return o()(".page-date-range",[o()(h,{placeholder:"Arrival/Departure",data:g,arrivalProp:"arrivalDate",departureProp:"departureDate"}),o()(".json",JSON.stringify(g))])}};o.a.mount(document.body,p)},function(e,t){},,function(e,t){}],[[3,0,1]]]);
//# sourceMappingURL=main.4560.js.map