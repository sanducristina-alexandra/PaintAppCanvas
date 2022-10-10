

var myCanvas = document.getElementById("crisCanvas");
var myContext = myCanvas.getContext('2d');
var dragg = false;
var startCoords;
var form;
var circle = document.getElementById("circle");      
var line = document.getElementById("line");
var ellipse = document.getElementById("ellipse");
var lineWidth = document.getElementById("lineWidth");
var fillColor = document.getElementById("fillColor");
var strokeColor = document.getElementById("strokeColor");
var backgroundColor = document.getElementById("backgroundColor");
var clearButton = document.getElementById("clearButton");
var pen = document.getElementById("pen");
var savePNG = document.getElementById("savePNGButton");
var saveSVG = document.getElementById("saveSVGButton");
function draw(){
   
	myContext.strokeStyle = strokeColor.value;   //culoare linii/contur
	myContext.fillStyle = fillColor.value;      //culoare continut 
	myContext.lineWidth = lineWidth.value;        //grosime linii 
	myContext.lineCap = "round";                 // varful liniilor
	
	
	myCanvas.onmousedown = function(e){             //event cand apasam click pe mouse
		if(pen.checked){    //if pentru a verifica daca desenam cu creionul pentru ca nu avem nevoie de functia getForm()
		dragg = true;          //anuntam ca s-a apasat click pe mouse si vrem sa desenam
		startCoords = getCanvasCoordinates(e);    //luam coordonatele unde am apasat
		}
		else
		{
		dragg = true;
		startCoords = getCanvasCoordinates(e);
		getForm();     //pentru a avea preview fara a desena in plus pe canvas( daca miscam mouse-ul in timp ce trasam linia si vrem sa schimbam directia, traiectoria nu se va colora )
		}
	}
	myCanvas.onmousemove = function(e){     //event cand trasam cu mouse-ul
		if(pen.checked){
			
		    if(dragg === true){       // inca desenam    
			var poz = getCanvasCoordinates(e);
			drawForm(poz);
			
		}
		}else{
			
		if(dragg === true){
			putForm();     
			var poz = getCanvasCoordinates(e);  //luam coordonatele pentru functia de desen de forme 
			drawForm(poz);  //functia pentru desenatul formelor
			
		}
		}
		
	}
	myCanvas.onmouseup = function(e){    // event cand nu mai apasam pe mouse
		if(pen.checked){
			dragg = false;     //nu mai desenam 
		var poz = getCanvasCoordinates(e);   //luam ultimele coordonate
		drawForm(poz);
		}
		else{
			dragg = false;
		putForm();
		var poz = getCanvasCoordinates(e);
	
		drawForm(poz);
		}
}
	lineWidth.addEventListener("input",changeLineWidth,false);  //adaugam event pentru a schimba culorile 
	fillColor.addEventListener("input",changeFillColor,false);
	strokeColor.addEventListener("input",changeStrokeColor,false);
	backgroundColor.addEventListener("input",changeBackgroundColor,false);
	
	clearButton.onclick = function(){
		myContext.clearRect(0,0,myCanvas.width,myCanvas.height);  // folosim functia clearRect pentru a sterge tot din canvas
	}
	savePNG.onclick = function(){   //functie de salvat in png
		myCanvas.toBlob((blob)=>{
			
			var link = document.createElement('a'); //facem un link
			document.body.append(link);
			link.download = 'image.png'
			link.href = URL.createObjectURL(blob); 
			link.click();
			link.remove();
		})
	}
	saveSVG.onclick = function(){
		myCanvas.toBlob((blob)=>{
			
			var link = document.createElement('a'); //facem un link
			document.body.append(link);
			link.download = 'image.svg' //nume fisier
			link.href = URL.createObjectURL(blob);  //facem un obiect URL
			link.click();
			link.remove();
		})
	}
}

function changeBackgroundColor(){    //functia care schimba culoarea de fundal
	myContext.save();    //salvam conditia canvasului in caz ca vrem sa folosim  .restore()
	myContext.fillStyle = backgroundColor.value;   //luam culoarea din input
	myContext.fillRect(0,0,myCanvas.width, myCanvas.height); //coloram canvasul
	myContext.restore();
}

function changeStrokeColor(){
	myContext.strokeStyle= this.value;    //luam culoarea din input 
}

function changeFillColor(){
	myContext.fillStyle = this.value;   //luam culoarea din input 
}
function changeLineWidth(){
	myContext.lineWidth= this.value;     //luam valoarea grosimii din input
}
function getCanvasCoordinates(e){    //calculul coordonatelor in canvas
	
	var mousePoz = {x:0,y:0};
	var rectPos = myCanvas.getBoundingClientRect();  // returneaza un obiect care are valorile pozitiei canvasului fata de pagina
	mousePoz.x = e.clientX - rectPos.left;	//pozitia mouse-ului minus pozitia la stanga a canvasului fata de pagina
	mousePoz.y = e.clientY - rectPos.top;
	return mousePoz;    //returnam coordonatele pentru a le folosi in functia de desen
}
function getForm(){
	form = myContext.getImageData(0,0,myCanvas.width,myCanvas.height);  //copiem imaginea din canvas 
}
function putForm(){
	myContext.putImageData(form,0,0);   //sa o punem inapoi
}

///////////////////////////////////////////////////////FUNCTIIILE DE DESEN///////////////////////////////////////////////////////////////

function drawLine(poz){
	myContext.beginPath();
	myContext.moveTo(startCoords.x,startCoords.y);  //incepem de la coordonatele unde am apasat pe mouse
	myContext.lineTo(poz.x,poz.y);   //coordonatele unde am lasat mouse-ul
	myContext.stroke();
}


function drawCircle(poz) {
    var radius = Math.sqrt(Math.pow((startCoords.x - poz.x), 2) + Math.pow((startCoords.y - poz.y), 2));  // ca centrul sa fie unde am pus mouseul
    myContext.beginPath();
    myContext.arc(startCoords.x, startCoords.y, radius, 0, 2 * Math.PI, false);  //functia de desenat cerc
    
}
  
		 
function drawPen(poz){
	      
		myContext.beginPath();
		myContext.arc(poz.x,poz.y,lineWidth.value,0,Math.PI*2);
		myContext.fillStyle = strokeColor.value;
		 }

function drawEllipse(poz){
	var radius1 = Math.sqrt(Math.pow((startCoords.x - poz.x), 2) + Math.pow((startCoords.y - poz.y), 2));
	var radius2 = Math.sqrt(Math.pow((startCoords.x - poz.x), 2) + 3.5*Math.pow((startCoords.y - poz.y), 2));
	myContext.beginPath();
	myContext.ellipse(poz.x,poz.y,radius1,radius2,Math.PI/4,0, Math.PI); //functia de desenat elipsa
	myContext.stroke();
}

function drawForm(poz){  //functia care decide ce forma se deseneaza
	
	
	//vedem care radiobutton este selectat si salvam valoarea in variabila shape 
	 if(circle.checked){
		shape = circle.value;
		if(shape === "circle"){  //verificam valoarea si atribuim functia de desen specifica
		drawCircle(poz);	
	}
	 }
	 if(line.checked){
		 shape = line.value;
		 if(shape === "line"){
		drawLine(poz);
	}
	 }
	 if(pen.checked){
		 shape = pen.value;
		 if(shape === "pen"){
		drawPen(poz);	
	}
	 }
	 if(ellipse.checked){
		 shape = ellipse.value;
		 if(shape === "ellipse"){
		drawEllipse(poz);
		}
	 }
	
	myContext.fill();
}
draw(); // apelam functia  
