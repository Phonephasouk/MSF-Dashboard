/*------------------------------------------------------------------------------------
    MSF Dashboard - module-datatable.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file gives the necessary instructions to setup the data table, using datatable.js instead of the table by default in dc.js.
 * @since 0.2
 * @module module:module_datatable
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 * @requires lang/main-core.js
 * @todo Harmonize container id.
 * @todo Warp 'Show datatable' container into the module.
 **/
var module_datatable = {};
 /*------------------------------------------------------------------------------------
	Components:
	0) Setup
	1) Datatable Setup
	2) Display
	3) Interactions
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.datatable = true;

/**
 * Stores all the global variables used by the {@link module:module_datatable}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_datatable
 */
g.module_datatable = {};


// 1) Datatable Setup
//------------------------------------------------------------------------------------

// Datatable
/**
 * Defines the columns in the table from {@link module:g.medical_headerlist} and sets up the datatable definition object {@link module:module_datatable.definition}.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:g.medical_keylist}</li>
 *  <li>{@link module:g.medical_headerlist}</li>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:g.viz_definition}</li>
 *  <li>{@link module:module_datatable.columns}</li>
 * </ul>
 * Returns:
 * <ul>
 *  <li>{@link module:module_datatable.columns}</li>
 *  <li>{@link module:module_datatable.definition}</li>
 * </ul>
 * <br> Triggered in {@link module:main_core~chartBuilder}.
 * @type {Function}
 * @method
 * @alias module:module_datatable.setup
 */
module_datatable.setup =function(){
    
    /**
     * Contains the columns in the table from {@link module:g.medical_headerlist}.
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:g.medical_keylist}</li>
     *  <li>{@link module:g.medical_headerlist}</li>
     * </ul>
     * <br> Defined in {@link module:module_datatable.setup}.
     * @type {Object}
     * @constant
     * @alias module:module_datatable.columns
     */
    g.module_datatable.columns = [];

    var short_names = {};
    g.medical_keylist.forEach(function(key,keynum){         //create list of only lowest level names (no higher adm names prefixing it)
        if ((g.new_layout) && (key in g.medical_loclists)) {
            short_names[key] = [];
            for (var i=0; i<=g.medical_loclists[key].length-1; i++){
                var loc = toTitleCase(g.medical_loclists[key][i].trim().split('_').join(' '));       //normalize names - capitalize, account for '_'
                short_names[key].push(loc.trim().split(', ')[loc.trim().split(', ').length-1]);  
            }
        }
    });

    g.medical_keylist.forEach(function(key,keynum){
        var column = {
            targets: keynum,
            //data: function(rec) { return rec[g.medical_headerlist[key]]; }  //previous code
            data: function(rec) { 
                if ((g.new_layout) && (key in g.medical_loclists)) {        //only return locations in the correct column - accounts for shared columns
                    if (short_names[key].indexOf(toTitleCase(rec[g.medical_headerlist[key]].trim().split('_').join(' ')))!=-1) {
                        return rec[g.medical_headerlist[key]];
                    } else {
                        return "";
                    }
                } else {
                    return rec[g.medical_headerlist[key]];
                }
            }
        };
        g.module_datatable.columns.push(column);
    });

    /**
     * Contains the datatable definition.
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:module_lang.text}</li>
     *  <li>{@link module:module_lang.current}</li>
     *  <li>{@link module:g.viz_definition}</li>
     *  <li>{@link module:module_datatable.columns}</li>
     * </ul>
     * <br> Defined in {@link module:module_datatable.setup}.
     * @type {Object}
     * @constant
     * @alias module:module_datatable.definition
     */
    g.datatable_definition = {
        dom: '<"#copyBtn"B>l<t>ip',
        buttons: [
            {
            extend: 'copy',
            text: g.module_lang.text[g.module_lang.current].datatable_text.button 
            } 
        ],
        data: g.viz_definition.table.dimension.top(Infinity),
        columns: g.module_datatable.columns,
        language: g.module_lang.text[g.module_lang.current].datatable_text.language,
        autoWidth: false
    };
}




