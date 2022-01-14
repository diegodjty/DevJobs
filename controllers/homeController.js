exports.showJobs = (req,res)=>{
    res.render('home',{
        pageName: 'devJobs',
        tagline: 'Find and publish Jobs for developers',
        bar: true,
        btn: true
    })
    
}