const router = require("express").Router()

const Booking = require("../models/Booking")
const User = require("../models/User")
const Listing = require("../models/Listing")
/*    GET TRIP LIST  */

router.get("/:userId/trips", async (req, res) => {
    try {

        const { userId } = req.params
        const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
        res.status(200).json(trips)

    } catch (error) {

        console.log(error)
        re.status(404).json({
            message: "can not find trips",
            error: error.message
        })

    }
})


/*   ADD LISTING TO WISHLIST*/

router.patch("/:userId/:listingId", async (req, res) => {
    try {

        const { userId, listingId } = req.params
        const user = await User.findById(userId)
        const listing = await Listing.findById(listingId).populate("creator")

        const favouriteListing = user.wishList.find((item) => item._id.toString() === listingId)
        if (favouriteListing) {
            user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
            await user.save()
            res.status(200).json({
                message: "Listing is Removed from Wishlist",
                wishList: user.wishList
            })
        } else {
            user.wishList.push(listing)
            await user.save()
            res.status(200).json({
                message: "Listing is Added from Wishlist",
                wishList: user.wishList
            })
        }


    } catch (error) {
        console.log(error);
        res.status(404).json({
            error: error.message
        })
    }
})


/* PROPERTY LIST*/

router.get("/:userId/properties", async (req, res) => {
    try {

        const { userId } = req.params
        const properties = await Listing.find({ creator: userId }).populate("creator")
        res.status(200).json(properties)

    } catch (error) {

        console.log(error)
        re.status(404).json({
            message: "can not find Properties",
            error: error.message
        })

    }
})

/* Reservation List */
router.get("/:userId/reservations", async (req, res) => {
    try {

        const { userId } = req.params
        const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
        res.status(200).json(reservations)

    } catch (error) {

        console.log(error)
        re.status(404).json({
            message: "can not find Reservations",
            error: error.message
        })

    }
})

module.exports = router