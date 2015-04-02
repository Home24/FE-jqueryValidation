module("rules");

test("rules() - internal - input", function() {
	var element = $("#firstname");

	$("#testForm1").validate();

	deepEqual( element.rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		}
	});
});

test("rules(), ignore method:false", function() {
	var element = $("#firstnamec");

	$("#testForm1clean").validate({
		rules: {
			firstnamec: { required: false, minLength: 2 }
		}
	});

	deepEqual( element.rules(), {
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		}
	});
});

test("rules() HTML5 required (no value)", function() {
	var element = $("#testForm11text1");

	$("#testForm11").validate();

	deepEqual( element.rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		}
	} );
});

test("rules() - internal - select", function() {
	var element = $("#meal");

	$("#testForm3").validate();

	deepEqual( element.rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		}
	} );
});

test("rules() - external", function() {
	var element = $("#text1");

	$("#form").validate({
		rules: {
			action: { date: true, min: 5 }
		}
	});

	deepEqual( element.rules(), {
		"error.date": {
			rule: true,
			validationType: "error",
			validationMethod: "date"
		},
		"error.min": {
			rule: 5,
			validationType: "error",
			validationMethod: "min"
		}
	});
});

test("rules() - external - complete form", function() {
	expect(1);

	var methods = $.extend({}, $.validator.methods),
		messages = $.extend({}, $.validator.messages),
		v;

	$.validator.addMethod("verifyTest", function() {
		ok( true, "method executed" );
		return true;
	});
	v = $("#form").validate({
		rules: {
			action: {
				"error.verifyTest": {
					rule: true,
					validationType: "error",
					validationMethod: "verifyTest"
				}
			}
		}
	});
	v.form();

	$.validator.methods = methods;
	$.validator.messages = messages;
});

test("rules() - internal - input", function() {
	var element = $("#form8input");

	$("#testForm8").validate();

	deepEqual( element.rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.number": {
			rule: true,
			validationType: "error",
			validationMethod: "number"
		},
		"error.rangelength": {
			rule: [ 2, 8 ],
			validationType: "error",
			validationMethod: "rangelength"
		}
	});
});

test("rules(), merge min/max to range, minLength/maxLength to rangelength", function() {
	jQuery.validator.autoCreateRanges = true;

	$("#testForm1clean").validate({
		rules: {
			firstnamec: {
				min: -15,
				max: 0
			},
			lastname: {
				minLength: 0,
				maxLength: 10
			}
		}
	});

	deepEqual( $("#firstnamec").rules(), {
		"error.range": {
			rule: [ -15, 0 ],
			validationType: "error",
			validationMethod: "range"
		}
	});
	deepEqual( $("#lastnamec").rules(), {
		"error.rangelength": {
			rule: [ 0, 10 ],
			validationType: "error",
			validationMethod: "rangelength"
		}
	});

	jQuery.validator.autoCreateRanges = false;
});

test("rules(), guarantee that required is at front", function() {
	$("#testForm1").validate();
	var v = $("#v2").validate();
	$("#subformRequired").validate();
	function flatRules(element) {
		var result = [];
		jQuery.each($(element).rules(), function(key) { result.push(key); });
		return result.join(" ");
	}
	equal( "error.required error.minLength", flatRules("#firstname") );
	equal( "error.required error.minLength error.maxLength", flatRules("#v2-i6") );
	equal( "error.required error.maxLength", flatRules("#co_name") );

	QUnit.reset();
	jQuery.validator.autoCreateRanges = true;
	v = $("#v2").validate();
	equal( "error.required error.rangelength", flatRules("#v2-i6") );

	$("#subformRequired").validate({
		rules: {
			co_name: "required"
		}
	});
	$("#co_name").removeClass();
	equal( "error.required error.maxLength", flatRules("#co_name") );
	jQuery.validator.autoCreateRanges = false;
});

