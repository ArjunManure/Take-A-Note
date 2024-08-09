exports.homepage = async(req,res) =>{
        const locals ={
            title: "notes",
            description : "free notes saver"
        }
        res.render("index",{
            locals,
            layout: "../views/layouts/home-page.ejs"
        });
    
};

exports.about = async(req,res) =>{

    const locals ={
        title: "about page",
        description : "this is about page"
    }
    res.render("about",locals);
}