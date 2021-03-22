
// Equilibrium Price Equations:
    // Qsupply = Msupply * price + Bsupply
    // Qdemand = Mdemand * price + Bdemand

    const Mdemand = -1000;
    const Bdemand = 10000;
    const Msupply = 0; // what if ABC can hire more people when price goes up? 
    const Bsupply = 8000;
    let consumption;
    let supply;
    let message;
    let selectedPrice = document.getElementById('theprice');

    document.getElementById("calculate").addEventListener("click", calculateOutput);

    function setLastPrice() {
      let p = document.getElementById("inputGroupSelect01").value;
      let dbPrice = {
        id: 1,
        price: p
      }
      AddPrice(dbPrice)
    }

    function calculateOutput() {
      // var price;
      message = "";
      revenue = 0;
      let price = document.getElementById("inputGroupSelect01").value;

      consumption = price * Mdemand + Bdemand;
      supply = price * Msupply + Bsupply;

      if (consumption > supply) {
        // consumption = supply;
        message = "Supreme Writer cannot make enough for ABC Inc.";
      }

      if (consumption <= 0) {
        consumption = 0;
        message = "No one will buy Supreme Writer at this price";
      }


      revenue = consumption * price;
			// Show when equilibrium price is selected
      if (consumption === supply) {
        message = "This is the equilibrium price"
      }

      document.getElementById("result").innerHTML = `Supreme Writer sold: ${consumption}/month<br>Revenue: $${revenue.toLocaleString('en-US', {maximumFractionDigits:2}) }/month<br><br>${message}`;

			/** Set selected price in indexedDB */
      setLastPrice();

			/** Get last selected price from indexedDB */
      getLastPrice();
    }

/** Initiate IndexedDB and Create priceDB on load 
 * OR 
 * Get last calculated price */

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB; 

if (window.indexedDB) {
	window.addEventListener("load", () => {
		createDB();
		getLastPrice();
	});
} else {
	console.log(
		"Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.",
	);
}
/** Create IndexedDB */
function createDB(){
	let request = indexedDB.open("ePrices"),
		db,
		store;
	/** on upgrade */
	request.onupgradeneeded = (e) => {
		db = request.result;
		console.log("upgrade is called", db);
		if (!db.objectStoreNames.contains("thePriceStore")) {
			// if there's no price store
			store = db.createObjectStore("thePriceStore"); // create it
		}
	};
	/** on success */
	request.onsuccess = (e) => {
		db = request.result;
		let theResult = e.target.result;
		db.close;
	};
	/** on err */
	request.onerror = (e) => {
		console.log(`err! ${e.target.error}`);
	};
}
/** DB Transaction to add price */
function AddPrice(data){
	let request = indexedDB.open("ePrices"),
		db,
		store,
		tx;

	/** on upgrade */
	request.onupgradeneeded = (e) => {
		db = request.result;
		console.log("upgrade is called", db);
		if (!db.objectStoreNames.contains("thePriceStore")) {
			// if there's no price store
			store = db.createObjectStore("thePriceStore"); // create it
		}
	};
	/** on success */
	request.onsuccess = (e) => {
		db = request.result;
		tx = db.transaction("thePriceStore", "readwrite");
		store = tx.objectStore("thePriceStore");
		tx.oncomplete = (e) => {
			console.log('Transaction Completed');
		};
		tx.onerror = (err) => {
			console.warn(err);
		};
		if (data.price !== "for Pen...") {
			store.put(data, data.id);
		}
		db.close;
	};
	/** on err */
	request.onerror = (e) => {
		console.log(`err! ${e.target.error}`);
	};
}

function getLastPrice(){
	let request = indexedDB.open("ePrices"),
		db,
		store,
		tx;

	/** on upgrade */
	request.onupgradeneeded = (e) => {
		db = request.result;
		if (!db.objectStoreNames.contains("thePriceStore")) {
			// if there's no price store
			store = db.createObjectStore("thePriceStore"); // create it
		}
	};
	/** on success */
	request.onsuccess = (e) => {
		db = request.result;
		tx = db.transaction("thePriceStore", "readwrite");
		store = tx.objectStore("thePriceStore");
		tx.oncomplete = (e) => {
			console.log('Transaction Completed');
		};
		tx.onerror = (err) => {
			console.warn(err);
		};
		let result = store.get(1);
		result.onsuccess = (e) => {
			let theP = e.target.result.price;
			/** Show last price selected */
			selectedPrice.innerHTML = `Last Price Used to Calculated: $${theP}`;
		}
		db.close;
	};
	/** on err */
	request.onerror = (e) => {
		console.log(`err! ${e.target.error}`);
	};
}
