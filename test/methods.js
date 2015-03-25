(function($) {

function methodTest( methodName ) {
	var v = jQuery("#form").validate(),
		method = $.validator.methods[methodName],
		element = $("#firstname")[0];

	return function(value, param) {
		element.value = value;
		return method.call( v, value, element, param );
	};
}

module("methods");

test("default messages", function() {
	var m = $.validator.methods;
	$.each(m, function(key) {
		ok( jQuery.validator.messages[key], key + " has a default message." );
	});
});

test("digit", function() {
	var method = methodTest("digits");
	ok( method( "123" ), "Valid digits" );
	ok(!method( "123.000" ), "Invalid digits" );
	ok(!method( "123.000,00" ), "Invalid digits" );
	ok(!method( "123.0.0,0" ), "Invalid digits" );
	ok(!method( "x123" ), "Invalid digits" );
	ok(!method( "100.100,0,0" ), "Invalid digits" );
});

test("url", function() {
	var method = methodTest("url");
	ok( method( "http://bassistance.de/jquery/plugin.php?bla=blu" ), "Valid url" );
	ok( method( "https://bassistance.de/jquery/plugin.php?bla=blu" ), "Valid url" );
	ok( method( "ftp://bassistance.de/jquery/plugin.php?bla=blu" ), "Valid url" );
	ok( method( "http://www.føtex.dk/" ), "Valid url, danish unicode characters" );
	ok( method( "http://bösendorfer.de/" ), "Valid url, german unicode characters" );
	ok( method( "http://192.168.8.5" ), "Valid IP Address" );
	ok(!method( "http://192.168.8." ), "Invalid IP Address" );
	ok(!method( "http://bassistance" ), "Invalid url" ); // valid
	ok(!method( "http://bassistance." ), "Invalid url" ); // valid
	ok(!method( "http://bassistance,de" ), "Invalid url" );
	ok(!method( "http://bassistance;de" ), "Invalid url" );
	ok(!method( "http://.bassistancede" ), "Invalid url" );
	ok(!method( "bassistance.de" ), "Invalid url" );
});

// disable email tests
//test("email", function() {
//	var method = methodTest("email");
//	ok( method( "name@domain.tld" ), "Valid email" );
//	ok( method( "name@domain.tl" ), "Valid email" );
//	ok( method( "bart+bart@tokbox.com" ), "Valid email" );
//	ok( method( "bart+bart@tokbox.travel" ), "Valid email" );
//	ok( method( "n@d.tld" ), "Valid email" );
//	ok( method( "bla.blu@g.mail.com"), "Valid email" );
//	ok( method( "name@domain" ), "Valid email" );
//	ok( method( "name.@domain.tld" ), "Valid email" );
//	ok( method( "name@website.a" ), "Valid email" );
//	ok(!method( "ole@føtex.dk"), "Invalid email" );
//	ok(!method( "jörn@bassistance.de"), "Invalid email" );
//	ok(!method( "name" ), "Invalid email" );
//	ok(!method( "test@test-.com" ), "Invalid email" );
//	ok(!method( "name@" ), "Invalid email" );
//	ok(!method( "name,@domain.tld" ), "Invalid email" );
//	ok(!method( "name;@domain.tld" ), "Invalid email" );
//	ok(!method( "name;@domain.tld." ), "Invalid email" );
//});

test("number", function() {
	var method = methodTest("number");
	ok( method( "123" ), "Valid number" );
	ok( method( "-123" ), "Valid number" );
	ok( method( "123,000" ), "Valid number" );
	ok( method( "-123,000" ), "Valid number" );
	ok( method( "123,000.00" ), "Valid number" );
	ok( method( "-123,000.00" ), "Valid number" );
	ok(!method( "-" ), "Invalid number" );
	ok(!method( "123.000,00" ), "Invalid number" );
	ok(!method( "123.0.0,0" ), "Invalid number" );
	ok(!method( "x123" ), "Invalid number" );
	ok(!method( "100.100,0,0" ), "Invalid number" );

	ok( method( "" ), "Blank is valid" );
	ok( method( "123" ), "Valid decimal" );
	ok( method( "123000" ), "Valid decimal" );
	ok( method( "123000.12" ), "Valid decimal" );
	ok( method( "-123000.12" ), "Valid decimal" );
	ok( method( "123.000" ), "Valid decimal" );
	ok( method( "123,000.00" ), "Valid decimal" );
	ok( method( "-123,000.00" ), "Valid decimal" );
	ok( method( ".100" ), "Valid decimal" );
	ok(!method( "1230,000.00" ), "Invalid decimal" );
	ok(!method( "123.0.0,0" ), "Invalid decimal" );
	ok(!method( "x123" ), "Invalid decimal" );
	ok(!method( "100.100,0,0" ), "Invalid decimal" );
});

test("date", function() {
	var method = methodTest("date");
	ok( method( "06/06/1990" ), "Valid date" );
	ok( method( "6/6/06" ), "Valid date" );
	ok(!method( "1990x-06-06" ), "Invalid date" );
});

test("required", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.required,
		e = $("#text1, #text1b, #hidden2, #select1, #select2");
	ok( method.call( v, e[0].value, e[0]), "Valid text input" );
	ok(!method.call( v, e[1].value, e[1]), "Invalid text input" );
	ok(!method.call( v, e[1].value, e[2]), "Invalid text input" );

	ok(!method.call( v, e[2].value, e[3]), "Invalid select" );
	ok( method.call( v, e[3].value, e[4]), "Valid select" );

	e = $("#area1, #area2, #pw1, #pw2");
	ok( method.call( v, e[0].value, e[0]), "Valid textarea" );
	ok(!method.call( v, e[1].value, e[1]), "Invalid textarea" );
	ok( method.call( v, e[2].value, e[2]), "Valid password input" );
	ok(!method.call( v, e[3].value, e[3]), "Invalid password input" );

	e = $("#radio1, #radio2, #radio3");
	ok(!method.call( v, e[0].value, e[0]), "Invalid radio" );
	ok( method.call( v, e[1].value, e[1]), "Valid radio" );
	ok( method.call( v, e[2].value, e[2]), "Valid radio" );

	e = $("#check1, #check2");
	ok( method.call( v, e[0].value, e[0]), "Valid checkbox" );
	ok(!method.call( v, e[1].value, e[1]), "Invalid checkbox" );

	e = $("#select1, #select2, #select3, #select4");
	ok(!method.call( v, e[0].value, e[0]), "Invalid select" );
	ok( method.call( v, e[1].value, e[1]), "Valid select" );
	ok( method.call( v, e[2].value, e[2]), "Valid select" );
	ok( method.call( v, e[3].value, e[3]), "Valid select" );
});

test("required with dependencies", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.required,
		e = $("#hidden2, #select1, #area2, #radio1, #check2");
	ok( method.call( v, e[0].value, e[0], "asffsaa" ), "Valid text input due to dependency not met" );
	ok(!method.call( v, e[0].value, e[0], "input" ), "Invalid text input" );
	ok( method.call( v, e[0].value, e[0], function() { return false; }), "Valid text input due to dependency not met" );
	ok(!method.call( v, e[0].value, e[0], function() { return true; }), "Invalid text input" );
	ok( method.call( v, e[1].value, e[1], "asfsfa" ), "Valid select due to dependency not met" );
	ok(!method.call( v, e[1].value, e[1], "input" ), "Invalid select" );
	ok( method.call( v, e[2].value, e[2], "asfsafsfa" ), "Valid textarea due to dependency not met" );
	ok(!method.call( v, e[2].value, e[2], "input" ), "Invalid textarea" );
	ok( method.call( v, e[3].value, e[3], "asfsafsfa" ), "Valid radio due to dependency not met" );
	ok(!method.call( v, e[3].value, e[3], "input" ), "Invalid radio" );
	ok( method.call( v, e[4].value, e[4], "asfsafsfa" ), "Valid checkbox due to dependency not met" );
	ok(!method.call( v, e[4].value, e[4], "input" ), "Invalid checkbox" );
});

