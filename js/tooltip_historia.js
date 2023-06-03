document.addEventListener("DOMContentLoaded", function() {
    var tooltipAreas = document.getElementsByClassName("tooltip-area");

    Array.from(tooltipAreas).forEach(function(area) {
        area.addEventListener("mouseover", function() {
            var tooltipText = this.getAttribute("title");
            var tooltip = document.querySelector(".tooltip");

            tooltip.innerHTML = tooltipText;
            tooltip.style.display = "block";
            tooltip.style.left = event.pageX + "px";
            tooltip.style.top = event.pageY + "px";
        });

        area.addEventListener("mouseout", function() {
            var tooltip = document.querySelector(".tooltip");
            tooltip.style.display = "none";
        });
    });
});