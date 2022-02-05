const express = require('express')
const mysql = require('mysql2')
const authRouter  = require('./routes/authRouter')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)

// const start = async () => {
// 	try {
// 		await mysql.createPool({
// 			connectionLimit: 5,
// 			host: "localhost",
// 			user: "root",
// 			password: "",
// 			database: "auth_nodejs"
// 		});
// 		app.listen(PORT, callback => console.log(`Server has been start on ${PORT}`))	
// 	} catch (e) {
// 		console.log(e)
// 	}
// }

function start(){
  try{
    app.listen((PORT), () => console.log("Server has been started"));
  }
  catch(e){
    console.log(e);
  }
}


start()