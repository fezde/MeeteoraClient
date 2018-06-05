function faqsLoad() {

    debug("Loading FAQs");
    $.getJSON({
            url: "faqs.json?r=" + Math.random()
        }, function (data) {
            debug("aslkdjasd");
        })
        .done(function (data) {
            debug("Got answer for FAQs");
            debug(data);



            var template = $('#faq_template').html();
            Mustache.parse(template); // optional, speeds up future uses

            data.forEach(function (element) {
                var rendered = Mustache.render(template, element);
                $('#faq_container').append(rendered);
            });


        })
        .fail(function (xhr, textStatus, error) {
            debug("Error in FAQ loading");
            debug(("getJSON failed, status: " + textStatus + ", error: " + error))
            debug(xhr);

        });

}
