const router = require("express").Router();
const multer = require("multer")
const Listing = require("../models/Listing")
/*  FILE UPLOAD CONFIGURING MULTER FOR FILE UPLOAD */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads")    // STORE UPLOADED FILES IN UPLOADS FOLDER
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)   // USE THE ORIGINAL FILE NAME 
    }
});


const upload = multer({ storage })

/* CREEATE LISTING API SETUP  */

router.post("/create", upload.array("listingPhotos"), async (req, res) => {
    try {
        //  TAKE THE INFORMATION FROM THE FORM 
        const {
            creator,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities,
            title,
            description,
            highlight,
            highlightDesc,
            price,
        } = req.body;

        const listingPhotos = req.files;

        if (!listingPhotos) {
            return res.status(400).send("No files uploaded")
        }

        const listingPhotoPaths = listingPhotos?.map((file) => file.path)

        const newListing = new Listing({
            creator,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities,
            listingPhotoPaths,
            title,
            description,
            highlight,
            highlightDesc,
            price,
        })

        await newListing.save();

        res.status(200).json(newListing)

    } catch (error) {
        res.status(409).json({
            message: "Fail to create listing",
            error: error.message
        })
        console.log(error)
    }
})


/* GET LISTING by category   */
router.get("/", async (req, res) => {
    const qCategory = req.query.category
    try {

        let listings
        if (qCategory) {
            listings = await Listing.find({
                category: qCategory
            }).populate("creator")
        } else {
            listings = await Listing.find().populate("creator")
        }

        res.status(200).json(listings)

    } catch (error) {
        res.status(404).json({
            message: "Fail to Fetch Listings",
            error: error.message
        })
        console.log(error)
    }
})


/* GET LISTING BY SEARCH  */

router.get("/search/:search", async (req, res) => {
    const { search } = req.params
    try {

        let listings = []
        if (search === "all") {
            listings = await Listing.find().populate("creator")
        } else {
            listings = await Listing.find({
                $or: [
                    { category: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                    { city: { $regex: search, $options: "i" } },
                    { province: { $regex: search, $options: "i" } },
                    { country: { $regex: search, $options: "i" } },

                ]
            }).populate("creator")
        }

        res.status(200).json(listings)

    } catch (error) {
        res.status(404).json({
            message: "Fail to Fetch Listings",
            error: error.message
        })
        console.log(error)
    }
})

/* LISTING DETAILS */

router.get("/:listingId", async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId).populate("creator")
        res.status(202).json(listing)

    } catch (error) {
        res.status(404).json({
            message: "Listing can not be found",
            error: error.message
        })
    }
})

module.exports = router;


