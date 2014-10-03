var Step1 = function(model) {
    var self = this;
    this.login = html.data('').required('Login info is required.');
    this.email = html.data('').required('Email is required.').isEmail('Must be a valid email.');
    this.password = html.data('').required('Password is required.').subscribe(function(val) {
        self.confirmation.validate();
    });
    this.confirmation = html.data('').equal(this.password, 'Password confirmation not matched.');
};

var Step2 = function(model) {
    var self = this;
    this.name = html.data('').required('Name is required.');
    this.lastName = html.data('').required('Last name is required.');
    this.dateOfBirth = html.data('').required('Date of birth is requried.')
    this.gender = html.data('').required('Gender is required.'); 
    this.comment = html.data('').maxLength(520,'Max length is 520.').validate();
    this.charLeft = html.data(function() {
        var length = self.comment().length;
        return length <= 520? 520 - length: 0;
    }).changeAfter(this.comment);
};

var Step3 = function(model) {
    var self = this;
    this.phoneNo = html.data('').required('Phone number is required.');
    this.country = html.data('').required('Country is required.');
    this.city = html.data('').required('City is requried.')
    this.address = html.data('').required('Address is required.'); 
    this.address2 = html.data('');
    this.address2Enabled = html.data(function() {
        return self.address.isValid();
    }).changeAfter(this.address);
    this.socialNetwork = html.data(['Facebook', 'Twitter', 'Instagram', 'Google+']);
};

var ViewModel = function () {
    var self = this;
    this.activeNextStep = function(error) {
        var step = self['step' + vm.step()];
        for (var prop in step) {
            if(!step[prop].isValid) continue;
            var isValid = step[prop].isValid();
            if(!isValid) {
                self.nextStepEnabled(false);
                return;
            }
        }
        self.nextStepEnabled(true);
    };
    this.step = html.data(1);
    this.nextStepEnabled = html.data(false);
    
    // events
    this.nextStepClick = function(e) {
        vm.step(vm.step() + 1);
        html.navigate('#step' + vm.step());
    };
    this.step1 = new Step1;
    this.step2 = new Step2;
    this.step3 = new Step3;
};

var vm = new ViewModel;

/* BINDING DATA TO VIEW */
(function(vm) {
    html('#next').click(vm.nextStepClick).enable(vm.nextStepEnabled);
    
    // step1
    html('#txtLogin').input(vm.step1.login, vm.activeNextStep);
    html('#txtEmail').input(vm.step1.email, vm.activeNextStep);
    html('#txtPassword').input(vm.step1.password, vm.activeNextStep);
    html('#txtPasswordConfirmation').input(vm.step1.confirmation, vm.activeNextStep);
    
    // step2
    html('#txtName').input(vm.step2.name, vm.activeNextStep);
    html('#txtLastName').input(vm.step2.lastName, vm.activeNextStep);
    html('#txtDoB').datepicker(vm.step2.dateOfBirth);
    html('#txtGender').input(vm.step2.gender, vm.activeNextStep);
    html('#txtComment').input(vm.step2.comment);
    html('#charLeft').text(vm.step2.charLeft);
    
    // step3
    html('#txtPhone').input(vm.step3.phoneNo, vm.activeNextStep);
    html('#txtCountry').input(vm.step3.country, vm.activeNextStep);
    html('#txtCity').input(vm.step3.city, vm.activeNextStep);
    html('#txtAddress').input(vm.step3.address, vm.activeNextStep);
    html('#txtAddress2').text(vm.step3.address2).enable(vm.step3.address2Enabled);
    html('#ddlSocialNetwork').dropdown(vm.step3.socialNetwork);
})(vm);

/* END OF BINDING DATA */

/* ROUTING */
    html.router('#step:step', function(step) {
        step = parseInt(step);
        $('form > div').hide()
        $('#step' + step).show();
        vm.step(step);
    });
/* END OF ROUTING */