test("minLength", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.minLength,
		param = 2,
		e = $("#text1, #text1c, #text2, #text3");
	ok( method.call( v, e[0].value, e[0], param), "Valid text input" );
	ok( method.call( v, e[1].value, e[1], param), "Valid text input" );
	ok(!method.call( v, e[2].value, e[2], param), "Invalid text input" );
	ok( method.call( v, e[3].value, e[3], param), "Valid text input" );

	e = $("#check1, #check2, #check3");
	ok(!method.call( v, e[0].value, e[0], param), "Valid checkbox" );
	ok( method.call( v, e[1].value, e[1], param), "Valid checkbox" );
	ok( method.call( v, e[2].value, e[2], param), "Invalid checkbox" );

	e = $("#select1, #select2, #select3, #select4, #select5");
	ok(method.call( v, e[0].value, e[0], param), "Valid select " + e[0].id );
	ok(!method.call( v, e[1].value, e[1], param), "Invalid select " + e[1].id );
	ok( method.call( v, e[2].value, e[2], param), "Valid select " + e[2].id );
	ok( method.call( v, e[3].value, e[3], param), "Valid select " + e[3].id );
	ok( method.call( v, e[4].value, e[4], param), "Valid select " + e[4].id );
});

test("maxLength", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.maxLength,
		param = 4,
		e = $("#text1, #text2, #text3");

	ok( method.call( v, e[0].value, e[0], param), "Valid text input" );
	ok( method.call( v, e[1].value, e[1], param), "Valid text input" );
	ok(!method.call( v, e[2].value, e[2], param), "Invalid text input" );

	e = $("#check1, #check2, #check3");
	ok( method.call( v, e[0].value, e[0], param), "Valid checkbox" );
	ok( method.call( v, e[1].value, e[1], param), "Invalid checkbox" );
	ok(!method.call( v, e[2].value, e[2], param), "Invalid checkbox" );

	e = $("#select1, #select2, #select3, #select4");
	ok( method.call( v, e[0].value, e[0], param), "Valid select" );
	ok( method.call( v, e[1].value, e[1], param), "Valid select" );
	ok( method.call( v, e[2].value, e[2], param), "Valid select" );
	ok(!method.call( v, e[3].value, e[3], param), "Invalid select" );
});

