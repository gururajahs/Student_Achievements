$(document).ready(function() {
    $(".department-select").select2({ placeholder: "Select the departments" });

    $("#select-all").click(function() {
        if ($("#select-all").is(':checked')) {
            $(".department-select > option").prop("selected", "selected");
            $(".department-select").trigger("change");
        } else {
            $(".department-select > option").removeAttr("selected");
            $(".department-select").trigger("change");
        }
    });
})

$(document).ready(function() {
    $(".batch-select").select2({ placeholder: "Select the batches" });

    $("#select-batch-all").click(function() {
        if ($("#select-batch-all").is(':checked')) {
            $(".batch-select > option").prop("selected", "selected");
            $(".batch-select").trigger("change");
        } else {
            $(".batch-select > option").removeAttr("selected");
            $(".batch-select").trigger("change");
        }
    });
})


$(document).on('ready', function() {
    $("#from_year").on('change', function() {
        $('#to_year').empty();
        var el = $(this);
        let year = new Date().getFullYear() + 1; // + 1 coz of current batch 2021-2022
        let chosen_year = parseInt(el.val()) + 1;
        for (let i = chosen_year; i <= year; i++) {
            $("#to_year").append("<option value=" + i + ">" + i + "</option>");
        }
    });

});