test("rules(), evaluate dynamic parameters", function() {
	expect(2);

	$("#testForm1clean").validate({
		rules: {
			firstnamec: {
				min: function(element) {
					equal( $("#firstnamec")[0], element );
					return 12;
				}
			}
		}
	});

	deepEqual( $("#firstnamec").rules(), {
		"error.min": {
			rule: 12,
			validationType: "error",
			validationMethod: "min"
		}
	});
});

test("rules(), class and attribute combinations", function() {

	$.validator.addMethod("customMethod1", function() {
		return false;
	}, "");
	$.validator.addMethod("customMethod2", function() {
		return false;
	}, "");

	$("#v2").validate({
		rules: {
			"v2-i7": {
				required: true,
				minLength: 2,
				customMethod: true
			}
		}
	});

	deepEqual( $("#v2-i1").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		}
	});
	deepEqual( $("#v2-i2").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.email": {
			rule: true,
			validationType: "error",
			validationMethod: "email"
		}
	});
	deepEqual( $("#v2-i3").rules(), {
		"error.url": {
			rule: true,
			validationType: "error",
			validationMethod: "url"
		}
	});
	deepEqual( $("#v2-i4").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		}
	});
	deepEqual( $("#v2-i5").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		},
		"error.maxLength": {
			rule: 5,
			validationType: "error",
			validationMethod: "maxLength"
		},
		"error.customMethod1": {
			rule: "123",
			validationType: "error",
			validationMethod: "customMethod1"
		}
	});
	jQuery.validator.autoCreateRanges = true;
	deepEqual( $("#v2-i5").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.customMethod1": {
			rule: "123",
			validationType: "error",
			validationMethod: "customMethod1"
		},
		"error.rangelength": {
			rule: [ 2, 5 ],
			validationType: "error",
			validationMethod: "rangelength"
		}
	});
	deepEqual( $("#v2-i6").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.customMethod2": {
			rule: true,
			validationType: "error",
			validationMethod: "customMethod2"
		},
		"error.rangelength": {
			rule: [ 2, 5 ],
			validationType: "error",
			validationMethod: "rangelength"
		}
	});
	jQuery.validator.autoCreateRanges = false;
	deepEqual( $("#v2-i7").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		},
		"error.customMethod": {
			rule: true,
			validationType: "error",
			validationMethod: "customMethod"
		}
	});

	delete $.validator.methods.customMethod1;
	delete $.validator.messages.customMethod1;
	delete $.validator.methods.customMethod2;
	delete $.validator.messages.customMethod2;
});

test("rules(), dependency checks", function() {
	var v = $("#testForm1clean").validate({
			rules: {
				firstnamec: {
					min: {
						param: 5,
						depends: function(el) {
							return (/^a/).test($(el).val());
						}
					}
				},
				lastname: {
					max: {
						param: 12
					},
					email: {
						depends: function() { return true; }
					}
				}
			}
		}),
		rules = $("#firstnamec").rules();

	equal( 0, v.objectLength(rules) );

	$("#firstnamec").val("ab");
	deepEqual( $("#firstnamec").rules(), {
		"error.min": {
			rule: 5,
			validationType: "error",
			validationMethod: "min"
		}
	});

	deepEqual( $("#lastnamec").rules(), {
		"error.max": {
			rule: 12,
			validationType: "error",
			validationMethod: "max"
		},
		"error.email": {
			rule: true,
			validationType: "error",
			validationMethod: "email"
		}
	});
});

