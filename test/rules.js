module("rules");

test("rules() - internal - input", function() {
	var element = $("#firstname");

	$("#testForm1").validate();

	deepEqual( element.rules(), { required: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" } } );
});

test("rules(), ignore method:false", function() {
	var element = $("#firstnamec");

	$("#testForm1clean").validate({
		rules: {
			firstnamec: { required: false, minLength: 2 }
		}
	});

	deepEqual( element.rules(), { minLength: { rule: 2, validationType: "error" } } );
});

test("rules() HTML5 required (no value)", function() {
	var element = $("#testForm11text1");

	$("#testForm11").validate();

	deepEqual( element.rules(), { required: { rule: true, validationType: "error" } } );
});

test("rules() - internal - select", function() {
	var element = $("#meal");

	$("#testForm3").validate();

	deepEqual( element.rules(), { required: { rule: true, validationType: "error" } } );
});

test("rules() - external", function() {
	var element = $("#text1");

	$("#form").validate({
		rules: {
			action: { date: true, min: 5 }
		}
	});

	deepEqual( element.rules(), { date: { rule: true, validationType: "error" }, min: { rule: 5, validationType: "error" } } );
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
			action: { verifyTest: true }
		}
	});
	v.form();

	$.validator.methods = methods;
	$.validator.messages = messages;
});

test("rules() - internal - input", function() {
	var element = $("#form8input");

	$("#testForm8").validate();

	deepEqual( element.rules(), { required: { rule: true, validationType: "error" }, number: { rule: true, validationType: "error" }, rangelength: { rule: [ 2, 8 ], validationType: "error" } } );
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

	deepEqual( $("#firstnamec").rules(), { range: { rule: [ -15, 0 ], validationType: "error" } } );
	deepEqual( $("#lastnamec").rules(), { rangelength: { rule: [ 0, 10 ], validationType: "error" } } );

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
	equal( "required minLength", flatRules("#firstname") );
	equal( "required minLength maxLength", flatRules("#v2-i6") );
	equal( "required maxLength", flatRules("#co_name") );

	QUnit.reset();
	jQuery.validator.autoCreateRanges = true;
	v = $("#v2").validate();
	equal( "required rangelength", flatRules("#v2-i6") );

	$("#subformRequired").validate({
		rules: {
			co_name: "required"
		}
	});
	$("#co_name").removeClass();
	equal( "required maxLength", flatRules("#co_name") );
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

	deepEqual( $("#firstnamec").rules(), { min: { rule: 12, validationType: "error" } });
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

	deepEqual( $("#v2-i1").rules(), { required: { rule: true, validationType: "error" } });
	deepEqual( $("#v2-i2").rules(), { required: { rule: true, validationType: "error" }, email: { rule: true, validationType: "error" } });
	deepEqual( $("#v2-i3").rules(), { url: { rule: true, validationType: "error" } });
	deepEqual( $("#v2-i4").rules(), { required: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" } });
	deepEqual( $("#v2-i5").rules(), { required: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" }, maxLength: { rule: 5, validationType: "error" }, customMethod1: { rule: "123", validationType: "error" } });
	jQuery.validator.autoCreateRanges = true;
	deepEqual( $("#v2-i5").rules(), { required: { rule: true, validationType: "error" }, customMethod1: { rule: "123", validationType: "error" }, rangelength: { rule: [ 2, 5 ], validationType: "error" } });
	deepEqual( $("#v2-i6").rules(), { required: { rule: true, validationType: "error" }, customMethod2: { rule: true, validationType: "error" }, rangelength: { rule: [ 2, 5 ], validationType: "error" } });
	jQuery.validator.autoCreateRanges = false;
	deepEqual( $("#v2-i7").rules(), { required: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" }, customMethod: { rule: true, validationType: "error" } });

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
	deepEqual( $("#firstnamec").rules(), { min: { rule: 5, validationType: "error" } });

	deepEqual( $("#lastnamec").rules(), { max: { rule: 12, validationType: "error" }, email: { rule: true, validationType: "error" } });
});

test("rules(), add and remove", function() {
	$.validator.addMethod("customMethod1", function() {
		return false;
	}, "");
	$("#v2").validate();
	var removedAttrs = $("#v2-i5").removeClass("required").removeAttrs("minLength maxLength");
	deepEqual( $("#v2-i5").rules(), { customMethod1: { rule: "123", validationType: "error" } });

	$("#v2-i5").addClass("required").attr(removedAttrs);
	deepEqual( $("#v2-i5").rules(), { required: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" }, maxLength: { rule: 5, validationType: "error" }, customMethod1: { rule: "123", validationType: "error" } });

	$("#v2-i5").addClass("email").attr({ min: 5 });
	deepEqual( $("#v2-i5").rules(), { required: { rule: true, validationType: "error" }, email: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" }, maxLength: { rule: 5, validationType: "error" }, min: { rule: 5, validationType: "error" }, customMethod1: { rule: "123", validationType: "error" } });

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

	deepEqual( $("#firstnamec").rules(), { required: { rule: true, validationType: "error" }, date: { rule: true, validationType: "error" } } );

	$("#firstnamec").rules("remove", "date");
	deepEqual( $("#firstnamec").rules(), { required: { rule: true, validationType: "error" } } );
	$("#firstnamec").rules("add", "email");
	deepEqual( $("#firstnamec").rules(), { required: { rule: true, validationType: "error" }, email: { rule: true, validationType: "error" } } );

	$("#firstnamec").rules("remove", "required");
	deepEqual( $("#firstnamec").rules(), { email: { rule: true, validationType: "error" } } );

	deepEqual( $("#firstnamec").rules("remove"), { email: { rule: true, validationType: "error" } } );
	deepEqual( $("#firstnamec").rules(), { } );

	$("#firstnamec").rules("add", "required email");
	deepEqual( $("#firstnamec").rules(), { required: { rule: true, validationType: "error" }, email: { rule: true, validationType: "error" } } );

	deepEqual( $("#lastnamec").rules(), {} );
	$("#lastnamec").rules("add", "required");
	$("#lastnamec").rules("add", {
		minLength: 2
	});
	deepEqual( $("#lastnamec").rules(), { required: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" } } );

	var removedRules = $("#lastnamec").rules("remove", "required email");
	deepEqual( $("#lastnamec").rules(), { minLength: { rule: 2, validationType: "error" } } );
	$("#lastnamec").rules("add", removedRules);
	deepEqual( $("#lastnamec").rules(), { required: { rule: true, validationType: "error" }, minLength: { rule: 2, validationType: "error" } } );
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
		required: { rule: true, validationType: "error" },
		rangelength: { rule: [ 2, 3 ], validationType: "error" }
	});
});