// 2) Display
//------------------------------------------------------------------------------------
/**
 * Sets up the layout for the datatable.
 * <br>
 * Requires:
 * <ul>
 *  <li>Container id='container-table' in index.html</li>
 *  <li>{@link module:g.medical_keylist}</li>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 * </ul>
 * Returns:
 * <ul>
 *  <li>{@link module:module_datatable.datatable}</li>
 * </ul>
 * <br> Triggered in {@link module:main_core~chartBuilder}.
 * @type {Function}
 * @method
 * @alias module:module_datatable.display
 */



        
module_datatable.display = function(){

    //defaults for older version dashboards (pre-v1.3) - from v1.3 these are defined in module_lang.js
    if (!(g.module_lang.text[g.module_lang.current].datatable_text.header)) {
        g.module_lang.text[g.module_lang.current].datatable_text['header'] = g.medical_headerlist;
    };
    if (!(g.module_lang.text[g.module_lang.current].datatable_text.header_popup)) {
        if (g.module_lang.current == 'eng') {
            g.module_lang.text[g.module_lang.current].datatable_text['header_popup'] = ['Click here to sort by ',' (when sorted the arrow on the right is red)'];
        } else if (g.module_lang.current == 'fra') {
            g.module_lang.text[g.module_lang.current].datatable_text['header_popup'] = ['Cliquez içi pour trier par ',' (lorsque vous cliquez dessus, la flèche sur la drote est rouge'];
        }
    };
    if (!(g.module_lang.text[g.module_lang.current].datatable_text.search_note)) {
        if (g.module_lang.current == 'eng') {
            g.module_lang.text[g.module_lang.current].datatable_text['search_note'] = 'Note: Searching the table does not filter the data in the rest of the dashboard';
        } else if (g.module_lang.current == 'fra') {
            g.module_lang.text[g.module_lang.current].datatable_text['search_note'] = 'Note: La recherche dans la table ne filtre pas les données dans le reste du dashboard';
        }
    };

 
    var html = '';
        html += '<div id="search_div"><label>'+ g.module_lang.text[g.module_lang.current].datatable_text.language.sSearch + ' ' + '</label><input id="search_table" type="text"><span class="infotext">(' + g.module_lang.text[g.module_lang.current].datatable_text.search_note + ')</span></div>';
        html += '<table style="font-size: 0.9em;" class="table table-condensed table-hover table-striped order-column viz" id="chart-table">';
        html += '<span id=buttons-table></span>';
        html += '<thead class="text-capitalize"><tr>';
            g.medical_keylist.forEach(function(key){
                //console.log(key)
                var hdr_name = (g.module_lang.text[g.module_lang.current].datatable_text.header[key] || key);
                var title_text = (g.module_lang.text[g.module_lang.current].datatable_text.header_popup[0] || '') + hdr_name + (g.module_lang.text[g.module_lang.current].datatable_text.header_popup[1] || '');
                html += '<th title="' + title_text + '">'+ hdr_name +'</th>';
            });
        html += '</tr></thead>';
        html += '<tbody></tbody>';
        html += '<tfoot><tr>';
            g.medical_keylist.forEach(function(key){
                //console.log(g.module_datatable.columns[4].data());
                var hdr_name = (g.module_lang.text[g.module_lang.current].datatable_text.header[key] || key);
                html += '<th></th>';
            });
        html += '</tr></tfoot>';
    html += '</table>'

    // Légendes
    html += '<p><small><br>'+g.module_lang.text[g.module_lang.current].datatable_legend+'</small></p>';

    $('#container-table').html(html);



    /** 
     * Contains the actual datatable object (definition parsed in layout).
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:module_datatable.definition}</li>
     * </ul>
     * <br> Defined in {@link module:module_datatable.display}.
     * @type {Object}
     * @constant
     * @alias module:module_datatable.datatable
     */
    $.fn.dataTable.ext.errMode = 'none';

    g.module_datatable.datatable = $('#chart-table').dataTable(g.datatable_definition);


    $('#chart-table')
        .on( 'page.dt', function() {  //on table page change        
            if (g.viz_definition.table.sums_in_footer) {
                module_datatable.recalculateTableColumnSums();
            }
        })
        .on( 'length.dt', function() {  //on table page change        
            if (g.viz_definition.table.sums_in_footer) {
                module_datatable.recalculateTableColumnSums();
            }    
        })
        .on( 'error.dt', function ( e, settings, techNote, message ) {
            console.log( 'An error has been reported by DataTables: ', message );
        });

}

