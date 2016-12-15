// Studentlist data array for filling in info box
var studentListData = [];
 
// DOM Ready =============================================================
$(document).ready(function() {
 
    // Populate the Student table on initial page load
    populateTable();
});
 
// Functions =============================================================
 
// Fill table with data
function populateTable() {
 
    // Empty content string
    var tableContent = '';
 
    // jQuery AJAX call for JSON
    $.getJSON( '/users/studentlist', function( data ) {
 
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
                                                tableContent += '<td>' + this.st_id + '</td>';
            tableContent += '<td><a href="#" class="linkshowstudent" rel="' + this.fullname + '" title="Show Details">' + this.fullname + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeletestudent" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
                                                // Stick our user data array into a studentlist variable in the global object
                                               
        });
        // Inject the whole content string into our existing HTML table
        $('#studentList table tbody').html(tableContent);
    });
};