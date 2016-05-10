var dependencies = ['jQuery'];
define( dependencies, function() {
	var Util = {
		bindCheckBox : function() {
			console.log('bindCheckBox');
			jQuery('.check_control input[type="checkbox"], .check_control input[type="radio"]').click(function() {
				var isChecked = jQuery(this).prop('checked');
				console.log('bindCheckBox...');
				if (jQuery(this).hasClass('radio')) {
					jQuery(this).parents('.inp_radio').find('label').removeClass('on');
				}
				if (isChecked === true) {
					jQuery(this).parent('label').addClass('on');	
					console.log('bindCheckBox isChecked true');
				}else {
					jQuery(this).parent('label').removeClass('on');
					console.log('bindCheckBox isChecked false');
				}
			});	
		}
		
	};
	
	return Util;

});