# stencilTemplates.JS

###### *Because certain stencils are generic*

Version: 1.0.0  
Last modified: 06 Apr 2016

Copyright (c) 2016 Kingston Chan. This software is provided as-is under The MIT Licence (Expat).
*Full legal text can be found in licence*

### Introduction

stencilTemplates.JS is a logical extension to stencil.JS, providing various generic stencil templates along with accompanying logic, resulting in full fledge reusable, themeable page components.

### Usage/APIs

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

Version: 1.0.0  
Last modified: 06 Apr 2016

Table is a fully featured data table that allows you to easily generate a div table layout quickly and easily without writing complicated table features. Table comes with pagination, text searching, column sorting and selection.

### Usage/APIs

#### stencilTemplates.table(tableID [string], css? [string], style? [string])

#### table.addColumnStyle(styleName [string], value [string], columnIndex [int])
