let navButton = document.getElementsByClassName("nav-button");

// add event listener to the nav button
function createText(element) {
    var text = document.createElement("span");
    text.classList.add("nav-text");
    text.classList.add("to-add");
    var navdiv = document.getElementById("nav-wrapper");
    navdiv.appendChild(text);

}
createText();

for (var i = 0; i < navButton.length; i++) {
    navButton[i].addEventListener("mouseover", function(element) {
        //create element text with class nav-text

        let text = document.getElementsByClassName("to-add")[0];
        text.classList.remove("to-add");
        text.classList.add("temporary");

        let elementId = this.id;
        if (elementId === "i"){
            text.innerHTML = "Início";
        }
        else if (elementId === "h"){
            text.innerHTML = "História";
        }
        else if (elementId === "e"){
            text.innerHTML = "Construtoras";
        }
        else if (elementId === "r"){
            text.innerHTML = "PitStops";
        }
        
        // transition its opacity to 1 and translate it to the right on the span of 0.5s
        text.style.transition = "opacity 0.5s, transform 0.5s";
        text.style.opacity = "1";
        text.style.transform = "translateX(50%)";
    });

    navButton[i].addEventListener("mouseout", function() {
        createText();
        var remove = document.getElementsByClassName("remove")[0];
        if (remove){
            remove.remove();
        }
        var text = document.getElementsByClassName("temporary")[0];
        // transition its opacity to 0 and translate it to the left on the span of 0.5s
        text.style.transition = "opacity 0.5s, transform 0.5s";
        text.style.opacity = "0";
        text.style.transform = "translateX(100%)";
        text.classList.remove("temporary");
        text.classList.add("remove");
        // remove the element from the DOM after the transition is done


    });

    navButton[i].addEventListener("click", function() {
        var active = document.getElementsByClassName("active")[0];
        if (active){
            active.classList.remove("active");
        }
        this.classList.add("active");
        let elementId = this.id;
        let car = document.getElementById("LilCar");
        if (elementId === "i"){
            car.style.transform = "translateX(0px)";
        }
        else if (elementId === "h"){
            car.style.transform = "translateX(48px)";
        }
        else if (elementId === "e"){
            car.style.transform = "translateX(96px)";
        }
        else if (elementId === "r"){
            car.style.transform = "translateX(144px)";
        }



    });

}

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
    console.log("history.scrollRestoration = 'manual'");
} else {
    console.log("history.scrollRestoration not supported");
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}