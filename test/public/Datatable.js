import './webix/webix.js';

export default class Datatable {
  constructor() {
    this.init();
  }

  init() {
    const div = document.createElement('div');

    div.id = 'testA';
    div.style.width = '500px';
    div.style.height = '500px';

    document.body.appendChild(div);
    webix.ready(() => {
      const grid = webix.ui({
        container:"testA",
        view:"datatable",
        columns:[
          { id:"rank",	header:"", css:"rank",  		width:50},
          { id:"title",	header:"Film title",width:200},
          { id:"year",	header:"Released" , width:80},
          { id:"votes",	header:"Votes", 	width:100}
        ],
        select:"row",
        autoheight:true,
        autowidth:true,
        multiselect:true,

        on:{
          onSelectChange:function(){
            var text = "Selected: "+grid.getSelectedId(true).join();
            document.getElementById('testB').innerHTML = text;
          }
        },

        data:[
          { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rating:9.2, rank:1, category:"Thriller"},
          { id:2, title:"The Godfather", year:1972, votes:511495, rating:9.2, rank:2, category:"Crime"},
          { id:3, title:"The Godfather: Part II", year:1974, votes:319352, rating:9.0, rank:3, category:"Crime"},
          { id:4, title:"The Good, the Bad and the Ugly", year:1966, votes:213030, rating:8.9, rank:4, category:"Western"},
          { id:5, title:"Pulp fiction", year:1994, votes:533848, rating:8.9, rank:5, category:"Crime"},
          { id:6, title:"12 Angry Men", year:1957, votes:164558, rating:8.9, rank:6, category:"Western"}
        ]
      });		
    });
  }
}
