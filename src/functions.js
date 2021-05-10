// function hidegraph(){
//   document.getElementById("graph").style.display = "none"
// }
// setTimeout(hidegraph, 1)

// TAGIFY INPUT FIELD
var input = document.querySelector('input[name="input-custom-dropdown"]'),
    // init Tagify script on the above inputs
    tagify = new Tagify(input, {
      whitelist: ["chloroquine", 
                  "ventilation", 
                  "ARDS",
                  "hydroxychloroquine"],
      maxTags: 5,
    })

// EVENT HANDLER FOR ADDING/REMOVING TAGS
tagify.on('add', e => {
  var rawex = input.value
  var regex = rawex.replace(/{"value":"/g, '\\b')
                   .replace(/,/g,'|')
                   .replace(/"}/g,'')
                   .replace(/\[/g, '(')
                   .replace(/\]/g, ')')

  var re = new RegExp(regex, "i")
  searcher(re)
})

tagify.on('remove', e => {
  var rawex = input.value
  var regex = rawex.replace(/{"value":"/g, '\\b')
                   .replace(/,/g,'|')
                   .replace(/"}/g,'')
                   .replace(/\[/g, '(')
                   .replace(/\]/g, ')')

  var re = new RegExp(regex, "i")
  searcher(re)
})

var printed_nodes = [...Array(data.nodes.length).keys()]
printer()

function printer() {
  document.getElementById('userinfostring').innerHTML = ""
  fetch('./data/graph_metadata.json')
    .then((response) => {
      return response.json();
    })
    .then((metadata) => {
      var toprint = printed_nodes.slice(0,20)
      for (const i of toprint) {
        var userinfostring = returninfo2(i, metadata[i])
        document.getElementById('userinfostring').innerHTML += userinfostring
        //document.getElementById('textinfo').innerHTML = `${printed_nodes.length} articles`
  }
})
}
function printer2() {
  document.getElementById('userinfostring').innerHTML = ""
  fetch('./data/graph_metadata.json')
    .then((response) => {
      return response.json();
    })
    .then((metadata) => {
      var toprint = printed_nodes
      for (const i of toprint) {
        var userinfostring = returninfo2(i, metadata[i])
        document.getElementById('userinfostring').innerHTML += userinfostring
        //document.getElementById('textinfo').innerHTML = `${printed_nodes.length} articles`
  }
})
}

function searcher(query) {
  var nodestogreyout = []
  var nodestoprint = []
  fetch('./data/graph_metadata.json')
    .then((response) => {
      return response.json();
    })
    .then((metadata) => {
      for (var key in metadata) {
        if (metadata[key]["abstract"]
            .match(query) != null) {
        nodestoprint.push(key)
        }
        else {nodestogreyout.push(Number(key))}
      }
      colored = true
      Graph.nodeColor(node => { 
      if (nodestogreyout.indexOf(node.id) != -1) {
      return "rgba(0,0,0,0.05)";}
      else {return colordict[node.topic]}})
      printed_nodes = nodestoprint
      printer()
      document.getElementById('textinfo').innerHTML = `${nodestoprint.length} articles for ${query}`

})}

// INITIALIZATION
var fieldhighlighted = false
var colored = false
var nodestoexport = []
var mdatatoexport = []

exportstring = ""

function returninfo2(id, metadata){

// || <nobr><b>DOI</b>: <a style="font-size:10pt;margin-top:0" target="_blank" rel="noopener noreferrer" href="https://dx.doi.org/${metadata.doi}">${metadata.doi}</a></nobr>

var databstract = id
    
    if (metadata.journal == "arxiv" || metadata.journal == "medrxiv" || metadata.journal == "biorxiv")
      {ui1 = `<h5><img style="margin-right: 10px; vertical-align: -3" width=20px src="img/preprint.svg" alt=""><a class="titlelinks" target="_blank" href=${metadata.url}>${metadata.title}</a></h5>`}
    else
      {ui1 = `<h5><img style="margin-right: 10px; vertical-align: -3" width=20px src="img/publication.svg" alt=""><a class="titlelinks" target="_blank" href=${metadata.url}>${metadata.title}</a></h5>`}

    ui2 = `

<h6>${metadata.authors}</h6>
<p class="papersub">
    <b>Category:</b> <span style="color: ${colordict[metadata.subfield]}">${metadata.subfield}</span> || 
    <b>Released:</b> ${metadata.date} on ${metadata.journal} 
    </p>
<p id="${databstract}" class="paperabs"><b>Abstract:</b> ${metadata.abstract}</p>
` 
if (metadata.abstract.length > 320) {
ui3 = `
<div id="moreless">
<div id="more${databstract}" class="more main__item2"><svg onclick="expandabstract(${databstract})" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="chevronDownIconTitle">
    <title id="chevronDownIconTitle">Chevron Down</title>
    <polyline points="6 10 12 16 18 10"></polyline>
  </svg></div>
<div id="less${databstract}"class="less main__item2"><svg onclick="retractabstract(${databstract})" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="chevronUpIconTitle">
    <title id="chevronUpIconTitle">Chevron Up</title>
    <polyline points="6 14 12 8 18 14 18 14"></polyline>
  </svg></div>
</div>
<hr>`
}
else {
  ui3 = `
<br>
<hr>`

}


    ui = ui1 + ui2 + ui3
    return ui
}

function returninfo(node, metadata){
var databstract = node.id
    ui = `
<h5>${metadata[node.id].title}</h5>
<h6>${metadata[node.id].authors}</h6>
<p class="papersub">
    <b>Category:</b> <span style="color: ${colordict[metadata[node.id].subfield]}">${metadata[node.id].subfield}</span> || 
    <b>Released:</b> ${metadata[node.id].date} on ${metadata[node.id].server} || 
    <nobr><b>DOI</b>: <a style="font-size:10pt;margin-top:0" target="_blank" rel="noopener noreferrer" href="https://dx.doi.org/${metadata[node.id].doi}">${metadata[node.id].doi}</a></nobr>
    </p>
<p id="${databstract}" class="paperabs"><b>Abstract:</b> ${metadata[node.id].abstract}</p>
<button onclick="expandabstract(${databstract})">+</button> 
<button onclick="retractabstract(${databstract})">-</button> 

<hr>`
    return ui
}

function expandabstract(id) {
document.getElementById(`more${id}`).style.display = "none";
document.getElementById(`less${id}`).style.display = "block";
document.getElementById(id).style["max-height"] = "500px";
document.getElementById(id).style["transition"] = "transition: max-height 0.5s ease-in;"

// if (document.getElementById(id).style["max-height"] == "50px")
// {document.getElementById(id).style["max-height"] = "500px";
//  document.getElementById(id).style["transition"] = "transition: max-height 0.25s ease-in;"}
// else {document.getElementById(id).style["max-height"] = "50px"}
}

function retractabstract(id) {
document.getElementById(`more${id}`).style.display = "block";
document.getElementById(`less${id}`).style.display = "none";
document.getElementById(id).style["max-height"] = "50px";
document.getElementById(id).style["transition"] = "transition: max-height 0.5s ease-in;"

// if (document.getElementById(id).style["max-height"] == "50px")
// {document.getElementById(id).style["max-height"] = "500px";
//  document.getElementById(id).style["transition"] = "transition: max-height 0.25s ease-in;"}
// else {document.getElementById(id).style["max-height"] = "50px"}
}

// USER INFO ON CLICK
Graph.onNodeClick((node =>  {highlight(node)}))

// HIGHLIGHT NODES ON CLICK TO SEE CONNECTIONS
function highlight(node) {
  
  nodestoexport = []
  nodestoexport.push(node.id)
  
  colored = true
  // reinitialize cols
  
  var ido = node.id 
  Graph.nodeVal(node => {
    if (node.id === ido)
    {return 10}
    else 
    {return 2}
  })

  // get neighbors for coloring
  var neighbors = []
  neighbors.push(node)
  var goodlinks = []
  for (link of data.links) {
    if (link.source == node) {
      neighbors.push(link.target)
      nodestoexport.push(link.target.id)
      link.colorthat = 1
    }
    else if (link.target == node){
      neighbors.push(link.source)
      nodestoexport.push(link.source.id)
      link.colorthat = 1
    }
    else {link.colorthat=0}
  }
  for (node of data.nodes){
    if(neighbors.includes(node)){
      node.colorthat = 1
    }
    else node.colorthat = 0
  }
  colorbar = ['#d3d3d3', 'red']

  Graph.nodeColor(() => 'black') 
  Graph.nodeColor(node => colorbar[node.colorthat])

  // linkcolor depending on dark/lightmode
  var bodyelement = document.querySelector('body')
  var bodystyle = window.getComputedStyle(bodyelement)
  var bg = bodystyle.getPropertyValue('color')
  if (bg === 'rgb(0, 0, 0)') {var colorbar2 = ['rgba(0,0,0,0.05)', 'rgba(255,0,0,0.5)']}
  if (bg === 'rgb(255, 255, 255)') {var colorbar2 = ['rgba(255,255,255,0.03)', 'rgba(255,0,0,0.5)']}

Graph.linkVisibility(link => {
    if (link.index % 2 == 0 || link.source.id == ido || link.target.id == ido)
        { return true }
    else
        { return false}
})
  Graph.linkColor(link => colorbar2[link.colorthat])

  printed_nodes = nodestoexport
  printer2()
  writedisplay(nodestoexport)
  }

function exportnodes(){

exportstring = ""

var uniquenodestoexport = [];
$.each(nodestoexport, function(i, el){
    if($.inArray(el, uniquenodestoexport) === -1) uniquenodestoexport.push(el);
});

fetch('./data/graph_metadata.json')
  .then((response) => {
    return response.json();
  })
  .then((metadata) => {
  for (node of uniquenodestoexport)
    {title = metadata[node].title;
    authors = metadata[node].authors;
    rightstring = `${title}` + `, ` + `${authors}` + `, ` + `2020`
    exportstring += rightstring
    exportstring += "\n"}

  var dllink = document.createElement('a');
  dllink.download = 'preprints.txt';
  var blob = new Blob([exportstring], {type: 'text/plain'});
  dllink.href = window.URL.createObjectURL(blob);
  dllink.click();

  })

}

// GET THE LATEST PUBLICATIONS
function getlatest () {
  mdatatoexport = []
  nodestoexport = []
  Graph.nodeColor(() => 'black')  
  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var bfyesterday = new Date();
  bfyesterday.setDate(bfyesterday.getDate() - 2);
var nodelist = []
  var datelist = [today, yesterday, bfyesterday]
  var dates = []
  for (day of datelist){
  var dd = String(day.getDate()).padStart(2, '0');
  var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = day.getFullYear();    
  day = yyyy + '-' + mm + '-' + dd;
  dates.push(day)}
  
  fetch('./data/graph_metadata.json')
  .then((response) => {
    return response.json();
  })
  .then((metadata) => {
  for (node of data.nodes)  {
    nodesdate = metadata[node.id].date
    if (dates.includes(nodesdate)){
      node.colorthat = 1;
      nodestoexport.push(node.id)
    }
    else {node.colorthat = 0}
  colored = true
  colorbar = ['#d3d3d3', 'red']
  Graph.nodeColor(node => colorbar[node.colorthat])
  var bodyelement = document.querySelector('body')
  var bodystyle = window.getComputedStyle(bodyelement)
  var bg = bodystyle.getPropertyValue('color')
  if (bg === 'rgb(0, 0, 0)') {var lamecol = 'rgba(0,0,0,0.05)'}
  if (bg === 'rgb(255, 255, 255)') {var lamecol = 'rgba(255,255,255,0.03)'}
  Graph.linkColor (() => lamecol)
  Graph.linkColor(link => {
    if (link.source.colorthat === 1 &&
        link.target.colorthat === 1)
      { return 'rgba(255,0,0,0.4)'}
    else {return lamecol}
  })
  }
})}

//getlatest()

function writeinto (nambah=20, cat="Epidemiology") {
  document.getElementById('userinfostring').innerHTML = ""
  var breakpoint = 0
  fetch('./data/graph_metadata.json')
    .then((response) => {
      return response.json();
    })
    .then((metadata) => {
      for (const idx in metadata){
        if (metadata[idx].subfield == cat){
        breakpoint += 1
        var userinfostring = returninfo2(idx, metadata[idx])
        document.getElementById('userinfostring').innerHTML += userinfostring
      }
        if (breakpoint == nambah) { break;}
        }})}

function writeinto_filter (nambah=10, cat="preprints") {
  document.getElementById('userinfostring').innerHTML = ""
  var breakpoint = 0
  fetch('./data/graph_metadata.json')
    .then((response) => {
      return response.json();
    })
    .then((metadata) => {
      for (const idx in metadata){
        if (metadata[idx].subfield == cat){
        breakpoint += 1
        var userinfostring = returninfo2(idx, metadata[idx])
        document.getElementById('userinfostring').innerHTML += userinfostring
      }
        if (breakpoint == nambah) { break;}
        }})}

var colordict = data.graph.colordict

function fieldcolor () {
  colored = true
  var bodyelement = document.querySelector('body')
  var bodystyle = window.getComputedStyle(bodyelement)
  var bg = bodystyle.getPropertyValue('color')
  if (bg === 'rgb(255, 255, 255)') {
    Graph.linkColor(() => 'rgba(255,255,255,0.1)');
    }
  else if (bg === 'rgb(0, 0, 0)') {
    Graph.linkColor(() => 'rgba(0,0,0,0.1)')
    }  
  Graph.nodeColor(node => colordict[node.subfield]);
  $("#content06").slideDown(300)
}


// --- BUTTONS ----------
// OPEN ARTICLE ON CLICK
// function openart(){
// var title = document.getElementById("searchuser").value;
// const getNode = id => {
// return data.nodes.find(node => node.title === title);
// }
// var nodo = getNode(title)
// fetch('./data/graph_metadata.json')
//   .then((response) => {
//     return response.json();
//   })
//   .then((metadata) => {
// window.open(`https://dx.doi.org/${metadata[nodo.id].doi}`, '_blank')    
// })}

// // FETCH INFO ON CLICK
// function fetchinfo(){
// var title = document.getElementById("searchuser").value;
// const getNode = id => {
// return data.nodes.find(node => node.title === title);
// }
// var nodo = getNode(title)
// fetch('./data/graph_metadata.json')
//   .then((response) => {
//     return response.json();
//   })
//   .then((metadata) => {
// var userinfostring = returninfo(nodo, metadata)
// document.getElementById('userinfostring').innerHTML += userinfostring
// highlight(nodo)
// })}

Graph.onBackgroundClick(() => resetall())
Graph.onLinkClick(() => resetall())

// RESET TO BLACK

function resetall(){
  resetcolors()
  resetnodes()
  resetdisplaytext()  
}

function resetnodes(){
  Graph.nodeVisibility(true)
  document.getElementById("toggle_published").className = "filter-element"
  document.getElementById("toggle_preprints").className = "filter-element"
  resetdisplaytext()  
}

function resetcolors(){
  var printed_nodes = [...Array(data.nodes.length).keys()]
  printer()
  Graph.nodeColor(node => colordict[node.topic]);
  Graph.linkVisibility(link => {
    if (link.index % 2 == 0)
        { return true }
    else
        { return false}
  })
  Graph.linkColor(link => 'rgba(0,0,0,0.05)');
  Graph.nodeVal(2);
  resetlegend();
  resetdisplaytext()
}

function resetlegend(){
  var activelegends = document.getElementsByClassName("legend-element-active")
  for (var i = 0; i < activelegends.length; i++) {
    activelegends[i].className = "legend-element"
  }
}

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

// HIDE ALL THAT ARE NOT IN THAT CATEGORY
function highfield (cat) {

  resetdisplaytext()
  resetlegend()
  x = document.getElementById(cat)
  x.className = "legend-element-active"


  writeinto(nambah=20, cat=cat)

  nodestoexport = []
  fieldhighlighted = true
  fetch('./data/graph_metadata.json')
  .then((response) => {
    return response.json();
  })
  .then((metadata) => {
  for (node of data.nodes) {
    node.subfield = metadata[node.id].subfield
    }  
  colored = true

  // linkcolor depending on dark/lightmode
  var bodyelement = document.querySelector('body')
  var bodystyle = window.getComputedStyle(bodyelement)
  var bg = bodystyle.getPropertyValue('color')
  if (bg === 'rgb(0, 0, 0)') {var lamecol = 'rgba(0,0,0,0.05)'}
  if (bg === 'rgb(255, 255, 255)') {var lamecol = 'rgba(255,255,255,0.03)'}
  Graph.linkVisibility(link => {
    if (metadata[link.source.id].subfield === cat &&
    metadata[link.target.id].subfield === cat)
      { return true}
  })
  Graph.linkColor(link => {
    if (metadata[link.source.id].subfield === cat &&
        metadata[link.target.id].subfield === cat)
      { 
        var colhex = colordict[link.source.subfield];
        var colrgba = hexToRgbA(colhex);
        var colrgba_right = colrgba.slice(0,-2) + '0.5)'
        return colrgba_right}
    else {return lamecol}
  })

  Graph.nodeColor(node => { 
    if (node.subfield === cat) {
      nodestoexport.push(node.id);
      return colordict[node.subfield];}
      else {return lamecol}});

  // Graph.nodeVisibility(node => { 
  //   if (node.subfield === cat) {
  //     nodestoexport.push(node.id);
  //     return true;}
  //     else {return false}});
})}


// INCLUDE NETWORK INFORMATION FROM GRAPH DATA
var udt = `
Last updated: ${data.graph.date}
`
legstring = data.graph.legend
document.getElementById('legendtext').innerHTML = legstring
document.getElementById('updatetime').innerHTML = udt

// BUTTONS
function togglereader(){
  document.getElementById("readermode").style.display = "block";
  document.getElementById("graph").style.display = "none";
  document.getElementById("netbutton").style.display = "block";
  document.getElementById("listbutton").style.display = "none";
  document.getElementById("networkmode").style.display = "none";
  Graph.pauseAnimation()
}

function togglenetwork(){
  document.getElementById("readermode").style.display = "none";
  document.getElementById("graph").style.display = "block";
  document.getElementById("listbutton").style.display = "block";
  document.getElementById("netbutton").style.display = "none";
  document.getElementById("networkmode").style.display = "block";
  document.getElementById("infomode").style.display = "none";  
  document.getElementById("totalborder").style.opacity = "100%";
  document.getElementById("graph").style.visibility = "visible";
  document.getElementById("infobutton").style.opacity = "100%";
  Graph.resumeAnimation()
}

function toggleinfo(){
  document.getElementById("infomode").style.display = "block";    
  document.getElementById("readermode").style.display = "none";
  document.getElementById("graph").style.display = "none";
  document.getElementById("networkmode").style.display = "none";
  document.getElementById("listbutton").style.display = "none";
  document.getElementById("netbutton").style.display = "block";  

  Graph.pauseAnimation()  
}


function toggleLight() {
  var $body = $("body");
  $body.toggleClass("light-mode")
  document.getElementById("sun").style.display = "none";
  document.getElementById("moon").style.display = "block";
  if (colored == false) {Graph.nodeColor(() => 'black')}
}

function toggleDark() {
  var $body = $("body");
  // document.getElementById("body").style.transition = "200ms";
  // document.getElementById("totalborder").style.transition = "200ms"
  $body.toggleClass("dark-mode");
  document.getElementById("moon").style.display = "none";
  document.getElementById("sun").style.display = "block";
  if (colored == false) {Graph.nodeColor(() => 'white')}  
}

function showpublished(){
  Graph.nodeVisibility(node => {
    if (node.preprint == false)
      {return true}
    else
      {return false}
  })
  document.getElementById("toggle_published").className = "filter-element-active"
  document.getElementById("toggle_preprints").className = "filter-element-inactive"
}
function showpreprints(){
  Graph.nodeVisibility(node => {
    if (node.preprint == true)
      {return true}
    else
      {return false}
  })
  document.getElementById("toggle_published").className = "filter-element-inactive"
  document.getElementById("toggle_preprints").className = "filter-element-active"

}

function resetdisplaytext(){
  var initial_text = `
    Displaying the latest: <br> <br>
    <img style="margin-left: 0; vertical-align: -2" width=20px src="img/publication.svg" alt="">
    1000 peer-reviewed articles
    <img style="margin-left: 5; vertical-align: -2" width=20px src="img/preprint.svg" alt="">
    500 preprints 
  `
  document.getElementById('textinfo-net').innerHTML = initial_text
  document.getElementById('textinfo').innerHTML = initial_text

}

function writedisplay(nodelist){
  // the first node is the one you are interested in
  var root = nodelist[0]
  fetch('./data/graph_metadata.json')
    .then((response) => {
      return response.json();
    })
    .then((metadata) => {
  var title = metadata[root].title

  pr = 0
  pp = 0 
  
  for (i of nodelist){
    if (metadata[i].preprint === true)
      {pp += 1}
    else
      {pr += 1}
  } 

  var strong = `
  Displaying articles related to <span style="font-weight: bold;">${title}</span>
: <br> <br>
    <img style="margin-left: 0; vertical-align: -2" width=20px src="img/publication.svg" alt="">
    ${pr} peer-reviewed articles
    <img style="margin-left: 5; vertical-align: -2" width=20px src="img/preprint.svg" alt="">
  ${pp} preprints 
    `
  document.getElementById('textinfo-net').innerHTML = strong
  document.getElementById('textinfo').innerHTML = strong
  })  
}

// fix these heights
var totalheight = document.getElementById('totalborder').clientHeight;
document.getElementById("readermode").style.height = totalheight
document.getElementById("infomode").style.height = totalheight - 40

var pr = 0
var pp = 0 


function show_home(){
  document.getElementById("home").style.display = "block";
  document.getElementById("show_home_button").className = "current"

  document.getElementById("about").style.display = "none";    
  document.getElementById("show_about_button").className = "none"  
  document.getElementById("description").style.display = "none";  
  document.getElementById("show_description_button").className = "none"  
  document.getElementById("getting_started").style.display = "none";    
  document.getElementById("show_gettingstarted_button").className = "none"  
  document.getElementById("statistics").style.display = "none";    
  document.getElementById("show_statistics_button").className = "none";      


}
function show_about(){
  document.getElementById("about").style.display = "block";    
  document.getElementById("show_about_button").className = "current"

  document.getElementById("home").style.display = "none";    
  document.getElementById("show_home_button").className = "none"  
  document.getElementById("description").style.display = "none";  
  document.getElementById("show_description_button").className = "none"  
  document.getElementById("getting_started").style.display = "none";    
  document.getElementById("show_gettingstarted_button").className = "none"  
  document.getElementById("statistics").style.display = "none";    
  document.getElementById("show_statistics_button").className = "none";      

}
function show_description(){
  document.getElementById("description").style.display = "block";    
  document.getElementById("show_description_button").className = "current";    

  document.getElementById("home").style.display = "none";    
  document.getElementById("show_home_button").className = "none"  
  document.getElementById("about").style.display = "none";  
  document.getElementById("show_about_button").className = "none"  
  document.getElementById("getting_started").style.display = "none";    
  document.getElementById("show_gettingstarted_button").className = "none"  
  document.getElementById("statistics").style.display = "none";    
  document.getElementById("show_statistics_button").className = "none";      

}
function show_gettingstarted(){
  document.getElementById("getting_started").style.display = "block";    
  document.getElementById("show_gettingstarted_button").className = "current";    

  document.getElementById("home").style.display = "none";    
  document.getElementById("show_home_button").className = "none"  
  document.getElementById("about").style.display = "none";  
  document.getElementById("show_about_button").className = "none"  
  document.getElementById("description").style.display = "none";    
  document.getElementById("show_description_button").className = "none" 
  document.getElementById("statistics").style.display = "none";    
  document.getElementById("show_statistics_button").className = "none";      

}

function show_statistics(){
  document.getElementById("statistics").style.display = "block";    
  document.getElementById("show_statistics_button").className = "current";      

  document.getElementById("getting_started").style.display = "none";    
  document.getElementById("show_gettingstarted_button").className = "none";    
  document.getElementById("home").style.display = "none";    
  document.getElementById("show_home_button").className = "none"  
  document.getElementById("about").style.display = "none";  
  document.getElementById("show_about_button").className = "none"  
  document.getElementById("description").style.display = "none";    
  document.getElementById("show_description_button").className = "none"  
}


//Graph.pauseAnimation()
