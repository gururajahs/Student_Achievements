$(document).ready(function(){
    $(".mul-select").select2({placeholder: "Select department"});
})

$(document).on('ready', function () {
        $("#from_year").on('change', function () {
             var el = $(this);
             let year = new Date().getFullYear();
             let chosen_year =parseInt(el.val()) +1;
            for (let i=chosen_year ;i<= year ;i++){
                $("#to_year").append("<option value="+i+">"+i+"</option>");
            }
        });
 });