test("rangelength", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.rangelength,
		param = [ 2, 4 ],
		e = $("#text1, #text2, #text3");

	ok( method.call( v, e[0].value, e[0], param), "Valid text input" );
	ok(!method.call( v, e[1].value, e[1], param), "Invalid text input" );
	ok(!method.call( v, e[2].value, e[2], param), "Invalid text input" );
});

test("min", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.min,
		param = 8,
		e = $("#value1, #value2, #value3");

	ok(!method.call( v, e[0].value, e[0], param), "Invalid text input" );
	ok( method.call( v, e[1].value, e[1], param), "Valid text input" );
	ok( method.call( v, e[2].value, e[2], param), "Valid text input" );
});

test("max", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.max,
		param = 12,
		e = $("#value1, #value2, #value3");

	ok( method.call( v, e[0].value, e[0], param), "Valid text input" );
	ok( method.call( v, e[1].value, e[1], param), "Valid text input" );
	ok(!method.call( v, e[2].value, e[2], param), "Invalid text input" );
});

test("range", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.range,
		param = [ 4, 12 ],
		e = $("#value1, #value2, #value3");

	ok(!method.call( v, e[0].value, e[0], param), "Invalid text input" );
	ok( method.call( v, e[1].value, e[1], param), "Valid text input" );
	ok(!method.call( v, e[2].value, e[2], param), "Invalid text input" );
});

test("equalTo", function() {
	var v = jQuery("#form").validate(),
		method = $.validator.methods.equalTo,
		e = $("#text1, #text2");

	ok( method.call( v, "Test", e[0], "#text1" ), "Text input" );
	ok( method.call( v, "T", e[1], "#text2" ), "Another one" );
});

