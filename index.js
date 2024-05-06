const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const cors = require("cors")

const authRoutes = require('./routes/auth.js') 
const bookingRoutes = require('./routes/booking.js')
const listingRoutes = require('./routes/listing.js')
const userRoute = require('./routes/user.js')

const app = express()



app.use(cors())
app.use(express.json())
app.use(express.static('public'))



//  Mongoose set up

const PORT = 5000
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening to port ${PORT}`)
    })
}).catch((error) => {
    console.log(`did not connect due to ${error}`)
}) 



// routes

app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes)
app.use("/users" , userRoute)





