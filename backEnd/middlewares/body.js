module.exports = (req, res, next) => {
    try {
        const body = req.body
        if(typeof body === 'string'){
           return JSON.parse(req.body.book);
        }
        console.log('J\'ai parsé la string du body en JSON');
        next();
    }
    catch (error){
        return res.status(401).json({ error });
    }
}