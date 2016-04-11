# stencilTemplates.JS

###### *Because certain stencils are generic*

Version: 1.0.0  
Last modified: 06 Apr 2016

Copyright (c) 2016 Kingston Chan. This software is provided as-is under The MIT Licence (Expat).
*Full legal text can be found in licence*

### Introduction

stencilTemplates.JS is a logical extension to stencil.JS, providing various generic stencil templates along with accompanying logic, resulting in full fledge reusable, themeable page components.

### Stencil Templates Usage/APIs

#### stencilTemplates.init(templateNames [string | Array])

```javascript
    stencilTemplates.init("table" || ["table", "etc..."])
        .done(function onTemplatesLoadComplete() {
            //Code in this block is guaranteed to have templates functions avaliable
            var tableBuilder = stencilTemplates.table("myTableId");
            //...
        });
```

## Templates

### Table

Version: 0.9.0  
Last modified: 11 Apr 2016

Table is a fully featured data table that allows you to easily generate a div table layout quickly and easily without writing complicated table features. Table comes with pagination, text searching, column sorting and selection.

### Table Usage/APIs

#### stencilTemplates.table(tableID [string], css? [string], style? [string])

Creates a table builder object. This object will provide the APIs as listed below.

* tableID - The html id of the main table object
* css - Additonal css classes to append to the table html tag
* style - Additional styles to append to the table html tag
* *return* - A table builder object

#### table.addColumnCss(css [string], columnIndex [int])

Adds the provided CSS classes to all cells in that column. Useful for setting global widths or a header column.

* css - Additonal CSS classes to append to every cell tag of the specified column
* columnIndex - The column index to add the css classes to, starting from 0
* *return* - The current table builder object

#### table.addColumnStyle(styleName [string], value [string], columnIndex [int])

Adds the provided styles to all cells in that column. It is better to use CSS classes instead of styles whenever possible.

* styleName - Additonal style to append to every cell tag of the specified column
* value - The value of the style to append
* columnIndex - The column index to add the style to, starting from 0
* *return* - The current table builder object

#### table.addHeaderRow(headerRowID? [string], css? [string], style? [string])

Adds a header row to contain header columns. You may add multiple header rows and it will always append the new header row to the bottom of all header rows.

* headerRowID - The html id of the header row
* css - The CSS classes to append
* style - Any inline styles (in `style: value` format) to add to the header row
* *return* - The current table builder object

#### table.addHeaderColumn(content [string], headerColumnID? [string], css? [string], style? [string], headerRowIndex? [int])

Adds a header column to a header row. You can add multiple header columns to a header row but only affects that particular row. If you don't specify a header row index, it will add the column to the last header row.

* content - The HTML content you want to insert into the column cell. Beware of the HTML escaping options in stencil.
* headerColumnID - The html id of the header column
* css - The CSS classes to append
* style - Any inline styles (in `style: value` format) to add to the headerRow
* headerRowIndex - The headerRowIndex you want to add the column to. Defaults to the last header row if not specified
* *return* - The current table builder object

#### table.addHeaderDivider(headerRowIndex? [int])

Adds a header divider to a header row. If you don't specify a header row index, it will add the column to the last headerRow.

* headerRowIndex - The headerRowIndex you want to add the column to. Defaults to the last header row if not specified
* *return* - The current table builder object

#### table.addRowSet(rowSetID? [string], css? [string], style? [string])

Adds a row set to contain rows. You may add multiple row sets and it will always append the new row set to the bottom of all row sets. A row set is a collection of rows which consists of a bottom border. Rows do not contain bottom borders. This allows you to logically group rows together. For single rows, just a add row in a row set.

* rowSetID - The html id of the row set
* css - The CSS classes to append
* style - Any inline styles (in `style: value` format) to add to the headerRow
* *return* - The current table builder object

#### table.addRowSetDivider(rowDividerID? [string], css? [string], style? [string], rowSetIndex? [int])

Adds a row set divider to a row set. If you don't specify a row set row index, it will add the column to the last row set.

* rowDividerID - The html id of the row set divider
* css - The CSS classes to append
* style - Any inline styles (in `style: value` format) to add to the headerRow
* headerRowIndex - The headerRowIndex you want to add the column to. Defaults to the last header row if not specified
* *return* - The current table builder object

#### table.getRowSetSize()

Gets the number of rowSets.

* *return* - The current the current number of row sets