asyncTest("remote", function() {
	expect(7);
	var e = $("#username"),
		v = $("#userForm").validate({
			rules: {
				username: {
					required: true,
					remote: "users.php"
				}
			},
			messages: {
				username: {
					required: "Please",
					remote: jQuery.validator.format("{0} in use")
				}
			},
			submitHandler: function() {
				ok( false, "submitHandler may never be called when validating only elements");
			}
		});

	$(document).ajaxStop(function() {
		$(document).unbind("ajaxStop");
		equal( 1, v.size(), "There must be one error" );
		equal( "Peter in use", v.errorList[0].message );

		$(document).ajaxStop(function() {
			$(document).unbind("ajaxStop");
			equal( 1, v.size(), "There must be one error" );
			equal( "Peter2 in use", v.errorList[0].message );
			start();
		});
		e.val("Peter2");
		strictEqual( v.element(e), true, "new value, new request; dependency-mismatch considered as valid though" );
	});
	strictEqual( v.element(e), false, "invalid element, nothing entered yet" );
	e.val("Peter");
	strictEqual( v.element(e), true, "still invalid, because remote validation must block until it returns; dependency-mismatch considered as valid though" );
});

asyncTest("remote, customized ajax options", function() {
	expect(2);
	$("#userForm").validate({
		rules: {
			username: {
				required: true,
				remote: {
					url: "users.php",
					type: "POST",
					beforeSend: function(request, settings) {
						deepEqual(settings.type, "POST");
						deepEqual(settings.data, "email=email.com");
					},
					data: {
						email: function() {
							return "email.com";
						}
					},
					complete: function() {
						start();
					}
				}
			}
		}
	});
	$("#username").val("asdf");
	$("#userForm").valid();
});

asyncTest("remote extensions", function() {
	expect(5);
	var e = $("#username"),
		v = $("#userForm").validate({
			rules: {
				username: {
					required: true,
					remote: "users2.php"
				}
			},
			messages: {
				username: {
					required: "Please"
				}
			},
			submitHandler: function() {
				ok( false, "submitHandler may never be called when validating only elements");
			}
		});

	$(document).ajaxStop(function() {
		$(document).unbind("ajaxStop");
		if ( v.size() !== 0 ) {
			ok( "There must be one error" );
			equal( v.errorList[0].message, "asdf is already taken, please try something else" );
			v.element(e);
			equal( v.errorList[0].message, "asdf is already taken, please try something else", "message doesn't change on revalidation" );
		}
		start();
	});
	strictEqual( v.element(e), false, "invalid element, nothing entered yet" );
	e.val("asdf");
	strictEqual( v.element(e), true, "still invalid, because remote validation must block until it returns; dependency-mismatch considered as valid though" );
});

asyncTest("remote radio correct value sent", function() {
	expect(1);
	var e = $("#testForm10Radio2"),
		v;

	e.attr("checked", "checked");
	v = $("#testForm10").validate({
		rules: {
			testForm10Radio: {
				required: true,
				remote: {
					url: "echo.php",
					dataType: "json",
					success: function(data) {
						equal( data.testForm10Radio, "2", " correct radio value sent" );
						start();
					}
				}
			}
		}
	});

	v.element(e);
});

asyncTest("remote reset clear old value", function() {
	expect(1);
	var e = $("#username"),
		v = $("#userForm").validate({
			rules: {
				username: {
					required: true,
					remote: {
						url: "echo.php",
						dataFilter: function(data) {
							var json = JSON.parse(data);
							if (json.username === "asdf") {
								return "\"asdf is already taken\"";
							}
							return "\"" + true + "\"";
						}
					}
				}
			}
		});

	$(document).ajaxStop(function() {
		var waitTimeout;

		$(document).unbind("ajaxStop");

		$(document).ajaxStop(function() {
			clearTimeout(waitTimeout);
			ok( true, "Remote request sent to server" );
			start();
		});

		v.resetForm();
		e.val("asdf");
		waitTimeout = setTimeout(function() {
			ok( false, "Remote server did not get request");
			start();
		}, 200);
		v.element(e);
	});
	e.val("asdf");
	v.element(e);
});

})(jQuery);
