function Tabs(dynamicContent) {
	this.dynamicContents = dynamicContent;
	this.prevTab = "";

}

var tabList = document.querySelectorAll("#tabList li");
tabList.forEach((element, index, arr) => {

	element.addEventListener("click", (e) => {

		tabList.forEach(function (tab) {
			tab.classList.remove("active");
		});

		e.target.classList.add("active");

		var selectedTab = event.target.getAttribute("data-tab");
		var selectedContent = this.dynamicContents;

		tabContainer.innerHTML = `<div class='tab-content active ${selectedTab}'>${selectedContent}</div>`;
		graphsCall(selectedTab);

		console.log(selectedTab);
		console.log(prevTab);

		if (prevTab != selectedTab) {
			prevTab = selectedTab;
			reloadGraph();

		}
		//console.log("Target element", e.target)
	})
})