#### table.addRow(rowID? [string], css? [string], style? [string], rowSetIndex? [int])

Adds a row to a row set. You may add multiple rows to a row set and it will always append the new row to the bottom of the row set. If you don't specify a row set row index, it will add the column to the last row set. Rows do not contain bottom borders and needs to be contained in a row set.

* rowID - The html id of the row
* css - The CSS classes to append
* style - Any inline styles (in `style: value` format) to add to the headerRow
* *return* - The current table builder object

#### table.getRowSize(rowSetIndex [int])

Gets the number of rows in a row set.

* rowSetIndex - The index of the row set index to check
* *return* - The current the current number of rows

#### table.addRowColumn(content [string], rowColumnID? [string], css? [string], style? [string], rowSetIndex? [int], rowIndex? [int])

Adds a row column to a header row. You can add multiple row columns to a row but only affects that particular row. If you don't specify a row or row set index, it will add the column to the last row in the last row set.

* content - The HTML content you want to insert into the column cell. Beware of the HTML escaping options in stencil.
* rowColumnID - The html id of the header column
* css - The CSS classes to append
* style - Any inline styles (in `style: value` format) to add to the headerRow
* rowSetIndex - The row set index you want to add the column to. Defaults to the last row set if not specified
* rowIndex - The row index you want to add the column to. Defaults to the last row if not specified
* *return* - The current table builder object

#### table.getDataset()

Gets the final JSON dataset object for use in rendering the stencil based template

* *return* - The stencil table dataset object

#### table.clearDataset()

Clears out all data from the table but leaves sort, search and paginate options alone to preserve user's existing context.

* *return* - The stencil table dataset object

#### table.clearAll()

Clears out all data from the table including sort, search and paginate options.

* *return* - The stencil table dataset object

#### table.render(onComplete [function])

Renders the dataset through the table stencil template passing the output DOM fragment as the first parameter to the onComplete callback.

* *return* - The stencil table dataset object

#### table.update()

Updates the table (based on its tableID) with its existing dataset.

* *return* - The stencil table dataset object

#### table.enableSort(allowMultipleColumns? [boolean], limitSortColumns? [int | Array[int]])

Enables column sorting functionality. It will apply the sortable columns to the last header row.

* allowMultipleColumns - Allow sorting on multiple columns based on click order. Default is false
* limitSortColumns - Limit sorting to the specific columns
* *return* - The stencil table dataset object

#### table.enableSearch(searchColumnIndexes? [int | Array[int]], searchRowIndexes? [int | Array[int]])

Enables the search functionality.

* searchColumnIndexes - The column indexes you want to limit the search to
* searchRowIndexes - The row indexes you want to limit the search to. This is the row index, not row set index. e.g. Limit search to the `[x, y, z]` row of every row set only
* *return* - The stencil table dataset object

#### table.enablePaginate(rowsPerPage? [int])

Enables table pagination functionality.

* rowsPerPage - The number of rows (not row sets) to display in a table page. This is to allow for even pages as some row sets may contain different number of rows
* *return* - The stencil table dataset object

#### table.enableSelector(selectRowIndexes [int | Array[int]], selectColumnIndexes [int | Array[int]], allowMultipleSelects? [boolean], onClick? [function([cellContent, ...])], onDblClick? [function([cellContent, ...])])

Enables the selector functionaity.

* selectRowIndexes - The row index in integer or indexes in an Array of integers in a rowSet as a rowSet can have more than one row. Indexes start from 0 for the first row in a rowSet
* selectColumnIndexes - The column index in integer or indexes in an Array of integers; Indexes start from 0 for the first column
* allowMultipleSelects - Can multiple rowSets be selected at the same time? Default is false
* onClick - Sets a callback to be activated on click of a rowSet. Passes in an Array of cellContents of the specified columnIndex. Passes in an Array of cellContents of the specified columnIndex
* onDblClick - Sets a callback to be activated on double click of a rowSet. Passes in an Array of cellContents of the specified columnIndex. allowMultipleSelects does not affect double clicks.
* *return* - The stencil table dataset object

#### table.getSelected()

Gets an Array of selected items and its contents from the columns specified in the columnIndexs parameter in the clicked order, `[[cellContent, ...], ...]`.

* *return* - The stencil table dataset object

#### table.emptySelected()

Clears the selection from this table.

* *return* - The stencil table dataset object