// Module Table Filter
module.exports = function() {
  var filtersConfig = {
    // instruct TableFilter location to import ressources from
    base_path: 'https://unpkg.com/tablefilter@latest/dist/tablefilter/',
    col_1: 'select',
    col_2: 'select',
    col_3: 'select',
    alternate_rows: false,
    rows_counter: false,
    btn_reset: false,
    loader: true,
    mark_active_columns: false,
    highlight_keywords: false,
    no_results_message: false,
    col_types: [
      'string', 'string', 'number',
      'date', 'date', 'number'
    ],
    custom_options: {
      cols: [3],
      texts: [
        [
          '0 - 25 000',
          '100 000 - 1 500 000'
        ]
      ],
      values: [
        [
          '>0 && <=25000',
          '>100000 && <=1500000'
        ]
      ],
      sorts: [false]
    },
    extensions: [{
      name: 'sort'
    }]
  };

  var tf1 = new TableFilter('conservative-table', filtersConfig);
  tf1.init();
  var tf2 = new TableFilter('moderate-table', filtersConfig);
  tf2.init();
  var tf3 = new TableFilter('aggressive-table', filtersConfig);
  tf3.init();
};