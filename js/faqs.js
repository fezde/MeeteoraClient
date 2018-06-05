var faqs = null;

var template = null;

function faqsLoad() {

    debug("Loading FAQs");
    template = $('#faq_template').html();
    Mustache.parse(template); // optional, speeds up future uses

    $.getJSON({
            url: "faqs.json?r=" + Math.random()
        })
        .done(function (data) {
            debug("Got answer for FAQs");
            debug(data);
            faqs = data;
            var i = 1;
            faqs.forEach(function (element) {
                var rendered = Mustache.render(template, element);

                element.initialWeight = i++;

                $('#faq_container').append(rendered);
            });
            search();


        })
        .fail(function (xhr, textStatus, error) {
            debug("Error in FAQ loading");
            debug(("getJSON failed, status: " + textStatus + ", error: " + error))
            debug(xhr);

        });

}

function compareFaqs(a, b) {
    if (a.weight < b.weight)
        return -1;
    if (a.weight > b.weight)
        return 1;
    return 0;
}

function search() {
    var phrase = $("#faqSearchInput").val();



    debug("Searching for: " + phrase)

    $('#faq_container').html("");


    faqs.forEach(function (element) {
        // create weight
        if (phrase.length < 3) {
            element.weight = element.initialWeight;
        } else {
            element.weight = 0;
            if (element.question.toLowerCase().indexOf(phrase.toLocaleLowerCase()) != -1) {
                element.weight += 2;
            }
        }


    });

    faqs.sort(compareFaqs);
    faqs.reverse();
    faqs.forEach(function (element) {

        debug(element.weight);
        if (element.weight > 0) {
            var rendered = Mustache.render(template, element);
            $('#faq_container').append(rendered);
        }

    });
}

$("#faqSearchInput").keyup(function () {
    debug("change");
    search();
});
