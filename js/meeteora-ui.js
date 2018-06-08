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
    debug("initUsernameModal");
    $(".username-button").click(function () {
        debug("Click");
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
            var tmp = $("#username").val();
            debug("Username shall be changed to: " + tmp);
            userName = tmp;
            saveName();
        },
        onShow: function () {
            $("#username").val(loadName());
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
