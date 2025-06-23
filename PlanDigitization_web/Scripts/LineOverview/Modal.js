

function modalDesign(container, ele) {

    // Get an element with the class "box-2"
    var box2Element = document.querySelector(ele);

    // Add a click event listener to the tabList
    box2Element.addEventListener('click', function (event) {

        document.querySelector(container).style.display = 'block';
        loadContentOfModals(`${container}`, `${ele}`);

    });

    // Add event listener for the close icon
    document.querySelector(`${container} .close-icon`).addEventListener('click', closeModal);
    // Function to close the modal
    function closeModal() {
        document.querySelector(container).style.display = 'none';
        //getSetCurrentShift();
        reloadGraph();
        
    }
}