// 3) Interactions
//------------------------------------------------------------------------------------
/**
 * Sets up the option to show/hide the datatable (saves ressources when hidden and refreshing is disabled).
 * <br>
 * Requires:
 * <ul>
 *  <li>Container id='container-table' in index.html</li>
 *  <li>Container id='more-table' in index.html</li>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:module_datatable.refreshTable}</li>
 * </ul>
 * <br> Triggered in {@link module:main_core~chartBuilder}.
 * @type {Function}
 * @method
 * @alias module:module_datatable.interaction
 */
module_datatable.interaction = function(){
    $('#more-table').html(g.module_lang.text[g.module_lang.current].datatable_more);


     $('#more-table').on('click',function(e) {
        if ($('#container-table').is(':hidden') == true) {
            $('#container-table').slideToggle();
            module_datatable.refreshTable();
            $('#more-table').html(g.module_lang.text[g.module_lang.current].datatable_less);
        }else{
            $('#container-table').slideToggle();
            $('#more-table').html(g.module_lang.text[g.module_lang.current].datatable_more);
        }
    });

    module_datatable.refreshTable();
}


module_datatable.recalculateTableColumnSums = function(){
    var table = $('#chart-table').DataTable();
    //var info = table.page.info();
    //console.log('Showing page: ', info.page + ' of ' + info.pages)
    var intVal = function(i) {
        return typeof i==='string'? i.replace(/[\$,]/g, '')*1 : typeof i==='number'? i : 0;
    };

    //defaults for older version dashboards (pre-v1.3) - from v1.3 these are defined in module_lang.js
    if (!(g.module_lang.text[g.module_lang.current].datatable_text.footer_text)) {
        if (g.module_lang.current == 'eng') {
            g.module_lang.text[g.module_lang.current].datatable_text['footer_text'] = ['Total', 'Table Total'];
        } else if (g.module_lang.current == 'fra') {
            g.module_lang.text[g.module_lang.current].datatable_text['footer_text'] = ['Total', 'Total de table'];
        }
    };

    g.medical_keylist.forEach(function(key, i) {
        if (g.viz_definition.table.sums_in_footer.indexOf(key)!=-1) {
            var colname = (g.module_lang.text[g.module_lang.current].datatable_text.header[key] || key);
            var colnum = g.medical_keylist.indexOf(key);

            var column = table.column(colnum);
            var total = column.data().reduce(function(a,b) {
                    return intVal(a)+intVal(b);
                }, 0)

            var pagecolumn = table.column(colnum, {page: 'current'});
            var pagetotal = pagecolumn.data().reduce(function(a,b) {
                    return intVal(a)+intVal(b);
                }, 0)

            $(column.footer()).html(
                colname + ' '+ (g.module_lang.text[g.module_lang.current].datatable_text.footer_text[0] || 'Total') +': ' + d3.format(",")(pagetotal) + '  (' + (g.module_lang.text[g.module_lang.current].datatable_text.footer_text[1] || 'Total table') + ': '  + d3.format(",")(total) + ')'
            );
        };
    });
}

/**
 * Actualises the datatable when not hidden (saves resources to hide it).
 * <br>
 * Requires:
 * <ul>
 *  <li>Container id='container-table' in index.html</li>
 *  <li>{@link module:module_datatable.datatable}</li>
 *  <li>{@link module:g.viz_definition}</li>
 * </ul>
 * <br> Triggered in {@link module:main_core~onFiltered}.
 * @type {Function}
 * @method
 * @alias module:module_datatable.refreshTable
 */
module_datatable.refreshTable = function() {
    if ($('#container-table').is(':hidden') == false) {
        dc.events.trigger(function () {
            g.module_datatable.datatable.api()
                .clear()
                .rows.add(g.viz_definition.table.dimension.top(Infinity) )
                .draw();
        });

        $.fn.dataTable.ext.errMode = 'none';

    }

    if (g.viz_definition.table.sums_in_footer) {
        module_datatable.recalculateTableColumnSums();       //deals with column summations on table refresh
    };


}

