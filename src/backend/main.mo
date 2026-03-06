import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";

actor {
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    active : Bool;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      switch (Text.compare(p1.category, p2.category)) {
        case (#equal) { Text.compare(p1.name, p2.name) };
        case (order) { order };
      };
    };
  };

  type Staff = {
    id : Nat;
    name : Text;
    active : Bool;
  };

  module Staff {
    public func compare(staff1 : Staff, staff2 : Staff) : Order.Order {
      Text.compare(staff1.name, staff2.name);
    };
  };

  type UsageEntry = {
    id : Nat;
    date : Text;
    productId : Nat;
    productName : Text;
    staffId : Nat;
    staffName : Text;
    quantity : Nat;
    time : Text;
    clientName : ?Text;
  };

  type DailyReport = {
    date : Text;
    staffGroups : [{
      staffName : Text;
      entries : [UsageEntry];
      totalQuantity : Nat;
    }];
    grandTotal : Nat;
  };

  type MonthlyReport = {
    month : Text;
    year : Text;
    productTotals : [{
      productName : Text;
      category : Text;
      totalQuantity : Nat;
    }];
    staffTotals : [{
      staffName : Text;
      totalQuantity : Nat;
      entryCount : Nat;
    }];
  };

  let productsMap = Map.empty<Nat, Product>();
  let staffMap = Map.empty<Nat, Staff>();
  let usageMap = Map.empty<Nat, UsageEntry>();

  var nextProductId = 1;
  var nextStaffId = 1;
  var nextUsageId = 1;

  // Product Functions
  public query ({ caller }) func getProducts() : async [Product] {
    productsMap.values().toArray().filter(func(p) { p.active }).sort();
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    productsMap.values().toArray().sort();
  };

  public shared ({ caller }) func addProduct(name : Text, category : Text) : async Product {
    let product : Product = {
      id = nextProductId;
      name;
      category;
      active = true;
    };
    productsMap.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, category : Text) : async ?Product {
    switch (productsMap.get(id)) {
      case (null) { null };
      case (?product) {
        let updatedProduct : Product = {
          id;
          name;
          category;
          active = product.active;
        };
        productsMap.add(id, updatedProduct);
        ?updatedProduct;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    switch (productsMap.get(id)) {
      case (null) { false };
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          category = product.category;
          active = false;
        };
        productsMap.add(id, updatedProduct);
        true;
      };
    };
  };

  // Staff Functions
  public query ({ caller }) func getStaff() : async [Staff] {
    staffMap.values().toArray().filter(func(s) { s.active }).sort();
  };

  public query ({ caller }) func getAllStaff() : async [Staff] {
    staffMap.values().toArray().sort();
  };

  public shared ({ caller }) func addStaff(name : Text) : async Staff {
    let staff : Staff = {
      id = nextStaffId;
      name;
      active = true;
    };
    staffMap.add(nextStaffId, staff);
    nextStaffId += 1;
    staff;
  };

  public shared ({ caller }) func updateStaff(id : Nat, name : Text) : async ?Staff {
    switch (staffMap.get(id)) {
      case (null) { null };
      case (?staff) {
        let updatedStaff : Staff = {
          id;
          name;
          active = staff.active;
        };
        staffMap.add(id, updatedStaff);
        ?updatedStaff;
      };
    };
  };

  public shared ({ caller }) func deleteStaff(id : Nat) : async Bool {
    switch (staffMap.get(id)) {
      case (null) { false };
      case (?staff) {
        let updatedStaff : Staff = {
          id = staff.id;
          name = staff.name;
          active = false;
        };
        staffMap.add(id, updatedStaff);
        true;
      };
    };
  };

  // Usage Entry Functions
  public shared ({ caller }) func addEntry(
    date : Text,
    productId : Nat,
    productName : Text,
    staffId : Nat,
    staffName : Text,
    quantity : Nat,
    time : Text,
    clientName : ?Text,
  ) : async UsageEntry {
    let entry : UsageEntry = {
      id = nextUsageId;
      date;
      productId;
      productName;
      staffId;
      staffName;
      quantity;
      time;
      clientName;
    };
    usageMap.add(nextUsageId, entry);
    nextUsageId += 1;
    entry;
  };

  public query ({ caller }) func getEntries(page : Nat, pageSize : Nat) : async { entries : [UsageEntry]; total : Nat } {
    let entriesArray = usageMap.values().toArray();
    let totalEntries = entriesArray.size();
    let start = page * pageSize;
    let end = if (start + pageSize > totalEntries) { totalEntries } else {
      start + pageSize;
    };
    let pagedEntries = entriesArray.sliceToArray(start, end);
    { entries = pagedEntries; total = totalEntries };
  };

  public query ({ caller }) func getEntriesFiltered(
    productName : ?Text,
    staffName : ?Text,
    fromDate : ?Text,
    toDate : ?Text,
    page : Nat,
    pageSize : Nat,
  ) : async {
    entries : [UsageEntry];
    total : Nat;
  } {
    var filteredValues = usageMap.values();
    switch (productName) {
      case (?pname) {
        filteredValues := filteredValues.filter(
          func(e) { Text.equal(e.productName, pname) }
        );
      };
      case (null) {};
    };
    switch (staffName) {
      case (?sname) {
        filteredValues := filteredValues.filter(
          func(e) { Text.equal(e.staffName, sname) }
        );
      };
      case (null) {};
    };
    switch (fromDate, toDate) {
      case (?from, ?to) {
        filteredValues := filteredValues.filter(
          func(e) { e.date >= from and e.date <= to }
        );
      };
      case (?from, null) {
        filteredValues := filteredValues.filter(
          func(e) { e.date >= from }
        );
      };
      case (null, ?to) {
        filteredValues := filteredValues.filter(
          func(e) { e.date <= to }
        );
      };
      case (null, null) {};
    };
    let filteredArray = filteredValues.toArray();
    let totalEntries = filteredArray.size();
    let start = page * pageSize;
    let end = if (start + pageSize > totalEntries) { totalEntries } else {
      start + pageSize;
    };
    let pagedEntries = if (start >= totalEntries) { [] } else {
      filteredArray.sliceToArray(start, end);
    };
    {
      entries = pagedEntries;
      total = totalEntries;
    };
  };

  public shared ({ caller }) func deleteEntry(id : Nat) : async Bool {
    switch (usageMap.get(id)) {
      case (null) { false };
      case (?_entry) {
        usageMap.remove(id);
        true;
      };
    };
  };

  // Report Functions
  public query ({ caller }) func getDailyReport(_date : Text) : async DailyReport {
    Runtime.trap("Function not implemented. Please implement report logic in the frontend for efficiency.");
  };

  public query ({ caller }) func getMonthlyReport(_month : Text, _year : Text) : async MonthlyReport {
    Runtime.trap("Function not implemented. Please implement report logic in the frontend for efficiency.");
  };
};
