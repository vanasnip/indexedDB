
$(document).ready(function(){
	if(window.indexedDB){
	//console.log('indexedDB is available');
	} else {
		console.log('nah boss');
	}

	var request = indexedDB.open('myFirstDatabase', 1);

	request.onupgradeneeded = function(e){
		console.log(e);
		db = e.target.result;

		if(!db.objectStoreNames.contains('customers')){
			//create and object store for this database
			console.log('feels like the first time');
			var objectStore = db.createObjectStore('customers', {keypath: "id", autoIncrement: true});
			// Create index for name
			objectStore.createIndex("name", "name", {unique: false});
		}	
	}



	request.onsuccess = function(e){
		console.log('Sucess, database is open');
		db = e.target.result;
		//show customers 
		showCustomers();
	};

	request.onerror = function(e){
		console.log('Error: database not open');
	}
});


//Add customer 


function addCustomer(){
		console.log(db);
	 var name = $('#name').val();
	 var email = $('#email').val();
	console.log(name + " " + email);

	 var transactions = db.transaction(["customers"],"readwrite");
	
	 // ask for object
	 var store = transactions.objectStore('customers');

	 // define Customer 
	 var customer  = {
	 	name: name,
	 	email: email
	 };
	 console.log(store);
	 // perform add
	 var request = store.add(customer);

	 // success
	 request.onsuccess = function(e){
	 	console.log('customer added, no worries');
	 	//window.location.href = "index.html"
	 	
	 }

	 //error
	 request.onerror = function(e){
	 	console.log("Error", e);
	 }


};

// display customers
function showCustomers(){
	var transactions = db.transaction(["customers"],"readonly");
	var store = transactions.objectStore("customers");
	// Ask for objects
	var index = store.index("name");


	var output = "";
	index.openCursor().onsuccess = function(e){
		var cursor = e.target.result;
		if(cursor){
			output += "<tr>";
			output += "<td>" + cursor.value.id + "</td>";
			output += "<td><span>" + cursor.value.name + "</span></td>";
			output += "<td><span>" + cursor.value.email + "</span></td>";
			output += "<td><a href=''>Delete</a> </td>";
			output += "<tr>";
			cursor.continue();
		}
		$("#customers").html(output);
	}
};