test("rules(), add and remove", function() {
	$.validator.addMethod("customMethod1", function() {
		return false;
	}, "");
	$("#v2").validate();
	var removedAttrs = $("#v2-i5").removeClass("required").removeAttrs("minLength maxLength");
	deepEqual( $("#v2-i5").rules(), {
		"error.customMethod1": {
			rule: "123",
			validationType: "error",
			validationMethod: "customMethod1"
		}
	});

	$("#v2-i5").addClass("required").attr(removedAttrs);
	deepEqual( $("#v2-i5").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		},
		"error.maxLength": {
			rule: 5,
			validationType: "error",
			validationMethod: "maxLength"
		},
		"error.customMethod1": {
			rule: "123",
			validationType: "error",
			validationMethod: "customMethod1"
		}
	});

	$("#v2-i5").addClass("email").attr({ min: 5 });
	deepEqual( $("#v2-i5").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.email": {
			rule: true,
			validationType: "error",
			validationMethod: "email"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		},
		"error.maxLength": {
			rule: 5,
			validationType: "error",
			validationMethod: "maxLength"
		},
		"error.min": {
			rule: 5,
			validationType: "error",
			validationMethod: "min"
		},
		"error.customMethod1": {
			rule: "123",
			validationType: "error",
			validationMethod: "customMethod1"
		}
	});

	$("#v2-i5").removeClass("required email").removeAttrs("minLength maxLength customMethod1 min");
	deepEqual( $("#v2-i5").rules(), {});

	delete $.validator.methods.customMethod1;
	delete $.validator.messages.customMethod1;
});

test("rules(), add and remove static rules", function() {

	$("#testForm1clean").validate({
		rules: {
			firstnamec: "required date"
		}
	});

	deepEqual( $("#firstnamec").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.date": {
			rule: true,
			validationType: "error",
			validationMethod: "date"
		}
	});

	$("#firstnamec").rules("remove", "error.date");
	deepEqual( $("#firstnamec").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		}
	});
	$("#firstnamec").rules("add", "email");
	deepEqual( $("#firstnamec").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.email": {
			rule: true,
			validationType: "error",
			validationMethod: "email"
		}
	});

	$("#firstnamec").rules("remove", "required");
	deepEqual( $("#firstnamec").rules(), {
		"error.email": {
			rule: true,
			validationType: "error",
			validationMethod: "email"
		}
	});

	deepEqual( $("#firstnamec").rules("remove"), {
		"error.email": {
			rule: true,
			validationType: "error",
			validationMethod: "email"
		}
	});
	deepEqual( $("#firstnamec").rules(), { } );

	$("#firstnamec").rules("add", "required email");
	deepEqual( $("#firstnamec").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.email": {
			rule: true,
			validationType: "error",
			validationMethod: "email"
		}
	});

	deepEqual( $("#lastnamec").rules(), {} );
	$("#lastnamec").rules("add", "required");
	$("#lastnamec").rules("add", {
		minLength: 2
	});
	deepEqual( $("#lastnamec").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		}
	});

	var removedRules = $("#lastnamec").rules("remove", "required email");
	deepEqual( $("#lastnamec").rules(), {
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		}
	});
	$("#lastnamec").rules("add", removedRules);
	deepEqual( $("#lastnamec").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.minLength": {
			rule: 2,
			validationType: "error",
			validationMethod: "minLength"
		}
	});
});

test("rules(), add messages", function() {
	$("#firstnamec").attr("title", null);
	var v = $("#testForm1clean").validate({
		rules: {
			firstnamec: "required"
		}
	});
	$("#testForm1clean").valid();
	$("#firstnamec").valid();
	deepEqual( v.settings.messages.firstname, undefined );

	$("#firstnamec").rules("add", {
		messages: {
			required: "required"
		}
	});

	$("#firstnamec").valid();
	deepEqual( v.errorList[0] && v.errorList[0].message, "required" );

	$("#firstnamec").val("test");
	$("#firstnamec").valid();
	equal(v.errorList.length, 0);
});

test( "rules(), rangelength attribute as array", function() {
	$("#testForm13").validate();
	deepEqual( $("#cars-select").rules(), {
		"error.required": {
			rule: true,
			validationType: "error",
			validationMethod: "required"
		},
		"error.rangelength": {
			rule: [ 2, 3 ],
			validationType: "error",
			validationMethod: "rangelength"
		}
	});
});
