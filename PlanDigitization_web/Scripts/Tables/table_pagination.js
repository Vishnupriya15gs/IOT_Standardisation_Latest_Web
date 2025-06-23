function displayData(currentPage, table, itemsPerPage, data, sortColumn, sortOrder) {

    // Apply search filter if a search input is provided
    const filteredData = searchInput
        ? data.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(String(searchInput).toLowerCase())
            );
        })
        : data;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;


    // Sort the data based on the specified column and order
    const sortedData = sortData(data, sortColumn, sortOrder);

    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Clear the table
    table.innerHTML = '';

    // Get the columns from the first item in the data
    const columns = Object.keys(data[0]);


    // Create the header row with th elements
    const headerRow = table.insertRow();
    columns.forEach((column, columnIndex) => {
        const th = document.createElement('th');
        th.textContent = column;

        // Add a sorting button to the header
        th.addEventListener('click', function () {
            const newSortOrder = sortColumn === columnIndex ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
            displayData(currentPage, table, itemsPerPage, data, columnIndex, newSortOrder);
        });

        headerRow.appendChild(th);
    });


    //// Check if no search results are found
    //if( filteredData.length === 0) {
    //    console.log('search:' + Object.values(searchInput));
    //    const noResultsRow = table.insertRow();
    //    const noResultsCell = noResultsRow.insertCell();
    //    noResultsCell.colSpan = columns.length;
    //    noResultsCell.textContent = 'No search results found.';
    //}
    //else {
    // Populate the table with paginated data dynamically
    paginatedData.forEach(item => {
        const row = table.insertRow();

        columns.forEach(column => {
            const cell = row.insertCell();
            cell.textContent = item[column];
        });
    });
    /*}*/


}
function sortData(data, columnIndex, sortOrder) {
    return data.slice().sort((a, b) => {
        const keyA = Object.keys(a)[columnIndex];
        const keyB = Object.keys(b)[columnIndex];

        const valueA = a[keyA];
        const valueB = b[keyB];

        // Handle undefined values
        if (valueA === undefined || valueB === undefined) {
            return sortOrder === 'asc' ? -1 : 1; // Place undefined values at the end
        }

        // Convert non-string values to strings before using localeCompare
        const strValueA = String(valueA);
        const strValueB = String(valueB);

        if (sortOrder === 'asc') {
            return strValueA.localeCompare(strValueB, undefined, { numeric: true, sensitivity: 'base' });
        } else {
            return strValueB.localeCompare(strValueA, undefined, { numeric: true, sensitivity: 'base' });
        }
    });
}

function createPaginationButtons(currentPage, totalPages, paginationContainer, table, itemsPerPage, data, statusContainer) {
    paginationContainer.innerHTML = '';

    // Helper function to create a button
    function createButton(text, page) {
        const button = document.createElement('a');
        button.href = '#';
        button.textContent = text;
        button.classList.add('page-link');

        button.addEventListener('click', function (event) {
            event.preventDefault();
            displayData(page, table, itemsPerPage, data);
            createPaginationButtons(page, totalPages, paginationContainer, table, itemsPerPage, data, statusContainer);
        });


        // Add 'active' class to highlight the current page
        if (text !== '...' && text !== '>>' && text !== '<<' && page === currentPage) {
            button.classList.add('active');
        }

        paginationContainer.appendChild(button);
    }

    const maxDisplayedPages = 2;

    // Create "First" button
    createButton('<<', 1);

    // Create "Previous" button
    if (currentPage > 1) {
        createButton('<', currentPage - 1);
    }

    // Create page buttons
    const start = Math.max(1, currentPage - maxDisplayedPages);
    const end = Math.min(totalPages, start + maxDisplayedPages * 2);

    // Display "..." if there are more pages before the current range
    if (start > 1) {
        createButton('...', start - 1);
    }

    // Display pages within the fixed range around the current page
    for (let i = start; i <= end; i++) {
        createButton(i, i);
    }

    // Display "..." if there are more pages after the current range
    if (end < totalPages) {
        createButton('...', end + 1);
    }

    // Create "Next" button
    if (currentPage < totalPages) {
        createButton('>', currentPage + 1);
    }

    // Create "Last" button
    createButton('>>', totalPages);

    // Update the pagination status within the status container
    statusContainer.innerHTML = `Showing page ${currentPage} out of ${totalPages}`;

}



function initPagination(data, itemsPerPage, paginationContainer, table, statusContainer, searchInput) {
    const filteredData = searchInput
        ? data.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(String(searchInput).toLowerCase())
            );
        })
        : data;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    createPaginationButtons(1, totalPages, paginationContainer, table, itemsPerPage, filteredData, statusContainer);
    displayData(1, table, itemsPerPage, filteredData); // Display the first page initially
}
