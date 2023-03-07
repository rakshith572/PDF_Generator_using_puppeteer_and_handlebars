
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let userRef = db.collection("UserAcct");

const getInformation=()=>{
    return new Promise((resolve,reject)=>{
        userRef.get().then((querySnapShot)=>{
            querySnapShot.forEach(document=>{
                const id = document.id;
                const link = `UserAcct/${id}/Services`;
                let servicesRef = db.collection(link);
                const data=document.data()
        
                const name = data.FirstName+" "+data.LastName; 
                const Address1 = data.Address1;
                const Address2 = data.Address2;
                const orderdate = data.CreatedDate.toDate().toDateString();
                const zipCode = data.AddressZipCode;
                const email = data.EmailID;

                servicesRef.get().then((qs)=>{
                    qs.forEach(da=>{
                        const d=da.data();
                        const description = d.Service;
                        const qty = 2;
                        const unitPrice =d.price
                        const totalPrice = d.price*qty;
                        const subTotal = totalPrice;
                        const surCarge = 0;
                        const tax = 0;
                        const orderID = d.OrderId;

                        const actualTotal = totalPrice+surCarge+tax;
                        const info={
                            name,
                            Address1,
                            Address2,
                            orderdate,
                            qty,
                            unitPrice,
                            totalPrice,
                            subTotal,
                            surCarge,
                            tax,
                            actualTotal,
                            zipCode,
                            email,
                            orderID,
                            description
                        }
                        resolve(info);
                    })
                })
            })
        });
    })
}
module.exports={
    getInformation
}