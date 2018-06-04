function initUi() {
    debug("Init UI");
    initModals();
    initUsernameModal();
    initMenu();
}

/**
* Inits the general Modals
**/
function initModals(){
    $('.ui.modal').modal("setting", {
        //detachable: false,
        closable: false,
    });
}

function initMenu() {
    debug("init Menu");
    $('.ui.dropdown').dropdown({
        transition: 'drop'
    });
}

function initUsernameModal() {
    $(".username-button").click(function () {
        $('#username-modal').modal('show');
    });

    // Init the modal
    $('#username-modal').modal("setting", {
        //detachable: false,
        closable: false,
        onDeny: function () {
            console.log("Deny / Cancel");

        },
        onApprove: function () {
            var formValid = $('#username-form').form('is valid');
            if (!formValid) {
                $("#username").focus();
                return false;
            }
            //TODO save name to cookie
        },
        onShow: function () {
            //TODO set name from Cookie
            $("#username").val(new Date());
        },
    });

    // Set validation rules for the form
    $('#username-form')
        .form({
            on: 'blur',
            inline: true,
            fields: {
                username: ['minLength[2]', 'maxLength[5]', 'empty']
            }
        });
}


initUi();
