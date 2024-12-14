module.exports = errorFunction => (req,res,next)=>{
    return Promise.resolve(errorFunction(req,res,next)).catch(next);
}