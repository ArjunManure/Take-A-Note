const Note = require('../models/notes');
const mongoose = require("mongoose");


exports.dashboard = async (req, res) => {
    const locals = {
        title: "dashboard",
        description: "free notes saver"
    }

    try {
        const notes = await Note.find({});

        res.render("dashboard/index", {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard"
        });
    }
    catch (error) {
        console.log(error)
    }


};



// VIEW SPECIFIC NOTES

exports.dashboardViewNote = async (req, res) => {

    const noteId = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user.id);
    console.log(userId);
    console.log(noteId);

    const note = await Note.findOne({ _id: noteId, user: userId }).lean();
    console.log("note: ", note)

    if (note) {
        res.render("dashboard/view-notes", {
            noteId: req.params.id,
            note,
            layout: "../views/layouts/dashboard"
        });
    } else {
        res.send("something went wrong")
    }

}

// UPDATE A SPECIFIC NOTE
exports.dashboardUpdateNote = async (req, res) => {
    try {
        const noteId = new mongoose.Types.ObjectId(req.params.id);
        const userId = new mongoose.Types.ObjectId(req.user.id);
        
        console.log("Updating Note ID:", noteId);
        console.log("User ID:", userId);

        await Note.findOneAndUpdate(
            { _id: noteId, user: userId },
            { title: req.body.name, body: req.body.body}
        );

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error updating note:", error);
        res.send("Something went wrong");
    }
};


//DELETING A SPECIFIC NOTE

exports.dashboardDeleteNote = async (req, res) => {
    try {
        const noteId = new mongoose.Types.ObjectId(req.params.id);
        
        console.log("Deleting Note ID:", noteId);

        const result = await Note.deleteOne({ _id: noteId });

        if (result.deletedCount === 0) {
            throw new Error("Note not found or already deleted");
        }

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).send("Something went wrong");
    }
};

//Adding a note

exports.dashboardAddNote = async(req,res)=>{
    res.render("dashboard/add" ,{
        layout: "../views/layouts/dashboard"
    } );
}


//Submiting the note

exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        console.log(req.body); // Log request body to debug
        req.body.user = req.user.id;
        const { title, body } = req.body;

        if (!title || !body) {
            throw new Error("Title and body are required");
        }

        await Note.create(req.body);
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error adding note:", error.message);
        res.status(400).send("Error adding note: " + error.message);
    }
};


// Render the search page
exports.dashboardSearch = async (req, res) => {
    try {
        res.render("dashboard/search", {
            searchResults: "",
            layout: "../views/layouts/dashboard"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while rendering the search page.");
    }
};

// dashboardController.js

exports.dashboardSearch = async (req, res) => {
    try {
        res.render("dashboard/search", {
            searchResults: "",
            layout: "../views/layouts/dashboard"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while rendering the search page.");
    }
};

exports.dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
                { body: { $regex: new RegExp(searchNoSpecialChars, "i") } }
            ]
        }).where({ user: req.user.id });

        res.render("dashboard/search", {
            searchResults,
            layout: "../views/layouts/dashboard"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while processing the search.");
    }
};


