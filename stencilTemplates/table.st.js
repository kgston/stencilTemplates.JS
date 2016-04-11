/*
@preserve table.st.js
version 0.9.0
Kingston Chan - Released under the MIT licence
*/

var stencilTemplates = stencilTemplates || {};

(function() {
    var templates = {
        table: {
            id: "tableStencilTemplate",
            stencil: null,
            templateLoader: $.Deferred(),
            //A set of tools to easily build tables with the table stencil template
            //A table is made up of one or more header rows (which can be repurposed as titles)
            //which contains header columns (aka the cells). Use the header divider to add a line between header rows
            //Following which it is made up of rowSets. A rowSet is a group of rows that you intend to logically group together.
            //A rowSet can contain one or more rows. A row is made up of a horizontal set of rowColumns in which you can put content.
            //You may want to use the rowSetDivider to add a thick divider between rowSets if you intend to logically split rowSets
            //Params: tableID?[string] - The ID of the table, while optional, it is highly recommended to have one, especially if using the selector
            //        css?[string] - Any classnames to add to the table
            //        style?[string] - Any inline styles to add to the table
            //Returns an tableBuilder object that helps build a tableTemplateStencil's dataset
            builder: function(tableID, css, style) {
                return {
                    //The dataset to build
                    dataset: {
                        global: {},
                        tableID: tableID,
                        css: css,
                        style: style,
                        headers: [],
                        rowSets: []
                    },

                    //Adds a css to a specific column in the table
                    //Params: css[string] - The css name
                    //        columnIndex[int] - the index of the column starting from 0
                    //Returns the tableBuilder object so you can chain your commands up
                    addColumnCss: function(css, columnIndex) {
                        if (css == null) {
                            stencilTemplates.util.log("Specify a style name");
                            return this;
                        }
                        if (columnIndex == null) {
                            stencilTemplates.util.log("Specify a column index to style to");
                            return this;
                        }
                        if (this.dataset.global["columnCss" + columnIndex] == null) {
                            this.dataset.global["columnCss" + columnIndex] = "";
                        }
                        this.dataset.global["columnCss" + columnIndex] += css + " ";
                        return this;
                    },

                    //Adds a style to a specific column in the table
                    //Params: styleName[string] - The specified css style property name
                    //        value[string] - the value for the given styleName
                    //        columnIndex[int] - the index of the column starting from 0
                    //Returns the tableBuilder object so you can chain your commands up
                    addColumnStyle: function(styleName, value, columnIndex) {
                        if (styleName == null) {
                            stencilTemplates.util.log("Specify a style name");
                            return this;
                        }
                        if (value == null) {
                            stencilTemplates.util.log("Specify a value");
                            return this;
                        }
                        if (columnIndex == null) {
                            stencilTemplates.util.log("Specify a column index to style to");
                            return this;
                        }
                        if (this.dataset.global["columnStyle" + columnIndex] == null) {
                            this.dataset.global["columnStyle" + columnIndex] = "";
                        }
                        this.dataset.global["columnStyle" + columnIndex] += styleName + ": " + value + "; ";
                        return this;
                    },

                    //Adds a header row to contain header columns. You may add multiple header rows.
                    //It will always append the headerRow to the bottom of all headerRows.
                    //Params: headerRowID?[string] - The ID of the headerRow
                    //        css?[string] - Any classnames to add to the headerRow
                    //        style?[string] - Any inline styles to add to the headerRow
                    //Returns the tableBuilder object so you can chain your commands up
                    addHeaderRow: function(headerRowID, css, style) {
                        this.dataset.headers.push({
                            headerID: headerRowID,
                            css: css,
                            style: style,
                            headerColumns: []
                        });
                        return this;
                    },

                    //Adds a headerColumn to a headerRow. You can add multiple headerColumns to a headerRow.
                    //If you don't specify a headerRowIndex, it will add the column to the last headerRow.
                    //Params: content?[string] - The HTML content you want to insert into the columnCell
                    //        headerColumnID?[string] - The ID of the headerColumn
                    //        css?[string] - Any classnames to add to the headerColumn
                    //        style?[string] - Any inline styles to add to the headerColumn
                    //        headerRowIndex?[int] - Specify the headerRowIndex you want to add the column to
                    //Returns the tableBuilder object so you can chain your commands up
                    addHeaderColumn: function(content, headerColumnID, css, style, headerRowIndex) {
                        if (this.dataset.headers.length === 0) {
                            stencilTemplates.util.log("There are no avaliable header rows to add columns to");
                            return this;
                        }
                        if (headerRowIndex == null) {
                            headerRowIndex = this.dataset.headers.length - 1;
                        }
                        if (this.dataset.headers[headerRowIndex] == null) {
                            stencilTemplates.util.log("The specified header row is undefined");
                        } else {
                            this.dataset.headers[headerRowIndex].headerColumns.push({
                                columnID: headerColumnID,
                                css: css,
                                style: style,
                                content: content || ""
                            });
                        }
                        return this;
                    },

                    //Adds a headerdivider to a headerRow. 
                    //If you don't specify a headerRowIndex, it will add the headerDivider to the last headerRow.
                    //Params: headerRowIndex?[int] - Specify the headerRowIndex you want to add the headerDivider to
                    //Returns the tableBuilder object so you can chain your commands up
                    addHeaderDivider: function(headerRowIndex) {
                        if (this.dataset.headers.length === 0) {
                            stencilTemplates.util.log("There are no avaliable header rows to add dividers to");
                            return this;
                        }
                        if (headerRowIndex == null) {
                            headerRowIndex = this.dataset.headers.length - 1;
                        }
                        if (this.dataset.headers[headerRowIndex] == null) {
                            stencilTemplates.util.log("The specified header row is undefined");
                        } else {
                            this.dataset.headers[headerRowIndex].css = "tableHeaderDivider " + this.dataset.headers[headerRowIndex].css;
                        }
                        return this;
                    },

                    //Adds a rowSet row to contain rows. You may add multiple rowSets.
                    //It will always append the rowSet to the bottom of all rowSets.
                    //A rowSet is a collection of rows which consists of a bottom border. 
                    //Rows do not contain bottom borders. This allows you to logically group rows together
                    //For normal rows, just a add row in a rowSet.
                    //Params: rowSetID?[string] - The ID of the rowSet
                    //        css?[string] - Any classnames to add to the rowSet
                    //        style?[string] - Any inline styles to add to the rowSet
                    //Returns the tableBuilder object so you can chain your commands up
                    addRowSet: function(rowSetID, css, style) {
                        this.dataset.rowSets.push({
                            rowSetID: rowSetID,
                            css: css,
                            style: style,
                            rows: [],
                            rowSetDivider: []
                        });
                        return this;
                    },

                    //Adds a rowSetDivider to a rowSet. 
                    //If you don't specify a rowSetIndex, it will add the rowSetDivider to the last rowSet.
                    //Params: rowSetIndex?[int] - Specify the rowSetIndex you want to add the rowSetDivider to
                    //Returns the tableBuilder object so you can chain your commands up
                    addRowSetDivider: function(rowDividerID, css, style, rowSetIndex) {
                        if (this.dataset.rowSets.length === 0) {
                            stencilTemplates.util.log("There are no avaliable rowSets to add dividers to");
                            return this;
                        }
                        if (rowSetIndex == null) {
                            rowSetIndex = this.dataset.rowSets.length - 1;
                        }
                        if (this.dataset.rowSets[rowSetIndex] == null) {
                            stencilTemplates.util.log("The specified rowSet is undefined");
                        } else {
                            this.dataset.rowSets[rowSetIndex].rowSetDivider.push({
                                rowDividerID: rowDividerID,
                                css: css,
                                style: style
                            });
                        }
                        return this;
                    },

                    //Gets the number of rowSets
                    //Returns the number of rowSet as an integer
                    getRowSetSize: function() {
                        return this.dataset.rowSets.length;
                    },

                    //Adds a row to a rowSet. You may add multiple rows.
                    //It will always append the row to the bottom of all rows in a rowSet unless specified.
                    //You need to add a row to a rowSet.
                    //Params: rowID?[string] - The ID of the row
                    //        css?[string] - Any classnames to add to the row
                    //        style?[string] - Any inline styles to add to the row
                    //        rowSetIndex?[int] - Specify the rowSetIndex you want to add the row to
                    //Returns the tableBuilder object so you can chain your commands up
                    addRow: function(rowID, css, style, rowSetIndex) {
                        if (this.dataset.rowSets.length === 0) {
                            stencilTemplates.util.log("There are no avaliable row sets, add a row set first");
                            return this;
                        }
                        if (rowSetIndex == null) {
                            rowSetIndex = this.dataset.rowSets.length - 1;
                        }
                        if (this.dataset.rowSets[rowSetIndex] == null) {
                            stencilTemplates.util.log("The specified row set is undefined");
                        } else {
                            this.dataset.rowSets[rowSetIndex].rows.push({
                                rowID: rowID,
                                css: css,
                                style: style,
                                rowColumns: [],
                                independentRowColumns: []
                            });
                        }
                        return this;
                    },

                    //Gets the number of rows in a rowSet, unless specified it gets the last rowSet
                    //Params: rowSetIndex?[int] - Specify the rowSetIndex you want to you want to check
                    //Returns the number of rows in a rowSet as an integer
                    getRowSize: function(rowSetIndex) {
                        if (this.dataset.rowSets.length === 0) {
                            stencilTemplates.util.log("There are no avaliable row sets, add a row set first");
                            return;
                        }
                        if (rowSetIndex == null) {
                            rowSetIndex = this.dataset.rowSets.length - 1;
                        }
                        if (this.dataset.rowSets[rowSetIndex] == null) {
                            stencilTemplates.util.log("The specified row set is undefined");
                        } else {
                            return this.dataset.rowSets[rowSetIndex].rows.length;
                        }
                    },

                    //Adds a rowColumn to a row. You can add multiple rowColumn to a row.
                    //You can customize the width by overridding it in the style parameter
                    //If you don't specify a rowSetIndex and/or rowIndex, it will add the column to the last rowSet and/or row.
                    //Params: content?[string] - The HTML content you want to insert into the columnCell
                    //        rowColumnID?[string] - The ID of the rowColumn
                    //        css?[string] - Any classnames to add to the rowColumn
                    //        style?[string] - Any inline styles to add to the rowColumn
                    //        rowSetIndex?[int] - Specify the rowSetIndex you want to add the column to
                    //        rowIndex?[int] - Specify the rowIndex you want to add the column to
                    //Returns the tableBuilder object so you can chain your commands up
                    addRowColumn: function(content, rowColumnID, css, style, rowSetIndex, rowIndex) {
                        if (this.dataset.rowSets.length === 0) {
                            stencilTemplates.util.log("There are no avaliable row sets, add a row set first");
                            return this;
                        }
                        if (rowSetIndex == null) {
                            rowSetIndex = this.dataset.rowSets.length - 1;
                        }
                        if (this.dataset.rowSets[rowSetIndex] == null) {
                            stencilTemplates.util.log("The specified row set is undefined");
                            return this;
                        }
                        if (this.dataset.rowSets[rowSetIndex].rows.length === 0) {
                            stencilTemplates.util.log("There are no avaliable rows in row set");
                            return this;
                        }
                        if (rowIndex == null) {
                            rowIndex = this.dataset.rowSets[rowSetIndex].rows.length - 1;
                        }
                        if (this.dataset.rowSets[rowSetIndex].rows[rowIndex] == null) {
                            stencilTemplates.util.log("The specified row: " + rowIndex + " of rowSet: " + rowSetIndex + " is undefined");
                        } else {
                            this.dataset.rowSets[rowSetIndex].rows[rowIndex].rowColumns.push({
                                columnID: rowColumnID,
                                css: css,
                                style: style,
                                content: content || ""
                            });
                        }
                        return this;
                    },

                    //Gets the final JSON dataset object for use in rendering the stencil based template
                    //Returns the stencil table dataset object
                    getDataset: function() {
                        return this.dataset;
                    },

                    //Clears out all data from the table but leaves sort, search and paginate options alone to 
                    //preserve user's existing context
                    //Returns the tableBuilder object so you can chain your commands up
                    clearDataset: function() {
                        this.dataset.headers = [];
                        this.dataset.rowSets = [];
                        this.dataset.global = {};
                        this.dataset.tableSelector = null;
                        return this;
                    },

                    clearAll: function() {
                        this.dataset = {
                            global: {},
                            tableID: tableID,
                            css: css,
                            style: style,
                            headers: [],
                            rowSets: []
                        };
                    },

                    //Renders the dataset through the table stencil template passing the output DOM fragment as the parameter to the onComplete callback
                    render: function(onComplete) {
                        if (templates.table.stencil == null) {
                            templates.table.templateLoader.done(function() {
                                this.render(onComplete);
                            }.bind(this));
                            return this;
                        }

                        var thisObj = this;
                        var dataset = this.dataset;
                        var update = this.update;
                        var tableSort = dataset.tableSort;
                        var tableSearch = dataset.tableSearch;
                        var tablePaginate = dataset.tablePaginate;
                        var tableRowsDisplayed = dataset.tableRowsDisplayed;
                        var tableSelector = dataset.tableSelector;
                        //Clone the dataset
                        var renderedDataset = stencilTemplates.util.cloneJSON(dataset);

                        //Sorting algorithm
                        var sortRowSetAlgorithm = function(a, b) {
                            var sortVal = 0;
                            //For each column to sort on
                            this.columnIndexes.every(function(colIdx, index) {
                                //Check the sort order
                                var sortDir = this.sortFlow[index];
                                //Compare the contents
                                if (a.rows[0].rowColumns[colIdx].content < b.rows[0].rowColumns[colIdx].content) {
                                    //Apply the sort order
                                    sortVal = -1 * sortDir;
                                } else if (a.rows[0].rowColumns[colIdx].content > b.rows[0].rowColumns[colIdx].content) {
                                    sortVal = 1 * sortDir;
                                } else {
                                    sortVal = 0;
                                }

                                //Continue checking other columns if no discernable difference
                                if (sortVal === 0) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }, this);
                            return sortVal;
                        }.bind(tableSort);

                        //Reduce dataset base on search terms
                        if (tableSearch != null) {
                            //Get search terms and clean up input
                            var searchTerms = tableSearch.lastSearchTerm.split(" ");
                            while (searchTerms.indexOf("") >= 0) {
                                searchTerms.splice(searchTerms.indexOf(""), 1);
                            }
                            searchTerms.forEach(function(term, index) {
                                searchTerms[index] = new RegExp(term, "i");
                            });

                            //Then remove entries based on search term
                            //Basically it is trying to enter each row, check if a rowIndex is specified or left undefined, 
                            //if so check the rowColumns for the same thing. Then check the cell contents to see if it matched
                            //the search term 
                            if (searchTerms.length !== 0) {
                                for (var i = 0; i < renderedDataset.rowSets.length; i++) {
                                    var found = false;
                                    var rowSet = renderedDataset.rowSets[i];

                                    rowSet.rows.every(function(row, rowIndex) {
                                        if (tableSearch.searchRowIndexes == null ||
                                            tableSearch.searchRowIndexes.indexOf(rowIndex) >= 0) {
                                            row.rowColumns.every(function(rowColumn, rowColumnIndex) {
                                                if (tableSearch.searchColumnIndexes == null ||
                                                    tableSearch.searchColumnIndexes.indexOf(rowColumnIndex) >= 0) {
                                                    //Count the number of matches, it should match all terms for success
                                                    var matches = 0;
                                                    searchTerms.forEach(function(searchTerm) {
                                                        if (rowColumn.content.toString().search(searchTerm) >= 0) matches++;
                                                    });
                                                    if (matches === searchTerms.length) {
                                                        found = true;
                                                    }
                                                } else {
                                                    return true;
                                                }
                                                return !found;
                                            });
                                        } else {
                                            return true;
                                        }
                                        return !found;
                                    });

                                    if (!found) {
                                        renderedDataset.rowSets.splice(i, 1);
                                        i--;
                                    }
                                }
                            }
                        }

                        //Sort based on column selection and flow
                        //Sort has to be before paginate otherwise it will only sort by page
                        //Sort is after search to increase performance from a reduced dataset to sort on
                        if (tableSort != null && tableSort.columnIndexes.length > 0) {
                            //Render sort icons as dataset would be previously cleared
                            tableSort.columnIndexes.forEach(function(columnIndex, index) {
                                renderedDataset
                                    .headers[renderedDataset.headers.length - 1]
                                    .headerColumns[columnIndex]
                                    .sortIcon = { css: (tableSort.sortFlow[index] === 1) ? "st-tableSortUp" : "st-tableSortDown" };
                            });

                            //Sort rowSets
                            renderedDataset.rowSets.sort(sortRowSetAlgorithm);
                        }

                        //Build final dataset based rows to display for pagination
                        if (tablePaginate != null) {
                            var rerender = false;
                            do {
                                //For this implementation, it uses the "row counting" method as the intention is to have a relatively even number
                                //of rows per page even if the rowSets have an uneven number of rows. It counts the number of rows in a rowSet
                                //and determines if the rowSet will continue to fit on the page, otherwise it will push to a next page - conceptually
                                //In order to display the array, it will copy out the rowSets that matches the page to be displayed and replaces the 
                                //full rowSet with the selected ones
                                rerender = false; //Reset rerender loop flag as loop only needs to run once unless there is an issue
                                var reducedRowSets = [];
                                var rowCounter = 0;
                                var page = 1;

                                //Error checking for user input page number
                                if (tablePaginate.currentPage > tablePaginate.totalPages) {
                                    tablePaginate.currentPage = tablePaginate.totalPages;
                                    renderedDataset.tablePaginate.currentPage = tablePaginate.totalPages;
                                } else if (tablePaginate.currentPage < 1) {
                                    tablePaginate.currentPage = 1;
                                    renderedDataset.tablePaginate.currentPage = 1;
                                }
                                renderedDataset.rowSets.forEach(function(rowSet) {
                                    //Increment the rowcounter
                                    rowCounter += rowSet.rows.length;

                                    //If the rows overflow the current page, increment the page and put the current rowSet into the next page
                                    if (rowCounter > tablePaginate.rowsPerPage) {
                                        page++;
                                        rowCounter = rowSet.rows.length;
                                    }

                                    //If this page is the page to display, add into the replacement array
                                    if (page === tablePaginate.currentPage) {
                                        reducedRowSets.push(rowSet);
                                    }
                                });

                                //Set totalPages to BOTH original & rendered datasets
                                //Otherwise, error checking will detect it on update and reset back to old totalPages
                                tablePaginate.totalPages = page;
                                renderedDataset.tablePaginate.totalPages = page;

                                //Determine if next/prev page button should be displayed
                                if (tablePaginate.currentPage === 1) {
                                    renderedDataset.tablePaginate.prevPageStyle = "visibility: hidden; ";
                                }
                                if (tablePaginate.currentPage === renderedDataset.tablePaginate.totalPages) {
                                    renderedDataset.tablePaginate.nextPageStyle = "visibility: hidden; ";
                                }

                                //Check if the new total pages (which can only be determined after 1 pass) is less then the current page
                                //If so, rerender the page with the current page set to the last page (handled in error checking code above)
                                //Otherwise save the page rowset to the renderedDataset
                                if (tablePaginate.currentPage > renderedDataset.tablePaginate.totalPages) {
                                    rerender = true;
                                } else {
                                    renderedDataset.rowSets = reducedRowSets;
                                }
                            } while (rerender);
                        }

                        //Render the DOM Fragment
                        var output = templates.table.stencil.render(renderedDataset, "fragment");

                        //Build UI actions for sorting
                        if (tableSort != null) {
                            //Method to attach to onclick for sorting
                            var sort = function(headerColumn) {
                                var tableSort = this.tableSort;
                                //Get the index of the header column clicked
                                headerColumn = $(headerColumn);
                                var index = headerColumn.index();

                                //columnIndexes is an array to store which columns has been clicked
                                //sortFlow is an array to store the sort order ascending (1) or desecending (-1) 
                                //of the columnIndex for the same index
                                //If not present, add a new entry and sort ASC
                                //Else flip the sortFlow
                                if (tableSort.columnIndexes.indexOf(index) < 0) {
                                    if (!tableSort.allowMultipleColumns) {
                                        tableSort.columnIndexes = [];
                                        tableSort.sortFlow = [];
                                    }
                                    tableSort.columnIndexes.push(index);
                                    tableSort.sortFlow.push(1);
                                } else {
                                    tableSort.sortFlow[tableSort.columnIndexes.indexOf(index)] *= -1;
                                }
                            }.bind(dataset);
                            //Method to attached to rightclick to remove sorting for that column
                            var unsort = function(headerColumn) {
                                var tableSort = this.tableSort;
                                //Get the index of the header column clicked
                                headerColumn = $(headerColumn);
                                var index = headerColumn.index();

                                //Remove the sort entry from the arrays
                                if (tableSort.columnIndexes.indexOf(index) >= 0) {
                                    var orderIndex = tableSort.columnIndexes.indexOf(index);
                                    tableSort.columnIndexes.splice(orderIndex, 1);
                                    tableSort.sortFlow.splice(orderIndex, 1);
                                    //Remove the icon manually as an update will not remove the icon as the dataset isn't cleared
                                    delete this.headers[this.headers.length - 1].headerColumns[index].sortIcon;
                                }
                            }.bind(dataset);

                            var headerColumns = output.find(".st-tableHeader").last().find(".st-tableHeaderColumns");
                            //For each header column, check if a limit is applied on the sort columns and 
                            //restrict accordingly or apply to all
                            headerColumns.each(function(index) {
                                if (tableSort.limitSortColumns == null ||
                                    (tableSort.limitSortColumns != null &&
                                        tableSort.limitSortColumns.indexOf(index) >= 0)) {
                                    //On left click
                                    this.onclick = function() {
                                        sort(this);
                                        update.bind(thisObj)();
                                    };
                                    //On right click
                                    this.addEventListener('contextmenu', function(ev) {
                                        ev.preventDefault();
                                        unsort(this);
                                        update.bind(thisObj)();
                                        return false;
                                    }, false);
                                    //Add css for pointer
                                    this.className += "st-clickable ";
                                }
                            });
                        }

                        //Build UI actions for searching
                        if (tableSearch != null) {
                            output.find("#st-tableSearchInput").change(function() {
                                tableSearch.lastSearchTerm = this.value.trim();
                                update.bind(thisObj)();
                            });
                            output.find("#st-tableSearchClear").click(function() {
                                if (tableSearch.lastSearchTerm !== "") {
                                    tableSearch.lastSearchTerm = "";
                                    update.bind(thisObj)();
                                }
                            });
                        }

                        //Build UI actions for pagination
                        if (tablePaginate != null) {
                            output.find("#st-tablePaginatePrevPageBtn").click(function() {
                                tablePaginate.currentPage--;
                                update.bind(thisObj)();
                            });
                            output.find("#st-tablePaginateNextPageBtn").click(function() {
                                tablePaginate.currentPage++;
                                update.bind(thisObj)();
                            });
                            output.find("#st-tableCurrentPage").change(function() {
                                var newPage = this.value.trim();
                                newPage = ($.isNumeric(newPage)) ? parseFloat(newPage) : 1;
                                tablePaginate.currentPage = newPage;
                                update.bind(thisObj)();
                            });
                            output.find("#st-tableRowsDisplayInput").change(function() {
                                var rowsToDisplay = this.value.trim();
                                rowsToDisplay = ($.isNumeric(rowsToDisplay)) ? parseFloat(rowsToDisplay) : 5;
                                tablePaginate.rowsPerPage = rowsToDisplay;
                                tableRowsDisplayed.rowsPerPage = rowsToDisplay;
                                update.bind(thisObj)();
                            });
                        }

                        //Build UI actions for selector
                        if (tableSelector != null) {
                            //Clear the selected obj
                            tableSelector.selected = {};
                            output.find(".st-tableRowSet").addClass("clickable").click(function() {
                                //Shortcut
                                var element = $(this); //The clicked element
                                var data = []; //The resulting dataset to be saved

                                //If multiple selects is disabled, clear the selected list each time 
                                //and reset all selected items
                                var isSingleUnselectAction = false;
                                if (!tableSelector.allowMultipleSelects) {
                                    //Empty the selection
                                    tableSelector.selected = {};
                                    //Check if its an unselect
                                    isSingleUnselectAction = element.hasClass("st-tableRowSetSelected");
                                    //Clear selection from all rows
                                    $("#" + dataset.tableID + " .st-tableRowSet").removeClass("st-tableRowSetSelected");
                                }

                                //If multiple selects is disabled and action is to remove selection, skip adding the data in
                                if (!isSingleUnselectAction) {
                                    //Get the data from the specified columns indexes of the clicked row
                                    //and store them in the data array
                                    var rowSetData = [];
                                    tableSelector.selectRowIndexes.forEach(function(rowIdx) {
                                        var rowData = [];
                                        //Get the columns of the specified row
                                        var columns = $(element[rowIdx]).find(".st-tableRowColumn");
                                        tableSelector.selectColumnIndexes.forEach(function(colIdx) {
                                            rowData.push(columns[colIdx].innerHTML.trim());
                                        });
                                        rowSetData.push(rowData);
                                    });
                                    data.push(rowSetData);

                                    //If the data is not present in list, add to the list, else remove it
                                    if (tableSelector.selected[data] == null) {
                                        tableSelector.selected[data] = data;
                                    } else {
                                        delete tableSelector.selected[data];
                                    }
                                    //Highlight/un-highlight selected row
                                    element.toggleClass("st-tableRowSetSelected");
                                }

                                //Run callback
                                if (tableSelector.onClick != null) {
                                    tableSelector.onClick(data);
                                }
                            }).dblclick(function() {
                                //Shortcut
                                var element = $(this); //The clicked element
                                var data = []; //The resulting dataset to be saved

                                //Get the data from the specified columns indexes of the clicked row
                                //and store them in the data array
                                var rowSetData = [];
                                tableSelector.selectRowIndexes.forEach(function(rowIdx) {
                                    var rowData = [];
                                    //Get the columns of the specified row
                                    var columns = $(element[rowIdx]).find(".st-tableRowColumn");
                                    tableSelector.selectColumnIndexes.forEach(function(colIdx) {
                                        rowData.push(columns[colIdx].innerHTML.trim());
                                    });
                                    rowSetData.push(rowData);
                                });
                                data.push(rowSetData);
                                //Run callback
                                if (tableSelector.onDblClick != null) {
                                    tableSelector.onDblClick(data);
                                }
                            });
                        }

                        //Run the onComplete callback
                        onComplete(output);
                        this.onComplete = onComplete;
                        return this
                    },

                    //Updates the table (based on its tableID) with its existing dataset
                    //Returns the tableBuilder object so you can chain your commands up
                    update: function() {
                        //This is to prevent some bugs in browser where event gets triggered twice
                        if (this.dataset.tableRenderState !== "rendering") {
                            this.dataset.tableRenderState = "rendering";
                            this.render(function(output) {
                                $("#" + this.dataset.tableID).replaceWith(output);
                                this.dataset.tableRenderState = "idle";
                            }.bind(this));
                        }
                        return this;
                    },

                    //Enables column sorting functionality. It will apply the sortable columns to the last header row
                    //Params: allowMultipleColumns?[boolean] - Allow sorting on multiple columns based on click order
                    //        limitSortColumns?[int | Array[int]] - Limit sorting to specific columns
                    //Returns the tableBuilder object so you can chain your commands up
                    enableSort: function(allowMultipleColumns, limitSortColumns) {
                        //Shortcut
                        var dataset = this.dataset;

                        //Input checking
                        if (limitSortColumns != null) {
                            if (!Array.isArray(limitSortColumns)) {
                                if ($.isNumeric(limitSortColumns)) {
                                    limitSortColumns = [limitSortColumns];
                                } else {
                                    stencilTemplates.util.log("Unable to implement sort on table " + this.dataset.tableID +
                                        " due to parameter error");
                                    return;
                                }
                            }
                        }


                        //Add in the tableSort options if not present
                        if (dataset.tableSort == null) {
                            dataset.tableSort = {
                                allowMultipleColumns: allowMultipleColumns,
                                limitSortColumns: limitSortColumns,
                                columnIndexes: [],
                                sortFlow: []
                            };
                        }
                        return this;
                    },

                    //Enables the search functionality
                    //Params: searchRowIndexes?[int | Array[int]] The row indexes you want to limit the search to
                    //        searchColumnIndexes?[int | Array[int]] The column indexes you want to limit the search to
                    //Returns the tableBuilder object so you can chain your commands up
                    enableSearch: function(searchColumnIndexes, searchRowIndexes) {
                        //Shortcut
                        var dataset = this.dataset;

                        //Input checking
                        if (searchRowIndexes != null) {
                            if (!Array.isArray(searchRowIndexes)) {
                                if ($.isNumeric(searchRowIndexes)) {
                                    searchRowIndexes = [searchRowIndexes];
                                } else {
                                    stencilTemplates.util.log("Unable to implement search on table " + this.dataset.tableID +
                                        " due to parameter error");
                                    return;
                                }
                            }
                        }

                        if (searchColumnIndexes != null) {
                            if (!Array.isArray(searchColumnIndexes)) {
                                if ($.isNumeric(searchColumnIndexes)) {
                                    searchColumnIndexes = [searchColumnIndexes];
                                } else {
                                    stencilTemplates.util.log("Unable to implement search on table " + this.dataset.tableID +
                                        " due to parameter error");
                                    return;
                                }
                            }
                        }


                        //Add in the tableSort options if not present
                        if (dataset.tableSearch == null) {
                            dataset.tableSearch = {
                                lastSearchTerm: "",
                                searchRowIndexes: searchRowIndexes,
                                searchColumnIndexes: searchColumnIndexes
                            };
                        }
                        return this;
                    },

                    //Enables table pagination functionality
                    //Params: rowsPerPage[int] - The number of rows (not rowSets) to display in a table page
                    //Returns the tableBuilder object so you can chain your commands up
                    enablePaginate: function(rowsPerPage) {
                        //Shortcut
                        var dataset = this.dataset;

                        //Input checking
                        if (!$.isNumeric(rowsPerPage)) {
                            stencilTemplates.util.log("Unable to implement pagination on table " + this.dataset.tableID +
                                " due to parameter error");
                            return;
                        }

                        //Add in the tablePaginate options if not present
                        if (dataset.tablePaginate == null) {
                            dataset.tablePaginate = {
                                rowsPerPage: rowsPerPage,
                                currentPage: 1,
                                totalPages: 1
                            };

                            dataset.tableRowsDisplayed = {
                                rowsPerPage: rowsPerPage
                            };
                        }
                        return this;
                    },

                    //Enables the selector on a given stencil template table
                    //Params: selectRowIndexes[int | Array[int]] - The row index in integer or indexes in an Array of integers 
                    //                        in a rowSet as a rowSet can have more than one row. Indexes start 
                    //                        from 0 for the first row in a rowSet
                    //        selectColumnIndexes[int | Array[int]] - The column index in integer or indexes in an Array of integers. 
                    //                        Indexes start from 0 for the first column
                    //        allowMultipleSelects?[boolean] - Can multiple rowSets be selected at the same time? Default: false
                    //        onClick?[function([cellContent, ...])] - Sets a callback to be activated on click of a rowSet. 
                    //                        Passes in an Array of cellContents of the specified columnIndex
                    //        onDblClick?[function([cellContent, ...])] - Sets a callback to be activated on double click of a rowSet. 
                    //                        Passes in an Array of cellContents of the specified columnIndex
                    //Returns the tableBuilder object so you can chain your commands up
                    enableSelector: function(selectRowIndexes, selectColumnIndexes, allowMultipleSelects, onClick, onDblClick) {
                        //Shortcut
                        var dataset = this.dataset;

                        //Input checking
                        if (selectRowIndexes != null) {
                            if (!Array.isArray(selectRowIndexes)) {
                                if ($.isNumeric(selectRowIndexes)) {
                                    selectRowIndexes = [selectRowIndexes];
                                } else {
                                    stencilTemplates.util.log("Unable to implement selector on table " + this.dataset.tableID +
                                        " due to parameter error");
                                    return;
                                }
                            }
                        }

                        if (selectColumnIndexes != null) {
                            if (!Array.isArray(selectColumnIndexes)) {
                                if ($.isNumeric(selectColumnIndexes)) {
                                    selectColumnIndexes = [selectColumnIndexes];
                                } else {
                                    stencilTemplates.util.log("Unable to implement selector on table " + this.dataset.tableID +
                                        " due to parameter error");
                                    return;
                                }
                            }
                        }

                        //Add in the tableSelctor options, always refresh
                        dataset.tableSelector = {
                            selected: {},
                            selectRowIndexes: selectRowIndexes,
                            selectColumnIndexes: selectColumnIndexes,
                            allowMultipleSelects: allowMultipleSelects || false,
                            onClick: onClick,
                            onDblClick: onDblClick
                        };
                        return this;
                    },

                    //Gets an Array of selected items and its contents from the columns specified in the columnIndexs parameter in the clicked order
                    //Returns the Array of selected items
                    //Format: [[cellContent, ...], ...]
                    getSelected: function() {
                        var selectedList = [];
                        Object.keys(this.dataset.tableSelector.selected).forEach(function(data) {
                            selectedList.push(this[data]);
                        }, this.dataset.tableSelector.selected);
                        return selectedList;
                    },

                    //Clears the selection from this table
                    //Returns the tableBuilder object so you can chain your commands up
                    emptySelected: function() {
                        this.dataset.tableSelector.selected = {};
                        $("#" + this.dataset.tableID + " .st-tableRowSet").removeClass("st-tableRowSetSelected");
                        return this;
                    }
                };
            }
        }
    };
    
    var templateOpts = stencilTemplates.opts.templates;
    var templateName = "table";
    stencil.fetch(templateOpts.path + "/" + templateName + templateOpts.stencilExt)
        .progress(function templateFetchProgress(stencilTemplate) {
            templates[templateName].id = stencilTemplate.tagID;
            templates[templateName].stencil = stencilTemplate;
        })
        .done(function templateFetchComplete() {
            templates[templateName].templateLoader.resolve();
        });

    stencilTemplates.table = templates.table.builder;
})();