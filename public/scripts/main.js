$(document).ready(function() {
	console.log('Ready');

	var source = $('#car-template').html();

	var template = Handlebars.compile(source);

	// var maintSource = $('#maint-template').html();

	// var maintTemp = Handlebars.compile(maintSource);

	var baseUrl = '/api/cars';

	var maintUrl = '/api/cars';

	var allMaint = [];

	var allCars = [];

	var $maintList = $('#maint-list');

	var $carList = $('#car-list');

	var carsHtml = template({
		cars: allCars
	});
	var $add_car = $('#add_car');

	var $carYear = $('#car_year');

	var $carMake = $('#car_make');

	var $carCategory = $('#car_category');

	var $carModel = $('#car_model');

	var $carStyle = $('#car_style');

	var $maintForm = $('#maintForm');

	var maintenance = [];

	var $MRecord = $('#MRecord');

	$('#car-list').append(carsHtml);

	var render = function() {
		// empty existing cars from view
	$carList.empty();

	$.get(baseUrl, function(data) {
		allCars = data.car;
		// console.log(data.car);

		var carsHtml = template({
			car: allCars
		});
		$carList.append(carsHtml);
	});
	}

	var makeUrl = 'https://api.edmunds.com/api/vehicle/v2/makes?state=used&year=2014&view=basic&fmt=json&api_key=szf95fn6tfxu9q6zezhb46cj';

	$.get(makeUrl, function(data) {
		var makeResults = data.makes;
		var makelength = makeResults.length;
		for (var i = 0; i < makelength; i++) {
			//console.log(makeResults);
			$('#car_make').append('<option>' + makeResults[i].name + '</option>')

		}
	});

	//test function

	// 	var modeltest ='https://api.edmunds.com/api/vehicle/v2/Buick/models?state=used&year=2004&category=Sedan&view=basic&fmt=json&api_key=szf95fn6tfxu9q6zezhb46cj';

	// $.get(modeltest, function(data){
	// 	var modelsTresults = data.models[0].name;

	// 	console.log(modelsTresults);
	// });

	$carModel.on('change', function() {
		event.preventDefault();

		$carStyle.empty();

		$('#car_style').append('<option>' + 'Style' + '</option>');

		var pickedYear = $carYear.val();

		var pickedMake = $carMake.val();

		var pickedCategory = $carCategory.val();

		var pickedModel = $carModel.val();

		var modelUrl = 'https://api.edmunds.com/api/vehicle/v2/' + pickedMake + '/' + pickedModel + '/' + pickedYear + '?category=' + pickedCategory + '&view=full&fmt=json&api_key=szf95fn6tfxu9q6zezhb46cj';

		$.get(modelUrl, function(data) {
			var styleResults = data.styles;
			// console.log(styleResults);
			var stylelength = styleResults.length;
			for (var i = 0; i < stylelength; i++) {
				$('#car_style').append('<option>' + styleResults[i].name + '</option>');
				//console.log(styleResults[i].name);
			}

		});

	});

	$carMake.on('change', function() {
		event.preventDefault();

		$carModel.empty();

		$('#car_model').append('<option>' + 'Model' + '</option>');

		var pickedYear = $carYear.val();

		var pickedMake = $carMake.val();

		var pickedCategory = $carCategory.val();

		var modelUrl = 'https://api.edmunds.com/api/vehicle/v2/' + pickedMake + '/models?state=used&year=' + pickedYear + '&category=' + pickedCategory + '&view=basic&fmt=json&api_key=szf95fn6tfxu9q6zezhb46cj';

		$.get(modelUrl, function(data) {
			var modelResults = data.models;
			// console.log(modelResults);
			var modellength = modelResults.length;
			for (var i = 0; i < modellength; i++) {
				$('#car_model').append('<option>' + modelResults[i].name + '</option>')
			}

		});

	});



	//Test
	// $carCategory.change(function() {
	// 	console.log($carCategory.val());
	// });


	// $carYear.change(function() {
	// 	console.log($carYear.val());
	// });

	// var pickedYear = $carYear.val();

	// $carMake.change(function() {
	// 	console.log($carMake.val());
	// });

	//delete car
	$('body').on('click', '.delete-car', function(event) {
		//	alert();
		event.preventDefault();

		var carId = $(this).closest('.car').attr('data-id');

		var carToDelete = allCars.filter(function(car) {
			return car._id == carId;
		})[0];

		$.ajax({
			type: 'DELETE',
			url: baseUrl + '/' + carId,
			success: function(data) {
				// remove deleted cars from allCars
				allCars.splice(allCars.indexOf(carToDelete), 1);
				// render all cars to view
				render();

			}

		});
	});



	// // Add Maintenance  
	// $maintForm.on('submit', function(event) {
	// 	event.preventDefault();
	// 	var CarId = $('.car').attr('data-id');
	// 	var maintInfo = $(this).serialize();

	// 	var a = allCars[0];

	// 	maintInfo.save(function(err, maintInfo) {
	// 		if (err) {
	// 			return console.error(err);
	// 		}
	// 	});

	// 	console.log(maintInfo);
	// 	console.log(CarId);
	// 	console.log(a);
	// 	a.maintenance.push(maintInfo);
	// 	a.save();

	// });

	// add maintenance 2.0
	// $maintForm.on('submit',function(event){
	// 	event.preventDefault();
	// 	// var CarId = $('.car').attr('data-id');
	//  	var maintInfo = $(this).serialize();
	//  	var CarId = $('#maintForm').closest('#add_rec').attr('data-id');
	//  	console.log(CarId); 

	//  	// $.post('/api/cars/'+CarId+'/maintenance', maintInfo, function(data){
	//  	// 	console.log(data)
	//  	// 	 // allMaint.push(data);
	//  	// 	maintenance.push(maintInfo);
	//  	// 	allMaint.push(data);
	//  	// 	$('#mainModal').modal('hide');
	//  	// });

	// });

	// add maintenance 3.0
	$('body').on('click', '#add_rec', function(event) {
		// $('#mainModal').modal('show');
		// $('#maintForm').reset();
		event.preventDefault();
		var carID = $(this).closest('#add_rec').attr('data-id');
		console.log(carID);

		$maintForm.on('submit', function(event) {
			event.preventDefault();
			var maintInfo = $maintForm.serialize();
			console.log(maintInfo);

			$.post('/api/cars/' + carID + '/maintenance', maintInfo, function(data) {
				// console.log(data);
				allMaint.push(data);
			 	maintenance.push(maintInfo);
			 	console.log(maintInfo);
			 	$maintForm[0].reset();
				$('#mainModal').modal('hide');
			});
		});

	});


	//Get all maintenance 

	$('body').on('click', '#MRecord', function(event) {
		event.preventDefault();
		$('#maint-list').empty();

		var maintenanceID = $(this).attr('data-id');
		console.log(maintenanceID);

		$.get(baseUrl + '/' + maintenanceID, function(data) {
			// console.log(data);
			var maintResults = data;
			for (var i = 0; i < maintResults.length; i++) {
				// console.log(maintResults[i]);
				$("#maint-list").append('<p>'+maintResults[i].date+'</p>'+'<p>' + maintResults[i].type + '</p>'
					+'<p>'+maintResults[i].maintenance+'</p>'+'<br>');
			}
		});
	});


	// Add New Car
	$add_car.on('submit', function(event) {
		$('#car-list').empty();
		event.preventDefault();
		var newCar = $(this).serialize();

		$.post(baseUrl, newCar, function(data) {
			// console.log(data);
			allCars.push(data);
			$carList.append(template({
				car: allCars
			}));
		});

		$add_car[0].reset();
		$carModel.empty();
		$('#car_model').append('<option>' + 'Model' + '</option>');
		$('#myModal').modal('hide');

		// render();
		// $add_car.reset();
	});



	// GET all cars on page load
	$.get(baseUrl, function(data) {
		allCars = data.car;
		// console.log(data.car);

		var carsHtml = template({
			car: allCars
		});
		$carList.append(carsHtml);
	});
});