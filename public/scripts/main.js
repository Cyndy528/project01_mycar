$(document).ready(function() {
	console.log('Ready');

	var source = $('#car-template').html();

	var template = Handlebars.compile(source);

	var baseUrl = '/api/cars';

	var allCars = [];

	var $carList = $('#car-list');

	var carsHtml = template({
		cars: allCars
	});
	var $add_car = $('#add_car');

	$('#car-list').append(carsHtml);

	// var render = function() {
	// 	// empty existing todos from view
	// 	$carList.empty();

	// 	var carsHtml = template({
	// 		cars: allCars
	// 	});

	// 	// append html to the view
	// 	$carList.append(carsHtml);
	// };

	// Add New Car
	$add_car.on('submit',function(event){
		event.preventDefault();
		var newCar = $(this).serialize();

		$.post(baseUrl, newCar, function(data){
			console.log(data);
			allCars.push(data);
			$carList.append(template({
				car:allCars
			}));
		});
	});


	// GET all cars on page load
	$.get(baseUrl, function(data) {
		allCars = data.car;
		console.log(data.car);

		var carsHtml =template({
			car: allCars
		});
		$carList.append(carsHtml);
	});
});