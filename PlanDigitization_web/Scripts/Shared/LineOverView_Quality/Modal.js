
function modalDesign(container, ele)
{
    
    var monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];
    document.getElementById('fromDate').setAttribute('max', new Date().toISOString().split('T')[0]);
    document.getElementById('toDate').setAttribute('max', new Date().toISOString().split('T')[0]);
    if (ele == '#svgPareto')
    {
        var monthSelect = document.getElementById('monthSelect');
        var currentMonth = new Date().getMonth();

        for (var i = 0; i <= currentMonth; i++) {
            var option = document.createElement('option');
            option.value = i + 1;
            option.text = monthNames[i];
            monthSelect.add(option);
        }

    }
    

    if (ele == '#svgCategoryPareto')
    {
        var monthSelectcategory = document.getElementById('monthSelectcategory');
        var currentMonth = new Date().getMonth();

        for (var i = 0; i <= currentMonth; i++) {
            var option = document.createElement('option');
            option.value = i + 1;
            option.text = monthNames[i];
            monthSelectcategory.add(option);
        }
    }
   

    
    // Get an element with the class "box-2"
    var box2Element = document.querySelector(ele);

    // Add a click event listener to the tabList
    box2Element.addEventListener('click', function (event) {
        document.querySelector(container).style.display = 'block';
        showTab('month');
        getReworkData_Monthly();
        //loadContentOfModals(`${container}`, `${ele}`);
        if (ele == '#svgCategoryPareto') {
            showTab('month1');
            getCategoryData_Monthly();
        }

    });
}
function closeModal() {
    document.querySelector("#container-modal-quality").style.display = 'none';
    document.querySelector("#container-modal-category-quality").style.display = 'none';
    //getSetCurrentShift();
    //reloadGraph();

}
function showTab(tabId) {
    $("#chartRejPopup_Monthly").empty();
    $("#chartRejPopup").empty();
    $("#chartCategoryPopup_Monthly").empty();
    $("#chartCategoryPopup").empty();
    //$("#monthSelect").empty();

    var tabs = document.querySelectorAll('.tab-content-quality');
    tabs.forEach(function (tab) {
        tab.style.display = (tab.id === tabId) ? 'flex' : 'none';
    });

    // Remove 'active' class from all tabs
    var allTabs = document.querySelectorAll('.tabModal');
    allTabs.forEach(function (tab) {
        tab.classList.remove('active');
    });

    // Add 'active' class to the clicked tab
    var clickedTab = document.querySelector('.tab-' + tabId);
    clickedTab.classList.add('active');
}
