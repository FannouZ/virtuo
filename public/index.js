'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
const rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'distance': 1000,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];


//console.log(cars);
//console.log(rentals);
//console.log(actors);

const commission_rate=0.3;
const insurance_rate=0.5;
const treasury_tax=1;
const deductible_tax=4;

var commission_cost,insurance,treasury,virtuo_benefit,deductible=0;
var commission={};

function rental_price()
{
  for (var i=0;i<rentals.length;i++)
  {
    //getting the number of days
    var pickupdate = new Date(rentals[i].pickupDate);
    var returndate= new Date(rentals[i].returnDate);
    var time_diff=returndate.getTime()-pickupdate.getTime();
    var days = time_diff / (1000 * 3600 * 24)+1; 

    //number of km
    var km=rentals[i].distance;
    
    //price per day and price per km
    var car_id=rentals[i].carId;
    var ppd,ppk;
    for (var j=0;j<cars.length;j++){
        if(cars[j].id==car_id){
            ppd=cars[j].pricePerDay;
            ppk=cars[j].pricePerKm;
        }
    }

    //rental price
    var price=days*ppd+km*ppk;

    if(days>1 && days<=4)
      price*=0.9;
    else if(days<=10)
      price*=0.7;
    else
      price*=0.5;

    price=price.toFixed(2);
    //commission
    commission_cost=(price*commission_rate).toFixed(2);
    insurance=(commission_cost*insurance_rate).toFixed(2);
    treasury=days*treasury_tax;
    virtuo_benefit=(commission_cost-insurance-treasury).toFixed(2);
    commission={'insurance':insurance,'treasury':treasury,'virtuo':virtuo_benefit};

    //deductible reduction option
    if(rentals[i].options.deductibleReduction==true)
      deductible=deductible_tax*days;


    //pay the actors :
    for (var k=0;k<actors.length;k++) //iterate through the actors list (going through each rental)
    {
      if (rentals[i].id==actors[k].rentalId) //if the rentals id match
      {
        for(var l=0;l<actors[k].payment.length;l++) //iterate through payment list
        {            
            if(actors[k].payment[l].who == 'driver')
            {
              actors[k].payment[l].amount=price+deductible;
            }
            if(actors[k].payment[l].who == 'partner')
              actors[k].payment[l].amount=(price-commission_cost).toFixed(2);
            if(actors[k].payment[l].who == 'insurance')
              actors[k].payment[l].amount=insurance;
            if(actors[k].payment[l].who == 'treasury')
              actors[k].payment[l].amount=treasury;
            if(actors[k].payment[l].who == 'virtuo')
              actors[k].payment[l].amount=virtuo_benefit+deductible;
           
        }
        console.log(actors[k].rentalId);
        console.log(actors[k].payment);
      }
    }

    //display recap 
    /*
    console.log("rental id : ",rentals[i].id);
    console.log("rental price :",(price).toFixed(2));
    console.log(commission);

    */
  
  }
  
}

rental_price();