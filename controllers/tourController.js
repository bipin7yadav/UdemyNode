const fs=require("fs")

let tours= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkID =(req,res,next,val)=>{
    console.log(`Tour id is : ${val}`);

    if(req.params.id*1>tours.length){
        return res.status(404).json({
            status:"failed",
            message:"Invalid Id"
        })
    }
    next()
}

// Route Handlers

exports.getAllTours=(req,res)=>{
    res.status(200).json({
        status:"success",
        result:tours.length,
        requestedAt:req.requestTime,
        data:{
            tours:tours
        }
    })
}
 exports.createTour =(req,res)=>{
    // console.log(req.body)
    const newId=tours[tours.length-1].id+1
    const newTour=Object.assign({id:newId},req.body)

    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
        res.status(201).json({
            status:"success",
            data:{
                tour:newTour
            }
        })
    })
}

exports.getTour =(req,res)=>{
    console.log(req.params);
    const id=req.params.id*1
    const tour=tours.find((a)=>a.id===id)

    // if(id>tours.length){
    //     return res.status(404).json({
    //         status:"failed",
    //         message:"Invalid Id"
    //     })
    // }

    if(!tour){
        return res.status(404).json({
            status:"failed",
            message:"Invalid Id"
        })
    }
    res.status(200).json({
        status:"success",
        data:{
            tour:tour
        }
    })
}

exports.updateTour=(req,res)=>{


    // if(req.params.id*1>tours.length){
    //     return res.status(404).json({
    //         status:"failed",
    //         message:"Invalid Id"
    //     })
    // }

    res.status(200).json({
        status:"success",
        data:{
            tour:"<updated tour here .... />>"
        }
    })
}

exports.deleteTour=(req,res)=>{


    // if(req.params.id*1>tours.length){
    //     return res.status(404).json({
    //         status:"failed",
    //         message:"Invalid Id"
    //     })
    // }

    res.status(204).json({
        status:"success",
        data:null
    })
}
